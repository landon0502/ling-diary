package handler

import (
	"ling-diary/internal/service"
	"ling-diary/pkg/response"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	userService *service.UserService
	authService *service.AuthService
}

func NewAuthHandler(userService *service.UserService, authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		userService: userService,
		authService: authService,
	}
}

// 登录
func (auth *AuthHandler) Login(c *gin.Context) {
	var req service.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, err.Error())
		return
	}

	// 调用 userService 登录
	res, err := auth.userService.Login(&req)
	if err != nil {
		response.Error(c, 400, err.Error())
		return
	}

	// 存储 token 到 Redis
	if err := auth.authService.StoreToken(res.Token, res.User.ID); err != nil {
		response.InternalServerError(c)
		return
	}

	response.Success(c, res)
}

// 登出
func (auth *AuthHandler) Logout(c *gin.Context) {
	// 从 cookie 获取 token
	token, err := c.Cookie("auth_token")
	if err != nil {
		response.NoAuthToken(c)
		return
	}

	// 从 Redis 删除 token
	if err := auth.authService.DeleteToken(token); err != nil {
		response.InternalServerError(c)
		return
	}

	response.Success(c, gin.H{"message": "logout successful"})
}

// 校验token 是否过期
func (auth *AuthHandler) VerifyJwt(c *gin.Context) {
	isVali := false
	token, err := c.Cookie("auth_token")
	if err != nil {
		response.Success(c, isVali)
		return
	}
	isVali, err = auth.authService.VerifyToken(token)
	response.Success(c, isVali)
}

// 登录
func (auth *AuthHandler) Register(c *gin.Context) {
	var req service.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ParamFormatError(c)
		return
	}
	user, err := auth.userService.Create(&req)
	if err != nil {
		response.Error(c, response.CodeSystemInternalError, err.Error())
		return
	}
	response.Success(c, user)
}
