import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  username: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(state, action: PayloadAction<{ isLoggedIn: boolean; username: string }>) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.username = action.payload.username;
    },
    clearAuthState(state) {
      state.isLoggedIn = false;
      state.username = null;
    },
  },
});

export const { setAuthState, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
