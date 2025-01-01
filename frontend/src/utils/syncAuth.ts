// src/utils/auth.ts
import { jwtDecode } from 'jwt-decode';
import store from '@store';
import { setAuthState, clearAuthState } from '@store/authSlice';

export function initializeAuth() {
  const token = sessionStorage.getItem('jwt');
  if (!token) {
    store.dispatch(clearAuthState());
    return;
  }

  try {
    const decoded: { exp: number; sub: string } = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    console.log('Decoded token:', decoded);

    if (decoded.exp > currentTime) {
      // Token is valid, update Redux
      store.dispatch(setAuthState({ isLoggedIn: true, username: decoded.sub }));
      scheduleTokenValidation(decoded.exp);
    } else {
      // Token expired
      sessionStorage.removeItem('jwt');
      store.dispatch(clearAuthState());
    }
  } catch (error) {
    console.error('Token validation failed:', error);
    sessionStorage.removeItem('jwt');
    store.dispatch(clearAuthState());
  }
}

export function scheduleTokenValidation(expirationTime: number): void {
  const currentTime = Date.now() / 1000; // In seconds
  const delay = (expirationTime - currentTime) * 1000;
  console.log('Scheduling token validation with delay:', delay);

  if (delay > 0) {
    setTimeout(() => {
      sessionStorage.removeItem('jwt');
      store.dispatch(clearAuthState());
      console.log('Token expired');
    }, delay);
  } else {
    console.log('Token expiration time is invalid or in the past:', expirationTime);
  }
}
