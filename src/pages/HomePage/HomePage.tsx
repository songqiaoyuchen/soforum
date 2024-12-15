import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dialog from '../../components/Dialog';
import {Box, Button} from '@mui/material';

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOpen, setIsOpen] = useState(false); 
    const navigate = useNavigate();


    
    function toggleOpen(event: Object, reason: String): void {
        if (reason !== 'backdropClick') {
        setIsOpen(!isOpen);  
        }
    }

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    if (!isLoggedIn) {
        return (
            <Box 
                sx={{
                display: 'flex',
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100vh',
                }}
            >
      
            {/* Login Button */}
            <Button variant="contained" color="primary" onClick={() => setIsOpen(true)}>
              Login
            </Button>
      
            {/* Login Form */}
            <Dialog 
                open={isOpen} 
                onClose={toggleOpen} 
                type="login" 
                onLogin={handleLogin} 
            />
            </Box>
        );
    }

    return (
        <div>
            <h1>Home Page</h1>
            <button onClick={() => navigate('/profile')}>Go to Profile</button>
        </div>
    );
};

export default HomePage;