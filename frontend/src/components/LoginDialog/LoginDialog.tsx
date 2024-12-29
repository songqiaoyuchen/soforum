'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Box, Button, TextField, Link, Dialog, 
  DialogActions, DialogTitle, DialogContent, Typography } from '@mui/material';

import { validPassword, validUsername } from '@/utils/validation';

const frogLook = '/images/frog-look.webp';
const frogClose = '/images/frog-close.webp';

interface CustomDialogProps {
  type: "login" | "signup",
  open: boolean,
  onClose: (event?: {}, reason?: "backdropClick" | "escapeKeyDown") => void,
  onSubmit: (formData: { username: string; password: string; }) => Promise<string | undefined>
}

function CustomDialog(props: CustomDialogProps) {
  // Frog image state
  const [typingPassword, setTypingPassword] = useState(false);

  // Toggle to frogClose if password is being typed
  function toggleFrog() {
    if (password) {
      setTypingPassword(true);
    } else {
      setTypingPassword(false);
    }
  }

  // Login states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Track password changes to toggle frog image
  useEffect(() => {
    toggleFrog();
  }, [password]);

  function resetFields() {
    setUsername('');
    setPassword('');
    setUsernameError('');
    setPasswordError('');
    setAuthError('');
    setLoading(false);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Reset error messages
    setAuthError('');
    setUsernameError('');
    setPasswordError('');

    // Input validation before submitting request    
    if (!validPassword(password)) {
      setPasswordError('Please enter a valid password');
    } 
    if (!validUsername(username)) {
      setUsernameError('Please enter a valid username');
    }

    setLoading(true);
    try {
      const errorMessage = await props.onSubmit({ username, password });
      if (errorMessage) {
        setAuthError("Login failed: " + errorMessage); 
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setAuthError('Sorry: an unexpected error occurred');
    } finally {
      setLoading(false);
      setUsername('');
      setPassword('');
    }
  };

  return (
    <Dialog 
      open={props.open}
      onClose={
        (event, reason) => {
          if (reason !== 'backdropClick') {
            resetFields();
            props.onClose(event, reason);
          }}
        }
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: props.onSubmit
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: {xxs: 'column', xs: 'row'},
        justifyContent: 'center',
        backgroundColor: '#2b2b2b',
      }}>
        {/* Frog Image Left */}
        <Box sx={{
          display: { xxs: 'none', xs: 'flex' },
          flexDirection: 'column',
          justifyContent: 'flex-end',
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          <Image
            src={typingPassword ? frogClose : frogLook} 
            alt="dialog image"
            width={100}  
            height={100} 
            style={{
              borderRadius: '8px',
              transform: 'scaleX(-1)' 
            }}
          />
        </Box>
              
        <Box sx={{
          width: '100%', 
          maxWidth: {xxs: '100%', sm: '70%'}
        }}>
          {/* Form Title */}
          <DialogTitle sx={{paddingTop: '24px', paddingBottom: '0px'}}>
            {props.type.toUpperCase()}
          </DialogTitle>

          {/* Input Fields */}
          <DialogContent sx={{paddingBottom: '0px'}}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              marginTop: '24px',
              width: '100%'
            }}>
              {/* Username Field */}
              <TextField
                label="Username"
                type="text"
                variant="outlined"
                autoComplete='off'
                fullWidth
                value={username}
                error={usernameError !== ''}
                helperText={usernameError}
                onChange={(e) => setUsername(e.target.value)}
              />
              
              {/* Password Field */}
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                autoComplete='off'
                fullWidth
                value={password}
                error={passwordError !== ''}
                helperText={passwordError}
                onChange={(e) => {setPassword(e.target.value)}}
              />
            </Box>
          </DialogContent>

          {/* Signup Link */}
          <Typography sx={{ textAlign: 'center', padding: '10px', fontSize: 14 }}>
            No account yet?{' '}
            <Link
              href="/signup"
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Sign up
            </Link>
            </Typography>
            
            {/* Authentication Error Message */}
            {authError && 
              <Typography 
                marginBottom="14px" 
                color="error" 
                fontSize={14}
                textAlign={'center'}>
                {authError}
              </Typography>}
            
          {/* Buttons */}
          <DialogActions sx={{
            display: 'flex',
            flexDirection: {xxs: 'column', sm: 'row'},
            padding: '0px 24px 24px 24px',
            gap: 1
          }}>
            {/* Cancel button */}
            <Button 
              onClick={() => {
                resetFields();
                props.onClose();
              }} 
              color="secondary"
              sx={{
                width: {xxs: '100%', sm: '72px'},
              }}
            >
              Cancel
            </Button>

            {/* Login / Signup button */}
            <Button 
              type='submit'
              onClick={handleFormSubmit}
              variant="contained" 
              color="primary"
              disabled={loading}
              sx={{
                margin: '0 !important',
                width: {xxs: '100%', sm: '72px'},
              }}
            >
              {loading ? "..." : props.type.toLocaleUpperCase()}
            </Button>
          </DialogActions>
        </Box>

        {/* Frog Image Right */}
        <Box sx={{
          display: 'flex',
          flexDirection: {xxs: 'row', xs: 'column'},
          justifyContent: 'flex-end',
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          <Image
            src={typingPassword ? frogClose : frogLook} 
            alt="dialog image"
            width={100} 
            height={100}
            style={{
              borderRadius: '8px',
            }}
          />
        </Box>   
      </Box>
    </Dialog>
  ); 
}

export default CustomDialog;