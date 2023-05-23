import React from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Stack, useMediaQuery } from '@mui/material';
import { FileBrowserContentProps } from 'components/documents/Interface/FileBrowser';
import RightSidebar from 'components/documents/components/browser/views/sidebars/RightSidebar';
import MainGrid from 'components/documents/components/browser/views';
import LeftSidebar from 'components/documents/components/browser/views/sidebars/LeftSidebar';
import { theme } from 'components/styles/themes';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';

const Content = ({ gridRef }: FileBrowserContentProps): JSX.Element => {
    const matches = useMediaQuery(theme.breakpoints.between('xs', 'lg'));
    const { splitScreen } = useBrowserStore();
    return (
        <Grid container width="100%" height="100%" overflow="hidden">
            <Grid
                md={3}
                height="100%"
                width="100%"
                component={Stack}
                direction="column"
                borderLeft={(theme) => `1px solid ${theme.palette.divider}`}
                justifyContent="start"
                alignItems="start"
                {...(matches && { display: 'none' })}
                px={1}
                pt={1}
            >
                <LeftSidebar />
            </Grid>
            <MainGrid gridRef={gridRef} />
            <Grid
                md={splitScreen ? 3 : 0}
                height="100%"
                width={splitScreen ? '100%' : 0}
                component={Stack}
                direction="row"
                borderLeft={(theme) => `1px solid ${theme.palette.divider}`}
                justifyContent="center"
                alignItems="center"
                sx={{
                    transition: '0.3s all',
                    transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
                }}
                {...(matches && { display: 'none' })}
            >
                <RightSidebar />
            </Grid>
        </Grid>
    );
};

export default Content;
