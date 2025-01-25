import { createSlice } from '@reduxjs/toolkit';

interface DialogState {
  isOpen: boolean;
}

const initialState: DialogState = {
  isOpen: false,
};

const loginDialogSlice = createSlice({
  name: 'loginDialog',
  initialState,
  reducers: {
    openLoginDialog: (state) => {
      state.isOpen = true;
    },
    closeLoginDialog: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openLoginDialog, closeLoginDialog } = loginDialogSlice.actions;
export default loginDialogSlice.reducer;
