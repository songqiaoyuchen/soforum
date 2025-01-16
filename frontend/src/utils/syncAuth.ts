'use client'
import store from '@store';
import { clearAuthState, setAuthState } from '@store/slices/authSlice';
import { getDecodedToken } from './decodeJwt';

// scheduleLogout schedules jwt removal and updates authSatte upon expiry
export function scheduleLogout(expiryTime: number): void {
  // expiryTime is expected to be in seconds
  const currentTime = Date.now() / 1000; // In seconds
  const delay = (expiryTime - currentTime) * 1000;
  console.log('Scheduling token validation with delay:', delay);

  if (delay > 0) {
    setTimeout(() => {
      sessionStorage.removeItem('jwt');
      store.dispatch(clearAuthState());
      console.log('Token expired, jwt removed from storage -- scheduleLogout');
    }, delay);
  } else {
    console.error('Token expiration time is invalid or in the past:', expiryTime);
  }
}

// syncAuth syncs authState with jwt in sessionStorage
export default function syncAuth() {
  if (typeof window === 'undefined') {
    console.warn('syncAuth should only run in the browser.');
    return;
  }

  const decodedToken = getDecodedToken();

  if (decodedToken) {
    const username = decodedToken.sub;
    const expiryTime = decodedToken.exp;
    store.dispatch(setAuthState({ isLoggedIn: true, username }));
    console.log("Auth state synced with jwt -- syncAuth");
    scheduleLogout(expiryTime)
  } else {
    store.dispatch(clearAuthState());
  }
}
