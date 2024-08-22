// Copyright (c) 2022-2024 Ronan LE MEILLAT
// This program is licensed under the AGPLv3 license.
package config

import (
	"os"

	"gopkg.in/yaml.v2"
)

type Config struct {
	Users map[string]string `yaml:"users"`
	SMTP  SMTPConfig        `yaml:"smtp"`
	Port  string            `yaml:"port"`
}

type SMTPConfig struct {
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
	Username string `yaml:"username"`
	Password string `yaml:"password"`
}

func Load(configFile string) (*Config, error) {
	if configFile == "" {
		configFile = os.Getenv("WEB_SMTP_CONFIG_FILE")
	}
	if configFile == "" {
		configFile = "config.yaml"
	}

	config := &Config{}
	data, err := os.ReadFile(configFile)
	if err != nil {
		return nil, err
	}
	err = yaml.Unmarshal(data, config)
	if err != nil {
		return nil, err
	}

	if config.Port == "" {
		config.Port = os.Getenv("WEB_SMTP_PORT")
	}
	if config.Port == "" {
		config.Port = "8080"
	}

	return config, nil
}
