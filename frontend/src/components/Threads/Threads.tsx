'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Button, Stack, CircularProgress } from '@mui/material';
import { fetchThreads } from '@api/thread';
import { Thread } from '@/types/thread';
import ThreadCard from '@/components/ThreadCard';

const bg = '/images/bg.webp';

function Threads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchedOnce = useRef(false); // Avoid React Strict Mode Re-render, no effects on production

  async function loadThreads(pageNumber: number) {
    setLoading(true);
    fetchedOnce.current = true;

    try {
      const newThreads = await fetchThreads(pageNumber);
      setThreads((prevThreads) => [...prevThreads, ...newThreads]);
      setHasMore(newThreads.length >= 10);
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    } finally {
      setLoading(false);
      fetchedOnce.current = false;
    }
  };

  useEffect(() => {
    if (fetchedOnce.current) return;
    loadThreads(page);

  }, [page]);

  const handleSeeMoreClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' },
          flexGrow: 1,
          overflowY: 'auto',
          marginBottom: 2,
          marginTop: 7,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '600px' }}>
          <Box sx={{ padding: '0px 0px 16px 4px' }}>SORTING SECTION</Box>
          <Stack spacing={2}>
            {threads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </Stack>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {hasMore && !loading && (
        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
          <Button variant="contained" onClick={handleSeeMoreClick}>
            See More
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Threads;
