import {useState} from 'react';
import { Button, TextField, Box } from '@mui/material';
import { StyledDialog, StyledDialogContent, StyledDialogTitle, StyledDialogActions, 
         Image, ImageBox } from './Dialog.style';
import frogLook from '../../assets/images/frog-look.png';
import frogClose from '../../assets/images/frog-close.png'

interface DialogProps {
    open: boolean;
    onClose: (event: Object, reason: String) => void;
    type: 'login' | 'signup';
    onLogin: (event: Object, reason: String) => void;
  }

function CustomDialog(props: DialogProps) {

    const [typingPassword, setTypingPassword] = useState(false);

    function toggleFrog() {
        setTypingPassword(!typingPassword);
    }

    return (
        <StyledDialog {...props} fullWidth>
            <Box display="flex" justifyContent="center">
                <ImageBox>
                    <Image
                    src={typingPassword ? frogClose : frogLook}
                    alt="dialog image"
                    style={{ transform: 'scaleX(-1)' }}
                    />
                </ImageBox>
                
                <Box width="100%" maxWidth="70%">
                    <StyledDialogTitle>{props.type === "login" ? "Login" : "Signup"}</StyledDialogTitle>

                    {/* Input Fields */}
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

                    {/* Buttons */}
                    <StyledDialogActions>
                        {/* Cancel button */}
                        <Button onClick={(e) => props.onClose(e, 'trivial')} color="secondary">
                            Cancel
                        </Button>

                        {/* Login / Signup button */}
                        <Button onClick={(e) => {
                            props.onLogin(e, "trivial");
                        }} variant="contained" color="primary">
                            {props.type}
                        </Button>
                    </StyledDialogActions>
                </Box>

                <ImageBox>
                    <Image
                    src={typingPassword ? frogClose : frogLook}
                    alt="dialog image"
                    />
                </ImageBox>
                    
            </Box>
      </StyledDialog>
    );
}

export default CustomDialog;