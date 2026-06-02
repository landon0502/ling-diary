package repository

import (
	"ling-diary/internal/models"

	"gorm.io/gorm"
)

type DiaryRepository struct {
	db *gorm.DB
}

func NewDiaryRepository(db *gorm.DB) *DiaryRepository {
	return &DiaryRepository{
		db: db,
	}
}

func (diaryRepo *DiaryRepository) Create(userID uint, title string, content string) (uint, error) {
	diary := models.Diary{UserID: userID, Title: title, Content: content}
	if err := diaryRepo.db.Create(&diary).Error; err != nil {
		return 0, err
	}
	return diary.ID, nil
}
