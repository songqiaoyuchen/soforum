'use client';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';

import store from '@store';
import theme from '@styles/theme';
import { useEffect } from 'react';
import syncAuth from '@utils/syncAuth';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    syncAuth();
  }, []);
  
  return (
    <Provider store={store}>
      {/* !!! Styled loading page later */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
