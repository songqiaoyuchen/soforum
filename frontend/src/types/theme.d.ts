/* eslint-disable @typescript-eslint/no-unused-vars */

import { BreakpointOverrides } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true; 
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxs: true; // Custom breakpoint
  }
}
