package controllers

import (
	"backend/models"
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CastVote(c *gin.Context, db *sql.DB) {
	// Get the username from JWT middleware
	username := c.GetString("username")

	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("thread_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid thread ID"})
		return
	}

	// Bind the request body to a Thread struct
	var newVote models.Vote
	if err := c.ShouldBindJSON(&newVote); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request payload"})
		return
	}

	newVote.Username = username
	newVote.ThreadID = threadID

	createdVote, err := models.CreateVote(db, &newVote)
	if err != nil {
		log.Printf("Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to cast vote"})
		return
	}

	// Respond with the thread ID
	c.JSON(http.StatusCreated, gin.H{
		"message": "vote casted successfully",
		"vote":    createdVote,
	})
}

func DeleteVote(c *gin.Context, db *sql.DB) {
	// Get the username from JWT middleware
	username := c.GetString("username")

	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("thread_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid thread ID"})
		return
	}

	// Call the model function to delete the vote
	err = models.DeleteVote(db, threadID, username)
	if err != nil {
		log.Printf("Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete vote"})
		return
	}

	// Respond with success message
	c.JSON(http.StatusOK, gin.H{
		"message": "vote deleted successfully",
	})
}

func CountVotes(c *gin.Context, db *sql.DB) {
	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("thread_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid thread ID"})
		return
	}

	// Call the CountVote function to get the net votes
	netVotes, err := models.CountVote(db, threadID)
	if err != nil {
		log.Printf("Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to count vote"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"votes": netVotes,
	})
}

func GetVoteState(c *gin.Context, db *sql.DB) {
	// Parse thread ID from URL
	threadID, err := strconv.Atoi(c.Param("thread_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid thread ID"})
		return
	}

	username := c.Param("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "username is required"})
		return
	}

	userID, err := models.GetUserIDByUsername(username, db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user_id"})
		return
	}

	// Fetch vote state
	voteState, err := models.GetVoteStateByUserID(db, threadID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve vote state"})
	}

	// Respond with vote state
	c.JSON(http.StatusOK, voteState)
}
