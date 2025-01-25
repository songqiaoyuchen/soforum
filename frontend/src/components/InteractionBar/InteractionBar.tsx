'use client';

import { useEffect, useState } from "react";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import { ThumbUp, ThumbDown, Comment } from "@mui/icons-material";
import { openCommentDialog } from "@store/slices/commentDialogSlice";
import { openLoginDialog } from "@store/slices/loginDialogSlice";
import store, { RootState } from "@store";
import { castVote, deleteVote, checkVoteState } from "@/api/vote";
import { useSelector } from "react-redux";

interface InteractionsBarProps {
  threadId: number;
  initialVotes: number;
}

export default function InteractionsBar({ threadId, initialVotes }: InteractionsBarProps) {
  const username = useSelector((state: RootState) => state.auth.username);
  const [votes, setVotes] = useState(initialVotes);
  const [voteState, setVoteState] = useState<"upvoted" | "downvoted" | null>(null);

  async function getVoteState() {
    try {
      const voteState = await checkVoteState(username ? username : "guest", threadId);
      if (voteState === 1) {
        setVoteState("upvoted");
      } else if (voteState === -1) {
        setVoteState("downvoted");
      } else {
        setVoteState(null);
      }
    } catch (error) {
      console.error("Error in fetching vote state:", error);
    }
  }

  useEffect(() => {
    getVoteState();
  }, [username]);

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

  function onUpvote(e: React.MouseEvent) {
    e.stopPropagation();
    if (username) {
      handleVote(voteState === "upvoted" ? null : "upvote");
    } else {
      store.dispatch(openLoginDialog());
    }
  }

  function onDownvote(e: React.MouseEvent) {
    e.stopPropagation();
    if (username) {
      handleVote(voteState === "downvoted" ? null : "downvote");
    } else {
      store.dispatch(openLoginDialog());
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
            onClick={onUpvote}
          >
            <ThumbUp />
          </IconButton>
        </Tooltip>
        <Typography variant="body2">{votes}</Typography>
        <Tooltip title="Downvote">
          <IconButton
            aria-label="Downvote"
            color={voteState === "downvoted" ? "primary" : "default"}
            onClick={onDownvote}
          >
            <ThumbDown />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Comment Section */}
      <Box
        onClick={() => store.dispatch(openCommentDialog())}
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
