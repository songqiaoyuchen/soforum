package models

import (
	"database/sql"
	"fmt"
)

type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func GetCategoryIDByName(name string, db *sql.DB) (int, error) {
	var category Category
	err := db.QueryRow("SELECT id FROM categories WHERE name = $1", name).Scan(&category.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			return category.ID, fmt.Errorf("category does not exist")
		}
		return category.ID, fmt.Errorf("error querying database: %v", err)
	}
	return category.ID, nil
}
