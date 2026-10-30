package user

import "errors"

var (
	ErrUserNotFound = errors.New("user not found")
)

type User struct {
	ID       int64  `json:"id"`
	Username string `json:"username"`
}

type UserRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type UserRegister struct {
	Email string `json:"email"`
	User  UserRequest
}
