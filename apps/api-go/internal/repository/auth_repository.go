package repository

import (
	"fmt"
	redis_pkg "ling-diary/pkg/redis"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type AuthRepository struct {
	db  *gorm.DB
	rdb *redis.Client
}

func NewAuthRepository(db *gorm.DB, rdb *redis.Client) *AuthRepository {
	return &AuthRepository{db: db, rdb: rdb}
}

func (auth *AuthRepository) VerifyToken(userId uint) (bool, error) {
	key := fmt.Sprintf("login_token:%d", userId)
	if err := auth.rdb.Get(redis_pkg.Ctx, key).Err(); err != nil {
		return false, err
	}
	return true, nil
}
