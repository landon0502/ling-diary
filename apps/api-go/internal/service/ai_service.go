package service

import (
	"fmt"
	"io"
	"ling-diary/internal/models"
	"ling-diary/internal/repository"
	"net/http"
	"strings"

	"encoding/json"
)

type AiService struct {
	aiRepo *repository.AiRepository
}

type AiAnalyzeResp struct {
	Content AiAnalyzeContent `json:"content"`
	Model   string           `json:"model"`
	Usage   any              `json:"usage"`
}

type AiAnalyzeContent struct {
	Score          int            `json:"score"`
	GrammarErrors  []GrammarError `json:"grammar_errors"`
	OverallComment string         `json:"overall_comment"`
	Idea           []string       `json:"idea"`
	AIIdea         string         `json:"ai_idea"`
}

type GrammarError struct {
	ErrorType   string `json:"error_type"`
	ErrorTag    string `json:"error_tag"`
	ErrorDesc   string `json:"error_desc"`
	ErrorWord   string `json:"error_word"`
	CorrectWord string `json:"correct_word"`
}

type AiMsgRequest struct {
	Messages []struct {
		Role    string `json:"role"`
		Content string `json:"content"`
	} `json:"messages"`
}

func NewAiService(aiRepo *repository.AiRepository) *AiService {
	return &AiService{aiRepo: aiRepo}
}

func (ai *AiService) GetPlatformsTree() ([]models.AiPlatforms, error) {
	return ai.aiRepo.GetPlatformsTree()
}

func (ai *AiService) GetUserAiConfig(userID uint) (*models.UserAiConfig, error) {
	return ai.aiRepo.GetUserAiConfig(userID)
}

func (ai *AiService) SaveUserAiConfig(conf models.UserAiConfig) error {
	return ai.aiRepo.SaveUserAiConfig(&conf)
}

func (ai *AiService) DiaryAiAnalyze(userId uint, messages AiMsgRequest) (aiAnalyzeResp *AiAnalyzeResp, err error) {
	aiModelConfig, err := ai.aiRepo.GetUserAiConfig(userId)
	if err != nil {
		return nil, err
	}

	params := struct {
		AiMsgRequest
		models.UserAiConfig
	}{
		AiMsgRequest: messages,
		UserAiConfig: *aiModelConfig,
	}
	conf, err := json.Marshal(params)
	if err != nil {
		return nil, err
	}
	contentType := "application/json"
	resp, err := http.Post("http://localhost:8001/ai/analyze", contentType, strings.NewReader(string(conf)))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var envelope struct {
		Code    int             `json:"code"`
		Message string          `json:"message"`
		Data    json.RawMessage `json:"data"`
	}
	if err := json.Unmarshal(body, &envelope); err != nil {
		return nil, err
	}
	if envelope.Code != 200 {
		return nil, fmt.Errorf("ai api error: %s", envelope.Message)
	}

	aiAnalyzeResp = &AiAnalyzeResp{}
	if err := json.Unmarshal(envelope.Data, aiAnalyzeResp); err != nil {
		return nil, err
	}

	return aiAnalyzeResp, nil
}
