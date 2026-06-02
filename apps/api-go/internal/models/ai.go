package models

import (
	"time"
)

// ai model
type AiModel struct {
	Id         int       `json:"id" gorm:"id"`
	PlatformId int       `json:"platform_id" gorm:"platform_id"`
	Label      string    `json:"label" gorm:"label"`
	Value      string    `json:"value" gorm:"value"`
	CreateAt   time.Time `json:"create_at" gorm:"create_at"`
}

// ai 平台及模型
type AiPlatforms struct {
	Id       int       `json:"id" gorm:"id"`
	Name     string    `json:"name" gorm:"name"`
	Label    string    `json:"label" gorm:"label"`
	AuthUrl  string    `json:"auth_url" gorm:"auth_url"`
	CreateAt time.Time `json:"create_at" gorm:"create_at"`
	Models   []AiModel `json:"models" gorm:"foreignKey:PlatformId"`
}

type UserAiConfig struct {
	Id       int    `json:"id,string" grom:"primaryKey,id"`
	Model    string `json:"model" gorm:"model"`
	Platform string `json:"platform" gorm:"platform"`
	AuthUrl  string `json:"auth_url" gorm:"auth_url"`
	ApiKey   string `json:"api_key" grom:"api_key"`
	UserId   int64  `json:"user_id" grom:"user_id"`
}
