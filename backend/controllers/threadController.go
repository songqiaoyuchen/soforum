package controllers

import (
	"backend/models"
	"database/sql"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// PostThread handles the HTTP request to post a thread
func PostThread(c *gin.Context, db *sql.DB) {
	// Get the username from JWT middleware
	username := c.GetString("username")

	// Bind the request body to a Thread struct
	var newThread models.Thread
	if err := c.ShouldBindJSON(&newThread); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request payload"})
		return
	}

	// Set Username
	newThread.Username = username

	// Add thread to table
	createdThread, err := models.CreateThread(db, &newThread)
	if err != nil {
		log.Printf("Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create thread"})
		return
	}

	// Associate thread with tags
	var tagIDs []int
	for _, tag := range newThread.Tags {
		tagID, err := models.GetOrCreateTagID(db, tag)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create tags"})
			return
		}
		tagIDs = append(tagIDs, tagID)
	}
	if err := models.AssociateThreadTags(db, createdThread.ID, tagIDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to associate thread with tags"})
		return
	}

	// Respond with the thread ID
	c.JSON(http.StatusCreated, gin.H{
		"message": "thread created successfully",
		"thread":  createdThread,
	})
}

// GetThreads handles requests to fetch threads.
func GetThreads(c *gin.Context, db *sql.DB) {
	// Parse query parameters for pagination and category
	pageStr := c.DefaultQuery("page", "1")    // Default to 1 if not provided
	limitStr := c.DefaultQuery("limit", "10") // Default to 10 if not provided
	category := c.DefaultQuery("category", "")
	search := c.DefaultQuery("search", "")
	username := c.DefaultQuery("username", "")
	sort := c.DefaultQuery("sort", "")

	// Convert page and limit to integers
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid page number"})
		return
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid limit number"})
		return
	}

	// Get threads from database
	threads, err := models.GetThreads(db, page, limit, category, search, username, sort)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve threads"})
		return
	}

	// Count votes for each thread
	for i := range threads {
		netVotes, err := models.CountVote(db, threads[i].ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to count votes"})
			return
		}
		threads[i].Votes = netVotes
	}

	// Return the threads as a JSON response
	c.JSON(http.StatusOK, gin.H{"threads": threads})
}

// GetSingleThread handles requests to fetch a single thread based on ID
func GetSingleThread(c *gin.Context, db *sql.DB) {
	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("thread_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid thread ID"})
		return
	}

	thread, err := models.GetThreadByID(db, threadID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch thread"})
		return
	}

	netVotes, err := models.CountVote(db, thread.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to count votes"})
		return
	}

	thread.Votes = netVotes

	c.JSON(http.StatusOK, gin.H{"thread": thread})
}

// EditThread handles requests to edit thread
func EditThread(c *gin.Context, db *sql.DB) {
	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("thread_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid thread ID"})
		return
	}

	// Get the username from the context
	username := c.GetString("username")

	// Check if user is thread owner
	ownername, err := models.GetThreadOwnerUsername(db, threadID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid thread ID"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch thread owner"})
		return
	}
	if ownername != username {
		c.JSON(http.StatusForbidden, gin.H{"error": "unauthorised user"})
		return
	}

	// Parse the thread data from the request body
	var updatedThread models.Thread
	if err := c.ShouldBindJSON(&updatedThread); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Edit the thread
	if err := models.EditThread(db, threadID, &updatedThread); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to edit thread"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "thread updated successfully"})
}

// DeleteThread handles requests to delete thread
func DeleteThread(c *gin.Context, db *sql.DB) {
	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("thread_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid thread ID"})
		return
	}

	// Get the username from the context (set by JWTAuthMiddleware)
	username := c.GetString("username")

	// Check if the thread belongs to the user
	ownername, err := models.GetThreadOwnerUsername(db, threadID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid thread ID"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch owner username"})
		return
	}
	if ownername != username {
		c.JSON(http.StatusForbidden, gin.H{"error": "unauthorised user"})
		return
	}

	// Delete the thread
	err = models.DeleteThread(db, threadID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete thread"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "thread deleted successfully"})
}

func SaveThread(c *gin.Context, db *sql.DB) {
	// Get the username from JWT middleware
	username := c.GetString("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "unauthenticated user",
		})
		return
	}

	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("thread_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid thread ID",
		})
		return
	}

	err = models.SaveThread(db, username, threadID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Thread saved successfully",
	})
}

func RemoveSavedThread(c *gin.Context, db *sql.DB) {
	// Get the username from JWT middleware
	username := c.GetString("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "unauthenticated user",
		})
		return
	}

	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("thread_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid thread ID",
		})
		return
	}

	err = models.RemoveSavedThread(db, username, threadID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Thread removed from saved list",
	})
}

func GetSavedThreads(c *gin.Context, db *sql.DB) {
	username := c.Param("username") // Directly retrieve the username from the URL

	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "unauthenticated user",
		})
		return
	}

	// Get the username from JWT middleware
	currentUsername := c.GetString("username")
	if currentUsername != username {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "unauthorised user",
		})
		return
	}

	pageStr := c.DefaultQuery("page", "1")    // Default to 1 if not provided
	limitStr := c.DefaultQuery("limit", "10") // Default to 10 if not provided
	// Convert page and limit to integers
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid page number"})
		return
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid limit number"})
		return
	}

	threads, err := models.GetSavedThreads(db, username, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"threads": threads,
	})
}
