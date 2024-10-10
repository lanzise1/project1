package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"myproject/internal/models"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
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
	r.HandleFunc("/user/register", registerHandler(db)).Methods("POST")
	r.HandleFunc("/user/login", loginHandler(db)).Methods("POST")

	// 使用带有CORS的处理器
	http.Handle("/", handler)
}

func registerHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user models.User
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// 对密码进行哈希处理
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "无法处理密码", http.StatusInternalServerError)
			return
		}

		// 将用户插入数据库
		_, err = db.Exec("INSERT INTO users (username, password) VALUES (?, ?)", user.Username, string(hashedPassword))
		if err != nil {
			http.Error(w, "注册失败", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"message": "注册成功"})
	}
}

func loginHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("loginHandler")
		var user models.User
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// 从数据库中获取用户
		var dbUser models.User
		err = db.QueryRow("SELECT id, username, password FROM users WHERE username = ?", user.Username).Scan(&dbUser.ID, &dbUser.Username, &dbUser.Password)
		if err != nil {
			http.Error(w, "用户不存在", http.StatusUnauthorized)
			return
		}

		// 验证密码
		err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password))
		if err != nil {
			http.Error(w, "用户名或密码错误", http.StatusUnauthorized)
			return
		}
		userData := dbUser
		userData.Password = ""
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(models.Response[models.User]{
			Message: "登录成功",
			Code:    http.StatusOK,
			Data:    userData,
		})
		log.Println("登录成功")

	}
}
