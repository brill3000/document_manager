import React from 'react';
import { Box, Typography } from '@mui/material';
import { GridViewItem } from 'components/documents/components/browser/item/GridViewItem';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { useGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
import { ViewsProps } from 'components/documents/Interface/FileBrowser';
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';
import { useGetFolderChildrenFilesQuery } from 'store/async/dms/files/filesApi';
import { GenericDocument } from 'global/interfaces';

export function GridView({ closeContext }: ViewsProps): React.ReactElement {
    const { selected } = useBrowserStore();
    const {
        data: folderChildren,
        error: folderChildrenError,
        isFetching: folderChildrenIsFetching,
        isLoading: folderChildrenIsLoading,
        isSuccess: folderChildrenIsSuccess
    } = useGetFoldersChildrenQuery(
        { fldId: Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1].id : '' },
        {
            skip:
                selected === null ||
                selected === undefined ||
                (Array.isArray(selected) && (selected.length < 1 || !selected[selected.length - 1].is_dir))
        }
    );
    const {
        data: childrenDocuments,
        error: childrenDocumentsError,
        isFetching: childrenDocumentsIsFetching,
        isLoading: childrenDocumentsnIsLoading,
        isSuccess: childrenDocumentsIsSuccess
    } = useGetFolderChildrenFilesQuery(
        { fldId: Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1].id : '' },
        {
            skip:
                selected === null ||
                selected === undefined ||
                (Array.isArray(selected) && (selected.length < 1 || !selected[selected.length - 1].is_dir))
        }
    );
    return (
        <>
            {folderChildrenIsLoading || folderChildrenIsFetching || childrenDocumentsIsFetching || childrenDocumentsnIsLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <GoogleLoader height={100} width={100} loop={true} />
                </Box>
            ) : folderChildrenError || childrenDocumentsError ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <Error height={50} width={50} />
                </Box>
            ) : folderChildrenIsSuccess &&
              Array.isArray(folderChildren.folder) &&
              childrenDocumentsIsSuccess &&
              Array.isArray(childrenDocuments.document) ? (
                [...folderChildren.folder, ...childrenDocuments.document].map((document: GenericDocument) => (
                    <GridViewItem closeContext={closeContext} document={document} key={document.path} />
                ))
            ) : (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <Typography>No Folders</Typography>
                </Box>
            )}
        </>
    );
}
