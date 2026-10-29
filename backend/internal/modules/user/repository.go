package user

import (
	"context"
	"database/sql"

	"github.com/redis/go-redis/v9"
)

type Repository struct {
	db    *sql.DB
	Redis *redis.Client
}

func NewRepository(db *sql.DB, redis *redis.Client) *Repository {
	return &Repository{db: db, Redis: redis}
}

func (repo *Repository) Create(ctx context.Context, user *User) error {
	result, err := repo.db.ExecContext(
		ctx,
		`
		INSERT INTO users
		()
		`,
	)

	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	user.ID = id
	return nil
}
