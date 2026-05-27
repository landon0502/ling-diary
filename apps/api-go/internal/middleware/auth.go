package middleware

import (
	utils "ling-diary/pkg/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// JWT认证中间件
func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// 解析Bearer token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer token required"})
			c.Abort()
			return
		}

		// 验证JWT token
		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer token expired"})
			c.Abort()
			return
		}
		// 将用户ID存入上下文
		c.Set("user_id", claims.UserID)

		c.Next()
	}
}
