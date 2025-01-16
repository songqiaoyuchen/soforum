'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import PostForm from '@components/PostForm';
import store, { RootState } from '@store';
import { showSnackbar } from '@store/slices/snackbarSlice';
import syncAuth from '@utils/syncAuth';
import { fetchSingleThread } from '@api/thread';
import { Box, Typography } from '@mui/material';
import { Thread } from '@/types/thread';

async function EditPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const username = useSelector((state: RootState) => state.auth.username);
  const router = useRouter();

  const [authSynced, setAuthSynced] = useState(false);
  const [thread, setThread] = useState<Thread | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync authentication on load
  useEffect(() => {
    syncAuth();
    setAuthSynced(true);
  }, []);

  // Redirect unauthenticated or unauthorized users
  useEffect(() => {
    if (authSynced) {
      if (!isLoggedIn) {
        router.push('/');
        store.dispatch(showSnackbar({ message: 'Please login to post', severity: 'info' }));
      } else if (thread && thread.username !== username) {
        router.push('/');
        store.dispatch(showSnackbar({ message: 'You are not allowed to edit this thread', severity: 'warning' }));
      }
    }
  }, [authSynced, isLoggedIn, thread, username, router]);

  // Fetch thread data
  useEffect(() => {
    if (authSynced && isLoggedIn) {
      const fetchThread = async () => {
        try {
          const fetchedThread = await fetchSingleThread(Number(id));
          if (!fetchedThread) {
            throw new Error('Thread not found');
          }
          setThread(fetchedThread);
        } catch (err) {
          console.error('Error fetching thread:', err);
          setError('Thread not found');
        }
      };
      fetchThread();
    }
  }, [authSynced, isLoggedIn, id]);

  // Render loading or error states
  if (!authSynced || !isLoggedIn) return null;

  if (error) {
    return (
      <Box
        sx={{
          margin: '20px auto',
          padding: '20px',
          maxWidth: '800px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Typography variant="h5" color="error" sx={{ marginBottom: '10px' }}>
          {error}
        </Typography>
        <Typography variant="body1" sx={{ color: 'gray' }}>
          The thread you are looking for might have been removed or does not exist.
        </Typography>
      </Box>
    );
  }

  if (!thread) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <Typography variant="body1" color="textSecondary">
          Loading thread...
        </Typography>
      </Box>
    );
  }

  // Render the PostForm if thread is successfully fetched
  return <PostForm initialThread={thread} />;
}

export default EditPage;
