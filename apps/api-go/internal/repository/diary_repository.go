package repository

import (
	"ling-diary/internal/models"
	"math"

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

func (diaryRepo *DiaryRepository) Create(userID uint, title string, content string, contentJSON string) (uint, error) {
	diary := models.Diary{UserID: userID, Title: title, Content: content, ContentJSON: contentJSON}
	if err := diaryRepo.db.Create(&diary).Error; err != nil {
		return 0, err
	}
	return diary.ID, nil
}

func (diaryRepo *DiaryRepository) GetData(userID uint, page int, pageSize int, keyword string) (*models.PageResult, error) {
	var total int64
	query := diaryRepo.db.Model(&models.Diary{}).Where("user_id = ?", userID)
	if keyword != "" {
		query = query.Where("title LIKE ? OR content LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
	}
	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	// 计算总页数
	totalPage := int64(math.Ceil(float64(total) / float64(pageSize)))

	offset := (page - 1) * pageSize
	var diaries []models.Diary
	if err := query.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&diaries).Error; err != nil {
		return nil, err
	}

	return &models.PageResult{
		List:      diaries,
		Total:     total,
		Page:      page,
		PageSize:  pageSize,
		TotalPage: totalPage,
	}, nil
}
