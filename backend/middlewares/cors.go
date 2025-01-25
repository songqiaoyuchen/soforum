package middlewares

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// SetupCORS returns a GIN middleware handler that sets up the CORS configuration
func SetupCORS() gin.HandlerFunc {
	// Define allowed origins
	allowedOrigins := []string{
		"http://localhost:3000",
		"https://soforum.vercel.app",
	}

	corsConfig := cors.Config{
		AllowOrigins: allowedOrigins,                                      // Allowed origins
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}, // Allowed HTTP methods
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"}, // Allowed headers
	}

	return cors.New(corsConfig)
}
