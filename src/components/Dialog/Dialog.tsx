import {useState} from 'react';
import { Button, TextField, Box } from '@mui/material';
import { StyledDialog, StyledDialogContent, StyledDialogTitle, StyledDialogActions } from './Dialog.style';
import frogLook from '../../assets/images/frog-look.png';
import frogClose from '../../assets/images/frog-close.png'

interface DialogProps {
    open: boolean;
    onClose: (event: Object, reason: String) => void;
    type: 'login' | 'signup';
  }

function CustomDialog(props: DialogProps) {

    const [typingPassword, setTypingPassword] = useState(false);

    function toggleFrog() {
        setTypingPassword(!typingPassword);
    }

    return (
        <StyledDialog {...props} fullWidth>
            <Box display="flex" justifyContent="center">
                <Box  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    height: '300px',
                }}>
                    <img
                    src={typingPassword ? frogClose : frogLook}
                    alt="dialog image"
                    style={{ width: "100px", 
                             height: "100px", 
                             borderRadius: "8px",
                             transform: 'scaleX(-1)' }}
                    />
                </Box>
                
                <Box width="100%" maxWidth="70%">
                    <StyledDialogTitle>{props.type === "login" ? "Login" : "Signup"}</StyledDialogTitle>
                    <StyledDialogContent>
                    <Box display="flex" flexDirection="column" gap={2} width="100%">
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
                        onFocus={toggleFrog}
                        onBlur={toggleFrog}
                        fullWidth
                        />
                    </Box>
                    </StyledDialogContent>
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
                </Box>
                <Box  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    height: '300px', 
                }}>
                    <img
                    src={typingPassword ? frogClose : frogLook}
                    alt="dialog image"
                    style={{ width: "100px", height: "100px", borderRadius: "8px" }}
                    />
                </Box>
            </Box>
      </StyledDialog>
    );
}

export default CustomDialog;