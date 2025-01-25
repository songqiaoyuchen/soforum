'use client'
import { useState } from 'react';
import { deleteThread } from '@api/thread';
import { showSnackbar } from '@store/slices/snackbarSlice';
import store, { RootState } from '@store';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function ThreadActionMenu(props: { id: number, ownername: string}) {
  const { id, ownername } = props;
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const username = useSelector((state: RootState) => state.auth.username);

  if (username !== ownername) {
    return null;
  }

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
  };

  async function handleDelete() {
    try {
      const response = await deleteThread(id);
      if (response.success) {
        store.dispatch(showSnackbar({ message: 'Thread deleted', severity: 'success' }));
        router.push("/")
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
