import { Card, CardContent, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const LearningPlan = ({ item }) => {
    return (
        <Card sx={{ height: '100%', width: '100%', mb: 1 }}>
            <CardContent
                sx={{
                    display: 'flex',
                    alignItems: 'center', // Center vertically
                    justifyContent: 'center', // Center horizontally
                    height: '100%', // Make sure the content takes the full height
                }}
            >
                <Typography
                    variant="h1"
                    component={RouterLink}
                    to={`/plan/${item.id}`}
                    sx={{
                        cursor: 'pointer',
                        color: (theme) => theme.palette.primary.main,
                        '&:hover': {
                            color: (theme) => theme.palette.primary.dark,
                        },
                    }}
                >
                    {item.title}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default LearningPlan;
