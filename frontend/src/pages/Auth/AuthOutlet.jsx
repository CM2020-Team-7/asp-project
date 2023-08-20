import React from 'react';
import { Stack, useTheme, Typography } from '@mui/material';
import { FormSX } from './Auth.styles';

function AuthOutlet({ children }) {
    const theme = useTheme();
    return (
        <form>
            <Stack
                gap={3}
                sx={{
                    ...FormSX,
                    border: `1px solid ${theme.palette.grey.border}`,
                    background: theme.palette.grey[50],
                }}
            >
                <Typography textAlign="center" variant="h2">
                    UpSkill
                </Typography>

                {children}
            </Stack>
        </form>
    );
}

export default AuthOutlet;
