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
      main: 'rgba(53, 177, 84, 0.87)',
      light: 'rgba(113, 216, 144, 0.87)',
      dark: 'rgba(16, 73, 33, 0.87)',
      contrastText: 'rgba(255,255,255,1)',
    },
    secondary: {
      main: '#c93156',
    },
    text: {
      primary: 'rgb(221, 255, 233)',
    },
    background: {
      default: 'rgb(1, 22, 8)',
      paper: 'rgb(12, 29, 16)',
    },
  },
};

const theme = createTheme(themeOptions as ThemeOptions);

export default theme;