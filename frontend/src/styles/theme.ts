import { createTheme, ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  breakpoints: {
    values: {
      ...createTheme().breakpoints.values, // Include default breakpoints
      xs: 425,
      xxs: 0,
    }},
  palette: {
    mode: 'dark',
    primary: {
      main: '#4fa852',
      light: '#2d5c2e',
      dark: '#3bde44',
      contrastText: 'rgba(255,255,255,0.87)',
    },
    secondary: {
      main: '#c93156',
    },
    text: {
      primary: '#c6eac1',
    },
    background: {
      default: '#031401',
      paper: '#031401',
    },
  },
};

const theme = createTheme(themeOptions as ThemeOptions);

export default theme;