'use client'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box } from '@mui/material';
import store, { RootState } from '@store';
import { closeDialog } from '@store/slices/commentDialogSlice';
import { postComment } from '@api/comment';
import { showSnackbar } from '@store/slices/snackbarSlice';


function CommentDialog(props: {threadID: number}) {
  const [comment, setComment] = useState('');
  const isOpen = useSelector((state: RootState) => state.commentDialog.isOpen);

  async function handleComment(e: React.FormEvent){
    e.preventDefault();

    if (comment.trim()) {
      try {
        const result = await postComment(props.threadID, {"content": comment});
        if (result.success) {
          store.dispatch(closeDialog());
          store.dispatch(showSnackbar({message: 'Comment posted', severity: 'success'}));
        } else {
          store.dispatch(showSnackbar({message: 'Comment failed: ' + result.message, severity: 'error'}));
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setComment('');
      }
    }
  }

  function handleClose() {
    setComment("");
    store.dispatch(closeDialog());
  };

  return (
    <Dialog 
      fullWidth
      open={isOpen} 
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleComment
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'background.paper',
      }}>
        <DialogTitle>Post a Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            type="text"
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions sx={{
            display: 'flex',
            flexDirection: {xxs: 'column', sm: 'row'},
            padding: '0px 24px 24px 24px',
            gap: 1
          }}>
            {/* Cancel button */}
            <Button 
              onClick={handleClose}
              color="secondary"
              sx={{
                width: {xxs: '100%', sm: '72px'},
              }}
            >
              Cancel
            </Button>

            {/* Login / Signup button */}
            <Button 
              type='submit'
              onClick={handleComment}
              variant="contained" 
              color="primary"
              sx={{
                margin: '0 !important',
                width: {xxs: '100%', sm: '72px'},
              }}
            >
              Post
            </Button>
          </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CommentDialog;
