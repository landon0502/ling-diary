package handler

import (
	"bufio"
	"bytes"
	"encoding/json"
	"io"
	"ling-diary/internal/models"
	"ling-diary/internal/service"
	"ling-diary/pkg/response"
	"log"
	"net/http"

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

	conf, err := ai.aiService.GetUserAiConfig(uid)
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
	// 保存到 Redis 缓存
	_ = ai.aiService.CacheUserAiConfig(conf.UserId, &conf)
	response.Success(c, gin.H{
		"success": true,
	})
}

func (ai *AiHandler) AiAnalyze(c *gin.Context) {
	userID, exists := c.Get("user_id")
	var req service.AiMsgRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ParamError(c)
		return
	}
	if !exists {
		response.NoAuthToken(c)
		return
	}
	uid, ok := userID.(uint)
	if !ok {
		response.ParamFormatError(c)
		return
	}
	res, err := ai.aiService.DiaryAiAnalyze(uid, req)
	if err != nil {
		response.InternalServerError(c)
		return
	}
	response.Success(c, res)
}

// 1. 定义发送给 FastAPI 的结构体
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}
type ChatRequest struct {
	Messages []Message           `json:"messages"`
	Stream   bool                `json:"stream"` // 必须开启流式返回
	Config   models.UserAiConfig `json:"config"`
}

func (ai *AiHandler) AiChatStream(c *gin.Context) {
	var messageReq service.AiMsgRequest
	if err := c.ShouldBindJSON(&messageReq); err != nil {
		response.ParamError(c)
		return
	}
	// 1. 发起请求到远端的 FastAPI 服务（假设 FastAPI 运行在 8000 端口）
	fastapiURL := "http://localhost:8001/ai/chat/stream"
	userID, ok := c.Get("user_id")
	if !ok {
		response.NoAuthToken(c)
		return
	}
	uid, ok := userID.(uint)
	if !ok {
		response.ParamFormatError(c)
		return
	}
	config, err := ai.aiService.GetCacheUserAiConfig(uid)
	if err != nil {
		response.InternalServerError(c)
		return
	}
	// 2. 构造你的参数
	payload := struct {
		models.UserAiConfig
		service.AiMsgRequest
	}{
		AiMsgRequest: messageReq,
		UserAiConfig: *config,
	}

	// 3. 将结构体序列化为 JSON 字节数组
	jsonBytes, err := json.Marshal(payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "参数序列化失败"})
		return
	}
	// 注意：如果前端传了参数，记得在这里透传（如 c.Request.Body 或 Query 参数）
	req, err := http.NewRequestWithContext(c.Request.Context(), "POST", fastapiURL, bytes.NewBuffer(jsonBytes))
	if err != nil {
		response.InternalServerError(c)
		return
	}

	// 2. 透传前端带来的特定 Header（如 Authorization 鉴权 Token）
	if auth := c.GetHeader("Authorization"); auth != "" {
		req.Header.Set("Authorization", auth)
	}
	req.Header.Set("Accept", "text/event-stream")
	req.Header.Set("Content-Type", "application/json")
	// 3. 执行请求
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		response.Error(c, http.StatusBadGateway, "无法连接到 FastAPI 服务")
		return
	}
	defer resp.Body.Close()

	// 4. 设置向前端返回的 SSE 核心响应头
	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")
	c.Writer.Header().Set("Transfer-Encoding", "chunked")

	// 5. 核心逻辑：按行读取 FastAPI 的响应体，并实时刷新（Flush）给前端
	reader := bufio.NewReader(resp.Body)

	c.Stream(func(w io.Writer) bool {
		// 按行读取远端流数据（SSE 的标准数据格式是以换行符 \n 结尾的）
		line, err := reader.ReadBytes('\n')
		if err != nil {
			if err == io.EOF {
				log.Println("FastAPI 流已结束 (EOF)")
				return false // 返回 false 终止 Gin 的 c.Stream 循环
			}
			log.Printf("读取 FastAPI 异常: %v\n", err)
			return false
		}

		// 将读到的这一行直接写入 Gin 的 Response Writer
		_, writeErr := w.Write(line)
		if writeErr != nil {
			log.Printf("发送数据给前端失败（用户可能关闭了网页）: %v\n", writeErr)
			return false
		}

		return true // 返回 true 继续循环读取下一行
	})

}
