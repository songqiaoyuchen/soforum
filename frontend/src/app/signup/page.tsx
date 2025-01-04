'use client';
// To be separated into a compoennt dialog
// Essentials
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Utils Functions
import { validPassword, validEmail, validUsername } from '@utils/validInputs';

// MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// Custom Components
import { Card, SignUpContainer} from './styles';

// Static Assets
import { GoogleIcon } from '../../../public/icons/customIcons';

interface SignupData {
  username: string;
  email: string;
  password: string;
}

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [serverMessage, setServerMessage] = useState('');

  function resetMsgs() {
    setEmailError('');
    setPasswordError('');
    setUsernameError('');
    setServerMessage('');
  }

  function resetInputs() {
    setUsername('');
    setEmail('');
    setPassword('');
  }

  function validateInputs() {
    resetMsgs();

    if (!validEmail(email)) {
      setEmailError('Please enter a valid email address.');
    } 
    if (!validPassword(password)) {
      setPasswordError('Password must be at least 8 characters long and contain at least one number and one letter.');
    } 
    if (!validUsername(username)) {
      setUsernameError('Username must be at least 3 characters long.');
    }
  };

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (usernameError || emailError || passwordError) {
      return;
    }

    const formData: SignupData = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post('http://localhost:8080/signup', formData);
      if (response.status === 201) {
        console.log('Signup successful:', response.data.message);
        setServerMessage('Signup successful!');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        console.error('Signup failed:', err.response.data.error);
        setServerMessage(`Signup failed: ${err.response.data.error || 'Invalid input or missing fields'}`);
      } else {
        console.error('Unexpected error:', err);
        setServerMessage('Sorry, an unexpected error occurred');
      }
    } finally {
      resetInputs();
    }
  }

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Sign up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSignup}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <FormControl>
            <TextField
              label="Username"
              required
              fullWidth
              autoComplete='off'
              value={username}
              error={usernameError != ''}
              helperText={usernameError}
              color={usernameError ? 'error' : 'primary'}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <TextField
              required
              fullWidth
              autoComplete='off'
              label="Email"
              variant="outlined"
              error={emailError != ''}
              value={email}
              helperText={emailError}
              color={passwordError ? 'error' : 'primary'}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <TextField
              required
              fullWidth
              autoComplete='off'
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              error={passwordError != ''}
              helperText={passwordError}
              color={passwordError ? 'error' : 'primary'}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          {serverMessage && 
              <Typography 
                color={serverMessage=="Signup successful!" ? "success" : "error"}
                fontSize={14}
                textAlign={'center'}>
                {serverMessage}
              </Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            Sign up
          </Button>
        </Box>
        <Divider>
          <Typography sx={{ color: 'text.secondary' }}>or</Typography>
        </Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert('Yet to implement lol')}
            startIcon={<GoogleIcon />}
          >
            Sign up with Google
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Link
              href="/"
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Card>
    </SignUpContainer>
  );
}

export default SignUp;
