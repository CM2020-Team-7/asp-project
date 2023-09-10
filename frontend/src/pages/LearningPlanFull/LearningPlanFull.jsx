import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    selectSelectedPlan,
    setSelectedPlan,
} from '@/features/learningPlan/learningPlanSlice';

import {
    Typography,
    Card,
    CardContent,
    List,
    ListItemButton,
    ListItemText,
    Box,
    TextField,
    Stack,
} from '@mui/material';
import { learningPlanApiSlice } from '@/features/learningPlan/learningPlanApiSlice';

function LearningPlanFull() {
    const { planId } = useParams(); // Get the plan ID from the route params
    const dispatch = useDispatch();
    const selectedPlan = useSelector(selectSelectedPlan);
    // // State to track whether the plan title is in edit mode or not
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    // // State for the editable plan title
    const [editedPlanTitle, setEditedPlanTitle] = useState('');
    useEffect(() => {
        const fetchPlan = async () => {
            const res = await dispatch(
                learningPlanApiSlice.endpoints.getPlanById.initiate(planId),
            );
            await dispatch(setSelectedPlan({ Plan: res.data }));
            setEditedPlanTitle(selectedPlan.title);
        };
        fetchPlan();
    }, [dispatch]);

    if (!selectedPlan) {
        // Handle the case where the plan is not found
        return <div>Loading...</div>;
    }

    // Calculate the start and finish dates, and plan status
    const startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
    const finishDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    const planStatus = 'TODO';

    // Function to enter edit mode for plan title
    const handleEditTitleClick = () => {
        setIsEditingTitle(true);
    };

    // Function to save changes to plan title
    const handleSaveTitle = async () => {
        await dispatch(
            learningPlanApiSlice.endpoints.editPlan.initiate({
                ...selectedPlan,
                title: editedPlanTitle,
            }),
        );
        // You can dispatch an action to update the plan title in your Redux store here if needed
        setIsEditingTitle(false);
    };
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            minHeight="100vh"
            padding="24px"
        >
            <Stack
                sx={{
                    width: '100%',
                    maxWidth: '1000px',
                    margin: '0 auto',
                    mt: 2,
                    textAlign: 'center',
                }}
            >
                {isEditingTitle ? (
                    <TextField
                        variant="outlined"
                        label="Plan Title"
                        value={editedPlanTitle}
                        onChange={(e) => setEditedPlanTitle(e.target.value)}
                        onBlur={handleSaveTitle}
                        sx={{
                            fontSize: '32px',
                            marginBottom: '16px',
                            width: '100%',
                        }}
                    />
                ) : (
                    <Typography
                        variant="h3"
                        fontSize="32px"
                        marginBottom="16px"
                        onClick={handleEditTitleClick}
                        style={{ cursor: 'pointer' }}
                    >
                        {editedPlanTitle}
                    </Typography>
                )}
            </Stack>
            <Card
                sx={{
                    width: '100%',
                    maxWidth: '1000px',
                    margin: '0 auto',
                    mt: 2,
                    textAlign: 'center',
                }}
            >
                <CardContent>
                    <Typography
                        variant="h4"
                        fontSize="24px"
                        marginBottom="16px"
                    >
                        Modules
                    </Typography>
                    <List>
                        {selectedPlan?.modules?.map((module) => (
                            <ListItemButton
                                key={module.id}
                                component="a"
                                href={`/module/${module.id}`}
                            >
                                <ListItemText
                                    primary={`#${module.id} ${module.name}`}
                                    textAlign="center"
                                />
                            </ListItemButton>
                        ))}
                    </List>
                    <Typography variant="body1" sx={{ marginTop: '16px' }}>
                        Start Date:{' '}
                        <span style={{ fontWeight: 'bold' }}>
                            {startDate.toDateString()}
                        </span>
                    </Typography>
                    <Typography variant="body1">
                        Finish Date:{' '}
                        <span style={{ fontWeight: 'bold' }}>
                            {finishDate.toDateString()}
                        </span>
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: '16px' }}>
                        Status:{' '}
                        <span
                            style={{
                                fontWeight: 'bold',
                            }}
                        >
                            {planStatus}
                        </span>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default LearningPlanFull;
