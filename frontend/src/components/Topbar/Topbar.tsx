'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Search from '@components/Topbar/Search';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store';
import { openLoginDialog } from '@store/slices/loginDialogSlice';
import { toggleSidenav } from '@store/slices/sidenavSlice';
import { Chip } from '@mui/material';
import { openMenu } from '@store/slices/menuSlice';
import { useRouter } from 'next/navigation';

function Topbar() {
  const router = useRouter();
  const dispatch = useDispatch(); 
  const username = useSelector((state: RootState) => state.auth.username);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  function onProfileClick() {
    if (isLoggedIn) {
      dispatch(openMenu());
    } else {
      dispatch(openLoginDialog());
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgb(7, 46, 10)',
        paddingRight: '0px !important' // To prevent layout change...TBC
      }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'stretch'}}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, 
              display: {sm: 'block', md: 'none'}
            }}
            onClick={() => dispatch(toggleSidenav())}
          >
            <MenuIcon />
          </IconButton>

          {/* Forum Title */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => router.push('/')}
            sx={{ display: { xxs: 'none', sm: 'block' } }}
          >
            FORUM
          </Typography>
          {/* Spacing Box */}
          <Box sx={{ flexGrow: 1 }} /> 
          {/* Search Field */}
          <Search />
          {/* Profile Icon */}    
          <Chip
            label={username || "LOGIN"}
            variant="filled"
            onClick={onProfileClick}
            sx={{
              height: 40, width: 90,
              backgroundColor: 'primary.main',
              borderRadius: '25px'
            }}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Topbar;
