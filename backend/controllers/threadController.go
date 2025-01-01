package controllers

import (
	"backend/models"
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// PostThread handles the HTTP request to post a thread
func PostThread(c *gin.Context, db *sql.DB) {
	var newThread models.Thread

	// Bind JSON
	if err := c.ShouldBindJSON(&newThread); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid thread data"})
		return
	}

	// Retrieve the username from the context (set by JWTMiddleware)
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Look up the user ID based on the username
	user, err := models.GetUserIDByUsername(username.(string), db)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Insert the new thread into the database
	err = models.InsertThread(db, user.ID, newThread.Title, newThread.Content, newThread.Category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to insert thread", "message": err.Error()})
		return
	}

	// Respond with a success message
	c.JSON(http.StatusCreated, gin.H{"message": "Thread posted successfully"})
}

// GetThreads handles the HTTP request to retrieve threads.
func GetThreads(c *gin.Context, db *sql.DB) {
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection not initialized"})
		return
	}
	// Parse query parameters for pagination and category
	pageStr := c.DefaultQuery("page", "1")    // Default to 1 if not provided
	limitStr := c.DefaultQuery("limit", "10") // Default to 10 if not provided
	category := c.DefaultQuery("category", "")
	search := c.DefaultQuery("search", "")

	// Convert page and limit to integers
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
		return
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit number"})
		return
	}

	// Call the model to get threads from the database
	threads, err := models.GetThreads(db, page, limit, category, search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve threads: " + err.Error()})
		return
	}

	// Return the threads as a JSON response
	c.JSON(http.StatusOK, threads)
}
