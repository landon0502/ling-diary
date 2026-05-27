package container

import (
	"ling-diary/internal/handler"
	"ling-diary/internal/service"
)

// Container 管理所有的依赖
type Container struct {
	userService *service.UserService
	authService *service.AuthService
	userHandler *handler.UserHandler
	authHandler *handler.AuthHandler
}

// NewContainer 创建新的依赖容器
func NewContainer() *Container {
	// 初始化 Service
	userService := service.NewUserService()
	authService := service.NewAuthService(userService)

	// 初始化 Handler
	userHandler := handler.NewUserHandler(userService)
	authHandler := handler.NewAuthHandler(userService, authService)

	return &Container{
		userService: userService,
		authService: authService,
		userHandler: userHandler,
		authHandler: authHandler,
	}
}


// GetUserService 获取用户服务
func (c *Container) GetUserService() *service.UserService {
	return c.userService
}

// GetAuthService 获取认证服务
func (c *Container) GetAuthService() *service.AuthService {
	return c.authService
}

// GetUserHandler 获取用户处理器
func (c *Container) GetUserHandler() *handler.UserHandler {
	return c.userHandler
}

// GetAuthHandler 获取认证处理器
func (c *Container) GetAuthHandler() *handler.AuthHandler {
	return c.authHandler
}
