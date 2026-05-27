package models

import "time"

// Diary 日记模型
type Diary struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Title     string    `json:"title" gorm:"not null"`
	Content   string    `json:"content" gorm:"type:text"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// DiaryCreate 日记创建请求
type DiaryCreate struct {
	Title   string `json:"title" binding:"required,min=1,max=100"`
	Content string `json:"content"`
}

// DiaryUpdate 日记更新请求
type DiaryUpdate struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

// DiaryQuery 日记查询参数
type DiaryQuery struct {
	Page     int    `form:"page" binding:"min=1"`
	PageSize int    `form:"page_size" binding:"min=1,max=100"`
	Keyword  string `form:"keyword"`
}