package database

import (
	"database/sql"
	"myproject/config"

	_ "github.com/go-sql-driver/mysql"
)

func Connect(cfg *config.Config) (*sql.DB, error) {
	dataSourceName := cfg.DBUser + ":" + cfg.DBPass + "@tcp(" + cfg.DBHost + ":" + cfg.DBPort + ")/" + cfg.DBName + "?charset=utf8mb4"
	return sql.Open("mysql", dataSourceName)
}
