import React from 'react';
import {
    AppBar,
    Button,
    Container,
    Link,
    Toolbar,
    Typography,
    ButtonGroup,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, handleLogout } = useAuth();

    const handleLogoutClick = () => {
        handleLogout();
        navigate('/');
    };

    return (
        <AppBar position="sticky" color="primary">
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    >
                        UpSkill
                    </Typography>
                    <ButtonGroup variant="text" color="inherit">
                        {isAuthenticated ? (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/dashboard"
                                    color="inherit"
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/templates"
                                    color="inherit"
                                >
                                    Templates
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/resources"
                                    color="inherit"
                                >
                                    Resources
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/contact"
                                    color="inherit"
                                >
                                    Contact
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/about"
                                    color="inherit"
                                    sx={{ mr: 4 }}
                                >
                                    About
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={handleLogoutClick}
                                >
                                    Log Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    color="inherit"
                                >
                                    Login
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    color="inherit"
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </ButtonGroup>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
