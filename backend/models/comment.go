package models

import (
	"database/sql"
	"time"
)

type Comment struct {
	ID        int       `json:"id"`
	ThreadID  int       `json:"thread_id"`
	Username  string    `json:"username"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

// CreateComment inserts a new comment into the database
func CreateComment(db *sql.DB, comment *Comment) (*Comment, error) {
	query := `
		INSERT INTO comments (thread_id, user_id, content)
		VALUES ($1, $2, $3)
		RETURNING id, created_at
	`
	userID, err := GetUserIDByUsername(comment.Username, db)
	if err != nil {
		return nil, err
	}

	err = db.QueryRow(query, comment.ThreadID, userID, comment.Content).Scan(&comment.ID, &comment.CreatedAt)
	if err != nil {
		return nil, err
	}

	return comment, nil
}

// GetCommentsByThreadID retrieves all comments for a given thread
func GetCommentsByThreadID(db *sql.DB, threadID int) ([]Comment, error) {
	query := `
		SELECT c.id, c.thread_id, u.username, c.content, c.created_at
		FROM comments c
		INNER JOIN users u ON c.user_id = u.id
		WHERE c.thread_id = $1
		ORDER BY c.created_at ASC
	`

	rows, err := db.Query(query, threadID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []Comment
	for rows.Next() {
		var comment Comment
		if err := rows.Scan(&comment.ID, &comment.ThreadID, &comment.Username, &comment.Content, &comment.CreatedAt); err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}

	return comments, nil
}

// EditComment updates the content of an existing comment
func EditComment(db *sql.DB, commentID int, newContent string) error {
	query := `
		UPDATE comments
		SET content = $1
		WHERE id = $2
	`
	_, err := db.Exec(query, newContent, commentID)
	return err
}

// DeleteComment deletes a comment by its ID and ensures the user is the owner
func DeleteComment(db *sql.DB, commentID int) error {
	query := `
		DELETE FROM comments
		WHERE id = $1
	`

	_, err := db.Exec(query, commentID)
	return err
}

func GetCommentOwnerUsername(db *sql.DB, commentID int) (string, error) {
	query := `
		SELECT u.username
		FROM users u
		INNER JOIN comments c ON u.id = c.user_id
		WHERE c.id = $1
	`

	var username string
	err := db.QueryRow(query, commentID).Scan(&username)
	if err != nil {
		return "", err
	}

	return username, nil
}
