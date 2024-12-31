import { Thread } from "@/types/thread";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { formatDistanceToNowStrict } from 'date-fns';


function ThreadCard(props: {thread: Thread}) {
  const router = useRouter();
   // Helper to parse SQL timestamp into a valid ISO string
  const parseSQLTimestamp = (timestamp: string) => {
    const isoString = timestamp.replace(' ', 'T').split('.')[0]; // Replace space with 'T' and trim after seconds
    return new Date(isoString);
  };

  const parsedDate = parseSQLTimestamp(props.thread.created_at);
  const relativeTime = formatDistanceToNowStrict(parsedDate, { addSuffix: true });
  
  return (
    <Box onClick={() => router.push("/")}
      sx={{
        borderTop: 2,
        borderRadius: 1,
        padding: "10px 20px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        maxHeight: '250px',
        color: 'primary',
        bgcolor: 'rgba(6, 20, 0, 0.7)',
        '&:hover': {
          backgroundColor: 'rgba(3, 20, 1, 0.9)',
        },
        boxShadow: 3,
      }}
    >
      <Box sx={{
        color: '#c6eac1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}>
        {/* Category... */}
        <Typography
          variant="subtitle2"
          sx={{display: 'flex', gap: '20px'}}>
          <Box># {props.thread.category}</Box>
          <Box>• {relativeTime} by {props.thread.username}</Box>
        </Typography>
        {/* Title */}
        <Typography
          variant="subtitle1"
          color="white">
          {props.thread.title}
        </Typography>
        {/* Body */}
        <Typography
          variant='body2'
          align="left"
          sx={{
            display: '-webkit-box',             
            WebkitLineClamp: 3,                 
            WebkitBoxOrient: 'vertical',         
            overflow: 'hidden',               
            textOverflow: 'ellipsis',
          }}>
          {props.thread.content}
        </Typography>
        {/* Interaction Bar */}
        <Box sx={{height: '30px', padding: '5px', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
          Interactions TBU
        </Box>
      </Box>
    </Box>
  );
}

export default ThreadCard