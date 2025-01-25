package models

import "database/sql"

type Vote struct {
	ID        int    `json:"id"`
	ThreadID  int    `json:"thread_id"`
	Username  string `json:"username"`
	Vote      int    `json:"vote"`
	CreatedAt string `json:"created_at"`
}

type VoteState struct {
	ThreadID int    `json:"thread_id"`
	Username string `json:"username"`
	Vote     int    `json:"vote"` // 1 for upvote, -1 for downvote, 0 for no vote
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

func GetVoteStateByUserID(db *sql.DB, threadID int, userID int) (*VoteState, error) {
	query := `
		SELECT v.thread_id, v.vote, u.username
		FROM votes v
		INNER JOIN users u ON v.user_id = u.id
		WHERE v.thread_id = $1 AND v.user_id = $2;
	`

	var voteState VoteState
	err := db.QueryRow(query, threadID, userID).Scan(
		&voteState.ThreadID,
		&voteState.Vote,
		&voteState.Username,
	)
	if err != nil {
		// Handle case where no row is returned (user has not voted)
		if err == sql.ErrNoRows {
			return &VoteState{
				ThreadID: threadID,
				Vote:     0, // Default to 0 if no vote is found
			}, nil
		}
		return nil, err // Return other errors
	}

	return &voteState, nil
}
