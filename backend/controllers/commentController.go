package controllers

import (
	"backend/models"
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// AddComment handles creating a new comment
func AddComment(c *gin.Context, db *sql.DB) {
	// Get the username from JWT middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid thread ID"})
		return
	}

	// Parse the request body for the comment content
	var newComment models.Comment
	if err := c.ShouldBindJSON(&newComment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Set thread ID and user ID
	newComment.ThreadID = threadID
	newComment.Username = username.(string)

	// Create the comment
	if err := models.CreateComment(db, &newComment); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Comment created successfully", "comment": newComment})
}

// GetComments retrieves comments for a specific thread
func GetComments(c *gin.Context, db *sql.DB) {
	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid thread ID"})
		return
	}

	// Get the comments
	comments, err := models.GetCommentsByThreadID(db, threadID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve comments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"comments": comments})
}

// EditComment handles editing a comment
func EditComment(c *gin.Context, db *sql.DB) {
	// Parse comment ID from URL
	commentID, err := strconv.Atoi(c.Param("comment_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}

	// Get the username from JWT middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse the new content from request body
	var updatedComment models.Comment
	if err := c.ShouldBindJSON(&updatedComment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Edit the comment
	if err := models.EditComment(db, commentID, username.(string), updatedComment.Content); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to edit comment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment updated successfully"})
}

// DeleteComment handles deleting a comment
func DeleteComment(c *gin.Context, db *sql.DB) {
	// Parse comment ID from URL
	commentID, err := strconv.Atoi(c.Param("comment_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}

	// Get the username from JWT middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Delete the comment
	if err := models.DeleteComment(db, commentID, username.(string)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete comment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}
