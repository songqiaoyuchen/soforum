'use client';

import { useState, useEffect } from 'react';

// Redux
import { useSelector } from 'react-redux';
import store, { RootState } from '@store';
import { closeLoginDialog } from '@store/slices/loginDialogSlice';

import Image from 'next/image';
const frogLook = '/images/frog-look.webp';
const frogClose = '/images/frog-close.webp';
import { Box, Button, TextField, Link, Dialog, 
  DialogActions, DialogTitle, DialogContent, Typography } from '@mui/material';

// Utils
import { validPassword, validUsername } from '@utils/validInputs';
import { userLogin } from '@api/user';
import syncAuth from '@utils/syncAuth';
import { showSnackbar } from '@store/slices/snackbarSlice';

function CustomDialog() { 
  const isOpen = useSelector((state: RootState) => state.loginDialog.isOpen);

  // Toggle to frogClose if password is being typed
  const [typingPassword, setTypingPassword] = useState(false);
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

  function handleClose() {
    setUsername('');
    setPassword('');
    setUsernameError('');
    setPasswordError('');
    setAuthError('');
    setLoading(false);
    store.dispatch(closeLoginDialog());
  }

  function validateInputs() {
    setUsernameError('');
    setPasswordError('');
    setAuthError('');

    if (!validPassword(password)) {
      setPasswordError('Please enter a valid password');
    } 
    if (!validUsername(username)) {
      setUsernameError('Please enter a valid username');
    }
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (usernameError || passwordError) {
      return;
    }

    setLoading(true);
    try {
      const result = await userLogin({username: username, password: password});
      if (result.success) {
        syncAuth()
        store.dispatch(closeLoginDialog());
        store.dispatch(showSnackbar({message: 'Login successful', severity: 'success'}));
      } else {
        store.dispatch(showSnackbar({message: 'Login failed: ' + result.message, severity: 'error'}));
        setAuthError("Login failed: " + result.message); 
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
      open={isOpen}
      onClose={
        (event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }}
        }
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleLogin
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: {xxs: 'column', xs: 'row'},
        justifyContent: 'center',
        backgroundColor: 'background.paper',
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
            Login
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
              href="/user/signup"
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
              onClick={handleClose}
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
              onClick={validateInputs}
              variant="contained" 
              color="primary"
              disabled={loading}
              sx={{
                margin: '0 !important',
                width: {xxs: '100%', sm: '72px'},
              }}
            >
              LOGIN
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