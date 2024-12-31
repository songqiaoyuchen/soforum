import { Thread } from "@/types/thread";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";


function ThreadCard(props: {thread: Thread}) {
  const router = useRouter();
  
  return (
    <Button onClick={() => router.push("/")} variant="text"
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
          variant="subtitle2">
          # {props.thread.category}
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
    </Button>
  );
}

export default ThreadCard