package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func SetupRoutes(r *mux.Router, db *sql.DB) {
	// 创建一个新的CORS中间件
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // 允许所有来源，您可以根据需要限制特定域名
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// 将CORS中间件应用到路由器
	handler := c.Handler(r)

	// 设置路由
	r.HandleFunc("/user/register", RegisterHandler(db)).Methods("POST")
	r.HandleFunc("/user/login", LoginHandler(db)).Methods("POST")

	// 使用带有CORS的处理器
	http.Handle("/", handler)
}
