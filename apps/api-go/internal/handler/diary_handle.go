package handler

import (
	"ling-diary/internal/service"
	"ling-diary/pkg/response"

	"github.com/gin-gonic/gin"
)

type DiaryHandler struct {
	diaryService *service.DiaryService
}

func NewDiaryHandler(diaryService *service.DiaryService) *DiaryHandler {
	return &DiaryHandler{
		diaryService: diaryService,
	}
}

func (d *DiaryHandler) GetDiarys(c *gin.Context) {}

func (d *DiaryHandler) GetDiaryById(c *gin.Context) {}

func (d *DiaryHandler) CreateDiary(c *gin.Context) {
	var req service.CreateDiaryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ParamError(c, err.Error())
		return
	}
	userID, ok := c.Get("user_id")
	if !ok {
		response.TokenInvalid(c)
		return
	}
	dId, err := d.diaryService.Create(userID.(uint), req)
	if err != nil {
		response.InternalServerError(c)
		return
	}
	response.Success(c, gin.H{"id": dId, "message": "Create successify", "status": 1})
}

func (d *DiaryHandler) DelDiaryById(c *gin.Context) {}

func (d *DiaryHandler) UpdateDiaryById(c *gin.Context) {}
