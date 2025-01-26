'use client';
import { Toolbar, List, ListItemText, Divider, Drawer, useMediaQuery, useTheme } from '@mui/material';

import { StyledBox } from './Sidenav.styles'

import ListItem from '@components/Sidenav/ListItem';

import HomeIcon from '@mui/icons-material/Home';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store';
import { closeSidenav } from '@store/slices/sidenavSlice';


const categories = [
  'General',
  'Technology',
  'Science',
  'Gaming',
  'Movies',
  'Music',
  'Sports',
  'Books',
  'Art',
  'Travel',
  'Food',
  'Academics',
];

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function Sidenav() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.sidenav.isOpen);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Drawer
      anchor={isLargeScreen ? 'left' : 'bottom'}
      variant={isLargeScreen ? "persistent" : "temporary"} // Persistent on large screens
      open={isOpen || isLargeScreen} // Always open on large screens
      onClose={() => dispatch(closeSidenav())} // Close on backdrop click for temporary
      sx={{
        width: {xxs: '100%', xs: '300px'},
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: {xxs: '100%', xs: '300px'},
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <StyledBox>
        <List>
          <ListItem key='Home' text='Home' icon={HomeIcon} href='/'/>
          <ListItem key='Trending' text='Trending' icon={LocalFireDepartmentOutlinedIcon} />
          {/* <ListItem key='Recent' text='Recent' icon={ScheduleIcon} /> */}
          <ListItem key='Saved' text='Saved' icon={BookmarkBorderIcon} href='/saved'/>
        </List>
        <Divider sx={{margin: '0px 16px'}}/>
        <List>
          {/* !!NEED TO WRAP HERE LATER!! */}
          <ListItemText primary='CATEGORIES' slotProps={{primary: {fontSize: '16px'}}} sx={{padding: '0px 24px'}}/> 
          {categories.map((category) => (
            <ListItem key={category} text={capitalizeFirstLetter(category)} icon={TagOutlinedIcon} href={`/${category}`}/>
          ))}
        </List>
      </StyledBox>
    </Drawer>
  )
}

export default Sidenav;
