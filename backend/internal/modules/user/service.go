package user

import (
	"database/sql"
	"net/http"

	"github.com/redis/go-redis/v9"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{
		repo: repo,
	}
}

func RegisterUser(w http.ResponseWriter, user *UserRegister, db *sql.DB, redis *redis.Client) bool {
	// Todo RegisterUser
	return false
}
