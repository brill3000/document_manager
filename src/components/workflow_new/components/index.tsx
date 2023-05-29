import { Grid } from '@mui/material';
import React from 'react';
import { InnerSidebar, OuterSidebar } from './sidebar';
import { MainContent } from './main';

export default function MainGrid() {
    return (
        <Grid container width="100%" height="100%" overflow="hidden">
            <OuterSidebar />
            <InnerSidebar />
            <MainContent />
        </Grid>
    );
}
