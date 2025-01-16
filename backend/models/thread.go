package models

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/lib/pq"
)

type Thread struct {
	ID        int      `json:"id"`
	Username  string   `json:"username"`
	Title     string   `json:"title"`
	Content   string   `json:"content"`
	Category  string   `json:"category"`
	Tags      []string `json:"tags"`
	CreatedAt string   `json:"created_at"`
}

func CreateThread(db *sql.DB, thread *Thread) (*Thread, error) {
	query := `
		INSERT INTO threads (user_id, title, content, category_id)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at;
	`

	userID, err := GetUserIDByUsername(thread.Username, db)
	if err != nil {
		return nil, err
	}

	var categoryID int
	categoryID, err = GetCategoryIDByName(thread.Category, db)
	if err != nil {
		return nil, err
	}

	err = db.QueryRow(query, userID, thread.Title, thread.Content, categoryID).Scan(&thread.ID, &thread.CreatedAt)
	if err != nil {
		return nil, err
	}

	// Insert tags into the thread_tags table
	for _, tag := range thread.Tags {
		tagID, err := GetOrCreateTagID(db, tag)
		if err != nil {
			return nil, err
		}

		_, err = db.Exec("INSERT INTO thread_tags (thread_id, tag_id) VALUES ($1, $2)", thread.ID, tagID)
		if err != nil {
			return nil, err
		}
	}

	return thread, nil
}

