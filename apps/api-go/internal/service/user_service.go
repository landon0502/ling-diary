package service

import (
	"errors"
	"ling-diary/internal/models"
	"ling-diary/internal/repository"
	"ling-diary/pkg/database"
	pkgtime "ling-diary/pkg/time"
	"ling-diary/pkg/token"
	utils "ling-diary/pkg/utils"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
}

func NewUserService() *UserService {
	return &UserService{}
}

// CreateUserRequest 创建用户请求
type CreateUserRequest struct {
	Username string `json:"username" binding:"required,min=3,max=20"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// UpdateUserRequest 更新用户请求
type UpdateUserRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// UserResponse 用户响应
type UserResponse struct {
	ID        uint               `json:"id"`
	Username  string             `json:"username"`
	Email     string             `json:"email"`
	CreatedAt pkgtime.CustomTime `json:"created_at"`
}

// Create 创建用户
func (s *UserService) Create(req *CreateUserRequest) (*UserResponse, error) {
	// 检查用户名是否已存在
	if _, err := repository.NewUserRepository(database.GetDB()).GetByUsername(req.Username); err == nil {
		return nil, errors.New("username already exists")
	}

	// 检查邮箱是否已存在
	if _, err := repository.NewUserRepository(database.GetDB()).GetByEmail(req.Email); err == nil {
		return nil, errors.New("email already exists")
	}

	// 密码加密
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// 创建用户
	user := &models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	if err := repository.NewUserRepository(database.GetDB()).Create(user); err != nil {
		return nil, err
	}

	return &UserResponse{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		CreatedAt: pkgtime.CustomTime{Time: user.CreatedAt},
	}, nil
}

// GetByID 根据ID获取用户
func (s *UserService) GetByID(id uint) (*UserResponse, error) {
	user, err := repository.NewUserRepository(database.GetDB()).GetByID(id)
	if err != nil {
		return nil, err
	}

	return &UserResponse{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		CreatedAt: pkgtime.CustomTime{Time: user.CreatedAt},
	}, nil
}

// Update 更新用户
func (s *UserService) Update(id uint, req *UpdateUserRequest) (*UserResponse, error) {
	user, err := repository.NewUserRepository(database.GetDB()).GetByID(id)
	if err != nil {
		return nil, err
	}

	// 如果更新用户名，检查是否已存在
	if req.Username != "" && req.Username != user.Username {
		if _, err := repository.NewUserRepository(database.GetDB()).GetByUsername(req.Username); err == nil {
			return nil, errors.New("username already exists")
		}
		user.Username = req.Username
	}

	// 如果更新邮箱，检查是否已存在
	if req.Email != "" && req.Email != user.Email {
		if _, err := repository.NewUserRepository(database.GetDB()).GetByEmail(req.Email); err == nil {
			return nil, errors.New("email already exists")
		}
		user.Email = req.Email
	}

	// 如果更新密码，加密新密码
	if req.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		user.Password = string(hashedPassword)
	}

	if err := repository.NewUserRepository(database.GetDB()).Update(user); err != nil {
		return nil, err
	}

	return &UserResponse{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		CreatedAt: pkgtime.CustomTime{Time: user.CreatedAt},
	}, nil
}

// Delete 删除用户
func (s *UserService) Delete(id uint) error {
	return repository.NewUserRepository(database.GetDB()).Delete(id)
}

// LoginRequest 登录请求
type LoginRequest struct {
	Name     string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse 登录响应
type LoginResponse struct {
	Token string        `json:"token"`
	User  *UserResponse `json:"user"`
}

// Login 用户登录
func (s *UserService) Login(req *LoginRequest) (*LoginResponse, error) {
	// 通过 repository 使用 bcrypt 验证用户名/密码和密码
	user, err := repository.NewUserRepository(database.GetDB()).GetByUserPassword(req.Name, req.Password)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// 生成 JWT token
	jwtToken, err := utils.GenerateJWT(user.ID, user.Username, 7*24)
	if err != nil {
		return nil, err
	}

	// 使用双向映射存储 token
	err = token.StoreTokenWithUserMapping(jwtToken, user.ID)
	if err != nil {
		return nil, errors.New("failed to store token")
	}

	// 返回登录响应
	return &LoginResponse{
		Token: jwtToken,
		User: &UserResponse{
			ID:        user.ID,
			Username:  user.Username,
			Email:     user.Email,
			CreatedAt: pkgtime.CustomTime{Time: user.CreatedAt},
		},
	}, nil
}
