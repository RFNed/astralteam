package httpx

import (
	"encoding/json"
	"net/http"
)

type Details struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

type Response struct {
	Details Details `json:"detail"`
}

func JSON(w http.ResponseWriter, status int, response Response) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	json.NewEncoder(w).Encode(response)
}
