'use client'
import { useState } from "react";
import { Box, IconButton, Typography, Tooltip, Chip } from "@mui/material";
import { ThumbUp, ThumbDown, Comment, Bookmark, BookmarkBorder } from "@mui/icons-material";
import { openDialog } from "@store/slices/commentDialogSlice";
import store from "@store";

interface InteractionsBarProps {
  threadId: number;
  initialVotes: number;
}

export default function InteractionsBar({ threadId, initialVotes }: InteractionsBarProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [hasSaved, setHasSaved] = useState(false);
  const [voteState, setVoteState] = useState<"upvoted" | "downvoted" | null>(null);

  function handleUpvote(e: React.MouseEvent) {
    e.stopPropagation();
    if (voteState === "upvoted") {
      setVotes((prev) => prev - 1);
      setVoteState(null);
    } else {
      setVotes((prev) => prev + (voteState === "downvoted" ? 2 : 1));
      setVoteState("upvoted");
    }
  };

  function handleDownvote(e: React.MouseEvent) {
    e.stopPropagation();
    if (voteState === "downvoted") {
      setVotes((prev) => prev + 1);
      setVoteState(null);
    } else {
      setVotes((prev) => prev - (voteState === "upvoted" ? 2 : 1));
      setVoteState("downvoted");
    }
  };

  function handleSave(e: React.MouseEvent) {
    e.stopPropagation();
    setHasSaved((prev) => !prev);
  };

  function onComment() {
    store.dispatch(openDialog())
  }

  return (
    <Box 
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}>
      <Box sx={{ 
        display: "flex", 
        alignItems: "center",
        bgcolor: "rgba(255, 255, 255, 0.2)",
        borderRadius: '30px',
        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.4)" }
      }}>
        <Tooltip title="Upvote">
          <IconButton color={voteState === "upvoted" ? "primary" : "default"} onClick={handleUpvote}>
            <ThumbUp />
          </IconButton>
        </Tooltip>
        <Typography variant="body2">{votes}</Typography>
        <Tooltip title="Downvote">
          <IconButton color={voteState === "downvoted" ? "primary" : "default"} onClick={handleDownvote}>
            <ThumbDown />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Comment */}
      <Box onClick={onComment} sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: "rgba(255, 255, 255, 0.2)",
        borderRadius: '30px',
        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.4)" }
      }}>
        <Tooltip title="Comment">
          <IconButton onClick={onComment}>
            <Comment />
          </IconButton>
        </Tooltip>
        <Typography variant="body2" sx={{paddingRight: 1.5}}>Comment</Typography>
      </Box>

      {/* Save */}
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
      </Box>
    </Box>
  );
}
