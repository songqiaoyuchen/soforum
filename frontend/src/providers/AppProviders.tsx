'use client';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';

import store, { persistor } from '@store';
import theme from '@styles/theme';
import { PersistGate } from 'redux-persist/integration/react';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {/* !!! Styled loading page later */}
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}> 
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
