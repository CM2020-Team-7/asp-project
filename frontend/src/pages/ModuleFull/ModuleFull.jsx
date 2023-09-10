import React from 'react';
import {
    Typography,
    Card,
    CardContent,
    Container,
    TextField,
    Box,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { moduleApiSlice } from '@/features/module/moduleApiSlice';
import {
    selectSelectedModule,
    setSelectedModule,
} from '@/features/module/moduleSlice';

const ModuleFull = () => {
    const { moduleId } = useParams(); // Get the plan ID from the route params
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(fetchModuleById(moduleId));
    // }, [dispatch, moduleId]);

    const selectedModule = useSelector(selectSelectedModule);

    useEffect(() => {
        const fetchModule = async () => {
            const res = await dispatch(
                moduleApiSlice.endpoints.getModuleById.initiate(moduleId),
            );
            console.log(res.data);
            await dispatch(setSelectedModule({ Module: res.data }));
        };
        fetchModule();
    }, [dispatch]);

    if (!selectedModule) {
        // Handle the case where the plan is not found
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="md">
            <Box mt={4} mb={4}>
                <Typography variant="h4" align="center">
                    {selectedModule.title}
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography>
                        Status:{' '}
                        <span style={{ fontWeight: 'bold' }}>
                            {selectedModule.status}
                        </span>
                    </Typography>
                    <Typography>
                        Start Date:{' '}
                        <span style={{ fontWeight: 'bold' }}>
                            {selectedModule.startDate}
                        </span>
                    </Typography>
                    <Typography>
                        Finish Date:{' '}
                        <span style={{ fontWeight: 'bold' }}>
                            {selectedModule.finishDate}
                        </span>
                    </Typography>
                </Box>
                <Card sx={{ mt: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Lesson 1: Introduction to Variables
                        </Typography>
                        <TextField
                            multiline
                            fullWidth
                            variant="outlined"
                            rows={10}
                            placeholder="Write your lesson content here..."
                        />
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default ModuleFull;
