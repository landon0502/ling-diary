package redis_pkg

import (
	"context"
	"fmt"
	"ling-diary/internal/config"

	"github.com/redis/go-redis/v9"
)

var (
	Rdb *redis.Client
	Ctx = context.Background()
)

// 连接redis
func Init(redisConfig config.RedisConfig) error {
	Rdb = redis.NewClient(&redis.Options{
		Addr:     redisConfig.Addr,
		Password: redisConfig.Password,
		DB:       0,
	})
	// 测试连接
	_, err := Rdb.Ping(Ctx).Result()
	if err != nil {
		return err
	}

	fmt.Println("Redis connected")

	return nil
}

// GetDB 获取数据库实例
func GetRedisDB() *redis.Client {
	return Rdb
}
