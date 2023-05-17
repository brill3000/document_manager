import React from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Divider, Stack } from '@mui/material';
import { FileBrowserContentProps } from '../../Interface/FileBrowser';
import { fileIcon } from '../../Icons/fileIcon';
import DocumentDetails from './DocumentDetails';
import FolderGrid from './FolderGrid';
import { useViewStore } from '../../data/global_state/slices/view';
import { MemorizedFcFolder } from './Document';

const FileBrowserContent = ({ selected, setSelected, documents, select, nav, gridRef }: FileBrowserContentProps): JSX.Element => {
    const { browserHeight } = useViewStore();
    return (
        <Grid container width="100%" height="100%">
            <FolderGrid documents={documents} selected={selected} setSelected={setSelected} select={select} nav={nav} gridRef={gridRef} />
            <Grid md={4} height={'100%'} component={Stack} direction="row">
                <Divider orientation="vertical" />
                {Array.isArray(selected) && selected.length > 0 && (
                    <Stack spacing={2} height="100%" width="100%">
                        {selected[0].is_dir ? (
                            <>
                                <Box display="flex" justifyContent="center">
                                    <MemorizedFcFolder
                                        size={browserHeight !== 0 && browserHeight !== undefined ? browserHeight * 0.7 * 0.2 : '30%'}
                                    />
                                </Box>
                                <DocumentDetails selected={selected} />
                            </>
                        ) : (
                            <>
                                <Box display="flex" justifyContent="center" pt={1}>
                                    {fileIcon(selected[0].type, browserHeight * 0.1, 0)}
                                </Box>
                                <DocumentDetails selected={selected} />
                            </>
                        )}
                    </Stack>
                )}
            </Grid>
        </Grid>
    );
};

export default FileBrowserContent;
