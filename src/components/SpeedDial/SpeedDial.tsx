import { useState } from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];

export default function ControlledOpenSpeedDial() {
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
          backgroundColor: '#15a33c',
          borderRadius: '5px', // Change the background color here
        }
        }}
        icon={<SpeedDialIcon sx={{color: 'white'}}/>}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
  );
}
