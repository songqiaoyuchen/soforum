package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

// InitDB initializes the database and creates tables if they don't exist
func InitDB() {
	// Load .env in development
	if os.Getenv("RENDER") == "" {
		err := godotenv.Load()
		if err != nil {
			log.Println("No .env file found, using environment variables")
		}
	}

	// Get the database connection string
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		// Fallback to individual components for local dev
		dbUser := os.Getenv("DB_USER")
		dbPassword := os.Getenv("DB_PASSWORD")
		dbName := os.Getenv("DB_NAME")

		if dbUser == "" || dbPassword == "" || dbName == "" {
			log.Fatal("Database credentials are not set in environment variables")
		}

		connStr = fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable", dbUser, dbPassword, dbName)
	} else {
		// Ensure SSL mode is set for production
		connStr += "?sslmode=require"
	}

	// Connect to the database
	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error opening database: ", err)
	}

	// Test the connection
	err = DB.Ping()
	if err != nil {
		log.Fatal("Error connecting to the database: ", err)
	}

	fmt.Println("Successfully connected to the database!")

	_, err = DB.Exec(`CREATE EXTENSION IF NOT EXISTS citext;`)
	if err != nil {
		log.Fatal("Error enabling citext extension: ", err)
	}
	// Initialize tables or migrations
	createTables()
}

// createTables creates necessary tables if they don't exist
func createTables() {
	query := `
		-- Users table
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			username VARCHAR(50) NOT NULL UNIQUE,
			password VARCHAR(255) NOT NULL,
			email VARCHAR(100) NOT NULL UNIQUE,
			bio VARCHAR(500) DEFAULT 'This user is too cool to add a bio.',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		-- Insert reserved "left" user
		INSERT INTO users (id, username, password, email) 
		VALUES (1, 'left', 'leftpass123', 'deleted@example.com')
		ON CONFLICT (id) DO NOTHING;

		-- Insert reserved "admin" user
		INSERT INTO users (id, username, password, email) 
		VALUES (2, 'admin', 'adminpass123', 'admin@example.com')
		ON CONFLICT (id) DO NOTHING;

		-- Insert reserved "guest" user
		INSERT INTO users (id, username, password, email) 
		VALUES (3, 'guest', 'guestpass123', 'guest@example.com')
		ON CONFLICT (id) DO NOTHING;

		-- Categories table
		CREATE TABLE IF NOT EXISTS categories (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) UNIQUE NOT NULL
		);

		-- Insert initial entries into the categories table
		INSERT INTO categories (name)
		VALUES
				('general'),
				('technology'),
				('science'),
				('gaming'),
				('movies'),
				('music'),
				('sports'),
				('books'),
				('art'),
				('travel'),
				('food'),
				('academics')
		ON CONFLICT (name) DO NOTHING;

		-- Threads table
		CREATE TABLE IF NOT EXISTS threads (
			id SERIAL PRIMARY KEY,
			user_id INT NOT NULL REFERENCES users(id),
			title VARCHAR(255) NOT NULL,
			content TEXT NOT NULL,
			category_id INT NOT NULL REFERENCES categories(id) ON DELETE SET NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		-- Votes table
		CREATE TABLE IF NOT EXISTS votes (
			id SERIAL PRIMARY KEY,
			thread_id INT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
			user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			vote SMALLINT NOT NULL CHECK (vote IN (-1, 1)), -- -1 for downvote, +1 for upvote
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			UNIQUE (thread_id, user_id) -- Each user can vote on a thread only once
		);

		-- Comments table
		CREATE TABLE IF NOT EXISTS comments (
				id SERIAL PRIMARY KEY,
				thread_id INT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
				user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				content TEXT NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		-- Tags table
		CREATE TABLE IF NOT EXISTS tags (
				id SERIAL PRIMARY KEY,
				name CITEXT UNIQUE NOT NULL
		);

		-- Thread-Tags table
		CREATE TABLE IF NOT EXISTS thread_tags (
			thread_id INT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
			tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
			PRIMARY KEY (thread_id, tag_id)
		);

		-- User-Threads table
		CREATE TABLE IF NOT EXISTS user_threads (
			user_id INT NOT NULL,
			thread_id INT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (user_id, thread_id),
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
			FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
		);
	`

	_, err := DB.Exec(query)
	if err != nil {
		log.Fatal("Error creating tables: ", err)
	}

	fmt.Println("Tables initialized successfully!")
}
