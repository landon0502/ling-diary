package service

import (
	tok "ling-diary/pkg/token"
)

type AuthService struct {
	userService *UserService
}

func NewAuthService(userService *UserService) *AuthService {
	return &AuthService{userService: userService}
}

// StoreToken 存储token到Redis（使用双向映射）
func (auth *AuthService) StoreToken(token string, userID uint) error {
	return tok.StoreTokenWithUserMapping(token, userID)
}

// VerifyToken 校验token是否有效
func (auth *AuthService) VerifyToken(token string) (bool, error) {
	_, err := tok.VerifyTokenWithUserMapping(token)
	return err == nil, err
}

// DeleteToken 删除token（登出）
func (auth *AuthService) DeleteToken(token string) error {
	return tok.DeleteTokenWithUserMapping(token)
}

// GetUserTokens 获取用户的所有token
func (auth *AuthService) GetUserTokens(userID uint) ([]string, error) {
	return tok.GetUserTokens(userID)
}

// DeleteUserTokens 删除用户的所有token（踢下线）
func (auth *AuthService) DeleteUserTokens(userID uint) error {
	return tok.DeleteUserTokens(userID)
}

// DeleteDeviceToken 删除指定用户的指定token（踢指定设备）
func (auth *AuthService) DeleteDeviceToken(userID uint, token string) error {
	return tok.DeleteDeviceToken(userID, token)
}

// GetUserTokenCount 获取用户的token数量
func (auth *AuthService) GetUserTokenCount(userID uint) (int64, error) {
	return tok.GetUserTokenCount(userID)
}