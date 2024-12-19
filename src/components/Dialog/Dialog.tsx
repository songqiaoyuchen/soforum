import { useState } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogTitle, DialogContent } from '@mui/material';

// Importing Assets
import frogLook from '../../assets/images/frog-look.png';
import frogClose from '../../assets/images/frog-close.png';

interface CustomDialogProps {
  type: "login" | "signup",
  open: boolean,
  onClose: (event: {}, reason?: "backdropClick" | "escapeKeyDown") => void,
  PaperProps: {
    component: 'form',
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  } 
}

function CustomDialog(props: CustomDialogProps) {
  const [typingPassword, setTypingPassword] = useState(false);

  function toggleFrog() {
    setTypingPassword(!typingPassword);
  }

  return (
    <Dialog {...props} fullWidth>
      <Box sx={{
        display: 'flex',
        flexDirection: {xxs: 'column', xs: 'row'},
        justifyContent: 'center'
      }}>
        {/* Frog Image Left */}
        <Box sx={{
          display: { xxs: 'none', xs: 'flex' },
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <img
            src={typingPassword ? frogClose : frogLook}
            alt="dialog image"
            style={{ 
              width: "100px",
              height: "100px",
              borderRadius: "8px",
              transform: 'scaleX(-1)' 
            }}
          />
        </Box>
              
        <Box sx={{
          width: '100%', 
          maxWidth: {xs: '100%', sm: '70%'}
        }}>
          {/* Form Title */}
          <DialogTitle sx={{paddingTop: '24px'}}>
            {props.type.toLocaleUpperCase()}
          </DialogTitle>

          {/* Input Fields */}
          <DialogContent>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%'
            }}>
              {/* Username Field */}
              <TextField
                label="Username"
                type="text"
                variant="outlined"
                fullWidth
              />
              
              {/* Password Field */}
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                onFocus={toggleFrog}
                onBlur={toggleFrog}
                fullWidth
              />
            </Box>
          </DialogContent>

          {/* Buttons */}
          <DialogActions sx={{
            display: 'flex',
            flexDirection: {xs: 'column', sm: 'row'},
            padding: '0px 24px 24px 24px',
            gap: 1
          }}>
            {/* Cancel button */}
            <Button 
              onClick={(e) => props.onClose(e)} 
              color="secondary"
              sx={{
                width: {xs: '100%', sm: '72px'},
              }}
            >
              Cancel
            </Button>

            {/* Login / Signup button */}
            <Button 
              type='submit'
              variant="contained" 
              color="primary"
              sx={{
                margin: '0 !important',
                width: {xs: '100%', sm: '72px'},
              }}
            >
              {props.type.toLocaleUpperCase()}
            </Button>
          </DialogActions>
        </Box>

        {/* Frog Image Right */}
        <Box sx={{
          display: 'flex',
          flexDirection: {xxs: 'row', xs: 'column'},
          justifyContent: 'flex-end',
        }}>
          <img
            src={typingPassword ? frogClose : frogLook}
            alt="dialog image"
            style={{  
              width: "100px",
              height: "100px",
              borderRadius: "8px",
            }}
          />
        </Box>   
      </Box>
    </Dialog>
  );
}

export default CustomDialog;