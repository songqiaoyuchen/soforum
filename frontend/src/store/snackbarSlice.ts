import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SnackbarState {
  message: string;
  isOpen: boolean;
}

const initialState: SnackbarState = {
  message: '',
  isOpen: false,
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      state.isOpen = true;
    },
    hideSnackbar: (state) => {
      state.isOpen = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
