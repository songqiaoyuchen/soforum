package models

import (
	"database/sql"
	"fmt"
)

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

// Function to create a new user in the database
func CreateUser(db *sql.DB, username, password, email string) error {
	_, err := db.Exec("INSERT INTO users (username, password, email) VALUES ($1, $2, $3)", username, password, email)
	if err != nil {
		return err
	}
	return nil
}

func GetUserIDByUsername(username string, db *sql.DB) (User, error) {
	var user User
	err := db.QueryRow("SELECT id FROM users WHERE username = $1", username).Scan(&user.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			return user, fmt.Errorf("user not found")
		}
		return user, fmt.Errorf("error querying database: %v", err)
	}
	return user, nil
}

func GetUserIDByEmail(email string, db *sql.DB) (User, error) {
	var user User
	err := db.QueryRow("SELECT id FROM users WHERE email = $1", email).Scan(&user.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			return user, fmt.Errorf("user not found")
		}
		return user, fmt.Errorf("error querying database: %v", err)
	}
	return user, nil
}

func GetUserPasswordByUsername(username string, db *sql.DB) (User, error) {
	var user User
	err := db.QueryRow("SELECT password FROM users WHERE username = $1", username).Scan(&user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return user, fmt.Errorf("user not found")
		}
		return user, fmt.Errorf("error querying database: %v", err)
	}
	return user, nil
}
