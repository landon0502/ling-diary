# ai-service

AI 对话服务 —— 基于 FastAPI 的大模型调用网关，负责对接智谱、DeepSeek 等大模型 API，为前端提供统一的 AI 能力接口。

## 技术栈

| 组件 | 说明 |
|---|---|
| Python 3.14 | 运行时 |
| FastAPI | Web 框架 |
| Uvicorn | ASGI 服务器 |
| Pydantic v2 | 数据校验 |
| SQLAlchemy 2.0 | ORM（async） |
| asyncmy | MySQL 异步驱动 |
| redis-py | Redis 异步客户端 |
| OpenAI SDK | 大模型调用（兼容接口） |
| python-dotenv | 环境变量管理 |

## 快速开始

```bash
# 1. 安装依赖
make install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入实际的 API Key

# 3. 启动开发服务器
make dev
```

服务默认运行在 `http://0.0.0.0:8001`，Swagger 文档在 `http://0.0.0.0:8001/docs`。

## 项目结构

```
ai-service/
├── .env                  # 环境变量（不提交）
├── .env.example          # 环境变量模板
├── .gitignore
├── Makefile              # 常用命令
├── requirements.txt      # 依赖清单
├── README.md
└── app/
    ├── main.py           # 入口：app 实例、中间件、异常注册、路由挂载、生命周期
    ├── core/
    │   ├── config.py     # Settings 配置单例（MySQL / Redis / 模型 / CORS / 日志）
    │   ├── exception.py  # 全局异常处理器（HTTP / 校验 / 业务 / 兜底）
    │   └── middleware.py # 中间件（CORS、请求日志 + X-Request-ID、耗时追踪）
    ├── db/
    │   ├── database.py   # SQLAlchemy async engine + 连接池 + get_session 依赖注入
    │   └── redis.py      # Redis async 连接池 + 快捷缓存方法
    ├── dao/              # 数据访问层 —— 封装对 MySQL / Redis 的 CRUD
    ├── utils/
    │   └── response.py   # 统一响应格式 { code, message, data }
    ├── routers/
    │   ├── health.py     # 健康检查 GET /health
    │   └── ai.py         # AI 对话 POST /ai/chat
    ├── models/           # Pydantic 请求/响应模型 + SQLAlchemy 数据模型
    └── services/         # 业务逻辑层
```

## 配置项说明

所有配置通过环境变量注入，开发环境使用 `.env` 文件，生产环境通过 docker-compose 或 K8s ConfigMap 注入。

| 变量 | 默认值 | 说明 |
|---|---|---|
| `APP_HOST` | `0.0.0.0` | 监听地址 |
| `APP_PORT` | `8001` | 监听端口 |
| `DEBUG` | `false` | 调试模式（开启后 Swagger 显示更多错误详情） |
| `LOG_LEVEL` | `INFO` | 日志级别 |
| `CORS_ORIGINS` | `http://localhost:3000` | 允许跨域来源，多个用逗号分隔 |
| `DB_HOST` | `127.0.0.1` | MySQL 主机 |
| `DB_PORT` | `3306` | MySQL 端口 |
| `DB_USER` | `root` | MySQL 用户名 |
| `DB_PASSWORD` | `00000000` | MySQL 密码 |
| `DB_NAME` | `ling_diary` | 数据库名 |
| `DB_POOL_SIZE` | `10` | 连接池大小 |
| `DB_MAX_OVERFLOW` | `20` | 连接池最大溢出 |
| `DB_ECHO` | `false` | 是否打印 SQL 日志 |
| `REDIS_HOST` | `127.0.0.1` | Redis 主机 |
| `REDIS_PORT` | `6379` | Redis 端口 |
| `REDIS_DB` | `0` | Redis 数据库编号 |
| `REDIS_PASSWORD` | 空 | Redis 密码 |
| `REDIS_POOL_MAX` | `20` | Redis 连接池最大连接数 |
| `DEEPSEEK_API_KEY` | — | DeepSeek API Key |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | DeepSeek 接口地址 |
| `ZAI_API_KEY` | — | 智谱 API Key |
| `ZAI_BASE_URL` | `https://open.bigmodel.cn/api/paas/v4/` | 智谱接口地址 |

## 中间件

| 中间件 | 说明 |
|---|---|
| CORS | 仅允许 `CORS_ORIGINS` 列表中的来源跨域访问 |
| RequestLogging | 每次请求记录 method、路径、状态码、耗时，注入 `X-Request-ID` 响应头用于链路追踪 |

## 应用生命周期

应用启动时自动初始化 Redis 连接池，关闭时自动释放。日志会输出启停事件，便于排查问题。

```python
# main.py
@asynccontextmanager
async def lifespan(_app: FastAPI):
    await redis_client.connect()   # 启动：创建连接池
    yield
    await redis_client.disconnect() # 关闭：释放连接池
```

## 数据库访问

通过 FastAPI 依赖注入获取数据库会话：

```python
from fastapi import Depends
from app.db import get_session

@router.get("/example")
async def example(session = Depends(get_session)):
    # session 是 SQLAlchemy AsyncSession，自动 commit/rollback
    pass
```

Redis 通过模块级单例直接使用：

```python
from app.db import redis_client

cached = await redis_client.get("my_key")
await redis_client.set("my_key", "value", expire=3600)
```

## 统一响应格式

所有接口返回统一结构：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

接口层通过 `success()` / `error()` 工具函数构建响应，也可在业务层 `raise AppException(code=400, message="xxx")` 抛出异常，由全局异常处理器统一转换。

## 可用命令

```bash
make dev        # 开发模式（热重载）
make run        # 生产模式
make install    # 安装依赖
make test       # 运行测试
make fmt        # 格式化代码（ruff）
make tidy       # 检查并自动修复（ruff）
make build      # 构建 Docker 镜像
make start      # 启动 Docker 容器
make clean      # 停止并移除容器
```

## 接口列表

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/health` | 健康检查，供 K8s 探活 |
| POST | `/ai/chat` | AI 对话（示例接口） |

详细文档见 Swagger：启动后访问 `http://localhost:8001/docs`。


不需要多个Provider实体
通过数据库配置 动态切换，
注意点：
部分模型可能在api上没有适配openapi，这里可能需要使用当前模型对应的 管理端，
暂时使用openai兼容接口
❓：模型配置是否需要存redis？？？？
prompt 应该是存在多场景, 需要定制多个tools 和 prompt来进行适配