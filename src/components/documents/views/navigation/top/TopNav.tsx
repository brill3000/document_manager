import { Divider, Grid, IconButton, Stack } from '@mui/material';
import React from 'react';
import TopNavActions from 'components/documents/views/navigation/top/TopNavActions';
import TopNavHandles from 'components/documents/views/navigation/top/TopNavHandles';
import TopWindowActions from 'components/documents/views/navigation/top/TopWindowActions';
import { BsWindowSplit } from 'react-icons/bs';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';

export interface FileBrowserTopNavProps {
    bgColor: string | undefined;
    borderRadius: string | number | undefined;
}
// ({ bgColor, borderRadius, title, handleBack, handleForward }: FileBrowserTopNavProps)

const FileBrowserTopNav = React.forwardRef<HTMLInputElement, FileBrowserTopNavProps>(function FileBrowserTopNav(props, ref) {
    const { bgColor, borderRadius } = props;
    const { actions, splitScreen } = useBrowserStore();
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
            <Grid item xs={10} justifyContent="start" display="flex">
                <TopNavActions />
            </Grid>
            <Grid item xs={1} justifyContent="end" display="flex">
                <IconButton
                    color={splitScreen ? 'primary' : 'secondary'}
                    size="small"
                    sx={{
                        border: (theme) => `.5px solid ${splitScreen ? theme.palette.primary.main : theme.palette.secondary.main}`,
                        transition: '0.2s all',
                        transitionTimingFunction: 'ease-in-out',
                        width: splitScreen ? 30 : 28,
                        height: splitScreen ? 30 : 28
                    }}
                    onClick={() => actions.setSplitScreen(!splitScreen)}
                >
                    <BsWindowSplit size={20} />
                </IconButton>
            </Grid>
        </Grid>
    );
});

export default FileBrowserTopNav;
