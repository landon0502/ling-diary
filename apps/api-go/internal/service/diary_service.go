package service

import (
	"ling-diary/internal/models"
	"ling-diary/internal/repository"
)

type DiaryService struct {
	diaryRepo *repository.DiaryRepository
}

func NewDiaryService(diaryRepo *repository.DiaryRepository) *DiaryService {
	return &DiaryService{
		diaryRepo: diaryRepo,
	}
}

type CreateDiaryRequest struct {
	Title       string `json:"title"`
	Content     string `json:"content"`
	ContentJSON string `json:"contentJSON"`
	IsAnalyze   int    `json:"isAnalyze"`
}

func (diaryService *DiaryService) GetDiarys(userID uint, page int, pageSize int, keyword string) (*models.PageResult, error) {
	return diaryService.diaryRepo.GetData(userID, page, pageSize, keyword)
}

func (diaryService *DiaryService) GetById() {}

func (diaryService *DiaryService) Create(userID uint, req CreateDiaryRequest) (uint, error) {

	return diaryService.diaryRepo.Create(userID, req.Title, req.Content, req.ContentJSON)
}

func (diaryService *DiaryService) DelDiary() {}

func (diaryService *DiaryService) Update() {}
