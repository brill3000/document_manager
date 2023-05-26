import { Box, Divider, Grid, Stack } from '@mui/material';
import React from 'react';

export function MainContent() {
    return (
        <Grid
            item
            xs={9}
            md={6}
            height="100%"
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="start"
            alignItems="start"
            px={3}
            py={2}
        >
            <Stack direction="column" height="100%" width="100%">
                <Box height="10%" position="relative">
                    <Divider sx={{ position: 'absolute', bottom: 0 }} variant="fullWidth" />
                </Box>
                <Box height="90%"></Box>
            </Stack>
        </Grid>
    );
}
