package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v2"
)

type Config struct {
	Environment string         `yaml:"environment"`
	Server      ServerConfig   `yaml:"server"`
	Database    DatabaseConfig `yaml:"database"`
	JWT         JWTConfig      `yaml:"jwt"`
	Redis       RedisConfig    `yaml:"redis"`
}

type ServerConfig struct {
	Port string `yaml:"port"`
}

type DatabaseConfig struct {
	Host     string `yaml:"host"`
	Port     string `yaml:"port"`
	User     string `yaml:"user"`
	Password string `yaml:"password"`
	Name     string `yaml:"name"`
}

type JWTConfig struct {
	Secret string `yaml:"secret"`
	Expire int    `yaml:"expire"` // 过期时间（小时）
}

type RedisConfig struct {
	Addr     string `yaml:"addr"`
	Password string `yaml:"password"`
}

func Load() (*Config, error) {
	// 从环境变量获取配置文件路径
	configPath := os.Getenv("CONFIG_PATH")
	if configPath == "" {
		configPath = "configs/config.yaml"
	}

	// 读取配置文件
	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	var config Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("failed to parse config file: %w", err)
	}

	// 设置默认值
	setDefaults(&config)

	return &config, nil
}

func setDefaults(c *Config) {
	if c.Environment == "" {
		c.Environment = "development"
	}
	if c.Server.Port == "" {
		c.Server.Port = "8080"
	}
	if c.JWT.Secret == "" {
		c.JWT.Secret = "your-secret-key"
	}
	if c.JWT.Expire == 0 {
		c.JWT.Expire = 24
	}
}
