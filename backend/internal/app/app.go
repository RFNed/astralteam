package app

import (
	"astral-core/internal/config"
	"astral-core/internal/modules/users"
	"astral-core/internal/platform/cache"
	"astral-core/internal/platform/database"
	"astral-core/internal/platform/httpx"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/redis/go-redis/v9"
)

type App struct {
	MySQL  *sql.DB
	Redis  *redis.Client
	Server *http.Server
}

func New(cfg config.Config) (*App, error) {
	mysqlDB, err := database.NewMySQL(cfg.MySQL)
	if err != nil {
		return nil, err
	}

	redisClient, err := cache.NewRedis(cfg.Redis)
	if err != nil {
		mysqlDB.Close()
		return nil, err
	}

	usersHandler := &users.Handler{
		DB:    mysqlDB,
		Redis: redisClient,
	}

	mux := http.NewServeMux()

	mux.HandleFunc("GET /ping", func(w http.ResponseWriter, r *http.Request) {
		httpx.JSON(w, http.StatusOK, httpx.Response{
			Code:    "PONG",
			Message: "ping - pong",
		})
	})

	mux.HandleFunc("GET /users/{id}", usersHandler.GetUser)

	server := &http.Server{
		Addr:              ":8000",
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	return &App{
		MySQL:  mysqlDB,
		Redis:  redisClient,
		Server: server,
	}, nil
}

func (a *App) Run() error {
	log.Printf("HTTP server starts on %s", a.Server.Addr)

	err := a.Server.ListenAndServe()
	if errors.Is(err, http.ErrServerClosed) {
		return nil
	}

	return err
}

func (a *App) Close() error {
	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)
	defer cancel()

	shutdownErr := a.Server.Shutdown(ctx)
	mysqlErr := a.MySQL.Close()
	redisErr := a.Redis.Close()

	return errors.Join(shutdownErr, mysqlErr, redisErr)
}

func (a *App) CheckDatabases(ctx context.Context) error {
	if err := a.MySQL.PingContext(ctx); err != nil {
		return fmt.Errorf("mysql: %w", err)
	}

	if err := a.Redis.Ping(ctx).Err(); err != nil {
		return fmt.Errorf("redis: %w", err)
	}

	return nil
}