func GetThreads(db *sql.DB, page, limit int, category, search, tag string) ([]Thread, error) {
	offset := (page - 1) * limit
	var params []interface{}
	var conditions []string

	// Base query
	query := `
	SELECT t.id, u.username, t.title, t.content, c.name AS category, t.created_at
	FROM threads t
	INNER JOIN users u ON t.user_id = u.id
	INNER JOIN categories c ON t.category_id = c.id
	`

	// Dynamic WHERE clause
	if category != "" {
		conditions = append(conditions, fmt.Sprintf("c.name = $%d", len(params)+1))
		params = append(params, category)
	}

	if search != "" {
		conditions = append(conditions, fmt.Sprintf("(t.title ILIKE $%d OR t.content ILIKE $%d)", len(params)+1, len(params)+1))
		params = append(params, "%"+search+"%")
	}

	if tag != "" {
		// Join with thread_tags and tags table to filter threads by tags
		conditions = append(conditions, fmt.Sprintf("t.id IN (SELECT tt.thread_id FROM thread_tags tt JOIN tags tg ON tt.tag_id = tg.id WHERE tg.name ILIKE $%d)", len(params)+1))
		params = append(params, "%"+tag+"%")
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
	threadMap := make(map[int]*Thread)

	for rows.Next() {
		var thread Thread
		if err := rows.Scan(&thread.ID, &thread.Username, &thread.Title, &thread.Content, &thread.Category, &thread.CreatedAt); err != nil {
			return nil, err
		}
		thread.Tags = []string{}
		threads = append(threads, thread)
		threadMap[thread.ID] = &threads[len(threads)-1]
	}

	// Check for iteration errors
	if err := rows.Err(); err != nil {
		return nil, err
	}

	// Fetch tags for threads
	threadIDs := make([]int, 0, len(threadMap))
	for id := range threadMap {
		threadIDs = append(threadIDs, id)
	}

	if len(threadIDs) > 0 {
		tagQuery := `
		SELECT tt.thread_id, tg.name 
		FROM thread_tags tt
		INNER JOIN tags tg ON tt.tag_id = tg.id
		WHERE tt.thread_id = ANY($1)
		`

		tagRows, err := db.Query(tagQuery, pq.Array(threadIDs))
		if err != nil {
			return nil, err
		}
		defer tagRows.Close()

		for tagRows.Next() {
			var threadID int
			var tagName string
			if err := tagRows.Scan(&threadID, &tagName); err != nil {
				return nil, err
			}
			if thread, exists := threadMap[threadID]; exists {
				thread.Tags = append(thread.Tags, tagName)
			}
		}

		// Check for tag query errors
		if err := tagRows.Err(); err != nil {
			return nil, err
		}
	}

	return threads, nil
}

func GetThreadByID(db *sql.DB, threadID int) (*Thread, error) {
	query := `
		SELECT t.id, t.title, t.content, t.created_at, u.username, c.name as category
		FROM threads t
		INNER JOIN users u ON t.user_id = u.id
		INNER JOIN categories c ON t.category_id = c.id
		WHERE t.id = $1;
	`

	var thread Thread
	err := db.QueryRow(query, threadID).Scan(
		&thread.ID,
		&thread.Title,
		&thread.Content,
		&thread.CreatedAt,
		&thread.Username,
		&thread.Category,
	)
	if err != nil {
		return nil, err
	}

	// Fetch tags for the thread
	tagQuery := `
		SELECT tg.name
		FROM thread_tags tt
		INNER JOIN tags tg ON tt.tag_id = tg.id
		WHERE tt.thread_id = $1;
	`
	rows, err := db.Query(tagQuery, threadID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch tags: %w", err)
	}
	defer rows.Close()

	thread.Tags = []string{}
	for rows.Next() {
		var tagName string
		if err := rows.Scan(&tagName); err != nil {
			return nil, fmt.Errorf("failed to scan tag name: %w", err)
		}
		thread.Tags = append(thread.Tags, tagName)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to process tag rows: %w", err)
	}

	return &thread, nil
}

func GetThreadOwnerUsername(db *sql.DB, threadID int) (string, error) {
	var username string
	query := `
		SELECT u.username
		FROM threads t
		INNER JOIN users u ON t.user_id = u.id
		WHERE t.id = $1
	`
	err := db.QueryRow(query, threadID).Scan(&username)
	if err != nil {
		return "", err
	}
	return username, nil
}

func EditThread(db *sql.DB, threadID int, thread *Thread) error {
	// Store query parts and parameters
	var setClauses []string
	var params []interface{}

	// Dynamically construct the SET clause based on provided fields
	if thread.Title != "" {
		setClauses = append(setClauses, fmt.Sprintf("title = $%d", len(params)+1))
		params = append(params, thread.Title)
	}
	if thread.Content != "" {
		setClauses = append(setClauses, fmt.Sprintf("content = $%d", len(params)+1))
		params = append(params, thread.Content)
	}
	if thread.Category != "" {
		categoryID, err := GetCategoryIDByName(thread.Category, db)
		if err != nil {
			return err
		}
		setClauses = append(setClauses, fmt.Sprintf("category_id = $%d", len(params)+1))
		params = append(params, categoryID)
	}

	// If no fields are provided for the thread itself, check for tags
	if len(setClauses) > 0 {
		// Add the thread ID as the last parameter for the thread update
		params = append(params, threadID)

		// Construct the final query
		query := fmt.Sprintf(`
			UPDATE threads
			SET %s
			WHERE id = $%d
		`, strings.Join(setClauses, ", "), len(params))

		// Execute the query
		_, err := db.Exec(query, params...)
		if err != nil {
			return err
		}
	}

	// Handle tags update if provided
	if len(thread.Tags) > 0 {
		// Remove existing tags for the thread
		deleteQuery := `DELETE FROM thread_tags WHERE thread_id = $1`
		_, err := db.Exec(deleteQuery, threadID)
		if err != nil {
			return fmt.Errorf("failed to delete existing tags: %w", err)
		}

		// Map provided tags to their tag IDs
		for _, tagName := range thread.Tags {
			tagID, err := GetOrCreateTagID(db, tagName)
			if err != nil {
				return fmt.Errorf("failed to resolve tag ID for %s: %w", tagName, err)
			}

			// Insert the new tag association
			insertQuery := `INSERT INTO thread_tags (thread_id, tag_id) VALUES ($1, $2)`
			_, err = db.Exec(insertQuery, threadID, tagID)
			if err != nil {
				return fmt.Errorf("failed to associate tag %s: %w", tagName, err)
			}
		}
	}

	return nil
}

func DeleteThread(db *sql.DB, threadID int) error {
	query := "DELETE FROM threads WHERE id = $1"
	_, err := db.Exec(query, threadID)
	return err
}
