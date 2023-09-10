import { Grid } from '@mui/material';

import LearningPlan from './LearningPlan';
import Module from './Module';

const LearningItem = ({ item, viewType }) => {
    return (
        <>
            {viewType === 'modules' && (
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
                    <Module item={item} />
                </Grid>
            )}
            {viewType === 'learningPlans' && <LearningPlan item={item} />}
        </>
    );
};

export default LearningItem;
