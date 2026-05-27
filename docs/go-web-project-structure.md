# Go Web应用项目结构方案

## 1. 基础结构

```
project/
├── cmd/              # 应用程序入口
│   └── server/
│       └── main.go
├── internal/         # 内部包，不对外暴露
│   ├── config/      # 配置相关
│   ├── handler/     # HTTP处理器
│   ├── middleware/  # 中间件
│   ├── models/      # 数据模型
│   ├── repository/  # 数据访问层
│   └── service/     # 业务逻辑层
├── pkg/            # 可复用的公共包
│   ├── logger/
│   ├── validator/
│   └── utils/
├── api/            # API定义（protobuf, grpc等）
├── configs/        # 配置文件
├── scripts/        # 构建和部署脚本
├── web/            # 静态文件（如果需要）
├── go.mod
└── go.sum
```

## 2. 当前项目的简单结构

```
api-go/
├── main.go
├── go.mod
└── go.sum
```

## 3. 进阶结构示例

当应用变大时，建议采用以下结构：

```
ling-diary/
├── cmd/
│   └── api/
│       └── main.go
├── internal/
│   ├── app/         # 应用初始化
│   │   └── app.go
│   ├── config/
│   │   └── config.go
│   ├── handler/
│   │   ├── user_handler.go
│   │   └── diary_handler.go
│   ├── middleware/
│   │   ├── auth.go
│   │   └── logging.go
│   ├── models/
│   │   ├── user.go
│   │   └── diary.go
│   ├── repository/
│   │   ├── user_repo.go
│   │   └── diary_repo.go
│   └── service/
│       ├── user_service.go
│       └── diary_service.go
├── pkg/
│   ├── database/
│   │   └── db.go
│   └── response/
│       └── response.go
├── configs/
│   └── config.yaml
├── go.mod
└── go.sum
```

## 4. 关键目录说明

- **cmd/**: 应用程序入口点，每个子目录是一个可执行的应用
- **internal/**: 私有应用程序和库代码，不对外暴露
- **pkg/**: 可被外部应用使用的库代码
- **api/**: API定义文件（protobuf, OpenAPI等）
- **configs/**: 配置文件
- **scripts/**: 构建和部署脚本
- **web/**: 静态资源文件

## 5. 日记应用推荐结构

```
ling-diary-api/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── app/
│   │   └── app.go          # 应用初始化和路由配置
│   ├── config/
│   │   └── config.go       # 配置管理
│   ├── handler/
│   │   ├── auth.go         # 认证相关
│   │   ├── diary.go        # 日记相关
│   │   └── user.go         # 用户相关
│   ├── middleware/
│   │   ├── auth.go         # JWT认证中间件
│   │   ├── cors.go         # 跨域中间件
│   │   └── logging.go      # 日志中间件
│   ├── models/
│   │   ├── diary.go        # 日记模型
│   │   └── user.go         # 用户模型
│   ├── repository/
│   │   ├── diary_repo.go   # 日记数据访问
│   │   └── user_repo.go    # 用户数据访问
│   └── service/
│       ├── diary_service.go # 日记业务逻辑
│       └── user_service.go  # 用户业务逻辑
├── pkg/
│   ├── database/
│   │   └── db.go          # 数据库连接
│   ├── response/
│   │   └── response.go    # 统一响应格式
│   └── utils/
│       └── utils.go       # 工具函数
├── configs/
│   └── config.yaml       # 配置文件
└── go.mod
```

## 6. 设计原则

1. **关注点分离**: 每个目录有明确的职责
2. **依赖倒置**: 高层模块不依赖低层模块的具体实现
3. **单一职责**: 每个包/模块只负责一项功能
4. **可测试性**: 结构便于编写单元测试和集成测试
5. **可扩展性**: 结构支持功能扩展而不需要大规模重构

## 7. 迁移建议

- 小型应用可以从简单结构开始
- 随着功能增长，逐步迁移到推荐结构
- 使用 `go mod tidy` 管理依赖
- 保持 `internal` 包的私有性

## 8. 已生成的文件清单

已成功在 `api-go` 目录下创建以下文件：

- **cmd/server/main.go** - 应用程序入口
- **internal/app/app.go** - 应用初始化和路由配置
- **internal/config/config.go** - 配置管理
- **internal/handler/user_handler.go** - 用户处理器
- **internal/handler/diary_handler.go** - 日记处理器
- **internal/middleware/auth.go** - 认证中间件
- **internal/middleware/cors.go** - 跨域中间件
- **internal/middleware/logging.go** - 日志中间件
- **internal/models/user.go** - 用户模型
- **internal/models/diary.go** - 日记模型
- **internal/repository/user_repository.go** - 用户数据访问
- **internal/repository/diary_repository.go** - 日记数据访问
- **internal/service/user_service.go** - 用户业务逻辑
- **internal/service/diary_service.go** - 日记业务逻辑
- **pkg/database/db.go** - 数据库连接
- **pkg/response/response.go** - 统一响应格式
- **pkg/utils/utils.go** - 工具函数
- **configs/config.yaml** - 配置文件