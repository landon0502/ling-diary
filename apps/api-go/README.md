# Ling Diary API Go

## 项目概述

Ling Diary 是一个基于 Go 语言开发的日记应用后端 API 项目，采用 Gin 框架构建，遵循分层架构设计模式。

## 技术栈

| 组件 | 技术 |
|------|------|
| Web 框架 | Gin v1.12.0 |
| ORM | GORM v1.31.1 |
| 数据库 | MySQL |
| 认证 | JWT (golang-jwt/jwt/v5) |
| 配置管理 | YAML + 环境变量 |
| 密码加密 | bcrypt |

## 项目结构

```
api-go/
├── cmd/
│   └── server/
│       └── main.go           # 应用入口
├── configs/
│   └── config.yaml           # 配置文件
├── internal/
│   ├── app/
│   │   └── app.go            # 应用初始化与路由注册
│   ├── config/
│   │   └── config.go         # 配置结构定义
│   ├── handler/              # HTTP 处理器层
│   │   ├── user_handler.go   # 用户相关接口
│   │   └── auth_handle.go    # 认证相关接口
│   ├── middleware/           # 中间件
│   │   ├── cors.go           # CORS 跨域处理
│   │   ├── auth.go           # JWT 认证中间件
│   │   └── logging.go        # 日志中间件
│   ├── models/               # 数据模型
│   │   ├── user.go           # 用户模型
│   │   └── diary.go          # 日记模型
│   ├── repository/           # 数据访问层
│   │   ├── user_repository.go
│   │   └── auth_repository.go
│   └── service/              # 业务逻辑层
│       ├── user_service.go
│       └── auth_service.go
├── pkg/                      # 公共包
│   ├── config/
│   │   └── config.go         # 全局配置管理器
│   ├── database/
│   │   └── db.go             # 数据库连接管理
│   ├── response/
│   │   └── response.go       # 统一响应格式
│   └── utils/
│       └── utils.go
└── README.md
```

## API 接口说明

### 基础信息

- **Base URL**: `/api/v1`
- **响应格式**: JSON

### 统一响应结构

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

| 状态码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 接口列表

#### 1. 健康检查

**GET** `/health`

检查服务健康状态。

**响应示例**:
```json
{
  "status": "ok"
}
```

#### 2. 用户认证

##### 2.1 用户登录

**POST** `/api/v1/auth/login`

用户登录获取访问令牌。

**请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "message": "login successfully"
  }
}
```

#### 3. 用户管理

##### 3.1 创建用户

**POST** `/api/v1/users/`

创建新用户。

**请求体**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

| 字段 | 类型 | 必填 | 校验规则 | 说明 |
|------|------|------|----------|------|
| username | string | 是 | min:3, max:20 | 用户名 |
| email | string | 是 | email | 邮箱地址 |
| password | string | 是 | min:6 | 密码 |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "message": "User created successfully"
  }
}
```

##### 3.2 获取用户信息

**GET** `/api/v1/users/:id`

根据用户 ID 获取用户信息。

**路径参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 用户 ID |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "1",
    "message": "User found"
  }
}
```

##### 3.3 更新用户信息

**PUT** `/api/v1/users/:id`

更新用户信息。

**路径参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 用户 ID |

**请求体**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 否 | 新用户名 |
| email | string | 否 | 新邮箱 |
| password | string | 否 | 新密码 |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "1",
    "message": "User updated successfully"
  }
}
```

##### 3.4 删除用户

**DELETE** `/api/v1/users/:id`

删除指定用户。

**路径参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 用户 ID |

**响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "1",
    "message": "User deleted successfully"
  }
}
```

## 数据模型

### User (用户)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uint | 主键 |
| username | string | 用户名（唯一） |
| email | string | 邮箱（唯一） |
| password | string | 密码（加密存储） |
| created_at | time.Time | 创建时间 |
| updated_at | time.Time | 更新时间 |

### Diary (日记)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uint | 主键 |
| title | string | 标题 |
| content | string | 内容 |
| user_id | uint | 所属用户 ID |
| created_at | time.Time | 创建时间 |
| updated_at | time.Time | 更新时间 |

## 中间件

### CORS 中间件

处理跨域请求，允许的请求方法：
- GET
- POST
- PUT
- DELETE
- OPTIONS

### 认证中间件 (Auth)

JWT Token 认证，需要在请求头中携带：
```
Authorization: Bearer {token}
```

### 日志中间件 (Logging)

记录请求日志。

## 配置说明

配置文件位于 `configs/config.yaml`，支持通过环境变量 `CONFIG_PATH` 指定配置文件路径。

```yaml
environment: development  # 运行环境
server:
  port: "8080"            # 服务端口
database:
  host: localhost         # 数据库主机
  port: "3306"            # 数据库端口
  user: root              # 数据库用户
  password: ""            # 数据库密码
  name: ling_diary        # 数据库名称
jwt:
  secret: your-secret-key # JWT 密钥
  expire: 24              # Token 过期时间（小时）
```

## 开发指南

### 环境要求

- Go 1.26.3+
- MySQL 5.7+

### 安装依赖

```bash
go mod download
```

### 运行项目

```bash
go run cmd/server/main.go
```

### 构建项目

```bash
go build -o ling-diary cmd/server/main.go
```

## 待完成功能

- [ ] JWT Token 验证实现
- [ ] 日记相关接口实现
- [ ] 用户认证 Handler 实现
- [ ] Service 层依赖注入完善
- [ ] 单元测试
- [ ] API 文档（Swagger）
- [ ] 日志系统完善

## 架构特点

1. **分层架构**: Handler → Service → Repository，职责清晰
2. **依赖注入**: 使用构造函数注入依赖
3. **统一响应**: 封装统一的响应格式
4. **配置管理**: 支持环境变量覆盖配置
5. **密码安全**: 使用 bcrypt 加密存储密码