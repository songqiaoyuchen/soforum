'use client'

import { useState, useEffect, useRef } from 'react';
import { Box, Button, Stack, CircularProgress, Typography } from '@mui/material';
import { fetchThreads } from '@api/thread';
import { Thread } from '@/types/thread';
import ThreadCard from '@components/ThreadCard';
import { useSelector } from 'react-redux';
import { RootState } from '@store';
import { useParams } from 'next/navigation';

export const dynamicParams = true;

export default function HomePage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchedOnce = useRef(false); // Avoid React Strict Mode Re-render, no effects on production
  const { searchQuery } = useSelector((state: RootState) => state.filters);

  // Get category from URL params
  const params = useParams();
  const category = params.category as string;

  async function loadThreads(pageNumber: number, reset: boolean = false) {
    setLoading(true);
    fetchedOnce.current = true;

    if (reset) {
      setThreads([]);
    }

    try {
      const newThreads = await fetchThreads(pageNumber, 10, category, searchQuery);
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
    if (!fetchedOnce.current) {
      loadThreads(1, true); 
    }
  }, [searchQuery, category]); // Trigger reset when filters change
  
  useEffect(() => {
    if (!fetchedOnce.current) {
      loadThreads(page);
    }
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
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: { xs: 'center', md: 'flex-start' },
        backgroundImage: `url('/images/bg.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        overflowY: 'auto',
      }}
    >
      <Box sx={{
        backgroundImage: `url('/images/${category}.jpg')`,
        marginTop: 7, 
        marginBottom: 2,
        height: '150px', 
        width: '100%'}}></Box>
      <Box sx={{ 
        width: '100%',
        maxWidth: {md: '600px', xl: '900px'},
        marginBottom: 2,
      }}>
        {/* Content Section */}
        <Box sx={{ padding: '0px 0px 16px 4px' }}>SORTING SECTION</Box>
        <Stack spacing={2}>
          {threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </Stack>

        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            <Button variant="contained" onClick={handleSeeMoreClick}>
              See More
            </Button>
          </Box>
        )}

        {/* No More Threads Indicator */}
        {!hasMore && !loading && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4, 
            px: 2 }}>
          <Typography color='primary.contrastText'>
            No more threads available...
          </Typography>
        </Box>
        )}
      </Box>
    </Box>
  );
}