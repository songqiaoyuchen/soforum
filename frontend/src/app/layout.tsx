'use client';

import "@styles/style.css";

import { Box } from '@mui/material';
import Topbar from '@components/Topbar';
import Sidenav from '@components/Sidenav';
import ProfileMenu from '@components/ProfileMenu';
import LoginDialog from '@components/LoginDialog';
import PopupActions from '@components/PopupActions';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { initializeAuth } from '@utils/syncAuth';
import AppProviders from '@providers/AppProviders';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (pathname.startsWith('/signup')) {
    return <>{children}</>;
  }

  return (
    <html lang="en">
      <head />
      <body>
        <AppProviders>
          <Box>
            <Topbar />
            <Box sx={{ display: 'flex' }}>
              <Sidenav />
              <Box sx={{ flexGrow: 1 }}>{children}</Box>
            </Box>
            <PopupActions />
            <ProfileMenu />
            <LoginDialog />
          </Box>
        </AppProviders>
      </body>
    </html>
  );
}
