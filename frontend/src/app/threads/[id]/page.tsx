import { Thread } from "@/types/thread";
import { Box, Typography, Chip } from "@mui/material";
import { formatDistanceToNowStrict } from "date-fns";
import { fetchSingleThread } from "@/api/thread";

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const { id } = params;
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
      sx={{
        margin: "70px auto",
        padding: "20px",
        maxWidth: "800px",
        bgcolor: "rgba(18, 46, 5, 0.7)",
        color: "primary",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* Title */}
      <Typography variant="h4" sx={{ color: "white", marginBottom: "10px" }}>
        {thread.title}
      </Typography>

      {/* Category and Author */}
      <Typography
        variant="subtitle2"
        sx={{ color: "#c6eac1", marginBottom: "10px" }}
      >
        # {thread.category} • {relativeTime} by {thread.username}
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
              bgcolor: "rgba(255, 255, 255, 0.2)",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.4)" },
            }}
          />
        ))}
      </Box>

      {/* Interaction Bar (Placeholder for future interaction features) */}
      <Box
        sx={{
          height: "30px",
          padding: "5px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        Interactions TBU
      </Box>
    </Box>
  );
}
