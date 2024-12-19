import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useMediaQuery, useTheme } from '@mui/material';


interface ProfilePopupProps {
  open: boolean,
  anchorEl: HTMLElement | null,
  onClose: () => void
}

function ProfilePopup(props: ProfilePopupProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <SwipeableDrawer
      anchor={isSmallScreen ? 'bottom' : 'right'}
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onClose}
      sx={{zIndex: 1300}}
    >
      <MenuList sx={{
        width: {xxs: '100%', xs: '300px'}
      }}>
        <MenuItem onClick={props.onClose}>
          <ListItemIcon>
            <ContentCut fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cut</ListItemText>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ⌘X
          </Typography>
        </MenuItem>
        <MenuItem onClick={props.onClose}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ⌘C
          </Typography>
        </MenuItem>
        <MenuItem onClick={props.onClose}>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Paste</ListItemText>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ⌘V
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <Cloud fontSize="small" />
          </ListItemIcon>
          <ListItemText>Web Clipboard</ListItemText>
        </MenuItem>
      </MenuList>
    </SwipeableDrawer>
  )
}

export default ProfilePopup;

