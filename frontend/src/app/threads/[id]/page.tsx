import { Thread } from "@/types/thread";
import { Box, Typography, Chip } from "@mui/material";
import { formatDistanceToNowStrict } from "date-fns";
import { fetchSingleThread } from "@/api/thread";
import Comments from "@components/Comments";
import ThreadActions from "@components/ThreadActions";
import InteractionsBar from "@components/InteractionBar";
import CommentDialog from "@components/CommentDialog";

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  let thread: Thread | null;

  try {
    thread = await fetchSingleThread(Number(id));
    if (!thread) {
      throw new Error("Thread not found");
    }
  } catch (error) {
    console.error("Error fetching thread:", error);
    return (
      <Box
        sx={{
          margin: "20px auto",
          padding: "20px",
          maxWidth: "800px",
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography variant="h5" color="error" sx={{ marginBottom: "10px" }}>
          Thread Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: "gray" }}>
          The thread you are looking for might have been removed or does not exist.
        </Typography>
      </Box>
    );
  }

  // Helper to parse SQL timestamp into a valid ISO string
  const parseSQLTimestamp = (timestamp: string) => {
    const isoString = timestamp.replace(" ", "T").split(".")[0]; // Replace space with 'T' and trim after seconds
    return new Date(isoString);
  };

  const parsedDate = parseSQLTimestamp(thread.created_at);
  const relativeTime = formatDistanceToNowStrict(parsedDate, { addSuffix: true });

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
      width: '100%',
      maxWidth: {md: '600px', xl: '900px'},
      marginTop: 7, 
      marginBottom: 2,
      borderTop: 2,
      borderRadius: 1,
      padding: "10px 20px",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      color: 'primary',
      bgcolor: 'rgba(6, 20, 0, 0.7)',
      boxShadow: 3,
    }}>
      <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
        {/* Title */}
        <Typography variant="h4" sx={{ color: "white", marginBottom: "10px" }}>
          {thread.title}
        </Typography>
        <ThreadActions id={Number(id)} ownername={thread.username}/>
      </Box>

      {/* Category and Author */}
      <Typography
          variant="subtitle2"
          sx={{display: 'flex', gap: '20px', paddingBottom: '10px'}}>
          <Box># {thread.category}</Box>
          <Box>• {relativeTime} by {thread.username}</Box>
        </Typography>

      {/* Content */}
      <Typography
        variant="body1"
        sx={{
          color: "white",
          marginBottom: "20px",
          lineHeight: 1.6,
        }}
      >
        {thread.content}
      </Typography>

      {/* Tags */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {thread.tags.map((tag) => (
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

      {/* Interaction Bar*/}
      <InteractionsBar initialVotes={0} threadId={Number(id)} userVote={thread.votes == 1 ? "upvoted" : thread.votes == -1 ? "downvoted" : null}/>
      <Comments threadID={Number(id)}/>
    </Box>
    <CommentDialog threadID={Number(id)} />

    </Box>
  );
}
