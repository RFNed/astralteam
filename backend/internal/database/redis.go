package database

import (
	"astral-core/internal/config"
	"context"
	"fmt"
	"log"
	"net"
	"time"

	"github.com/redis/go-redis/v9"
)

func NewRedis(cfg config.Redis) (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     net.JoinHostPort(cfg.HOST, cfg.PORT),
		Username: cfg.USER,
		Password: cfg.PASSWORD,
		DB:       cfg.DATABASE,
		PoolSize: cfg.MAX_CONNECTIONS,
	})
	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		client.Close()
		return nil, fmt.Errorf("Redis connection: %w", err)
	}

	log.Println("Redis inited successfully")

	return client, nil
}
