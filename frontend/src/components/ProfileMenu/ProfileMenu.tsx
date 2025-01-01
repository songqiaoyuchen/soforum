import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import LogoutIcon from '@mui/icons-material/Logout';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useMediaQuery, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import store, { RootState } from '@store';
import { closeMenu } from '@store/menuSlice';
import { clearAuthState } from '@store/authSlice';


function ProfilePopup() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const isOpen = useSelector((state: RootState) => state.menu.isOpen);

  function handleClose() {
    store.dispatch(closeMenu())
  }

  function handleLogout() {
    store.dispatch(clearAuthState());
    sessionStorage.removeItem('jwt');
    store.dispatch(closeMenu());
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
        <MenuItem>
          <ListItemIcon>
            <ContentCut fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cut</ListItemText>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ⌘X
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ⌘C
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Paste</ListItemText>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ⌘V
          </Typography>
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

