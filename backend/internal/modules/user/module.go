package user

import (
	"database/sql"
	"net/http"

	"github.com/redis/go-redis/v9"
)

func RegisterModule(mux *http.ServeMux, db *sql.DB, redisClient *redis.Client) {
	repo := NewRepository(db, redisClient)
	service := NewService(repo)
	handler := NewHandler(service)

	mux.HandleFunc("POST /user/register", handler.RegisterUser)
}
