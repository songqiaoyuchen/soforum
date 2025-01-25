package main

import (
	"backend/config"
	"backend/controllers"
	"backend/middlewares"
	"fmt"
	"log"
	"os"

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
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to the API!",
		})
	})
	userGroup := router.Group("/user")
	{
		userGroup.PUT("/:username", middlewares.JWTAuthMiddleware(), func(c *gin.Context) {
			controllers.UpdateUser(c, config.DB)
		})
		userGroup.GET("/:username", func(c *gin.Context) {
			controllers.GetUser(c, config.DB)
		})
	}
	threadGroup := router.Group("/threads")
	threadGroup.Use(middlewares.JWTAuthMiddleware())
	{
		threadGroup.POST("/post", func(c *gin.Context) {
			controllers.PostThread(c, config.DB)
		})
		threadGroup.PUT("/:thread_id", func(c *gin.Context) {
			controllers.EditThread(c, config.DB)
		})
		threadGroup.DELETE("/:thread_id", func(c *gin.Context) {
			controllers.DeleteThread(c, config.DB)
		})
	}
	commentGroup := router.Group("/threads/:thread_id/comments")
	commentGroup.Use(middlewares.JWTAuthMiddleware())
	{
		commentGroup.POST("", func(c *gin.Context) {
			controllers.AddComment(c, config.DB)
		})
		commentGroup.PUT("/:comment_id", func(c *gin.Context) {
			controllers.EditComment(c, config.DB)
		})
		commentGroup.DELETE("/:comment_id", func(c *gin.Context) {
			controllers.DeleteComment(c, config.DB)
		})
	}
	voteGroup := router.Group("/threads/:thread_id/votes")
	voteGroup.Use(middlewares.JWTAuthMiddleware())
	{
		voteGroup.POST("", func(c *gin.Context) {
			controllers.CastVote(c, config.DB)
		})
		voteGroup.DELETE("", func(c *gin.Context) {
			controllers.DeleteVote(c, config.DB)
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
	router.GET("/threads/:thread_id", func(c *gin.Context) {
		controllers.GetSingleThread(c, config.DB)
	})
	router.GET("/threads/:thread_id/comments", func(c *gin.Context) {
		controllers.GetComments(c, config.DB)
	})
	router.GET("/threads/:thread_id/votes", func(c *gin.Context) {
		controllers.CountVotes(c, config.DB)
	})
	router.GET("/:username/:thread_id/vote_state", func(c *gin.Context) {
		controllers.GetVoteState(c, config.DB)
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
	// Get the port from the environment variable or use a default value
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default to port 8080 if no environment variable is set
	}

	// Start the server
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
