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
    openDialog(state) {
      state.isOpen = true;
    },
    closeDialog(state) {
      state.isOpen = false;
    },
  },
});

export const { openDialog, closeDialog } = commentDialogSlice.actions;
export default commentDialogSlice.reducer;
