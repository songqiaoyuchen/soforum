import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import loginDialogReducer from './slices/loginDialogSlice';
import menuReducer from './slices/menuSlice';
import snackbarReducer from './slices/snackbarSlice';
import filterReducer from './slices/filterSlice';
import commentDialogReducer from './slices/commentDialogSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    loginDialog: loginDialogReducer,
    menu: menuReducer,
    snackbar: snackbarReducer,
    filters: filterReducer,
    commentDialog: commentDialogReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

