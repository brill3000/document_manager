import { Divider, Grid, Stack } from '@mui/material';
import React from 'react';
import { DocumentType } from '../../Interface/FileBrowser';
import TopNavActions from './TopNavActions';
import TopNavHandles from './TopNavHandles';
import TopWindowActions from './TopWindowActions';

export interface FileBrowserTopNavProps {
    bgColor: string | undefined;
    borderRadius: string | number | undefined;
    doc: DocumentType | undefined;
    handleBack: () => void;
    handleForward: () => void;
}
// ({ bgColor, borderRadius, title, handleBack, handleForward }: FileBrowserTopNavProps)

const FileBrowserTopNav = React.forwardRef<HTMLInputElement, FileBrowserTopNavProps>(function FileBrowserTopNav(props, ref) {
    const { bgColor, borderRadius, doc, handleBack, handleForward } = props;

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
                    <TopNavHandles handleBack={handleBack} handleForward={handleForward} doc={doc} />
                </Stack>
                <Divider absolute />
            </Grid>

            <Grid item md={3} xs={6} justifyContent="end" display="flex">
                <TopWindowActions />
            </Grid>
            <Grid item xs={12} justifyContent="start" display="flex">
                <TopNavActions doc={doc} />
            </Grid>
        </Grid>
    );
});

export default FileBrowserTopNav;
