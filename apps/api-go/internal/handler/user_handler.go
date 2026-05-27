package handler

import (
	"ling-diary/internal/service"
	"ling-diary/pkg/response"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

// Create 创建用户
func (h *UserHandler) Create(c *gin.Context) {
	var req service.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "Invalid request body")
		return
	}
	_, err := h.userService.Create(&req)
	if err != nil {
		response.InternalServerError(c)
	}
	// TODO: 调用userService创建用户
	response.Success(c, gin.H{"message": "User created successfully"})
}

// Get 获取用户信息
func (h *UserHandler) Get(c *gin.Context) {
	id := c.Param("id")

	// TODO: 调用userService获取用户
	response.Success(c, gin.H{"id": id, "message": "User found"})
}

// Update 更新用户信息
func (h *UserHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var req service.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "Invalid request body")
		return
	}

	// TODO: 调用userService更新用户
	response.Success(c, gin.H{"id": id, "message": "User updated successfully"})
}

// Delete 删除用户
func (h *UserHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	// TODO: 调用userService删除用户
	response.Success(c, gin.H{"id": id, "message": "User deleted successfully"})
}

// 获取用户信息
func (s *UserHandler) GetUserInfo(c *gin.Context) {
	id, has := c.Get("user_id")
	if !has {
		response.Success(c, gin.H{"id": id, "message": "Get user info failed"})
		return
	}
	res, err := s.userService.GetByID(id.(uint))
	if err != nil {
		response.Success(c, gin.H{"id": id, "message": "Get user info failed"})
		return
	}
	response.Success(c, res)
}
