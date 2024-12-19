// External Libraries
import { useState } from 'react';
import { Box, Container, Button } from '@mui/material';

// Local Components
import Dialog from '../../components/Dialog';
import Sidenav from '../../components/Sidenav';
import Topbar from '../../components/Topbar';
import Threads from '../../components/Threads';
import PopupActions from '../../components/SpeedDial';
import ProfilePopup from '../../components/ProfilePopup';

function HomePage() {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function handleProfileClick(event: React.MouseEvent<HTMLElement>) {
    if (isLoggedIn) {
      setAnchorEl(event.currentTarget);
      setProfileOpen((prev) => !prev);
    } else {
      setLoginOpen(true)
    }
  }

  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleLogin() {
    setIsLoggedIn(true);
    setLoginOpen(false)
  };

  return (
    <Box>
      <Topbar onProfileClick={handleProfileClick} />

      <Box sx={{display: 'flex'}}>
        <Sidenav />
        <Threads />
      </Box>

      <ProfilePopup open={isProfileOpen} anchorEl={anchorEl} onClose={() => setProfileOpen(false)}/>
      <PopupActions />
      <Dialog 
        open={isLoginOpen} 
        type="login" 
        onClose={() => setLoginOpen(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleLogin()
          }
        }}
      />
    </Box>
  )  
}

export default HomePage;
