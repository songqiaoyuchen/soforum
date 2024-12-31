import { Toolbar, List, ListItemText, Divider} from '@mui/material';

import { StyledBox, StyledDrawer } from './Sidenav.styles'

import ListItem from '../ListItem';

import HomeIcon from '@mui/icons-material/Home';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';

function Sidenav() {
  return (
    <StyledDrawer
      variant="permanent"
      sx={{ display: {xxs: 'none', sm: 'block'} }}
    >
      <Toolbar />
      <StyledBox>
        <List>
          <ListItem key='Home' text='Home' icon={HomeIcon} href="/"/>
          <ListItem key='Trending' text='Trending' icon={LocalFireDepartmentOutlinedIcon} href="/trending"/>
          <ListItem key='Recent' text='Recent' icon={ScheduleIcon} href="/recent"/>
          <ListItem key='Saved' text='Saved' icon={BookmarkBorderIcon} href="/saved"/>
        </List>
        <Divider sx={{margin: '0px 16px'}}/>
        <List>
          {/* !!NEED TO WRAP HERE LATER!! */}
          <ListItemText primary='CATEGORIES' slotProps={{primary: {fontSize: '16px'}}} sx={{padding: '0px 24px'}}/> 
          {['Tag1', 'Tag2', 'Tag312312', 'tag13234', 'tag5123', 'tag3126', 'tag7123123', 'tag812312', 'tag123129', 'tag10'].map((text) => (
            <ListItem key={text} text={text} icon={TagOutlinedIcon} href="/trending"/>
          ))}
        </List>
      </StyledBox>
    </StyledDrawer>
  )
}

export default Sidenav;
