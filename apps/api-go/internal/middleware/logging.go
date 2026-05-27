package middleware

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

// 日志中间件
func Logging() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 开始时间
		start := time.Now()

		// 处理请求
		c.Next()

		// 结束时间
		end := time.Now()

		// 执行时间
		latency := end.Sub(start)

		// 请求方式
		method := c.Request.Method

		// 请求路由
		path := c.Request.URL.Path

		// 状态码
		statusCode := c.Writer.Status()

		// 请求IP
		clientIP := c.ClientIP()

		// 日志格式
		fmt.Printf("[GIN] %v | %3d | %13v | %15s | %s | %s\n",
			end.Format("2006/01/02 - 15:04:05"),
			statusCode,
			latency,
			clientIP,
			method,
			path,
		)
	}
}