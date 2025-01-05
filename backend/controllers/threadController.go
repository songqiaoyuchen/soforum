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
	// Bind the request body to a Thread struct
	var thread models.Thread
	if err := c.ShouldBindJSON(&thread); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid request payload"})
		return
	}

	// Add thread to table
	threadID, err := models.CreateThread(db, &thread)
	if err != nil {
		c.Error(err).SetMeta("Thread creation failed")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create thread"})
		return
	}

	// Associate thread with tags
	var tagIDs []int
	for _, tag := range thread.Tags {
		tagID, err := models.GetOrCreateTagID(db, tag)
		if err != nil {
			c.Error(err).SetMeta("Tag creation failed")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tags"})
			return
		}
		tagIDs = append(tagIDs, tagID)
	}
	if err := models.AssociateThreadTags(db, threadID, tagIDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to associate thread with tags"})
		return
	}

	// Respond with the thread ID
	c.JSON(http.StatusCreated, gin.H{
		"message":   "Thread created successfully",
		"thread_id": threadID,
	})
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
	tag := c.DefaultQuery("tag", "")

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
	threads, err := models.GetThreads(db, page, limit, category, search, tag)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve threads: " + err.Error()})
		return
	}

	// Return the threads as a JSON response
	c.JSON(http.StatusOK, threads)
}

// EditThread handles the HTTP request to edit thread
func EditThread(c *gin.Context, db *sql.DB) {
	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid thread ID"})
		return
	}

	// Get the username from the context
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse the thread data from the request body
	var updatedThread models.Thread
	if err := c.ShouldBindJSON(&updatedThread); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Check if the thread belongs to the user
	threadOwner, err := models.GetThreadOwnerUsername(db, threadID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching thread owner"})
		return
	}
	if threadOwner != username {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to edit this thread"})
		return
	}

	// Update the thread
	err = models.UpdateThread(db, threadID, &updatedThread)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Thread updated successfully"})
}

// DeleteThread handles the HTTP request to delete thread
func DeleteThread(c *gin.Context, db *sql.DB) {
	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid thread ID"})
		return
	}

	// Get the username from the context (set by JWTAuthMiddleware)
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Check if the thread belongs to the user
	threadOwner, err := models.GetThreadOwnerUsername(db, threadID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching thread owner"})
		return
	}
	if threadOwner != username {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to delete this thread"})
		return
	}

	// Delete the thread
	err = models.DeleteThread(db, threadID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete thread"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Thread deleted successfully"})
}
