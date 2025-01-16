'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import PostForm from '@components/PostForm';
import store, { RootState } from '@store';
import { showSnackbar } from '@store/slices/snackbarSlice';
import syncAuth from '@utils/syncAuth';

function PostPage() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const router = useRouter();
  const [authSynced, setAuthSynced] = useState(false); // Track when `syncAuth` finishes

  useEffect(() => {
    syncAuth();
    setAuthSynced(true);
  }, []);

  useEffect(() => {
    if (authSynced && !isLoggedIn) {
      router.push('/');
      store.dispatch(showSnackbar({ message: 'Please login to post', severity: 'info' }));
    }
  }, [authSynced, isLoggedIn, router]);

  if (!authSynced || !isLoggedIn) return null;

  return <PostForm initialThread={null}/>;
}

export default PostPage;
