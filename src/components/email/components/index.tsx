import { Grid, alpha } from '@mui/material';
import React from 'react';

export default function MainGrid() {
    return (
        <Grid container width="100%" height="100%" overflow="hidden">
            <Grid
                md={3}
                height="100%"
                width="100%"
                direction="column"
                borderLeft={(theme) => `1px solid ${theme.palette.divider}`}
                bgcolor={(theme) => alpha(theme.palette.secondary.main, 0.1)}
                justifyContent="start"
                alignItems="start"
                sx={{
                    backdropFilter: 'blur(5px)'
                }}
            ></Grid>
            <Grid
                md={4}
                height="100%"
                width="100%"
                direction="column"
                borderLeft={(theme) => `1px solid ${theme.palette.divider}`}
                justifyContent="start"
                alignItems="start"
            ></Grid>
            <Grid md={4} height="100%" width="100%" direction="column" justifyContent="start" alignItems="start"></Grid>
        </Grid>
    );
}
