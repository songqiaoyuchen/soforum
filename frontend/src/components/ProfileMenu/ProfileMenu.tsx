'use client';

import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useMediaQuery, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import store, { RootState } from '@store';
import { closeMenu } from '@store/slices/menuSlice';
import { clearAuthState } from '@store/slices/authSlice';
import { AccountBox } from '@mui/icons-material';
import { useRouter } from 'next/navigation';


function ProfilePopup() {
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const isOpen = useSelector((state: RootState) => state.menu.isOpen);
  const username = useSelector((state: RootState) => state.auth.username)

  function handleClose() {
    store.dispatch(closeMenu())
  }

  function handleLogout() {
    store.dispatch(clearAuthState());
    sessionStorage.removeItem('jwt');
    store.dispatch(closeMenu());
  }

  function onProfileClick() {
    router.push(`/user/${username}`)
    store.dispatch(closeMenu())
  }

  return (
    <SwipeableDrawer
      anchor={isSmallScreen ? 'bottom' : 'right'}
      open={isOpen}
      onClose={handleClose}
      onOpen={handleClose}
      sx={{zIndex: 1300}}
    >
      <MenuList sx={{
        width: {xxs: '100%', xs: '300px'}
      }}>
        <MenuItem onClick={onProfileClick}>
          <ListItemIcon>
            <AccountBox />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </MenuList>
    </SwipeableDrawer>
  )
}

export default ProfilePopup;

