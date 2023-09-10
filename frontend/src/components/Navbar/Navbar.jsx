import React from 'react';
import {
    AppBar,
    Button,
    Container,
    Toolbar,
    Typography,
    ButtonGroup,
    IconButton,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { userApiSlice } from '@/features/user/userApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { changeMode, selectMode } from '@/features/user/userSlice';
import { useCookies } from 'react-cookie';

const Navbar = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();
    const [cookie, setCookie, removeCookie] = useCookies();
    const handleLogoutClick = async () => {
        await dispatch(userApiSlice.endpoints.logout.initiate());
        removeCookie('jwt_token', { path: '/' });
        window.location.reload();

    };
    const mode = useSelector(selectMode);

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
                        {!!token ? (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/dashboard"
                                    color="inherit"
                                >
                                    Dashboard
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
                    <IconButton onClick={() => dispatch(changeMode())}>
                        <Brightness4Icon
                            sx={{
                                transition: 'transform 0.4s',
                                transform:
                                    mode === 'dark'
                                        ? 'rotateY(180deg)'
                                        : 'rotateY(0deg)',
                            }}
                        />
                    </IconButton>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
