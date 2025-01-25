package models

import (
	"database/sql"
	"fmt"
)

type User struct {
	ID        int    `json:"id"`
	Username  string `json:"username"`
	Password  string `json:"password"`
	Email     string `json:"email"`
	Bio       string `json:"bio"`
	CreatedAt string `json:"created_at"`
}

// Function to create a new user in the database
func CreateUser(db *sql.DB, username, password, email string) error {
	_, err := db.Exec("INSERT INTO users (username, password, email) VALUES ($1, $2, $3)", username, password, email)
	if err != nil {
		return err
	}
	return nil
}

func GetUserIDByUsername(username string, db *sql.DB) (int, error) {
	var user User
	err := db.QueryRow("SELECT id FROM users WHERE username = $1", username).Scan(&user.ID)
	if err != nil {
		return 0, err
	}
	return user.ID, nil
}

func GetUserIDByEmail(email string, db *sql.DB) (int, error) {
	var user User
	err := db.QueryRow("SELECT id FROM users WHERE email = $1", email).Scan(&user.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("user not found")
		}
		return 0, fmt.Errorf("error querying database: %v", err)
	}
	return user.ID, nil
}

func GetUserPasswordByUsername(username string, db *sql.DB) (string, error) {
	var user User
	err := db.QueryRow("SELECT password FROM users WHERE username = $1", username).Scan(&user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("user not found")
		}
		return "", fmt.Errorf("error querying database: %v", err)
	}
	return user.Password, nil
}

func UpdateUser(db *sql.DB, oldname, newname, bio string) error {
	userID, err := GetUserIDByUsername(oldname, db)
	if err != nil {
		return err
	}

	_, err = db.Exec(`UPDATE users SET username = $1, bio = $2 WHERE id = $3`, newname, bio, userID)
	return err
}

func GetUserByUsername(db *sql.DB, username string) (*User, error) {
	// Query to fetch user details by username
	query := `SELECT id, username, email, bio, created_at FROM users WHERE username = $1`
	row := db.QueryRow(query, username)

	// Map result to User struct
	var user User
	var bio sql.NullString

	err := row.Scan(&user.ID, &user.Username, &user.Email, &bio, &user.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, err
		}
		return nil, err
	}

	// Assign bio value if it is valid, otherwise set to an empty string
	if bio.Valid {
		user.Bio = bio.String
	} else {
		user.Bio = ""
	}

	return &user, nil
}
