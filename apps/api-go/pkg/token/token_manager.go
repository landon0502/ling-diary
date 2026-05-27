package token

import (
	"context"
	"fmt"
	"time"

	redis_pkg "ling-diary/pkg/redis"
)

const (
	TokenPrefix   = "token:"
	UserTokensKey = "user_tokens:"
	TokenExpire   = time.Hour * 24 // 24小时过期
)

// StoreTokenWithUserMapping 存储 token 并建立双向映射
func StoreTokenWithUserMapping(token string, userID uint) error {
	ctx := context.Background()

	// 1. Token -> User ID
	tokenKey := TokenPrefix + token
	err := redis_pkg.GetRedisDB().Set(ctx, tokenKey, userID, TokenExpire).Err()
	if err != nil {
		return err
	}

	// 2. User ID -> Token Set
	userTokensKey := UserTokensKey + fmt.Sprintf("%d", userID)
	err = redis_pkg.GetRedisDB().SAdd(ctx, userTokensKey, token).Err()
	if err != nil {
		// 如果添加到 Set 失败，回滚删除 token
		redis_pkg.GetRedisDB().Del(ctx, tokenKey)
		return err
	}

	// 3. 设置 user_tokens key 的过期时间
	redis_pkg.GetRedisDB().Expire(ctx, userTokensKey, TokenExpire)

	return nil
}

// VerifyTokenWithUserMapping 验证 token 并返回用户ID
func VerifyTokenWithUserMapping(token string) (uint, error) {
	ctx := context.Background()
	tokenKey := TokenPrefix + token

	// 获取用户ID
	userID, err := redis_pkg.GetRedisDB().Get(ctx, tokenKey).Int()
	if err != nil {
		return 0, err
	}

	return uint(userID), nil
}

// DeleteTokenWithUserMapping 删除 token 及其反向映射
func DeleteTokenWithUserMapping(token string) error {
	ctx := context.Background()

	// 1. 获取用户ID
	tokenKey := TokenPrefix + token
	userID, err := redis_pkg.GetRedisDB().Get(ctx, tokenKey).Int()
	fmt.Println("删除redis token", tokenKey, err.Error())
	fmt.Println("获取到的userId", userID)
	if err != nil {
		// token 不存在，直接返回成功
		return err
	}

	// 2. 删除 token
	redis_pkg.GetRedisDB().Del(ctx, tokenKey)

	// 3. 从用户的 token set 中移除
	userTokensKey := UserTokensKey + fmt.Sprintf("%d", userID)
	redis_pkg.GetRedisDB().SRem(ctx, userTokensKey, token)

	// 4. 如果用户的 token set 为空，删除整个 key
	count := redis_pkg.GetRedisDB().SCard(ctx, userTokensKey).Val()
	if count == 0 {
		redis_pkg.GetRedisDB().Del(ctx, userTokensKey)
	}

	return nil
}

// GetUserTokens 获取用户的所有 token
func GetUserTokens(userID uint) ([]string, error) {
	ctx := context.Background()
	userTokensKey := UserTokensKey + fmt.Sprintf("%d", userID)

	tokens, err := redis_pkg.GetRedisDB().SMembers(ctx, userTokensKey).Result()
	if err != nil {
		return nil, err
	}

	return tokens, nil
}

// DeleteUserTokens 删除用户的所有 token（踢下线）
func DeleteUserTokens(userID uint) error {
	ctx := context.Background()
	userTokensKey := UserTokensKey + fmt.Sprintf("%d", userID)

	// 获取所有 token
	tokens, err := redis_pkg.GetRedisDB().SMembers(ctx, userTokensKey).Result()
	if err != nil {
		return err
	}

	// 删除所有 token
	if len(tokens) > 0 {
		var keys []string
		for _, token := range tokens {
			keys = append(keys, TokenPrefix+token)
		}
		redis_pkg.GetRedisDB().Del(ctx, keys...)
	}

	// 删除用户的 token set
	redis_pkg.GetRedisDB().Del(ctx, userTokensKey)

	return nil
}

// DeleteDeviceToken 删除指定用户的指定 token（踢指定设备）
func DeleteDeviceToken(userID uint, token string) error {
	ctx := context.Background()

	// 删除 token
	tokenKey := TokenPrefix + token
	redis_pkg.GetRedisDB().Del(ctx, tokenKey)

	// 从用户的 token set 中移除
	userTokensKey := UserTokensKey + fmt.Sprintf("%d", userID)
	redis_pkg.GetRedisDB().SRem(ctx, userTokensKey, token)

	// 如果用户的 token set 为空，删除整个 key
	count := redis_pkg.GetRedisDB().SCard(ctx, userTokensKey).Val()
	if count == 0 {
		redis_pkg.GetRedisDB().Del(ctx, userTokensKey)
	}

	return nil
}

// GetUserTokenCount 获取用户的 token 数量
func GetUserTokenCount(userID uint) (int64, error) {
	ctx := context.Background()
	userTokensKey := UserTokensKey + fmt.Sprintf("%d", userID)

	return redis_pkg.GetRedisDB().SCard(ctx, userTokensKey).Val(), nil
}
