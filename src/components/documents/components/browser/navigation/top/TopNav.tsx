import { Divider, Grid, Stack } from '@mui/material';
import React from 'react';
import TopNavActions from 'components/documents/components/browser/navigation/top/TopNavActions';
import TopNavHandles from 'components/documents/components/browser/navigation/top/TopNavHandles';
import TopWindowActions from 'components/documents/components/browser/navigation/top/TopWindowActions';

export interface FileBrowserTopNavProps {
    bgColor: string | undefined;
    borderRadius: string | number | undefined;
}
// ({ bgColor, borderRadius, title, handleBack, handleForward }: FileBrowserTopNavProps)

const FileBrowserTopNav = React.forwardRef<HTMLInputElement, FileBrowserTopNavProps>(function FileBrowserTopNav(props, ref) {
    const { bgColor, borderRadius } = props;

    return (
        <Grid
            container
            ref={ref}
            height="100%"
            direction="row"
            position="relative"
            justifyContent="space-between"
            alignItems="center"
            bgcolor={bgColor ?? 'background.paper'}
            px={2}
            py={0}
            m={0}
            borderRadius={borderRadius ?? 2}
            rowSpacing={0.2}
        >
            <Grid item md={5} xs={6} justifyContent="start" display="flex">
                <Stack direction="row" justifyContent="space-between" width="max-content" alignItems="center" spacing={2}>
                    <TopNavHandles />
                </Stack>
                <Divider absolute />
            </Grid>

            <Grid item md={3} xs={6} justifyContent="end" display="flex">
                <TopWindowActions />
            </Grid>
            <Grid item xs={12} justifyContent="start" display="flex">
                <TopNavActions />
            </Grid>
        </Grid>
    );
});

export default FileBrowserTopNav;
