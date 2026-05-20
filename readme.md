# LingDiary API 设计文档

## 项目简介

LingDiary 是一个基于 AI 的英文日记学习平台。

核心功能：

- 每日英文日记
- AI 英文评分
- 语法纠错
- AI 改写建议
- 长期英语成长分析

---

# 技术架构

## 前端

- Next.js
- TailwindCSS
- shadcn/ui

---

## Go 主后端

- Gin
- JWT
- GORM
- Redis
- Asynq

---

## Python AI 服务

- FastAPI
- OpenAI SDK
- LangChain

---

## 数据库

- MySQL
- Redis

---

# Monorepo 目录结构

```text
lingdiary/
├── apps/
│
│   ├── web/                 # Next.js
│   │
│   ├── api-go/              # Go 主后端
│   │
│   └── ai-service/          # Python AI 服务
│
├── packages/
│
│   ├── shared-types/
│   ├── shared-config/
│   └── prompts/
│
├── deploy/
│   ├── docker/
│   └── nginx/
│
├── scripts/
│
├── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md
```

---

# 系统架构图

```text
                ┌─────────────────┐
                │     Next.js      │
                │      Web App     │
                └────────┬─────────┘
                         │
                    HTTP API
                         │
          ┌──────────────▼──────────────┐
          │         Go API               │
          │ Gin + JWT + GORM             │
          └───────┬─────────┬───────────┘
                  │         │
                  │         │
           ┌──────▼───┐ ┌──▼──────┐
           │  MySQL   │ │ Redis   │
           └──────────┘ └─────────┘
                  │
                  ▼
          ┌────────────────┐
          │ Python AI      │
          │ FastAPI        │
          └──────┬─────────┘
                 │
                 ▼
          ┌───────────────┐
          │ OpenAI / GLM  │
          └───────────────┘
```

---

# API 规范

## Base URL

```text
/api/v1
```

---

## 通用响应格式

### 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

---

### 错误响应

```json
{
  "code": 1001,
  "message": "invalid params"
}
```

---

# 用户模块

## 用户注册

### 请求

```http
POST /api/v1/auth/register
```

---

### Body

```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

---

### 响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "jwt_token"
  }
}
```

---

# 用户登录

### 请求

```http
POST /api/v1/auth/login
```

---

### Body

```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

---

### 响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "jwt_token"
  }
}
```

---

# 获取当前用户信息

### 请求

```http
GET /api/v1/user/me
```

---

### Headers

```text
Authorization: Bearer jwt_token
```

---

### 响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "email": "test@test.com",
    "nickname": "Tom"
  }
}
```

---

# 日记模块

# 创建日记

### 请求

```http
POST /api/v1/diaries
```

---

### Body

```json
{
  "content": "Today I went shopping with my friends."
}
```

---

### 响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "status": "processing"
  }
}
```

---

# 获取日记详情

### 请求

```http
GET /api/v1/diaries/:id
```

---

### 响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "content": "Today I went shopping...",
    "word_count": 120,
    "created_at": "2026-05-19"
  }
}
```

---

# 获取我的日记列表

### 请求

```http
GET /api/v1/diaries?page=1&page_size=10
```

---

### 响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "score": 85,
        "created_at": "2026-05-19"
      }
    ],
    "total": 1
  }
}
```

---

# 删除日记

### 请求

```http
DELETE /api/v1/diaries/:id
```

---

### 响应

```json
{
  "code": 0,
  "message": "success"
}
```

---

# AI 分析模块

# 获取 AI 分析结果

### 请求

```http
GET /api/v1/diaries/:id/report
```

---

### 响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "score": 82,
    "grammar_score": 80,
    "fluency_score": 85,
    "vocabulary_score": 78,
    "grammar_errors": [
      {
        "original": "I goed",
        "fixed": "I went",
        "reason": "Wrong tense"
      }
    ],
    "rewrite": "Today I went shopping with my friends..."
  }
}
```

---

# 重新 AI 分析

### 请求

```http
POST /api/v1/diaries/:id/reanalyze
```

---

### 响应

```json
{
  "code": 0,
  "message": "reanalyze queued"
}
```

---

# 统计模块

# 获取成长趋势

### 请求

```http
GET /api/v1/statistics/trend
```

---

### 响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "scores": [
      {
        "date": "2026-05-01",
        "score": 72
      },
      {
        "date": "2026-05-02",
        "score": 78
      }
    ]
  }
}
```

---

# 获取常见错误统计

### 请求

```http
GET /api/v1/statistics/mistakes
```

---

### 响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "type": "grammar",
        "content": "past tense",
        "count": 10
      }
    ]
  }
}
```

---

# AI Service 内部接口

这些接口仅供 Go API 内部调用。

---

# AI 分析接口

### 请求

```http
POST /internal/analyze
```

---

### Body

```json
{
  "diary_id": 1,
  "content": "Today I went shopping..."
}
```

---

### 响应

```json
{
  "score": 85,
  "grammar": [],
  "rewrite": "Today I went shopping with my friends..."
}
```

---

# 数据库设计

# users

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100),
    password VARCHAR(255),
    nickname VARCHAR(50),
    avatar VARCHAR(255),
    streak_days INT DEFAULT 0,
    created_at DATETIME
);
```

---

# diaries

```sql
CREATE TABLE diaries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    content TEXT,
    word_count INT,
    ai_status VARCHAR(20),
    created_at DATETIME
);
```

---

# diary_reports

```sql
CREATE TABLE diary_reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    diary_id BIGINT,
    total_score INT,
    grammar_score INT,
    vocabulary_score INT,
    fluency_score INT,
    rewrite_content TEXT,
    feedback_json JSON,
    created_at DATETIME
);
```

---

# user_mistakes

```sql
CREATE TABLE user_mistakes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    type VARCHAR(50),
    content TEXT,
    fixed_content TEXT,
    count INT DEFAULT 1
);
```

---

# Docker Compose 示例

```yaml
services:

  web:
    build: ./apps/web
    ports:
      - "3000:3000"

  api:
    build: ./apps/api-go
    ports:
      - "8080:8080"

  ai-service:
    build: ./apps/ai-service
    ports:
      - "8000:8000"

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: lingdiary

  redis:
    image: redis:7
```

---

# 开发阶段规划

## Phase 1

MVP：

- 用户登录
- 写日记
- AI评分
- 历史记录

---

## Phase 2

增加：

- 成长趋势
- AI Rewrite
- CEFR等级分析

---

## Phase 3

增加：

- AI陪练
- RAG
- 向量搜索
- 英语学习画像

---

# 推荐部署方案

## 初期

- Docker Compose
- Ubuntu
- Nginx

---

## 后期

- Kubernetes
- Redis Cluster
- MySQL 主从
- AI 服务独立扩容

---

# 项目亮点

LingDiary 最大价值：

- 长期英语学习数据积累
- AI 写作能力分析
- 用户英语成长画像
- 个性化英语学习路径

这是一个非常适合：

- AI SaaS
- 独立开发
- 出海产品
- 面试项目
- AI Coding 实战

的完整项目。

