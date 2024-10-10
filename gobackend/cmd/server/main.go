package main

import (
	"log"
	"myproject/config"
	"myproject/internal/database"
	"myproject/internal/handlers"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	// 加载配置
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Error loading config:", err)
	}

	// 连接数据库
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}
	defer db.Close()

	// 创建路由
	r := mux.NewRouter()
	handlers.SetupRoutes(r, db)

	// 添加一个简单的测试路由
	r.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	// 设置服务器
	log.Println("服务器正在运行，端口为2148")
	log.Fatal(http.ListenAndServe(":2148", r))
}
