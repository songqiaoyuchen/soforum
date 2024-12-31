import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import dialogReducer from './dialogSlice';
import menuReducer from './menuSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    dialog: dialogReducer,
    menu: menuReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
