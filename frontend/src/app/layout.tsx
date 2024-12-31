'use client';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import { Provider } from 'react-redux';
import store, { persistor } from '@store';

import theme from "@styles/theme";
import "@styles/style.css"; 

import { Box } from '@mui/material';
import Topbar from '@components/Topbar';
import Sidenav from '@components/Sidenav';
import ProfilePopup from '@components/ProfileMenu';
import LoginDialog from '@components/LoginDialog';
import PopupActions from '@components/PopupActions';


import { usePathname } from 'next/navigation';
import { PersistGate } from 'redux-persist/integration/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Skip wrapping `/signup` with RootLayout
  if (pathname.startsWith('/signup')) {
    return <>{children}</>;
  }

  return (
    <html lang="en">
      <head />
      <body>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}> 
            <CssBaseline />  
              <Box>
              <Topbar />

              <Box sx={{ display: 'flex' }}>
                <Sidenav />
                <Box sx={{ flexGrow: 1 }}>{children}</Box>
              </Box>

              <PopupActions />

              <ProfilePopup />

              <LoginDialog />
            </Box>
          </ThemeProvider>
        </PersistGate>
      </Provider>
      </body>
    </html>
  );
}



