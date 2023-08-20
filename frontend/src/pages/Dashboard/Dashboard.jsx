import React, { useState } from 'react';
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

const Dashboard = () => {
    const [viewType, setViewType] = useState('learningPlans');
    const [page, setPage] = useState(1);
    const itemsPerPage = 4;

    const handleViewTypeChange = (event) => {
        setViewType(event.target.checked ? 'modules' : 'learningPlans');
        setPage(1); // Reset page number when switching view
    };

    const modulesData = [
        {
            id: 1,
            imageUrl:
                'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
            title: 'Python Data Science for everyone',
            categories: ['Data Science', 'Pandas', 'SQL'],
            rating: 8.4,
            created: new Date(),
        },
        {
            id: 2,
            imageUrl:
                'https://plus.unsplash.com/premium_photo-1664302004020-a69eec567967?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            title: 'TensorFlow Cerified Developer Course',
            categories: ['Machine Learning', 'Python'],
            rating: 9.5,
            created: new Date(),
        },
        {
            id: 3,
            imageUrl:
                'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            title: 'Learn Japanese Hiragana and Katakana',
            categories: ['Languages', 'Japanese'],
            rating: 7.5,
            created: new Date(),
        },
        {
            id: 4,
            imageUrl:
                'https://images.unsplash.com/photo-1532618790904-3c45e0405300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            title: 'Learn to mix with Pioneer DJ Pro',
            categories: ['Music', 'Mixing', 'DJ'],
            rating: 8.4,
            created: new Date(),
        },
        {
            id: 5,
            imageUrl:
                'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.scnsoft.com%2Fservices%2Fweb-development&psig=AOvVaw0zb7_cQllTmOY_eXZMQshW&ust=1692608596150000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLDoo8Pw6oADFQAAAAAdAAAAABAE',
            title: 'Python Data Science for everyone',
            categories: ['Data Science', 'Pandas', 'SQL'],
            rating: 8.4,
            created: new Date(),
        },
    ];
    const learningPlansData = [];

    const plansOrModules =
        viewType === 'learningPlans' ? learningPlansData : modulesData;

    const numPages = Math.ceil(plansOrModules.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const displayedItems = plansOrModules.slice(
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
                {plansOrModules.length === 0 ? (
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
                        {displayedItems.map((item) => (
                            <LearningItem key={item.id} item={item} />
                        ))}
                    </Grid>
                )}
                {plansOrModules.length > 0 && (
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
