import { createSlice } from '@reduxjs/toolkit';

interface CommentDialogState {
  isOpen: boolean;
}

const initialState: CommentDialogState = {
  isOpen: false,
};

const commentDialogSlice = createSlice({
  name: 'commentDialog',
  initialState,
  reducers: {
    openCommentDialog(state) {
      state.isOpen = true;
    },
    closeCommentDialog(state) {
      state.isOpen = false;
    },
  },
});

export const { openCommentDialog, closeCommentDialog } = commentDialogSlice.actions;
export default commentDialogSlice.reducer;
