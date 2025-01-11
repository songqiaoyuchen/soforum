'use client'
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { showSnackbar } from '@store/slices/snackbarSlice';
import { deleteThread } from '@api/thread';
import store from '@store';

const options = [
  'Edit',
  'Save'
];

export default function LongMenu(props: {id: number}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleDelete(e: React.MouseEvent<HTMLElement>) {
    try {
      const response = await deleteThread(props.id);
      if (response.success) {
        store.dispatch(showSnackbar({message: 'Thread deleted', severity: 'success'}));
      } else {
        store.dispatch(showSnackbar({message: 'Deletion failed: ' + response.message, severity: 'error'}));
      }
      
    } catch (error) {
      console.error("Unexpected error: ", error);
    }
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        sx={{borderRadius: '5px'}}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              width: '20ch',
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
        <MenuItem key='delete' onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
}
