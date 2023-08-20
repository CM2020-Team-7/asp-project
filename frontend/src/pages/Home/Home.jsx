import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { HomeSX } from './Home.styles';

const Home = () => {
    return (
        <Container
            sx={{
                backgroundImage: `url('https://images.unsplash.com/photo-1610484826917-0f101a7bf7f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                minWidth: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Box
                sx={{
                    width: '50%',
                    p: 6,
                    color: 'white',
                    transition: 'background-color 1s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: {
                            xs: '1rem',
                            md: '2rem',
                            lg: '3rem',
                        },
                    }}
                    gutterBottom
                >
                    We provide an all in one solution for students in which they
                    can combine all their resources into one intuitive platform
                    for effective studying.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    component={Link}
                    to="/register"
                    sx={{
                        width: '20rem',
                        height: '5rem',
                        fontSize: 36,
                    }}
                >
                    Sign up here
                </Button>
            </Box>
            <Box
                sx={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginRight: '3rem',
                    transition: 'color 1s',
                    width: '50%',
                }}
            >
                <Typography variant="h1" textAlign="center">
                    UpSkill
                </Typography>
            </Box>
        </Container>
    );
};

export default Home;
