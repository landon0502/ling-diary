package middleware

import (
	token_pkg "ling-diary/pkg/token"
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

		// 从Redis中校验token并获取user_id
		userID, err := token_pkg.VerifyTokenWithUserMapping(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			c.Abort()
			return
		}

		c.Set("user_id", userID)

		c.Next()
	}
}
