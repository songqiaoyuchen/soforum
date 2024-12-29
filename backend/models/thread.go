package models

import (
	"database/sql"
	"time"
)

type Thread struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Category  string    `json:"category"`
	CreatedAt time.Time `json:"created_at"`
}

func InsertThread(db *sql.DB, userID int, title, content, category string) error {
	_, err := db.Exec("INSERT INTO threads (user_id, title, content, category) VALUES ($1, $2, $3, $4)",
		userID, title, content, category)
	if err != nil {
		return err
	}
	return nil
}

func GetThreads(db *sql.DB, page, limit int, category string) ([]Thread, error) {
	// Calculate the offset for pagination.
	offset := (page - 1) * limit
	var rows *sql.Rows
	var err error

	// Base query to retrieve threads sorted by created_at.
	query := `
		SELECT t.id, u.username, t.title, t.content, t.category, t.created_at
		FROM threads t
		JOIN users u ON t.user_id = u.id
		ORDER BY t.created_at DESC
		LIMIT $1 OFFSET $2
	`

	// If a category is provided, add a WHERE clause to filter by category.
	if category != "" {
		query = `
			SELECT t.id, u.username, t.title, t.content, t.category, t.created_at
			FROM threads t
			JOIN users u ON t.user_id = u.id
			WHERE t.category = $1
			ORDER BY t.created_at DESC
			LIMIT $2 OFFSET $3
		`
		rows, err = db.Query(query, category, limit, offset)
	} else {
		rows, err = db.Query(query, limit, offset)
	}

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	// Prepare a slice to store the retrieved threads.
	var threads []Thread

	// Iterate over the result set.
	for rows.Next() {
		var thread Thread
		if err := rows.Scan(&thread.ID, &thread.Username, &thread.Title, &thread.Content, &thread.Category, &thread.CreatedAt); err != nil {
			return nil, err
		}
		threads = append(threads, thread)
	}

	// Check for any errors during row iteration.
	if err := rows.Err(); err != nil {
		return nil, err
	}

	// Return the threads.
	return threads, nil
}
