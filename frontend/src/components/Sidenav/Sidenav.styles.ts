import { styled } from "@mui/material/styles";
import { Box, Drawer } from "@mui/material";


export const StyledBox = styled(Box)({
  // Scrollbar Styling
  overflow: 'hidden',
  '&:hover': {
    overflowY: 'auto',
  },
  '&::-webkit-scrollbar': {
    width: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#4b7353',
    borderRadius: '1px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#6BAF8D',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#333a3e',
    borderRadius: '1px',
  },
});

export const StyledDrawer = styled(Drawer)({
  width: 260,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: '260px',
    boxSizing: 'border-box',
  },
});