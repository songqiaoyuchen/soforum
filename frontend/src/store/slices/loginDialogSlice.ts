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
    openDialog: (state) => {
      state.isOpen = true;
    },
    closeDialog: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openDialog, closeDialog } = loginDialogSlice.actions;
export default loginDialogSlice.reducer;
