package main

import (
	"ling-diary/internal/app"
	"log"
)

func main() {
	// 初始化应用
	a, err := app.New()
	if err != nil {
		log.Fatalf("Failed to initialize app: %v", err)
	}

	// 启动服务器
	if err := a.Run(""); err != nil {
		log.Fatalf("Failed to run app: %v", err)
	}
}
