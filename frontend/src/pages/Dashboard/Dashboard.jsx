import React, { useState, useEffect } from 'react';

import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    ButtonGroup,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Switch,
    Box,
    Pagination,
    Stack,
} from '@mui/material';
import LearningItem from '@/components/LearningItem/LearningItem';
import CreateButton from './components/CreateButton';
import { learningPlanApiSlice } from '@/features/learningPlan/learningPlanApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
    setPlans,
    selectPlans,
} from '@/features/learningPlan/learningPlanSlice';
import { moduleApiSlice } from '@/features/module/moduleApiSlice';
import { setModules, selectModules } from '@/features/module/moduleSlice';

const Dashboard = () => {
    const [viewType, setViewType] = useState('learningPlans');
    const [page, setPage] = useState(1);
    const itemsPerPage = 4;
    const dispatch = useDispatch();
    const learningPlansData = useSelector(selectPlans);
    const modulesData = useSelector(selectModules);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                const res = await dispatch(
                    learningPlanApiSlice.endpoints.getPlans.initiate(),
                );

                dispatch(setPlans({ UserPlans: res.data }));

                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchPlans();
    }, [dispatch]);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                setLoading(true);
                const res = await dispatch(
                    moduleApiSlice.endpoints.getModules.initiate(),
                );
                dispatch(setModules({ UserModules: res.data }));
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchModules();
    }, [dispatch]);

    const handleViewTypeChange = (event) => {
        setViewType(event.target.checked ? 'modules' : 'learningPlans');
        setPage(1); // Reset page number when switching view
    };

    const plansOrModules =
        viewType === 'learningPlans' ? learningPlansData : modulesData;

    const numPages = Math.ceil(plansOrModules?.length / itemsPerPage) || 0;
    const startIndex = (page - 1) * itemsPerPage;
    const displayedItems = plansOrModules?.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Container maxWidth="lg">
            <Box mt={4} display="flex" justifyContent="flex-end">
                <Typography variant="body2" color="textSecondary">
                    Learning Plans
                </Typography>
                <Switch
                    color="primary"
                    checked={viewType === 'modules'}
                    onChange={handleViewTypeChange}
                />
                <Typography variant="body2" color="textSecondary">
                    Modules
                </Typography>
            </Box>
            <Box mt={4}>
                <Typography variant="h1" textAlign="center">
                    Your {viewType === 'modules' ? 'Modules' : 'Learning Plans'}{' '}
                </Typography>
            </Box>
            <Box mt={4}>
                {!plansOrModules || plansOrModules?.length === 0 ? (
                    <Box textAlign="center" my={8}>
                        <Typography variant="h5" sx={{ mb: 4 }}>
                            No{' '}
                            {viewType === 'modules'
                                ? 'Modules'
                                : 'Learning Plans'}{' '}
                            found
                        </Typography>
                        <CreateButton viewType={viewType} />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {displayedItems?.map((item) => (
                            <LearningItem
                                key={item.id}
                                item={item}
                                viewType={viewType}
                            />
                        ))}
                    </Grid>
                )}
                {plansOrModules?.length > 0 && (
                    <Stack>
                        <Box
                            mt={4}
                            display="flex"
                            justifyContent="center"
                            sx={{ marginBottom: '1rem' }} // Add margin bottom
                        >
                            <Pagination
                                count={numPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                        <CreateButton viewType={viewType} />
                    </Stack>
                )}
            </Box>
        </Container>
    );
};

export default Dashboard;
