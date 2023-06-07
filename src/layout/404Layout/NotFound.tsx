import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { NotFoundLoader } from 'ui-component/LoadHandlers';

function NotFound() {
    return (
        <Box height="100vh" width="100vw" display="flex" justifyContent="center" alignItems="center">
            <Stack spacing={1} justifyContent="center" alignItems="center">
                <NotFoundLoader height={200} width={200} loop={true} />
                <Typography color="error">Page Not Found</Typography>
            </Stack>
        </Box>
    );
}

export default NotFound;
