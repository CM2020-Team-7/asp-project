import React, { useState } from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    TextField,
    Stack,
} from '@mui/material';
import { moduleApiSlice } from '@/features/module/moduleApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers';

const CreateModule = () => {
    const [moduleTitle, setModuleTitle] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [finishDate, setFinishDate] = useState(null);

    const dispatch = useDispatch();

    const handleModuleTitleChange = (event) => {
        setModuleTitle(event.target.value);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleFinishDateChange = (date) => {
        setFinishDate(date);
    };

    const token = useSelector((state) => state.user.token);

    const handleCreateModule = async () => {
        try {
            const res = await dispatch(
                moduleApiSlice.endpoints.createModule.initiate({
                    title: moduleTitle,
                    startDate: startDate ? startDate.toISOString() : null,
                    finishDate: finishDate ? finishDate.toISOString() : null,
                }),
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={6}>
                <Typography variant="h4" align="center" sx={{ mb: 2 }}>
                    Create a Module
                </Typography>
                <form>
                    <TextField
                        label="Title of Module"
                        variant="outlined"
                        fullWidth
                        value={moduleTitle}
                        onChange={handleModuleTitleChange}
                        sx={{ mb: 2 }}
                    />
                    <Stack direction="row" justifyContent="space-between">
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    variant="outlined"
                                />
                            )}
                        />
                        <DatePicker
                            label="Finish Date"
                            value={finishDate}
                            onChange={handleFinishDateChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Stack>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleCreateModule}
                        sx={{ mt: 2 }}
                    >
                        Create Module
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default CreateModule;
