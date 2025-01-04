'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import store, { RootState } from '@store';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import CreateIcon from '@mui/icons-material/Create';
import { showSnackbar } from '@store/slices/snackbarSlice';

function ControlledOpenSpeedDial() {
  const router = useRouter();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }

  function handleClickPen() {
    if (isLoggedIn) {
      router.push('/post');
    } else {
      store.dispatch(showSnackbar({message: 'Please login to post', severity: 'info'}));
    }
  }

  return (
    <SpeedDial
      ariaLabel="SpeedDial Actions"
      sx={{ 
        position: 'fixed', 
        bottom: 16, right: 16, 
        '& .MuiSpeedDial-fab': {
        borderRadius: '45px'
      }
      }}
      icon={<SpeedDialIcon sx={{color: 'white'}}/>}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      
    >
      <SpeedDialAction
        key="PostText"
        icon={<CreateIcon />}
        onClick={handleClickPen}
        tooltipTitle="Post Text"
        sx={{
          color: 'white',
          backgroundColor: 'primary.light'
        }}
      />
    </SpeedDial>
  );
}

export default ControlledOpenSpeedDial;
