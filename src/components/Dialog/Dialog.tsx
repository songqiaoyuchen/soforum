import { Dialog, DialogTitle, DialogContent, Button, TextField, Box } from '@mui/material';
import { StyledDialogTitle, StyledDialogActions } from './Dialog.style';

interface DialogProps {
    open: boolean;
    onClose: (event: Object, reason: String) => void;
    type: 'login' | 'signup';
  }

function CustomDialog(props: DialogProps) {
    return (
        <Dialog {...props}>
            <StyledDialogTitle>{props.type === "login" ? "Login" : "Signup"}</StyledDialogTitle>
            <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} width={300}>
                {/* Username Field */}
                <TextField
                label="Username"
                type="text"
                variant="outlined"
                fullWidth
                />
                {/* Password Field */}
                <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                />
            </Box>
            </DialogContent>
            <StyledDialogActions>
                {/* Cancel Button */}
                <Button onClick={(e) => props.onClose(e, 'trivial')} color="secondary">
                    Cancel
                </Button>
                {/* Login / Signup Button */}
                <Button onClick={(e) => props.onClose(e, 'trivial')} variant="contained" color="primary">
                    {props.type}
                </Button>
            </StyledDialogActions>
      </Dialog>
    );
}

export default CustomDialog;