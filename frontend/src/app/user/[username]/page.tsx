'use client';

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { TextField, Button, Box, Typography, CircularProgress, Stack } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import store, { RootState } from "@store"; // Adjust path as necessary
import { fetchUserProfile, updateUserProfile } from "@api/user";
import { showSnackbar } from "@store/slices/snackbarSlice";
import { Thread } from "@/types/thread";
import { setAuthState } from "@store/slices/authSlice";
import { fetchThreads } from "@api/thread";
import ThreadCard from "@components/ThreadCard";

function UserProfile() {
  const params = useParams();
  const router = useRouter()
  const [profile, setProfile] = useState<{
    bio?: string;
    email?: string;
    username?: string;
    joined?: string;
  } | null>(null);
  const [bio, setBio] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const currentUsername = useSelector((state: RootState) => state.auth.username);
  const username = typeof params.username === "string" ? params.username : "";
  const [newUsername, setNewUsername] = useState(username)

  // Fetch profile data
  async function fetchProfile() {
    try {
      const userProfile = await fetchUserProfile(username);
      if (userProfile) {
        setProfile(userProfile);
        setBio(userProfile.bio || "");
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    if (username) fetchProfile();
  }, [username]);

  // Handle profile update
  async function handleSave() {
    try {
      const response = await updateUserProfile(currentUsername ? currentUsername : "guest", {"bio": bio, "username": newUsername})
      if (response.success) {
        store.dispatch(showSnackbar({message: "Profile updated successfully!", severity: 'success'}));
        store.dispatch(setAuthState({isLoggedIn: true, username: newUsername}));
        setIsEditing(false);
        router.push(`/user/${newUsername}`)
      } else {
        store.dispatch(showSnackbar({message: "Failed to update profile", severity: 'error'}));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      store.dispatch(showSnackbar({message: "Failed to update profile", severity: 'error'}));
    }
  };

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { searchQuery, category } = useSelector((state: RootState) => state.filters);
  const fetchedOnce = useRef(false); // Avoid React Strict Mode Re-render, no effects on production

  async function loadThreads(pageNumber: number, reset: boolean = false) {
    setLoading(true);
    fetchedOnce.current = true;

    if (reset) {
      setThreads([]);
    }

    try {
      const newThreads = await fetchThreads(pageNumber, 10, category, searchQuery, username);
      setThreads((prevThreads) => [...prevThreads, ...newThreads]);
      setHasMore(newThreads.length >= 10);
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    } finally {
      setLoading(false);
      fetchedOnce.current = false;
    }
  };

  const handleSeeMoreClick = () => {
    setPage((prevPage) => prevPage + 1);
    console.log("clicked" + page + hasMore + loading)
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

  return (
    <Box sx={{ 
      padding: 3, 
      marginTop: 7, 
      minHeight: '100vh',
      backgroundImage: `url('/images/bg.webp')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      overflowY: 'auto', }}>
      {/* Profile Section */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Profile Picture Placeholder */}
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            backgroundColor: "#ccc",
            marginBottom: 2,
          }}
        />

        {/* Username */}
        {isEditing && username === currentUsername ? (
          <TextField
            label="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
          />
        ) : (
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            {profile?.username || "Unknown User"}
          </Typography>
        )}

        {/* Bio */}
        {isEditing && username === currentUsername ? (
          <TextField
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            sx={{ marginBottom: 2 }}
          />
        ) : (
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            {profile?.bio || "No bio available."}
          </Typography>
        )}

        {/* Joined Date */}
        {profile?.joined && (
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
            Joined {formatDistanceToNow(new Date(profile.joined))} ago
          </Typography>
        )}

        {/* Edit/Save Buttons */}
        {username === currentUsername && (
          <Box sx={{ display: "flex", gap: 2 }}>
            {isEditing ? (
              <Button variant="contained" onClick={handleSave}>
                Save Changes
              </Button>
            ) : (
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* User Threads */}
      <Box sx={{ 
        width: '100%',
        maxWidth: {md: '600px', xl: '900px'},
        marginBottom: 2,
        marginTop: 7,
      }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Threads Posted:
        </Typography>
        {/* Content Section */}
        {/* <Box sx={{ padding: '0px 0px 16px 4px' }}>SORTING SECTION</Box> */}
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
};

export default UserProfile;
