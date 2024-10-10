package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBUser string
	DBPass string
	DBName string
	DBHost string
	DBPort string
}

func Load() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	return &Config{
		DBUser: os.Getenv("DATABASE_USER"),
		DBPass: os.Getenv("DATABASE_PASSWORD"),
		DBName: os.Getenv("DATABASE_NAME"),
		DBHost: os.Getenv("DATABASE_HOST"),
		DBPort: os.Getenv("DATABASE_PORT"),
	}, nil
}
