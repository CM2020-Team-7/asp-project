import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const CreatePlan = () => {
    const [planTitle, setPlanTitle] = useState('');

    const handlePlanTitleChange = (event) => {
        setPlanTitle(event.target.value);
    };

    const handleCreatePlan = () => {
        // Perform logic to create the plan using the planTitle
        alert(`Creating plan with title: ${planTitle}`);
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
