'use client'
import { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { fetchComments } from "@/api/thread"; // Assuming this API function exists
import { ThreadComment } from "@/types/thread"; // Assuming a `Comment` type is defined

export default function Comments({ threadID }: { threadID: number }) {
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadComments() {
      try {
        const response = await fetchComments(threadID);
        response ? setComments(response) : setError("No comments under this thread.");
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments.");
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [threadID]);

  if (loading) {
    return <Typography>Loading comments...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ width: "100%", marginTop: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        Comments ({comments.length})
      </Typography>
      {comments.map((comment) => (
        <Box
          key={comment.id}
          sx={{
            padding: "10px",
            marginBottom: "10px",
            bgcolor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ color: "white" }}>
            {comment.username} • {new Date(comment.created_at).toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ color: "white", marginTop: "5px" }}>
            {comment.content}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
