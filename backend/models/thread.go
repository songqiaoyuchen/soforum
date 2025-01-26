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
	Votes     int      `json:"votes"`
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

func GetThreads(db *sql.DB, page int, limit int, category string, search string, username string, sort string) ([]Thread, error) {
	offset := (page - 1) * limit

	// Base query for fetching threads
	baseQuery := `
		SELECT DISTINCT 
			t.id,
			u.username,
			t.title,
			t.content,
			c.name as category,
			t.created_at,
			ARRAY_AGG(DISTINCT tags.name) as tags,
			COALESCE(SUM(v.vote), 0) as votes
		FROM threads t
		INNER JOIN users u ON t.user_id = u.id
		INNER JOIN categories c ON t.category_id = c.id
		LEFT JOIN thread_tags tt ON t.id = tt.thread_id
		LEFT JOIN tags ON tt.tag_id = tags.id
		LEFT JOIN votes v ON t.id = v.thread_id
	`

	whereClause := "WHERE 1=1"
	args := []interface{}{}
	argCount := 1

	// Filter by category if provided
	if category != "" {
		whereClause += fmt.Sprintf(" AND c.name = $%d", argCount)
		args = append(args, category)
		argCount++
	}

	// Search for threads by title or content if provided
	if search != "" {
		whereClause += fmt.Sprintf(" AND (t.title ILIKE $%d OR t.content ILIKE $%d)", argCount, argCount)
		searchPattern := "%" + search + "%"
		args = append(args, searchPattern)
		argCount++
	}

	// Filter by username if provided
	if username != "" {
		whereClause += fmt.Sprintf(" AND u.username = $%d", argCount)
		args = append(args, username)
		argCount++
	}

	// Determine sorting method
	var orderClause string
	if sort == "trending" {
		// Rank threads by total votes in descending order
		orderClause = "ORDER BY votes DESC"
	} else {
		// Default: Sort by creation date
		orderClause = "ORDER BY t.created_at DESC"
	}

	// Final query with filters and sorting applied
	query := fmt.Sprintf(`
		%s
		%s
		GROUP BY t.id, u.username, t.title, t.content, c.name, t.created_at
		%s
		LIMIT $%d OFFSET $%d
	`, baseQuery, whereClause, orderClause, argCount, argCount+1)

	args = append(args, limit, offset)

	// Execute the query
	rows, err := db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()

	var threads []Thread
	for rows.Next() {
		var thread Thread
		var tags []sql.NullString

		err := rows.Scan(
			&thread.ID,
			&thread.Username,
			&thread.Title,
			&thread.Content,
			&thread.Category,
			&thread.CreatedAt,
			pq.Array(&tags),
			&thread.Votes,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}

		thread.Tags = make([]string, 0)
		for _, tag := range tags {
			if tag.Valid {
				thread.Tags = append(thread.Tags, tag.String)
			}
		}

		threads = append(threads, thread)
	}

	// Check for errors after iterating rows
	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %v", err)
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

func GetSingleThread(db *sql.DB, threadID int) (*Thread, error) {
	query := `
		SELECT 
			t.id,
			u.username,
			t.title,
			t.content,
			c.name as category,
			t.created_at,
			ARRAY_AGG(DISTINCT tags.name) as tags
		FROM threads t
		INNER JOIN users u ON t.user_id = u.id
		INNER JOIN categories c ON t.category_id = c.id
		LEFT JOIN thread_tags tt ON t.id = tt.thread_id
		LEFT JOIN tags ON tt.tag_id = tags.id
		WHERE t.id = $1
		GROUP BY t.id, u.username, t.title, t.content, c.name, t.created_at
	`

	var thread Thread
	var tags []sql.NullString

	err := db.QueryRow(query, threadID).Scan(
		&thread.ID,
		&thread.Username,
		&thread.Title,
		&thread.Content,
		&thread.Category,
		&thread.CreatedAt,
		pq.Array(&tags),
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	// Convert sql.NullString array to string array
	thread.Tags = make([]string, 0)
	for _, tag := range tags {
		if tag.Valid {
			thread.Tags = append(thread.Tags, tag.String)
		}
	}

	return &thread, nil
}

func SaveThread(db *sql.DB, username string, threadID int) error {
	query := `INSERT INTO user_threads (user_id, thread_id) VALUES ($1, $2)`

	userID, err := GetUserIDByUsername(username, db)
	if err != nil {
		return err
	}

	_, err = db.Exec(query, userID, threadID)
	if err != nil {
		return fmt.Errorf("error saving thread: %v", err)
	}
	return nil
}

func RemoveSavedThread(db *sql.DB, username string, threadID int) error {
	query := `DELETE FROM user_threads WHERE user_id = $1 AND thread_id = $2`

	userID, err := GetUserIDByUsername(username, db)
	if err != nil {
		return err
	}

	_, err = db.Exec(query, userID, threadID)
	if err != nil {
		return fmt.Errorf("error removing saved thread: %v", err)
	}
	return nil
}

func GetSavedThreads(db *sql.DB, username string, page, limit int) ([]Thread, error) {
	// Calculate offset
	offset := (page - 1) * limit

	// SQL query to get saved threads with pagination
	query := `
		SELECT DISTINCT 
			t.id,
			u.username,
			t.title,
			t.content,
			c.name AS category,
			t.created_at,
			ARRAY_AGG(DISTINCT tags.name) AS tags,
			COALESCE(SUM(v.vote), 0) AS votes
		FROM threads t
		INNER JOIN user_threads ut ON t.id = ut.thread_id
		INNER JOIN users u ON t.user_id = u.id
		INNER JOIN categories c ON t.category_id = c.id
		LEFT JOIN thread_tags tt ON t.id = tt.thread_id
		LEFT JOIN tags ON tt.tag_id = tags.id
		LEFT JOIN votes v ON t.id = v.thread_id
		WHERE ut.user_id = $1
		GROUP BY t.id, u.username, c.name, t.created_at
		ORDER BY t.created_at DESC
		LIMIT $2 OFFSET $3
	`

	// Get user ID by username
	userID, err := GetUserIDByUsername(username, db)
	if err != nil {
		return nil, fmt.Errorf("error getting user ID: %v", err)
	}

	// Execute the query
	rows, err := db.Query(query, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("error retrieving saved threads: %v", err)
	}
	defer rows.Close()

	// Parse the results
	var threads []Thread
	for rows.Next() {
		var thread Thread
		var tags []sql.NullString

		err := rows.Scan(
			&thread.ID,
			&thread.Username,
			&thread.Title,
			&thread.Content,
			&thread.Category,
			&thread.CreatedAt,
			pq.Array(&tags),
			&thread.Votes,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}

		// Convert nullable tags to a slice of strings
		thread.Tags = make([]string, 0)
		for _, tag := range tags {
			if tag.Valid {
				thread.Tags = append(thread.Tags, tag.String)
			}
		}

		threads = append(threads, thread)
	}

	return threads, nil
}

func CheckSavedState(db *sql.DB, username string, threadID int) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM user_threads WHERE user_id = $1 AND thread_id = $2)`

	userID, err := GetUserIDByUsername(username, db)
	if err != nil {
		return false, err
	}

	var saved bool
	err = db.QueryRow(query, userID, threadID).Scan(&saved)
	if err != nil {
		return false, err
	}

	return saved, nil
}
