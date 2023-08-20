import { Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';

const LearningItem = ({ item }) => {
    return (
        <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Card sx={{ height: '100%' }}>
                <CardMedia
                    component="img"
                    height="140"
                    image={item.imageUrl}
                    alt={item.title}
                />
                <CardContent>
                    <Typography
                        variant="h6"
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
                    <Typography variant="subtitle2" color="textSecondary">
                        Categories: {item.categories.join(' | ')}
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        sx={{
                            marginTop: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                        }}
                    >
                        <span>{item.rating}/10</span>
                        <span>{format(item.created, 'dd.MM.yyyy')}</span>
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default LearningItem;
