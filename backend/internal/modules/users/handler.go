package users

import (
	"astral-core/internal/platform/httpx"
	"database/sql"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/redis/go-redis/v9"
)

type Handler struct {
	DB    *sql.DB
	Redis *redis.Client
}

func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil || id <= 0 {
		httpx.JSON(w, http.StatusBadRequest, httpx.Response{
			Code:    "INVALID_USER_ID",
			Message: "Invalid user id",
		})
		return
	}
	var user User
	err = h.DB.QueryRowContext(
		r.Context(),
		"SELECT id, username FROM users WHERE id = ?",
		id,
	).Scan(&user.ID, &user.Username)

	if errors.Is(err, sql.ErrNoRows) {
		httpx.JSON(w, http.StatusNotFound, httpx.Response{
			Code:    "USER_NOT_FOUND",
			Message: "User is not founded",
		})
		return
	}

	if err != nil {
		httpx.JSON(w, http.StatusInternalServerError, httpx.Response{
			Code:    "DATABASE_ERROR",
			Message: "Database error",
		})
		log.Fatal(err)
		return
	}

	httpx.JSON(w, http.StatusOK, httpx.Response{
		Code:    "SUCCESS",
		Message: "Founded",
		Data:    user,
	})
}

func (h *Handler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	return
}
