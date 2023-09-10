import React from 'react';
import {
    AppBar,
    Box,
    Container,
    Grid,
    IconButton,
    Link,
    Typography,
    Button,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useSelector } from 'react-redux';

const Footer = () => {
    const token = useSelector((state) => state.user.token);
    const isAuthenticated = !!token;
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                zIndex: 9999, // Adjust this to control the stacking order
                '& .MuiAppBar-root': {
                    top: 'auto', // Reset the top position for the AppBar
                },
            }}
        >
            <AppBar
                position="sticky"
                color="primary"
                sx={{
                    backgroundColor: (theme) => theme.palette.primary.secondary,
                    color: 'white',
                    flexDirection: 'row',
                    py: 1,
                    '& .MuiTypography-subtitle1': {
                        '& a': {
                            color: 'inherit',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        },
                    },
                    '& .MuiButton-contained': {
                        fontSize: '1.5rem',
                        padding: '12px 24px',
                        backgroundColor: (theme) =>
                            theme.palette.secondary.main,
                        '&:hover': {
                            backgroundColor: (theme) =>
                                theme.palette.secondary.dark,
                        },
                    },
                    '& .MuiIconButton-root': {
                        color: 'inherit',
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Grid container alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1">
                                <Link href="#" color="inherit">
                                    Imprint
                                </Link>
                            </Typography>
                            <Typography variant="subtitle1">
                                <Link href="#" color="inherit">
                                    Data Security
                                </Link>
                            </Typography>
                            <Typography variant="subtitle1">
                                <Link href="#" color="inherit">
                                    Terms
                                </Link>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            {isAuthenticated ? (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    href="/dashboard"
                                    sx={{
                                        fontSize: '1.5rem',
                                        padding: '12px 24px',
                                    }}
                                >
                                    Learn Now
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    href="/register"
                                    sx={{
                                        fontSize: '1.5rem',
                                        padding: '12px 24px',
                                    }}
                                >
                                    Register Now
                                </Button>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box display="flex" justifyContent="center">
                                <Link href="#">
                                    <IconButton color="inherit">
                                        <InstagramIcon />
                                    </IconButton>
                                </Link>
                                <Link href="#">
                                    <IconButton color="inherit">
                                        <FacebookIcon />
                                    </IconButton>
                                </Link>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </AppBar>
        </Box>
    );
};

export default Footer;
