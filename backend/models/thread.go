package models

import (
	"database/sql"
	"fmt"
	"strings"
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

func GetThreads(db *sql.DB, page, limit int, category, search string) ([]Thread, error) {
	offset := (page - 1) * limit
	var params []interface{}
	var conditions []string

	// Base query
	query := `
	SELECT t.id, u.username, t.title, t.content, t.category, t.created_at
	FROM threads t
	JOIN users u ON t.user_id = u.id
	`

	// Dynamic WHERE clause
	if category != "" {
		conditions = append(conditions, fmt.Sprintf("t.category = $%d", len(params)+1))
		params = append(params, category)
	}

	if search != "" {
		conditions = append(conditions, fmt.Sprintf("(t.title ILIKE $%d OR t.content ILIKE $%d)", len(params)+1, len(params)+1))
		params = append(params, "%"+search+"%")
	}

	// Append conditions if any
	if len(conditions) > 0 {
		query += "WHERE " + strings.Join(conditions, " AND ") + " "
	}

	// Add ORDER BY, LIMIT, and OFFSET
	query += fmt.Sprintf("ORDER BY t.created_at DESC LIMIT $%d OFFSET $%d", len(params)+1, len(params)+2)
	params = append(params, limit, offset)

	// Execute the query
	rows, err := db.Query(query, params...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Map rows to Thread slice
	var threads []Thread
	for rows.Next() {
		var thread Thread
		if err := rows.Scan(&thread.ID, &thread.Username, &thread.Title, &thread.Content, &thread.Category, &thread.CreatedAt); err != nil {
			return nil, err
		}
		threads = append(threads, thread)
	}

	// Check for iteration errors
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return threads, nil
}
