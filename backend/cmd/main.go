package main

import (
	"backend/config"
	"backend/controllers"
	"backend/middlewares"
	"fmt"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	// Load environment variables
	config.LoadEnv()

	// Initialize the database connection
	config.InitDB()

	// Set up the Gin router
	router := gin.Default()

	// Enable CORS for frontend localhost
	router.Use(middlewares.SetupCORS())

	// Define routes and pass the db connection
	threadGroup := router.Group("/threads")
	threadGroup.Use(middlewares.JWTAuthMiddleware())
	{
		threadGroup.POST("/post", func(c *gin.Context) {
			controllers.PostThread(c, config.DB)
		})
	}
	router.POST("/signup", func(c *gin.Context) {
		controllers.UserSignup(c, config.DB)
	})
	router.POST("/login", func(c *gin.Context) {
		controllers.UserLogin(c, config.DB)
	})
	router.GET("/threads", func(c *gin.Context) {
		controllers.GetThreads(c, config.DB)
	})

	// Run the server
	fmt.Println(`
  ___       __    _______    ___        ________   ________   _____ ______    _______      
  |\  \     |\  \ |\  ___ \  |\  \      |\   ____\ |\   __  \ |\   _ \  _   \ |\  ___ \     
  \ \  \    \ \  \\ \   __/| \ \  \     \ \  \___| \ \  \|\  \\ \  \\\__\ \  \\ \   __/|    
   \ \  \  __\ \  \\ \  \_|/__\ \  \     \ \  \     \ \  \\\  \\ \  \\|__| \  \\ \  \_|/__  
    \ \  \|\__\_\  \\ \  \_|\ \\ \  \____ \ \  \____ \ \  \\\  \\ \  \    \ \  \\ \  \_|\ \ 
     \ \____________\\ \_______\\ \_______\\ \_______\\ \_______\\ \__\    \ \__\\ \_______\
      \|____________| \|_______| \|_______| \|_______| \|_______| \|__|     \|__| \|_______|                                                                                
  `)
	router.Run(":8080")
}
