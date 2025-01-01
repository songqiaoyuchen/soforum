'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import PostForm from '@components/PostForm';
import store, { RootState } from '@store';
import { showSnackbar } from '@store/snackbarSlice';

function PostPage() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn); // Adjust state type as needed
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
      store.dispatch(showSnackbar({message: 'Please login to post', severity: 'info'}));
    }
  }, [isLoggedIn, router]);

  // Render nothing if not logged in to avoid flickering
  if (!isLoggedIn) return null;

  return <PostForm />;
}

export default PostPage;

