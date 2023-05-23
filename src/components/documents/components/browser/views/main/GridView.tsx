import React from 'react';
import { Box, Typography } from '@mui/material';
import { GridViewItem } from 'components/documents/components/browser/item/GridViewItem';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { useGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
import { ViewsProps } from 'components/documents/Interface/FileBrowser';
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';

export function GridView({ closeContext }: ViewsProps): React.ReactElement {
    const { selected } = useBrowserStore();
    const {
        data: folderChildren,
        error: folderChildrenError,
        isFetching: folderChildrenIsFetching,
        isLoading: folderChildrenIsLoading,
        isSuccess: folderChildrenIsSuccess
    } = useGetFoldersChildrenQuery(
        { fldId: Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1] : '' },
        {
            skip: selected === null || selected === undefined || (Array.isArray(selected) && selected.length < 1)
        }
    );

    return (
        <>
            {folderChildrenIsLoading || folderChildrenIsFetching ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <GoogleLoader height={150} width={150} loop={true} />
                </Box>
            ) : folderChildrenError ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <Error height={150} width={150} />
                </Box>
            ) : folderChildrenIsSuccess && Array.isArray(folderChildren.folder) && folderChildren.folder.length > 0 ? (
                folderChildren.folder.map((folder) => <GridViewItem closeContext={closeContext} folder={folder} key={folder.path} />)
            ) : (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <Typography>No Folders</Typography>
                </Box>
            )}
        </>
    );
}
