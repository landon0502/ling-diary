package service

import "ling-diary/internal/repository"

type DiaryService struct {
	diaryRepo *repository.DiaryRepository
}

func NewDiaryService(diaryRepo *repository.DiaryRepository) *DiaryService {
	return &DiaryService{
		diaryRepo: diaryRepo,
	}
}

type CreateDiaryRequest struct {
	Title     string `json:"title"`
	Content   string `json:"content"`
	IsAnalyze int    `json:"isAnalyze"`
}

func (diaryService *DiaryService) GetDiarys(title string, content string) {

}

func (diaryService *DiaryService) GetById() {}

func (diaryService *DiaryService) Create(userID uint, req CreateDiaryRequest) (uint, error) {

	return diaryService.diaryRepo.Create(userID, req.Title, req.Content)
}

func (diaryService *DiaryService) DelDiary() {}

func (diaryService *DiaryService) Update() {}
