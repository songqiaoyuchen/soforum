'use client'
import { useState } from 'react';
import { deleteThread } from '@api/thread';
import { showSnackbar } from '@store/slices/snackbarSlice';
import store from '@store';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';

export default function LongMenu(props: { id: number }) {
  const { id } = props;
  const router = useRouter();
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
      const response = await deleteThread(id);
      if (response.success) {
        store.dispatch(showSnackbar({ message: 'Thread deleted', severity: 'success' }));
      } else {
        store.dispatch(showSnackbar({ message: 'Deletion failed: ' + response.message, severity: 'error' }));
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        sx={{ borderRadius: '5px' }}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem key="edit" onClick={() => router.push(`/threads/${id}/edit`)}>
          Edit
        </MenuItem>
        <MenuItem key="delete" onClick={handleDelete}>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
