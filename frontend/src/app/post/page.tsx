'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import PostForm from '@components/PostForm';
import { RootState } from '@store';

function PostPage() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn); // Adjust state type as needed
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to homepage if user is not logged in
      router.push('/');
    }
  }, [isLoggedIn, router]);

  // Render nothing if not logged in to avoid flickering
  if (!isLoggedIn) return null;

  return <PostForm />;
}

export default PostPage;

