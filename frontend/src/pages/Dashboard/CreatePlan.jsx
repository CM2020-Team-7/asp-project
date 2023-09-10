import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { learningPlanApiSlice } from '@/features/learningPlan/learningPlanApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreatePlan = () => {
    const navigate = useNavigate();
    const [planTitle, setPlanTitle] = useState('');
    const dispatch = useDispatch();
    const handlePlanTitleChange = (event) => {
        setPlanTitle(event.target.value);
    };

    const token = useSelector((state) => state.user.token);

    const handleCreatePlan = async () => {
        try {
            await dispatch(
                learningPlanApiSlice.endpoints.createPlan.initiate({
                    title: planTitle,
                }),
            );
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={6}>
                <Typography variant="h4" align="center">
                    Create a Plan
                </Typography>
                <form>
                    <TextField
                        label="Title of Plan"
                        variant="outlined"
                        fullWidth
                        value={planTitle}
                        onChange={handlePlanTitleChange}
                        sx={{ mt: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleCreatePlan}
                        sx={{ mt: 2 }}
                    >
                        Create Plan
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default CreatePlan;
