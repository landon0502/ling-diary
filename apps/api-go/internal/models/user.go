package models

import (
	"ling-diary/pkg/idnode"
	"time"

	"gorm.io/gorm"
)

// User 用户模型
type User struct {
	ID        int64     `json:"id" gorm:"primaryKey;autoIncrement:false;type:varchar(64)"`
	Username  string    `json:"username" gorm:"unique;not null"`
	Email     string    `json:"email" gorm:"unique;not null"`
	Password  string    `json:"-" gorm:"not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

func (u *User) BeforeCreate(tx *gorm.DB) {
	if u.ID == 0 {
		u.ID = idnode.GenerateInt64()
	}
}

// UserCreate 用户创建请求
type UserCreate struct {
	Username string `json:"username" binding:"required,min=3,max=20"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// UserUpdate 用户更新请求
type UserUpdate struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
