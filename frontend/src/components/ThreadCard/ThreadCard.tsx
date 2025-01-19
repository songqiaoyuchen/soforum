import { useState } from "react";
import { Thread } from "@/types/thread";
import { Box, Chip, Typography, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { formatDistanceToNowStrict } from 'date-fns';
import InteractionsBar from "@components/InteractionBar";

function ThreadCard(props: { thread: Thread }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Helper to parse SQL timestamp into a valid ISO string
  const parseSQLTimestamp = (timestamp: string) => {
    const isoString = timestamp.replace(' ', 'T').split('.')[0]; // Replace space with 'T' and trim after seconds
    return new Date(isoString);
  };

  const parsedDate = parseSQLTimestamp(props.thread.created_at);
  const relativeTime = formatDistanceToNowStrict(parsedDate, { addSuffix: true });

  const handleClick = () => {
    setLoading(true);
    router.push(`/threads/${props.thread.id}`);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'relative',
        borderTop: 2,
        borderRadius: 1,
        padding: "10px 20px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        color: 'primary',
        bgcolor: 'rgba(6, 20, 0, 0.7)',
        '&:hover': {
          backgroundColor: 'rgb(221, 255, 233, 0.3)',
        },
        boxShadow: 3,
        cursor: 'pointer',
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box sx={{
        color: '#c6eac1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}>
        {/* Category... */}
        <Typography
          variant="subtitle2"
          sx={{ display: 'flex', gap: '20px' }}>
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
            WebkitLineClamp: { md: 3, xl: 6 },
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {props.thread.content}
        </Typography>
        {/* Tags */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            margin: "10px 0px",
        }}
      >
        {props.thread.tags.map((tag) => (
          <Chip
            key={tag}
            label={`#${tag}`}
            sx={{
              color: "white",
              bgcolor: "primary.main",
              borderRadius: '5px',
              "&:hover": { bgcolor: "primary.light" },
            }}
          />
        ))}
      </Box>
        {/* Interaction Bar */}
        <InteractionsBar threadId={props.thread.id} initialVotes={0}/>
      </Box>
    </Box>
  );
}

export default ThreadCard;