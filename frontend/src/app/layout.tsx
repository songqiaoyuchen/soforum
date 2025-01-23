import "@styles/global.css";
import { Metadata } from 'next';
import { Box } from '@mui/material';
import Topbar from '@components/Topbar';
import Sidenav from '@components/Sidenav';
import PopupActions from '@components/PopupActions';
import AppProviders from '@providers/AppProviders';
import dynamic from "next/dynamic";
import { Suspense } from "react";
import NavigationListener from "@components/NavListener";

// Dynamically import components that aren't needed for initial render
const LoginDialog = dynamic(() => import('@components/LoginDialog'));
const ProfileMenu = dynamic(() => import('@components/ProfileMenu'));
const Alertbar = dynamic(() => import('@components/Alertbar'));

export const metadata: Metadata = {
  title: 'Soforum',
  description: 'CVWO Forum'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body>
        <AppProviders>
          <NavigationListener />
          <Topbar />
          <Box sx={{ display: 'flex' }}>
            <Sidenav />
            <Box sx={{ flexGrow: 1 }}>{children}</Box>
          </Box>
          <PopupActions />
          <Suspense>
            <LoginDialog />
            <ProfileMenu />
            <Alertbar />
          </Suspense>
        </AppProviders>
      </body>
    </html>
  );
}
