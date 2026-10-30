package user

import (
	"context"
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

	return nil
}
