package models

import "database/sql"

type Vote struct {
	ID        int    `json:"id"`
	ThreadID  int    `json:"thread_id"`
	Username  string `json:"username"`
	Vote      int    `json:"vote"`
	CreatedAt string `json:"created_at"`
}

func CreateVote(db *sql.DB, vote *Vote) (*Vote, error) {
	query := `
  INSERT INTO votes (user_id, thread_id, vote)
  values ($1, $2, $3)
	ON CONFLICT (thread_id, user_id) DO UPDATE
	SET vote = EXCLUDED.vote
	RETURNING id;
 `
	userID, err := GetUserIDByUsername(vote.Username, db)
	if err != nil {
		return nil, err
	}

	err = db.QueryRow(query, userID, vote.ThreadID, vote.Vote).Scan(&vote.ID)

	if err != nil {
		return nil, err
	}

	return vote, nil
}

func CountVote(db *sql.DB, threadID int) (int, error) {
	var netVotes int

	query := `
			SELECT COALESCE(SUM(vote), 0) AS net_votes
			FROM votes
			WHERE thread_id = $1;
	`

	err := db.QueryRow(query, threadID).Scan(&netVotes)
	if err != nil {
		return 0, err
	}

	return netVotes, nil
}

func DeleteVote(db *sql.DB, threadID int, username string) error {
	query := `
		DELETE FROM votes
		WHERE thread_id = $1 AND user_id = $2;
	`

	userID, err := GetUserIDByUsername(username, db)
	if err != nil {
		return err
	}

	_, err = db.Exec(query, threadID, userID)
	return err
}
