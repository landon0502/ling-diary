package handler

import (
	"ling-diary/internal/models"
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

func (d *DiaryHandler) GetDiarys(c *gin.Context) {
	var query models.DiaryQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.ParamError(c, err.Error())
		return
	}
	// 设置默认值
	if query.Page == 0 {
		query.Page = 1
	}
	if query.PageSize == 0 {
		query.PageSize = 10
	}

	userID, ok := c.Get("user_id")
	if !ok {
		response.TokenInvalid(c)
		return
	}
	uid, ok := userID.(uint)
	if !ok {
		response.ParamFormatError(c)
		return
	}

	result, err := d.diaryService.GetDiarys(uid, query.Page, query.PageSize, query.Keyword)
	if err != nil {
		response.InternalServerError(c)
		return
	}
	response.Success(c, result)
}

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
