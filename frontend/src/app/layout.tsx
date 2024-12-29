'use client';

import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import theme from "@styles/theme";
import "@styles/style.css"; 

import { Box } from '@mui/material';
import Topbar from '@components/Topbar';
import Sidenav from '@components/Sidenav';
import ProfilePopup from '@components/ProfilePopup';
import Dialog from '@components/LoginDialog';
import PopupActions from '@/components/PopupActions';

import { userLogin } from '@/api/user';
import { validToken } from '@/utils/validation';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);
  const pathname = usePathname();

  // Skip wrapping `/signup` with RootLayout
  if (pathname.startsWith('/signup')) {
    return <>{children}</>;
  }

  // Handle profile button click (check token and handle popups)
  function handleProfileClick(event: React.MouseEvent<HTMLElement>) {
    const token = sessionStorage.getItem('jwtToken');

    if (validToken(token)) {
      setAnchorEl(event.currentTarget);
      setProfileOpen((prev) => !prev);
    } else {
      setLoginDialogOpen(true);
    }
  }

  async function handleLogin(formData: { username: string; password: string }) {
    const result = await userLogin(formData);
    if (result.success) {
      setLoginDialogOpen(false);
    } else {
      return(result.message);
    }
  }

  // Handle logout
  function handleLogout() {
    sessionStorage.removeItem('jwtToken');
  }

  return (
    <html lang="en">
      <head />
      <body>
        <ThemeProvider theme={theme}> 
          <CssBaseline />  
            <Box>
            <Topbar onProfileClick={handleProfileClick} />

            <Box sx={{ display: 'flex' }}>
              <Sidenav />
              <Box sx={{ flexGrow: 1 }}>{children}</Box>
            </Box>

            <PopupActions />

            <ProfilePopup
              open={isProfileOpen}
              anchorEl={anchorEl}
              onClose={() => setProfileOpen(false)}
              onLogout={handleLogout}
            />

            <Dialog
              open={isLoginDialogOpen}
              type="login"
              onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                  setLoginDialogOpen(false);
                }
              }}
              onSubmit={handleLogin}
            />
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}



