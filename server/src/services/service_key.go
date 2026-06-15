package services

import "gorm.io/gorm"

type ServiceKeyService struct {
	db *gorm.DB
}

func NewServiceKeyService(db *gorm.DB) *ServiceKeyService {
	return &ServiceKeyService{db: db}
}

func (s *ServiceKeyService) EnsureSystemKey(systemKey string) error {
	return nil
}

func (s *ServiceKeyService) ValidateSystemKey(key string) bool {
	return key != ""
}
