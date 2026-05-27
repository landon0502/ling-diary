package config

import (
	"ling-diary/internal/config"
	"sync"
)

var (
	instance *ConfigManager
	once     sync.Once
)

// ConfigManager 全局配置管理器
type ConfigManager struct {
	config *config.Config
}

// GetConfigManager 获取单例配置管理器
func GetConfigManager() *ConfigManager {
	once.Do(func() {
		instance = &ConfigManager{}
		// 加载配置
		cfg, err := config.Load()
		if err != nil {
			panic("Failed to load configuration: " + err.Error())
		}
		instance.config = cfg
	})
	return instance
}

// Get 获取配置
func (cm *ConfigManager) Get() *config.Config {
	return cm.config
}

// Reload 重新加载配置
func (cm *ConfigManager) Reload() error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}
	cm.config = cfg
	return nil
}

// GetEnvironment 获取环境
func (cm *ConfigManager) GetEnvironment() string {
	return cm.config.Environment
}

// GetDatabaseConfig 获取数据库配置
func (cm *ConfigManager) GetDatabaseConfig() *config.DatabaseConfig {
	return &cm.config.Database
}

// GetJWTConfig 获取JWT配置
func (cm *ConfigManager) GetJWTConfig() *config.JWTConfig {
	return &cm.config.JWT
}

// GetServerPort 获取服务器端口
func (cm *ConfigManager) GetServerPort() string {
	if cm.config.Server.Port != "" {
		return cm.config.Server.Port
	}
	return "8080"
}