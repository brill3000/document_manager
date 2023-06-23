import React from 'react';
import { Grid, Stack } from '@mui/material';
import { TopNav } from './navigation';
import { Content } from './content';

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
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    height="7%"
                    position="relative"
                    borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
                    alignItems="center"
                >
                    <TopNav />
                </Stack>
                <Stack height="93%" spacing={3}>
                    <Content />
                </Stack>
            </Stack>
        </Grid>
    );
}
