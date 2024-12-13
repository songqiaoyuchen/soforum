import { styled } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export const StyledDialog = styled(Dialog) ({
})

export const StyledDialogContent = styled(DialogContent) ({
  '&.MuiDialogContent-root': {
    paddingTop: '18px',  // This will increase the specificity and apply the style properly
  },
})

export const StyledDialogActions = styled(DialogActions)({
  paddingRight: '24px',
  paddingBottom: '24px'
});

export const StyledDialogTitle = styled(DialogTitle)({
  paddingTop: '28px',
  paddingLeft: '25px',
  paddingBottom: '0px'
});



