import React from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Typography, darken, lighten } from '@mui/material';
import { ListViewsProps } from 'components/documents/Interface/FileBrowser';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListViewItem } from 'components/documents/views/item/ListViewItem';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { useGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
import { Error, FolderEmpty } from 'ui-component/LoadHandlers';
import { useGetFolderChildrenFilesQuery } from 'store/async/dms/files/filesApi';
import { GenericDocument } from 'global/interfaces';
import { isEmpty } from 'lodash';
import { LazyLoader } from '../..';

export function ListView({ closeContext, width, height }: ListViewsProps): React.ReactElement {
    const { selected } = useBrowserStore();
    const {
        data: folderChildren,
        error: folderChildrenError,
        isFetching: folderChildrenIsFetching,
        isLoading: folderChildrenIsLoading
    } = useGetFoldersChildrenQuery(
        { fldId: Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1].id : '' },
        {
            skip:
                selected === null ||
                selected === undefined ||
                selected?.length < 1 ||
                isEmpty(selected[selected.length - 1]?.id) ||
                !selected[selected.length - 1]?.is_dir
        }
    );
    const {
        data: childrenDocuments,
        error: childrenDocumentsError,
        isFetching: childrenDocumentsIsFetching,
        isLoading: childrenDocumentsnIsLoading
    } = useGetFolderChildrenFilesQuery(
        { fldId: Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1].id : '' },
        {
            skip:
                selected === null ||
                selected === undefined ||
                selected?.length < 1 ||
                isEmpty(selected[selected.length - 1]?.id) ||
                !selected[selected.length - 1]?.is_dir
        }
    );
    return (
        <List
            sx={{
                width: width,
                p: 0
            }}
        >
            <ListItem
                sx={{
                    position: 'sticky',
                    width: width,
                    top: 0,
                    zIndex: 2,
                    pt: 0,
                    pb: 0.5,
                    px: 0,
                    webkitTransform: 'translate3d(0, 0, 0)',
                    bgcolor: (theme) => lighten(theme.palette.primary.light, 0.9),
                    borderBottom: (theme) => `1px solid ${darken(theme.palette.divider, 0.03)}`,
                    minWidth: '100vw'
                }}
            >
                <Grid container direction="row" minWidth={'100vw'} position="relative" ml={1}>
                    <Grid
                        xs={2.5}
                        zIndex={2}
                        top="1%"
                        left={0}
                        position="sticky"
                        bgcolor={(theme) => lighten(theme.palette.primary.light, 0.9)}
                        borderRight={(theme) => `1px solid ${darken(theme.palette.divider, 0.03)}`}
                        py={0.5}
                        pl={1}
                    >
                        <Typography variant="caption" noWrap color={(theme) => theme.palette.primary.main}>
                            Name
                        </Typography>
                    </Grid>
                    <Grid
                        xs={2}
                        pl={2}
                        bgcolor={(theme) => lighten(theme.palette.secondary.light, 0.7)}
                        borderRight={(theme) => `1px solid ${darken(theme.palette.divider, 0.03)}`}
                        py={0.5}
                    >
                        <Typography noWrap variant="caption">
                            Author
                        </Typography>
                    </Grid>
                    <Grid
                        xs={3}
                        pl={2}
                        bgcolor={(theme) => lighten(theme.palette.secondary.light, 0.7)}
                        borderRight={(theme) => `1px solid ${darken(theme.palette.divider, 0.03)}`}
                        py={0.5}
                    >
                        <Typography noWrap variant="caption">
                            Date Created
                        </Typography>
                    </Grid>
                    <Grid
                        xs={2}
                        pl={2}
                        bgcolor={(theme) => lighten(theme.palette.secondary.light, 0.7)}
                        borderRight={(theme) => `1px solid ${darken(theme.palette.divider, 0.03)}`}
                        py={0.5}
                    >
                        <Typography noWrap variant="caption">
                            Subscribed
                        </Typography>
                    </Grid>
                    {/* <Grid xs={2} pl={2} bgcolor={(theme) => lighten(theme.palette.secondary.light, 0.7)} py={0.5}>
                        <Typography noWrap variant="caption">
                            Permission
                        </Typography>
                    </Grid> */}
                </Grid>
            </ListItem>
            <>
                <>
                    {folderChildrenIsLoading ||
                    folderChildrenIsFetching ||
                    childrenDocumentsIsFetching ||
                    childrenDocumentsnIsLoading ||
                    selected.length === 0 ? (
                        <LazyLoader />
                    ) : folderChildrenError || childrenDocumentsError ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                            <Error height={50} width={50} />
                        </Box>
                    ) : folderChildren !== undefined &&
                      childrenDocuments !== undefined &&
                      Array.isArray(folderChildren?.folders) &&
                      Array.isArray(childrenDocuments?.documents) &&
                      [...folderChildren.folders, ...childrenDocuments.documents].length > 0 ? (
                        [...folderChildren.folders, ...childrenDocuments.documents].map((document: GenericDocument, i: number) => (
                            <ListViewItem
                                isColored={i % 2 === 0}
                                closeContext={closeContext}
                                document={document}
                                width={width}
                                height={height}
                                key={document.path}
                            />
                        ))
                    ) : (
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            minHeight="100%"
                            minWidth="100%"
                        >
                            <FolderEmpty height={100} width={100} />
                            <Typography variant="caption">Empty Folders</Typography>
                        </Box>
                    )}
                </>
            </>
        </List>
        // <VirtualizedList />
    );
}
