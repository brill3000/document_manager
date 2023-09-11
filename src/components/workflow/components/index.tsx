import { Grid } from '@mui/material';
import React, { useState } from 'react';
import { InnerSidebar, OuterSidebar } from './sidebar';
import { MainContent } from './main';

export default function MainGrid() {
    const [selected, setSelected] = useState<number | null>(1);
    return (
        <Grid container width="100%" height="100%" overflow="hidden">
            <OuterSidebar />
            <InnerSidebar setSelected={setSelected} selected={selected} />
            <MainContent selected={selected} />
        </Grid>
    );
}
