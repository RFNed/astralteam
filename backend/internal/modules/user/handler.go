package user

import (
	"astral-core/internal/platform/httpx"
	"database/sql"
	"encoding/json"
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

type UserRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type UserRegister struct {
	Email string `json:"email"`
	User  UserRequest
}

func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil || id <= 0 {
		httpx.JSON(w, http.StatusBadRequest, httpx.Response{
			Details: httpx.Details{
				Code:    "INVALID_USER_ID",
				Message: "Invalid user id",
			},
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
			Details: httpx.Details{
				Code:    "USER_NOT_FOUND",
				Message: "User is not founded",
			},
		})
		return
	}

	if err != nil {
		httpx.JSON(w, http.StatusInternalServerError, httpx.Response{
			Details: httpx.Details{
				Code:    "DATABASE_ERROR",
				Message: "Database error",
			},
		})
		log.Fatal(err)
		return
	}

	httpx.JSON(w, http.StatusOK, httpx.Response{
		Details: httpx.Details{
			Code:    "SUCCESS",
			Message: "Founded",
			Data:    user,
		},
	})
}

func (h *Handler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		httpx.JSON(w, http.StatusMethodNotAllowed, httpx.Response{
			Details: httpx.Details{
				Code:    "NOT_ALLOWED",
				Message: "not allowed",
			},
		})
	}

	var req UserRegister
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&req); err != nil {
		httpx.JSON(w, http.StatusBadRequest, httpx.Response{
			Details: httpx.Details{
				Code:    "INCORRECT_JSON",
				Message: "Incorrect Json",
			},
		})
	}

	RegisterUser(w, &req, h.DB, h.Redis)

}
