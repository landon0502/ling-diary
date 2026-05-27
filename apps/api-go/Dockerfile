# 使用官方 Go 镜像作为构建阶段
FROM golang:1.26-alpine AS builder

# 设置工作目录
WORKDIR /app

# 设置 Go 玑境变量
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64

# 复制 go.mod 和 go.sum 文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN go build -a -installsuffix cgo -o server ./cmd/server/main.go

# 使用最小化 Alpine 镜像作为运行阶段
FROM alpine:latest

# 安装 ca-certificates (如果需要 HTTPS)
RUN apk --no-cache add ca-certificates

# 设置工作目录
WORKDIR /root/

# 从构建阶段复制二进制文件
COPY --from=builder /app/server .

# 复制配置文件
COPY --from=builder /app/configs ./configs

# 暴露端口
EXPOSE 8080

# 运行应用
CMD ["./server"]