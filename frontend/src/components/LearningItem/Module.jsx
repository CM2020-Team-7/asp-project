import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

const Module = ({ item }) => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardMedia
                component="img"
                height="140"
                image="https://www.freecodecamp.org/news/content/images/2021/08/chris-ried-ieic5Tq8YMk-unsplash.jpg"
                alt={item.title}
            />
            <CardContent>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to={`/module/${item.id}`}
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
                    Categories: Python | Data Science | Machine Learning
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
                    <span>8/10</span>
                    <span>
                        {format(parseISO(item.createdOn), 'dd.MM.yyyy')}
                    </span>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Module;
