package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net"
	"time"

	"astral-core/internal/config"

	_ "github.com/go-sql-driver/mysql"
)

func NewMySQL(cfg config.MySQL) (*sql.DB, error) {
	address := net.JoinHostPort(cfg.HOST, cfg.PORT)

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s)/%s?charset=%s&parseTime=true",
		cfg.USER,
		cfg.PASSWORD,
		address,
		cfg.DATABASE,
		cfg.CHARSET,
	)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}

	db.SetMaxIdleConns(cfg.POOL_MIN)
	db.SetMaxOpenConns(cfg.POOL_MAX)
	db.SetConnMaxLifetime(30 * time.Minute)

	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, fmt.Errorf("MySQL connection: %w", err)
	}

	log.Println("MySQL inited successfully")

	return db, nil
}
