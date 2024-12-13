import { useState } from 'react';
import Dialog from "../../components/Dialog";
import {Box, Button} from '@mui/material';

const LoginPopup = () => {
  const [open, setOpen] = useState(false); 

  function toggleOpen(event: Object, reason: String): void {
    if (reason !== 'backdropClick') {
      setOpen(!open);  
    }
  }

  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
      }}
    >

      {/* Login Button */}
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Login
      </Button>

      {/* Login Form */}
      <Dialog 
        open={open} 
        onClose={toggleOpen} 
        type="login" 
      />
      
    </Box>
  );
};

export default LoginPopup;
