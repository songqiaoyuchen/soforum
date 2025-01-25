package config

import (
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	env := os.Getenv("ENV") // Check the environment (e.g., "development" or "production")
	if env == "production" {
		log.Println("Running in production mode, using environment variables from Render")
	} else {
		// Load the .env file only in development mode
		envFilePath := filepath.Join("..", ".env")
		err := godotenv.Load(envFilePath)
		if err != nil {
			log.Fatalf("Error loading .env file from %s: %v", envFilePath, err)
		}
		log.Println(".env file loaded successfully")
		log.Println("Running in production mode, using environment variables from Render")
	}
}
