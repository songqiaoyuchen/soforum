'use client';

import { useState } from "react";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import { ThumbUp, ThumbDown, Comment } from "@mui/icons-material";
import { openDialog } from "@store/slices/commentDialogSlice";
import store from "@store";
import { castVote, deleteVote } from "@/api/vote";

interface InteractionsBarProps {
  threadId: number;
  initialVotes: number;
  userVote: "upvoted" | "downvoted" | null;
}

export default function InteractionsBar({ threadId, initialVotes, userVote }: InteractionsBarProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [voteState, setVoteState] = useState<"upvoted" | "downvoted" | null>(userVote);

  async function handleVote(vote: "upvote" | "downvote" | null) {
    try {
      let result;
      if (vote === null) {
        // Retract vote
        result = await deleteVote(threadId);
      } else {
        // Cast or change vote
        const voteValue = vote === "upvote" ? 1 : -1;
        result = await castVote(threadId, { vote: voteValue });
      }

      if (result.success) {
        if (vote === null) {
          if (voteState === "upvoted") setVotes((prev) => prev - 1);
          if (voteState === "downvoted") setVotes((prev) => prev + 1);
          setVoteState(null);
        } else {
          if (vote === "upvote") setVotes((prev) => prev + (voteState === "downvoted" ? 2 : 1));
          if (vote === "downvote") setVotes((prev) => prev - (voteState === "upvoted" ? 2 : 1));
          setVoteState(vote === "upvote" ? "upvoted" : "downvoted");
        }
      } else {
        console.error("Error in voting operation:", result.message);
      }
    } catch (error) {
      console.error("Error in voting API call:", error);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Voting Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "30px",
          "&:hover": { bgcolor: "rgba(255, 255, 255, 0.4)" },
        }}
      >
        <Tooltip title="Upvote">
          <IconButton
            aria-label="Upvote"
            color={voteState === "upvoted" ? "primary" : "default"}
            onClick={() => handleVote(voteState === "upvoted" ? null : "upvote")}
          >
            <ThumbUp />
          </IconButton>
        </Tooltip>
        <Typography variant="body2">{votes}</Typography>
        <Tooltip title="Downvote">
          <IconButton
            aria-label="Downvote"
            color={voteState === "downvoted" ? "primary" : "default"}
            onClick={() => handleVote(voteState === "downvoted" ? null : "downvote")}
          >
            <ThumbDown />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Comment Section */}
      <Box
        onClick={() => store.dispatch(openDialog())}
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "30px",
          "&:hover": { bgcolor: "rgba(255, 255, 255, 0.4)" },
        }}
      >
        <Tooltip title="Comment">
          <IconButton>
            <Comment />
          </IconButton>
        </Tooltip>
        <Typography variant="body2" sx={{ paddingRight: 1.5 }}>
          Comment
        </Typography>
      </Box>

      {/* Save
      <Box onClick={handleSave} sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: "rgba(255, 255, 255, 0.2)",
        borderRadius: '30px',
        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.4)" }
      }}>
        <Tooltip title={hasSaved ? "Unsave" : "Save"}>
          <IconButton onClick={handleSave}>
            {hasSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
          </IconButton>
        </Tooltip>
        <Typography variant="body2" sx={{paddingRight: 1.5}}>{hasSaved ? "Unsave" : "Save"}</Typography>
      </Box> */}
    </Box>
  );
}
