import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthState, clearAuthState } from '@/store/slices/authSlice';
import { getDecodedToken } from '@/utils/decodeJwt';
import { scheduleLogout } from '@utils/syncAuth';

export const useRehydrateAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const decodedToken = getDecodedToken();

    if (decodedToken) {
      const username = decodedToken.sub;
      const expiryTime = decodedToken.exp;
      dispatch(setAuthState({ isLoggedIn: true, username }));
      scheduleLogout(expiryTime)
    } else {
      dispatch(clearAuthState());
    }
  }, [dispatch]);
};
