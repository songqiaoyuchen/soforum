'use client';

import { useState } from 'react';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import CreateIcon from '@mui/icons-material/Create';
import { Link } from '@mui/material';

function ControlledOpenSpeedDial() {
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
        key="Share"
        icon={<Link href={"/post"} sx={{height: '24px', color: 'white'}}><CreateIcon /></Link>}
        tooltipTitle="Share"
      />
    </SpeedDial>
  );
}

export default ControlledOpenSpeedDial;
