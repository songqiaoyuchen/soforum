import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Using localStorage
import authReducer from './authSlice';
import dialogReducer from './dialogSlice';
import menuReducer from './menuSlice';
import snackbarReducer from './snackbarSlice';
import { combineReducers } from 'redux';

// Persist configuration for the auth slice only
const authPersistConfig = {
  key: 'auth', // Key for the auth slice
  storage,     // Using localStorage or sessionStorage
  whitelist: ['auth'], // Only persist the auth slice
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer), // Persist only auth
  dialog: dialogReducer,
  menu: menuReducer,
  snackbar: snackbarReducer,
});

// Create the store with the persisted reducer
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

// Persistor for the store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

