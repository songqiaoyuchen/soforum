'use client'
import { useState } from 'react';
import { showSnackbar } from '@store/slices/snackbarSlice';
import store from '@store';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { deleteComment } from '@api/comment';

export default function CommentActions(props: { id: number; onEdit: () => void }) {
  const { id, onEdit } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
  };

  async function handleDelete() {
    try {
      const response = await deleteComment(id);
      if (response.success) {
        store.dispatch(showSnackbar({ message: 'Comment deleted', severity: 'success' }));
      } else {
        store.dispatch(showSnackbar({ message: 'Deletion failed: ' + response.message, severity: 'error' }));
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu id="long-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem key="edit" onClick={() => { onEdit(); handleClose(); }}>
          Edit
        </MenuItem>
        <MenuItem key="delete" onClick={handleDelete}>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
