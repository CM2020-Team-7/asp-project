import { Box, Stack, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import AuthOutlet from './AuthOutlet';
import { userApiSlice } from '@/features/user/userApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/features/user/userSlice';
import { useCookies } from 'react-cookie';

function Register() {
    const name = useRef(null);
    const surname = useRef(null);

    const username = useRef(null);
    const password = useRef(null);
    const passwordConf = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cookies, setCookie] = useCookies(['jwt_token']);

    const registerHandler = async (e) => {
        e.preventDefault();
        const FirstName = name.current.value.replace(/\s+/g, '');
        const LastName = surname.current.value.replace(/\s+/g, '');

        const Username = username.current.value.replace(/\s+/g, '');
        const Password = password.current.value.replace(/\s+/g, '');
        const pwdConf = passwordConf.current.value.replace(/\s+/g, '');
        if (FirstName === '') {
            // 'Please enter name.'
            name.current.focus();
        } else if (LastName === '') {
            // 'Please enter surname.'
            surname.current.focus();

        } else if (Username === '') {
            // 'Please enter username.'
            username.current.focus();
            // } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{1,20}$/.test(Username)) {
            //     // 'Please enter real username.'
            //     username.current.focus();
        } else if (Password === '') {
            // 'Please enter password.'
            password.current.focus();
        } else if (pwdConf === '') {
            // 'Please enter password again.'
            passwordConf.current.focus();
        } else if (Password !== pwdConf) {
            // 'Passwords do not match.'
            password.current.focus();
        } else if (Password.length < 6) {
            // 'Password must be at least 6 characters.'
            password.current.focus();
        } else if (
            !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(
                Password,
            )
        ) {
            // 'Password must contain at least one uppercase letter, one lowercase letter and one number.',
            password.current.focus();
        } else {
            try {
                const res = await dispatch(
                    userApiSlice.endpoints.register.initiate({
                        firstName: FirstName,
                        lastName: LastName,
                        username: Username,
                        passwd: Password,
                    }),
                );
                dispatch(
                    setCredentials({
                        AccessToken: res.data.token,
                        User: res.data.user,
                    }),
                );
                setCookie('jwt_token', res.data.token, 30);

                navigate('/dashboard');
            } catch (error) {
                console.error(error);
            }
        }
    };

    /** Focus name input when component mounted. */
    useEffect(() => {
        name.current.focus();
    }, []);

    return (
        <AuthOutlet>
            <Stack direction="row" gap={3} sx={{ alignItems: 'center' }}>
                <TextField
                    inputRef={name}
                    label="Name"
                    type="text"
                    variant="outlined"
                    autoComplete="off"
                />
                <TextField
                    inputRef={surname}
                    label="Surname"
                    type="text"
                    variant="outlined"
                    autoComplete="off"
                />
            </Stack>
            <TextField
                inputRef={username}
                type="username"
                label="Username"
                variant="outlined"
                autoComplete="off"
            />
            <TextField
                inputRef={password}
                type="password"
                autoComplete="new-password"
                label="Password"
                variant="outlined"
            />
            <TextField
                inputRef={passwordConf}
                hidden
                type="password"
                autoComplete="new-password"
                label="Password (again)"
                variant="outlined"
            />

            <Button variant="contained" onClick={registerHandler}>
                Sign Up
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body2" component="p">
                    Alredy have an account?
                </Typography>
                <Link
                    variant="body2"
                    sx={{ display: 'inline', ml: 1 }}
                    onClick={() => navigate('/login')}
                >
                    Sign In
                </Link>
            </Box>
        </AuthOutlet>
    );
}

export default Register;
