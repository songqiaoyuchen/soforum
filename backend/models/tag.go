package models

import (
	"database/sql"
	"fmt"
)

// CreateTag inserts a new tag into the database or retrieves its ID if it already exists.
func GetOrCreateTagID(db *sql.DB, tagName string) (int, error) {
	var tagID int

	query := `SELECT id FROM tags WHERE name = $1`
	err := db.QueryRow(query, tagName).Scan(&tagID)
	if err == nil {
		return tagID, nil // Tag found, return the existing ID
	} else if err != sql.ErrNoRows {
		return 0, fmt.Errorf("failed to retrieve existing tag: %v", err)
	}

	// Insert the tag if it doesn't exist
	query = `
			INSERT INTO tags (name)
			VALUES ($1)
			RETURNING id;
	`
	err = db.QueryRow(query, tagName).Scan(&tagID)
	if err != nil {
		return 0, fmt.Errorf("failed to add tag: %v", err)
	}

	return tagID, nil
}

// AssociateThreadTags associates a thread with multiple tags in the thread_tags table.
func AssociateThreadTags(db *sql.DB, threadID int, tagIDs []int) error {
	for _, tagID := range tagIDs {
		query := `
			INSERT INTO thread_tags (thread_id, tag_id)
			VALUES ($1, $2)
			ON CONFLICT DO NOTHING;
		`
		_, err := db.Exec(query, threadID, tagID)
		if err != nil {
			return fmt.Errorf("failed to associate thread with tag: %v", err)
		}
	}
	return nil
}
