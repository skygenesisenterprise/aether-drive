package interfaces

import "gorm.io/gorm"

type IDatabaseService interface {
	GetDB() *gorm.DB
	Close() error
}
