import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import ProfilePopup from '../ProfilePopup'
import Search from '../Search';
import AccountCircle from '@mui/icons-material/AccountCircle';

interface TopbarProps {
  onProfileClick: (event: React.MouseEvent<HTMLElement>) => void;
}

function Topbar(props: TopbarProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        paddingRight: '0px !important' // To prevent layout change...TBC
      }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'stretch'}}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, 
              display: {xs: 'block', sm: 'none'}
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Forum Title */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            FORUM
          </Typography>
          {/* Spacing Box */}
          <Box sx={{ flexGrow: 1 }} /> 
          {/* Search Field */}
          <Search />
          {/* Profile Icon */}    
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={props.onProfileClick}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>

      </AppBar>

    </Box>
  );
}

export default Topbar;
