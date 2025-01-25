package controllers

import (
	"backend/models"
	"backend/utils"
	"database/sql"
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// UserSignup handles the HTTP request to create a new user
func UserSignup(c *gin.Context, db *sql.DB) {
	var newUser models.User

	// Bind the JSON payload to newUser
	if err := c.BindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// Check validity of username, password and email
	usernameError := utils.ValidateUsername(newUser.Username)
	passwordError := utils.ValidatePassword(newUser.Password)
	emailError := utils.ValidateEmail(newUser.Email)
	if usernameError != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": usernameError.Error()})
		return
	} else if passwordError != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": passwordError.Error()})
		return
	} else if emailError != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": emailError.Error()})
		return
	}

	// Check if the username / email is already taken
	_, err := models.GetUserIDByUsername(newUser.Username, db)
	if err == nil {
		log.Printf("Error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "username already taken"})
		return
	}
	_, err = models.GetUserIDByEmail(newUser.Email, db)
	if err == nil {
		log.Printf("Error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "email already signed up"})
		return
	}

	// Insert the new user into the database
	err = models.CreateUser(db, newUser.Username, newUser.Password, newUser.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to insert user", "message": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusCreated, newUser)
}

// UserLogin handles the HTTP request to login a user
func UserLogin(c *gin.Context, db *sql.DB) {
	var loginData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	// Parse the JSON request body
	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	// Check validity of username and password
	usernameError := utils.ValidateUsername(loginData.Username)
	passwordError := utils.ValidatePassword(loginData.Password)
	if usernameError != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": usernameError.Error()})
		return
	} else if passwordError != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": passwordError.Error()})
		return
	}

	// User authentication (!! hash password with bcrpt !!)
	Password, err := models.GetUserPasswordByUsername(loginData.Username, db)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "username does not exist"})
			return
		}
		c.Error(err).SetMeta("Authentication failed")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	if Password != loginData.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(loginData.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate JWT token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "login successful",
		"token":   token,
	})
}

func UpdateUser(c *gin.Context, db *sql.DB) {
	username := c.Param("username") // Directly retrieve the username from the URL

	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid username"})
		return
	}

	// Get the username from JWT middleware
	currentUsername := c.GetString("username")
	if currentUsername != username {
		c.JSON(http.StatusForbidden, gin.H{"error": "unauthorised user"})
		return
	}

	// Parse the new content from request body
	var updatedUser models.User
	if err := c.ShouldBindJSON(&updatedUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request payload"})
		return
	}

	// Edit the user
	if err := models.UpdateUser(db, currentUsername, updatedUser.Username, updatedUser.Bio); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "user updated successfully"})
}

func GetUser(c *gin.Context, db *sql.DB) {
	// Get the username from the URL parameter
	username := c.Param("username")

	// Call the model to fetch user details
	user, err := models.GetUserByUsername(db, username)
	if err != nil {
		// Handle error if user not found or any other error
		log.Println("Error fetching user:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Return user profile info
	c.JSON(http.StatusOK, gin.H{
		"username": user.Username,
		"email":    user.Email,
		"bio":      user.Bio,
		"joined":   user.CreatedAt,
	})
}
