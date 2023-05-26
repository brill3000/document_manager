import { Grid } from '@mui/material';
import React from 'react';
import { RightSidebar } from './sidebar';
import { InnerRightSidebar } from './sidebar';
import { Content } from './Content';

export default function MainGrid() {
    return (
        <Grid container width="100%" height="100%" overflow="hidden">
            <RightSidebar />
            <InnerRightSidebar />
            <Content />
        </Grid>
    );
}
