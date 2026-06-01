package handler

import (
	"ling-diary/internal/models"
	"ling-diary/internal/service"
	"ling-diary/pkg/response"

	"github.com/gin-gonic/gin"
)

type AiHandler struct {
	aiService *service.AiService
}

func NewAiHandler(aiService *service.AiService) *AiHandler {
	return &AiHandler{aiService: aiService}
}

// 获取ai平台配置
func (ai *AiHandler) GetAiPlatforms(c *gin.Context) {
	platforms, err := ai.aiService.GetPlatformsTree()
	if err != nil {
		response.InternalServerError(c)
		return
	}
	response.Success(c, platforms)
}

// 获取用户ai配置
func (ai *AiHandler) GetUserAiConf(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.NoAuthToken(c)
		return
	}
	uid, ok := userID.(uint)
	if !ok {
		response.ParamFormatError(c)
		return
	}

	conf, err := ai.aiService.GetUserAiConfig(int64(uid))
	if err != nil {
		response.Success(c, nil)
		return
	}
	response.Success(c, conf)
}

func (ai *AiHandler) SetUserAiConf(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.NoAuthToken(c)
		return
	}
	uid, ok := userID.(uint)
	if !ok {
		response.ParamFormatError(c)
		return
	}

	var conf models.UserAiConfig
	if err := c.ShouldBindJSON(&conf); err != nil {
		response.ParamError(c)
		return
	}
	conf.UserId = int64(uid)

	if err := ai.aiService.SaveUserAiConfig(conf); err != nil {
		response.Error(c, response.CodeSystemInternalError, err.Error())
		return
	}
	response.Success(c, gin.H{
		"success": true,
	})
}

func (ai *AiHandler) AiAnalyze(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.NoAuthToken(c)
		return
	}
	uid, ok := userID.(int64)
	if !ok {
		response.ParamFormatError(c)
		return
	}
	res, err := ai.aiService.DiaryAiAnalyze(uid)
	if err != nil {
		response.InternalServerError(c)
		return
	}
	response.Success(c, res)
}
