package container

import (
	"ling-diary/internal/handler"
	"ling-diary/internal/repository"
	"ling-diary/internal/service"
	"ling-diary/pkg/database"
)

// Container 管理所有的依赖
type Container struct {
	userService  *service.UserService
	authService  *service.AuthService
	aiService    *service.AiService
	userHandler  *handler.UserHandler
	authHandler  *handler.AuthHandler
	aiHandler    *handler.AiHandler
	aiRepo       *repository.AiRepository
	diaryRepo    *repository.DiaryRepository
	diaryHandler *handler.DiaryHandler
}

// NewContainer 创建新的依赖容器
func NewContainer() *Container {
	// 初始化 Repository
	aiRepo := repository.NewAiRepository(database.GetDB())
	diaryRepo := repository.NewDiaryRepository(database.GetDB())

	// 初始化 Service
	userService := service.NewUserService()
	authService := service.NewAuthService(userService)
	aiService := service.NewAiService(aiRepo)
	diaryService := service.NewDiaryService(diaryRepo)

	// 初始化 Handler
	userHandler := handler.NewUserHandler(userService)
	authHandler := handler.NewAuthHandler(userService, authService, aiService)
	aiHandler := handler.NewAiHandler(aiService)
	diaryHandler := handler.NewDiaryHandler(diaryService)
	return &Container{
		userService:  userService,
		authService:  authService,
		userHandler:  userHandler,
		authHandler:  authHandler,
		aiHandler:    aiHandler,
		aiRepo:       aiRepo,
		diaryHandler: diaryHandler,
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

// GetAiHandler 获取ai处理器
func (c *Container) GetAiHandler() *handler.AiHandler {
	return c.aiHandler
}

// GetDiaryHandler 获取日记处理器
func (c *Container) GetDiaryHandler() *handler.DiaryHandler {
	return c.diaryHandler
}
