package services

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

type DatabaseService struct {
	db *gorm.DB
}

func NewDatabaseService(dsn string) (*DatabaseService, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return &DatabaseService{db: db}, nil
}

func (s *DatabaseService) GetDB() *gorm.DB {
	if s == nil {
		return nil
	}
	return s.db
}

func (s *DatabaseService) Close() error {
	if s == nil || s.db == nil {
		return nil
	}

	sqlDB, err := s.db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}
