package controllers

import (
	"backend/models"
	"backend/utils"
	"database/sql"
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
		c.JSON(http.StatusBadRequest, gin.H{"error": usernameError})
		return
	} else if passwordError != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": passwordError})
		return
	} else if emailError != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": emailError})
		return
	}

	// Check if the username / email is already taken
	_, err := models.GetUserIDByUsername(newUser.Username, db)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "username already taken"})
		return
	}
	_, err = models.GetUserIDByEmail(newUser.Email, db)
	if err == nil {
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
		c.JSON(http.StatusBadRequest, gin.H{"error": usernameError})
		return
	} else if passwordError != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": passwordError})
		return
	}

	// User authentication
	// Check if the user exists
	user, err := models.GetUserIDByUsername(loginData.Username, db)
	if err != nil {
		if err.Error() == "user not found" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "username does not exist"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	// Compare the password (!! hash password with bcrpt !!)
	user, _ = models.GetUserPasswordByUsername(loginData.Username, db)
	if user.Password != loginData.Password {
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
