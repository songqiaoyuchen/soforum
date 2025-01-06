package controllers

import (
	"backend/models"
	"database/sql"
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// AddComment handles creating a new comment
func AddComment(c *gin.Context, db *sql.DB) {
	// Get the username from JWT middleware
	username := c.GetString("username")

	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("thread_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid thread ID"})
		return
	}

	// Parse the request body for the comment content
	var newComment models.Comment
	if err := c.ShouldBindJSON(&newComment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request payload"})
		return
	}

	// Set ThreadID and Username
	newComment.ThreadID = threadID
	newComment.Username = username

	// Add comment to table
	createdComment, err := models.CreateComment(db, &newComment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create comment"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "comment created successfully",
		"comment": createdComment,
	})
}

// GetComments handles requests to fetch comments for a specific thread
func GetComments(c *gin.Context, db *sql.DB) {
	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("thread_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid thread ID"})
		return
	}

	// Get comments from database
	comments, err := models.GetCommentsByThreadID(db, threadID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch comments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"comments": comments})
}

// EditComment handles requests to edit a comment
func EditComment(c *gin.Context, db *sql.DB) {
	// Parse comment ID from URL
	commentID, err := strconv.Atoi(c.Param("comment_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid comment ID"})
		return
	}

	// Get the username from JWT middleware
	username := c.GetString("username")

	// Check if user is comment owner
	owner, err := models.GetCommentOwnerUsername(db, commentID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid comment ID"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch owner username"})
		return
	}
	if owner != username {
		c.JSON(http.StatusForbidden, gin.H{"error": "unauthorised user"})
		return
	}

	// Parse the new content from request body
	var updatedComment models.Comment
	if err := c.ShouldBindJSON(&updatedComment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request payload"})
		return
	}

	// Edit the comment
	if err := models.EditComment(db, commentID, updatedComment.Content); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to edit comment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "comment updated successfully"})
}

// DeleteComment handles requests to delete a comment
func DeleteComment(c *gin.Context, db *sql.DB) {
	// Parse comment ID from URL
	commentID, err := strconv.Atoi(c.Param("comment_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid comment ID"})
		return
	}

	// Get the username from JWT middleware
	username := c.GetString("username")

	// Get owner username
	ownername, err := models.GetCommentOwnerUsername(db, commentID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid comment ID"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch owner username"})
		return
	}

	// Check if user is comment owner
	if ownername != username {
		c.JSON(http.StatusForbidden, gin.H{"error": "unauthorised user"})
		return
	}

	// Delete the comment
	if err := models.DeleteComment(db, commentID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete comment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "comment deleted successfully"})
}
