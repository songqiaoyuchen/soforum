package utils

import (
	"fmt"
	"regexp"
)

// ValidateUsername checks if the username is valid
func ValidateUsername(username string) error {
	if len(username) < 3 || len(username) > 20 {
		return fmt.Errorf("username must be between 3 and 20 characters")
	}

	// Allow alphanumeric and underscore only
	validUsername := regexp.MustCompile(`^[a-zA-Z0-9_]+$`)
	if !validUsername.MatchString(username) {
		return fmt.Errorf("username can only contain letters, numbers, and _")
	}

	return nil
}

// ValidatePassword checks if the password is valid
func ValidatePassword(password string) error {
	if len(password) < 8 {
		return fmt.Errorf("password must be at least 8 characters")
	}

	// Check for at least one letter AND one number
	var letters = regexp.MustCompile(`[a-zA-Z]`)
	var numbers = regexp.MustCompile(`[0-9]`)

	if !letters.MatchString(password) {
		return fmt.Errorf("password must contain at least one letter")
	}
	if !numbers.MatchString(password) {
		return fmt.Errorf("password must contain at least one number")
	}

	return nil
}

func ValidateEmail(email string) error {
	// Check if the email is valid
	validEmail := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !validEmail.MatchString(email) {
		return fmt.Errorf("invalid email address")
	}

	return nil
}
