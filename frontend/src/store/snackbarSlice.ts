import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type severity = 'success' | 'info' | 'warning' | 'error';

interface SnackbarState {
  message: string;
  severity: severity;
  isOpen: boolean;
}

const initialState: SnackbarState = {
  message: '',
  severity: 'info',
  isOpen: false,
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<{message: string, severity: severity}>) => {
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.isOpen = true;
    },
    hideSnackbar: (state) => {
      state.isOpen = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
