import React, { Suspense } from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Skeleton, Stack, useMediaQuery } from '@mui/material';
import { FileBrowserContentProps } from 'components/documents/Interface/FileBrowser';
import { theme } from 'components/styles/themes';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
const RightSidebar = React.lazy(() =>
    import('components/documents/views/main/sidebars')
        .then((module) => ({ default: module.RightSidebar }))
        .catch((error) => {
            // Handle the error
            console.error('Error loading component:', error);
            return { default: Skeleton };
        })
);
const LeftSidebar = React.lazy(() =>
    import('components/documents/views/main/sidebars')
        .then((module) => ({ default: module.LeftSidebar }))
        .catch((error) => {
            // Handle the error
            console.error('Error loading component:', error);
            return { default: Skeleton };
        })
);
const MainGrid = React.lazy(() => import('components/documents/views/main'));
export const LazyLoader = React.memo(
    ({
        align,
        height,
        width
    }: {
        align?: 'normal' | 'stretch' | 'start' | 'end' | 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'initial' | 'inherit';
        justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'initial' | 'inherit';
        height?: number | string;
        width?: number | string;
    }) => (
        <Box display="flex" justifyContent="center" alignItems={align ?? 'center'} minHeight="100%" minWidth="100%">
            <Skeleton sx={{ minWidth: 20, minHeight: 15, width: width ?? '20%', height: height ?? 15 }} />
        </Box>
    )
);

const Content = ({ gridRef }: FileBrowserContentProps): JSX.Element => {
    const md = useMediaQuery(theme.breakpoints.down('md'));
    const { splitScreen } = useBrowserStore();
    return (
        <Grid container width="100%" height="100%" overflow="hidden">
            <Box
                height="100%"
                width={md ? 0 : '25%'}
                component={Stack}
                direction="column"
                borderRight={(theme) => `1px solid ${theme.palette.divider}`}
                justifyContent="start"
                alignItems="start"
                px={1}
                pt={1}
                sx={{
                    transition: '0.3s all',
                    transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
                }}
            >
                <Suspense fallback={<LazyLoader align="flex-start" width="80%" justify="flex-start" height={20} />}>
                    <LeftSidebar />
                </Suspense>
            </Box>
            <Box
                height="100%"
                width={md ? '100%' : splitScreen ? '50%' : '75%'}
                sx={{
                    transition: '0.3s all',
                    transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
                }}
            >
                <Suspense fallback={<LazyLoader />}>
                    <MainGrid gridRef={gridRef} />
                </Suspense>
            </Box>

            <Box
                height="100%"
                width={md ? 0 : splitScreen ? '25%' : 0}
                component={Stack}
                direction="row"
                borderLeft={(theme) => `1px solid ${theme.palette.divider}`}
                justifyContent="center"
                alignItems="center"
                sx={{
                    transition: '0.3s all',
                    transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
                }}
            >
                <Suspense fallback={<LazyLoader />}>
                    <RightSidebar />
                </Suspense>
            </Box>
        </Grid>
    );
};

export default React.memo(Content);
