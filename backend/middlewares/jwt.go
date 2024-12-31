package middlewares

import (
	"net/http"
	"os"
	"strings"

	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

// JWT middleware to validate the token
func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the "Authorization" header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			// If no Authorization header is found, return 401
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// Split the header into the "Bearer" token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader { // "Bearer" not present
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer token is required"})
			c.Abort()
			return
		}

		// Parse and validate the JWT token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate the signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			// Return the secret key used to sign the token (this can be configured elsewhere)
			jwtSecretKey := os.Getenv("JWT_SECRET_KEY")
			if jwtSecretKey == "" {
				return nil, fmt.Errorf("JWT_SECRET_KEY is not set")
			}

			// Return the secret key for validation
			return []byte(jwtSecretKey), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Extract username from JWT "sub" claim
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		// Set the username in the context
		username, exists := claims["sub"].(string)
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Username not found in token"})
			c.Abort()
			return
		}

		// Add the username to the context for further use in the handler
		c.Set("username", username)

		// Proceed to the next handler
		c.Next()
	}
}
