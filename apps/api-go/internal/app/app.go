package app

import (
	"ling-diary/internal/config"
	"ling-diary/internal/container"
	"ling-diary/internal/middleware"
	configManager "ling-diary/pkg/config"
	"ling-diary/pkg/database"
	redis_pkg "ling-diary/pkg/redis"
	"log"

	"github.com/gin-gonic/gin"
)

type App struct {
	router    *gin.Engine
	config    *config.Config
	container *container.Container
}

func New() (*App, error) {
	// 使用全局配置管理器
	configMgr := configManager.GetConfigManager()
	cfg := configMgr.Get()

	// 初始化数据库连接
	if err := database.Init(cfg.Database); err != nil {
		return nil, err
	}
	// 初始化redis
	if err := redis_pkg.Init(cfg.Redis); err != nil {
		return nil, err
	}

	// 设置Gin模式
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 创建应用实例
	a := &App{
		router:    gin.Default(),
		config:    cfg,
		container: container.NewContainer(),
	}

	// 注册中间件
	a.registerMiddleware()

	// 注册路由
	a.registerRoutes()

	return a, nil
}

func (a *App) registerMiddleware() {
	// 注册中间件
	a.router.Use(middleware.CORS())
	a.router.Use(middleware.Logging())
}

func (a *App) registerRoutes() {
	// 从容器获取已初始化的组件
	userHandler := a.container.GetUserHandler()
	authHandler := a.container.GetAuthHandler()
	// 健康检查
	a.router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API v1 路由组
	v1 := a.router.Group("/api/v1")
	{
		// 登录
		authGroup := v1.Group("/auth")
		{
			authGroup.POST("/login", authHandler.Login)
			authGroup.POST("/logout", authHandler.Logout)
			authGroup.GET("/verifyjwt", authHandler.VerifyJwt)
			authGroup.POST("/register", authHandler.Register)
		}
		// 用户路由
		userGroup := v1.Group("/users")
		userGroup.Use(middleware.Auth())
		{
			userGroup.GET("/info", userHandler.GetUserInfo)
			userGroup.GET("/:id", userHandler.Get)
			userGroup.PUT("/:id", userHandler.Update)
			userGroup.DELETE("/:id", userHandler.Delete)
		}

		// ai配置
		aiHandler := a.container.GetAiHandler()
		aiGroup := v1.Group("/ai")
		aiGroup.Use(middleware.Auth())
		{
			aiGroup.GET("/platforms", aiHandler.GetAiPlatforms)
			aiGroup.POST("/saveConfig", aiHandler.SetUserAiConf)
			aiGroup.GET("/userAiConf", aiHandler.GetUserAiConf)
			aiGroup.POST("/analyze", aiHandler.AiAnalyze)
			aiGroup.POST("/chat", aiHandler.AiChatStream)
		}

		// 用户diary
		diaryHandler := a.container.GetDiaryHandler()
		diaryGroup := v1.Group("/diary")
		diaryGroup.Use(middleware.Auth())
		{
			diaryGroup.GET("/", diaryHandler.GetDiarys)
			diaryGroup.GET("/:id", diaryHandler.GetDiaryById)
			diaryGroup.POST("/", diaryHandler.CreateDiary)
			diaryGroup.DELETE("/:id", diaryHandler.DelDiaryById)
			diaryGroup.PUT("/:id", diaryHandler.UpdateDiaryById)
		}
	}
}

func (a *App) Run(addr string) error {
	if addr == "" {
		addr = ":" + configManager.GetConfigManager().GetServerPort()
	}
	log.Printf("Server starting on %s", addr)
	return a.router.Run(addr)
}
