import { Box, Toolbar, List, ListItemButton, ListItemIcon, ListItemText,
         Drawer, Divider} from '@mui/material';
import ListItem from '../ListItem';

function Sidenav() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: {xxs: 'none', sm: 'block'},
        width: 260,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: '260px',
          boxSizing: 'border-box'
        }
      }}
    >
      <Toolbar />
      <Box sx={{ 
        // Scrollbar Styling
        overflow: 'hidden', 
        '&:hover': {
          overflowY: 'auto',
        },
        '&::-webkit-scrollbar': {
          width: '10px', 
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#4b7353', 
          borderRadius: '1px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#6BAF8D', 
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#333a3e',
          borderRadius: '1px',
        },
      }}>
        <List>
          {['Home', 'Trending', 'Recent', 'Saved'].map((text) => (
            <ListItem key={text} text={text}/>
          ))}
        </List>
        <Divider sx={{margin: '0px 16px'}}/>
        <List>
          {/* !!NEED TO WRAP HERE LATER!! */}
          <ListItemText primary='CATEGORIES' slotProps={{primary: {fontSize: '16px'}}} sx={{padding: '0px 24px'}}/> 
          {['Tag1', 'Tag2', 'Tag312312', 'tag13234', 'tag5123', 'tag3126', 'tag7123123', 'tag812312', 'tag123129', 'tag10'].map((text) => (
            <ListItem key={text} text={text} />
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidenav;
