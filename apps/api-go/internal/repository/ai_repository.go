package repository

import (
	"ling-diary/internal/models"

	"gorm.io/gorm"
)

type AiRepository struct {
	db *gorm.DB
}

func NewAiRepository(db *gorm.DB) *AiRepository {
	return &AiRepository{
		db: db,
	}
}

func (ai *AiRepository) GetPlatformsTree() ([]models.AiPlatforms, error) {
	var aiPlatforms []models.AiPlatforms
	err := ai.db.Preload("Models").Find(&aiPlatforms).Error
	if err != nil {
		return nil, err
	}
	return aiPlatforms, nil
}

func (ai *AiRepository) GetUserAiConfig(userID int64) (*models.UserAiConfig, error) {
	var conf models.UserAiConfig
	err := ai.db.Where("user_id = ?", userID).First(&conf).Error
	if err != nil {
		return nil, err
	}
	return &conf, nil
}

func (ai *AiRepository) SaveUserAiConfig(conf *models.UserAiConfig) error {
	var existing models.UserAiConfig
	err := ai.db.Where("user_id = ?", conf.UserId).First(&existing).Error
	if err == nil {
		return ai.db.Model(&existing).Updates(conf).Error
	}
	return ai.db.Create(conf).Error
}
