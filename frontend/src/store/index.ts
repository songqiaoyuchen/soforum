import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dialogReducer from './slices/dialogSlice';
import menuReducer from './slices/menuSlice';
import snackbarReducer from './slices/snackbarSlice';
import filterReducer from './slices/filterSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    dialog: dialogReducer,
    menu: menuReducer,
    snackbar: snackbarReducer,
    filters: filterReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

