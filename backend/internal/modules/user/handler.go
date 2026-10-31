package user

import (
	"astral-core/internal/platform/httpx"
	"encoding/json"
	"net/http"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		httpx.JSON(w, http.StatusMethodNotAllowed, httpx.Response{
			Details: httpx.Details{
				Code:    "NOT_ALLOWED",
				Message: "not allowed",
			},
		})
		return
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

	if err := h.service.RegisterUser(r.Context(), &req); err != nil {
		switch err.Error() {
		case "require data":
			httpx.JSON(w, http.StatusBadRequest, httpx.Response{
				Details: httpx.Details{
					Code:    "REGDATA_REQUIRED",
					Message: "Need to regdata!",
				},
			})
		case "invalid email":
			httpx.JSON(w, http.StatusBadRequest, httpx.Response{
				Details: httpx.Details{
					Code:    "INVALID_EMAIL",
					Message: "Sorry, invalid email!",
				},
			})
		case "already exists":
			httpx.JSON(w, http.StatusConflict, httpx.Response{
				Details: httpx.Details{
					Code:    "ACCOUNT_ALREADY_EXISTS",
					Message: "Account already is exists!",
				},
			})
		default:
			httpx.JSON(w, http.StatusInternalServerError, httpx.Response{
				Details: httpx.Details{
					Code:    "INTERNAL_ERROR",
					Message: "Error Internal",
				},
			})
		}
		return
	}
}
