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

	// Look up user_id based on the provided username
	var userID int
	err := db.QueryRow("SELECT id FROM users WHERE username = $1", newThread.Username).Scan(&userID)
	if err != nil {
		if err == sql.ErrNoRows {
			// If no user was found with the provided username
			c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		} else {
			// If there's a different error (e.g., database connection issues)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "message": err.Error()})
		}
		return
	}

	// Insert the new thread into the database
	err = models.InsertThread(db, userID, newThread.Title, newThread.Content, newThread.Category)
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
	threads, err := models.GetThreads(db, page, limit, category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve threads: " + err.Error()})
		return
	}

	// Return the threads as a JSON response
	c.JSON(http.StatusOK, threads)
}
