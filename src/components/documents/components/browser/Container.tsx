import React from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { FileBrowserContentProps } from 'components/documents/Interface/FileBrowser';
import { fileIcon } from 'components/documents/Icons/fileIcon';
import LeftSidebar from 'components/documents/components/browser/views/sidebars/LeftSidebar';
import MainGrid from 'components/documents/components/browser/views';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { MemorizedFcFolder } from 'components/documents/components/browser/item/GridViewItem';
import RightSidebar from 'components/documents/components/browser/views/sidebars/RightSidebar';
import { theme } from 'components/styles/themes';

const FileBrowserContent = ({ selected, setSelected, documents, select, nav, gridRef }: FileBrowserContentProps): JSX.Element => {
    const { browserHeight } = useViewStore();
    const matches = useMediaQuery(theme.breakpoints.between('xs', 'lg'));
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
                <RightSidebar />
            </Grid>
            <MainGrid documents={documents} selected={selected} setSelected={setSelected} select={select} nav={nav} gridRef={gridRef} />
            <Grid
                md={3}
                height="100%"
                width="100%"
                component={Stack}
                direction="row"
                borderLeft={(theme) => `1px solid ${theme.palette.divider}`}
                justifyContent="center"
                alignItems="center"
                {...(matches && { display: 'none' })}
            >
                {Array.isArray(selected) && selected.length > 0 ? (
                    <Stack spacing={2} height="100%" width="100%">
                        {selected[0].is_dir ? (
                            <>
                                <Box display="flex" justifyContent="center">
                                    <MemorizedFcFolder
                                        size={browserHeight !== 0 && browserHeight !== undefined ? browserHeight * 0.7 * 0.2 : '30%'}
                                    />
                                </Box>
                                <LeftSidebar selected={selected} />
                            </>
                        ) : (
                            <>
                                <Box display="flex" justifyContent="center" pt={1}>
                                    {fileIcon(selected[0].type, browserHeight * 0.1, 0)}
                                </Box>
                                <LeftSidebar selected={selected} />
                            </>
                        )}
                    </Stack>
                ) : (
                    <Typography>Nothing Selected</Typography>
                )}
            </Grid>
        </Grid>
    );
};

export default FileBrowserContent;
