package user

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/redis/go-redis/v9"
)

type Repository struct {
	db    *sql.DB
	Redis *redis.Client
}

func NewRepository(db *sql.DB, redis *redis.Client) *Repository {
	return &Repository{db: db, Redis: redis}
}

func (r *Repository) IsEmailOrLoginTaken(ctx context.Context, email string, username string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?))`
	var exists bool

	if err := r.db.QueryRowContext(ctx, query, email, username).Scan(&exists); err != nil {
		return false, fmt.Errorf("oops, cant check account: %w", err)
	}

	return exists, nil
}

func (r *Repository) NewAccount(ctx context.Context, email string, username string, password string) error {
	query := `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`

	if err := r.db.QueryRowContext(ctx, query, username, email, password).Err(); err != nil {
		return fmt.Errorf("oops, cant register new account: %w", err)
	}

	return nil
}
