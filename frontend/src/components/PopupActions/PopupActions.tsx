'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import CreateIcon from '@mui/icons-material/Create';

function ControlledOpenSpeedDial() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
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
        onClick={() => router.push("/post")}
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
