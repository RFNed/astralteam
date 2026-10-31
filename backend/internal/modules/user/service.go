package user

import (
	"astral-core/internal/platform/security"
	"context"
	"fmt"
	"log"
	"net/mail"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{
		repo: repo,
	}
}

func (s *Service) RegisterUser(ctx context.Context, user *UserRegister) error {
	if err := ctx.Err(); err != nil {
		return err
	}

	if len(user.Email) == 0 || len(user.Username) == 0 {
		return fmt.Errorf("require data")
	}

	_, err := mail.ParseAddress(user.Email)
	if err != nil {
		return fmt.Errorf("invalid email")
	}

	exists, err := s.repo.IsEmailOrLoginTaken(ctx, user.Email, user.Username)
	if err != nil {
		log.Printf("%s", err)
	}
	if exists {
		return fmt.Errorf("already exists")
	}

	password, err := security.HashPassword(user.Password, security.DefaultParams)
	if err != nil {
		return fmt.Errorf("oops, cant hash password: %w", err)
	}

	if err := s.repo.NewAccount(ctx, user.Email, user.Username, password); err != nil {
		return fmt.Errorf("oops, cant create account: %w", err)
	}
	return nil
}
