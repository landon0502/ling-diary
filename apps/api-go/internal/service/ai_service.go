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

func NewAiService(aiRepo *repository.AiRepository) *AiService {
	return &AiService{aiRepo: aiRepo}
}

func (ai *AiService) GetPlatformsTree() ([]models.AiPlatforms, error) {
	return ai.aiRepo.GetPlatformsTree()
}

func (ai *AiService) GetUserAiConfig(userID int64) (*models.UserAiConfig, error) {
	return ai.aiRepo.GetUserAiConfig(userID)
}

func (ai *AiService) SaveUserAiConfig(conf models.UserAiConfig) error {
	return ai.aiRepo.SaveUserAiConfig(&conf)
}

func (ai *AiService) DiaryAiAnalyze(userId int64) (aiAnalyzeResp *models.AiAnalyzeResp, err error) {
	aiModelConfig, err := ai.aiRepo.GetUserAiConfig(userId)
	if err != nil {
		return nil, err
	}
	contentType := "application/json"
	conf, err := json.Marshal(aiModelConfig)
	if err != nil {

		return nil, err
	}
	resp, err := http.Post("http://localhost:8001/ai/chat", contentType, strings.NewReader(string(conf)))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result map[string]any
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	fmt.Println(string(body))
	if err := json.Unmarshal(body, result); err != nil {
		return nil, err
	}

	return aiAnalyzeResp, nil
}
