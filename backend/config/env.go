package config

import (
	"log"
	"path/filepath"

	"github.com/joho/godotenv"
)

// LoadEnv loads environment variables from the .env file.
func LoadEnv() {
	// Get the absolute path to the .env file
	envFilePath := filepath.Join("..", ".env")

	// Load environment variables from the .env file
	err := godotenv.Load(envFilePath)
	if err != nil {
		log.Fatalf("Error loading .env file from %s: %v", envFilePath, err)
	}
}
