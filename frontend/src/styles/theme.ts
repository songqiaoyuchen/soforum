import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  breakpoints: {
    values: {
      ...createTheme().breakpoints.values, // Include default breakpoints
      xs: 425,
      xxs: 0,
    }},
  palette: {
    mode: 'dark',
    primary: {
      main: '#19d26b',
    },
    secondary: {
      main: '#de37a3',
    },
    text: {
      primary: '#cbe2cd',
    },
    background: {
      default: '#121212',
      paper: '#121212',
    },
  },
};

const theme = createTheme(themeOptions as ThemeOptions);

export default theme;