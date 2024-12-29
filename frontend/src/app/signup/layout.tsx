'use client';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from "@styles/theme"; 
import "@styles/style.css"; 

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body>
        <ThemeProvider theme={theme}> 
          <CssBaseline />  
          {children} 
        </ThemeProvider>
      </body>
    </html>
  );
}