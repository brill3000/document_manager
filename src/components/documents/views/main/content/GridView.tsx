import React from 'react';
import { Box, Typography } from '@mui/material';
import { GridViewItem } from 'components/documents/views/item/GridViewItem';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { useGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
import { ViewsProps } from 'components/documents/Interface/FileBrowser';
import { Error, FolderEmpty } from 'ui-component/LoadHandlers';
import { useGetFolderChildrenFilesQuery } from 'store/async/dms/files/filesApi';
import { GenericDocument } from 'global/interfaces';
import { isEmpty } from 'lodash';
import { LazyLoader } from '../..';

export function GridView({ closeContext }: ViewsProps): React.ReactElement {
    const { selected, uploadFiles } = useBrowserStore();
    const [newFiles, setNewFiles] = React.useState<GenericDocument[]>([]);
    const { data: folderChildren, error: folderChildrenError, isLoading: folderChildrenIsLoading } = useGetFoldersChildrenQuery(
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
        isFetching: childrenDocumentsIsFetching
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

    React.useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const filesArray = Array.from(uploadFiles, ([_, value]) => value);
        setNewFiles(filesArray);
    }, [uploadFiles]);
    return (
        <>
            {folderChildrenIsLoading || childrenDocumentsIsFetching || selected.length === 0 ? (
                <LazyLoader />
            ) : folderChildrenError || childrenDocumentsError ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <Error height={50} width={50} />
                </Box>
            ) : folderChildren !== undefined &&
              childrenDocuments !== undefined &&
              Array.isArray(folderChildren?.folders) &&
              Array.isArray(childrenDocuments?.documents) &&
              [...folderChildren.folders, ...childrenDocuments.documents, ...newFiles].length > 0 ? (
                [...folderChildren.folders, ...childrenDocuments.documents, ...newFiles].map((document: GenericDocument) => (
                    <GridViewItem closeContext={closeContext} document={document} key={document.path} splitScreen />
                ))
            ) : (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <FolderEmpty height={100} width={100} />
                    <Typography variant="caption">Empty Folders</Typography>
                </Box>
            )}
        </>
    );
}
