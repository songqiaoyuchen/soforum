import { useState, useEffect } from 'react';
import { Box, Button, Stack, Pagination } from '@mui/material'
import bg from '../../assets/images/bg.jpg';

function Threads() {
  const [threads, setThreads] = useState<string[]>([]); 
  const [loading, setLoading] = useState(false); 
  const [page, setPage] = useState(1); 

  function fetchThreads(pageNumber: number) {
    setLoading(true);
    setTimeout(() => {
      const newThreads = Array.from({ length: 10 }, (_, i) => `Thread ${(pageNumber - 1) * 10 + i + 1}`);
      setThreads(newThreads);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchThreads(page);
  }, [page]);

  function handlePageChange(event: React.ChangeEvent<unknown>, value: number) {
    setPage(value);
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

      {/* Threads Section */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: {xs: 'center', md: 'flex-start'},
        flexGrow: 1, 
        overflowY: 'auto', 
        marginBottom: 2, 
        marginTop: 7 
        }}
      >
        <Box sx={{width: '100%', maxWidth: '600px',}}>        
          <Box sx={{ padding: '0px 0px 16px 4px' }}>SORING SECTION</Box>
          <Stack spacing={8}>
            {threads.map((thread) => (
              <Box
                sx={{
                  border: 1,
                  borderRadius: 1,
                  padding: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '400px',
                }}
              >
                <h3>{thread}</h3>
                <Button variant="outlined">Read More</Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

    {/* Pagination Controls */}
    <Pagination
      count={10} // Set total pages (for example, 10 pages)
      page={page} // Current page
      onChange={handlePageChange} // Page change handler
      color="primary"
      sx={{ alignSelf: 'center' }}
    />

    {/* Loading Indicator */}
    {loading && <Box sx={{ textAlign: 'center', marginTop: 3 }}>Loading...</Box>}
    </Box>
      )
    }

export default Threads;
