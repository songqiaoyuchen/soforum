'use client'
import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, TextField, Button } from "@mui/material";
import { fetchComments, editComment } from "@api/comment";
import { ThreadComment } from "@/types/thread";
import CommentActions from "./CommentActions";
import { useSelector } from "react-redux";
import { RootState } from "@store";

export default function Comments({ threadID }: { threadID: number }) {
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const username = useSelector((state: RootState) => state.auth.username);

  useEffect(() => {
    async function loadComments() {
      try {
        const response = await fetchComments(threadID);
        if (response) {
          setComments(response);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments.");
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [threadID]);

  function handleEditClick(comment: ThreadComment) {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  function handleCancelEdit() {
    setEditingCommentId(null);
    setEditedContent("");
  };

  async function handleSaveEdit(commentId: number) {
    try {
      const response = await editComment(commentId, { content: editedContent });
      if (response.success) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId ? { ...comment, content: editedContent } : comment
          )
        );
        setEditingCommentId(null);
        setEditedContent("");
      } else {
        console.error("Failed to update comment:", response.message);
      }
    } catch (error) {
      console.error("Unexpected error while updating comment:", error);
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ width: "100%", marginTop: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        Comments ({comments.length})
      </Typography>
      {loading && (
        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
          <CircularProgress />
        </Box>
      )}
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
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" flexDirection="column">
              <Typography variant="subtitle1" sx={{ color: username == comment.username ? "primary.main" : "white"}}>
                {comment.username}
              </Typography>
              <Typography variant="subtitle2">
                {new Date(comment.created_at).toLocaleString()}
              </Typography>
            </Box>
            {username == comment.username && 
            <CommentActions
              id={comment.id}
              onEdit={() => handleEditClick(comment)}
            />}
          </Box>
          {editingCommentId === comment.id ? (
            <Box sx={{ marginTop: "10px" }}>
              <TextField
                fullWidth
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                multiline
                rows={3}
                variant="outlined"
                sx={{ marginBottom: "10px" }}
              />
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Button variant="contained" onClick={() => handleSaveEdit(comment.id)}>
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ marginTop: "10px" }}>
              {comment.content}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}
