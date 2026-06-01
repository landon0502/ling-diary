package idnode

import (
	"fmt"

	"github.com/bwmarrin/snowflake"
)

var node *snowflake.Node

func init() {
	var err error
	// 参数 1 代表当前机器/节点的 ID (范围: 0 - 1023)
	// 在分布式部署时，每个实例的这个 ID 必须唯一，可以通过环境变量或配置传入
	node, err = snowflake.NewNode(1)
	if err != nil {
		panic(fmt.Sprintf("初始化雪花算法节点失败: %v", err))
	}
}

// GenerateString 生成字符串类型的雪花 ID (推荐，防止前端 JavaScript 精度丢失)
func GenerateString() string {
	return node.Generate().String()
}

// GenerateInt64 生成 int64 类型的雪花 ID
func GenerateInt64() int64 {
	return node.Generate().Int64()
}
