import { Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const CreateButton = ({ viewType }) => {
    const url =
        viewType === 'modules'
            ? '/dashboard/createModule'
            : '/dashboard/createPlan';

    const text = viewType === 'modules' ? 'module' : 'learning plan';
    return (
        <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to={url}
            sx={{ width: '200px', margin: '0 auto' }} // Center with fixed width
        >
            Create a {text}
        </Button>
    );
};

export default CreateButton;
