import React, { Suspense } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { GridVirtuosoContainer, GridVirtuosoItem, GridVirtuosoItemWrapper } from 'components/documents/views/UI/Grid';
import { GenericDocument } from 'global/interfaces';
import { useBrowserStore } from '../data/global_state/slices/BrowserMock';
import { useGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
import { useGetFolderChildrenFilesQuery } from 'store/async/dms/files/filesApi';
import { isArray, isEmpty, isUndefined } from 'lodash';
import { ViewsProps } from 'components/documents/Interface/FileBrowser';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { FileViewerDialog, PermissionsDialog } from 'components/documents/views/UI/Dialogs';
import { LazyLoader } from '../views';
import { Box, Typography } from '@mui/material';
import { FolderEmpty } from 'ui-component/LoadHandlers';

const GridViewItem = React.lazy(() => import('components/documents/views/item').then((module) => ({ default: module.GridViewItem })));
export function VirtualizedGrid({ height, closeContext }: ViewsProps & { height: number }) {
    const { selected, uploadFiles } = useBrowserStore();
    const { browserHeight } = useViewStore();
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
        isLoading: childrenDocumentsIsLoading
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

    const documents: GenericDocument[] = React.useMemo(() => {
        if (!isUndefined(folderChildren) && !isUndefined(childrenDocuments)) {
            const doc = [
                ...(isArray(folderChildren?.folders) ? folderChildren.folders : []),
                ...(isArray(childrenDocuments?.documents) ? childrenDocuments.documents : []),
                ...newFiles
            ];
            return doc;
        } else return [];
    }, [childrenDocuments, folderChildren, newFiles, folderChildrenIsLoading, childrenDocumentsIsLoading]);

    return (
        <>
            {isEmpty(documents) ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={browserHeight * 0.25}
                    minWidth="100%"
                >
                    <FolderEmpty height={100} width={100} />
                    <Typography variant="caption">Empty Folders</Typography>
                </Box>
            ) : (
                <VirtuosoGrid
                    style={{ height: height ?? 400, width: '100%' }}
                    data={documents}
                    components={{
                        Item: GridVirtuosoItem,
                        List: GridVirtuosoContainer
                    }}
                    itemContent={(index, document) => (
                        <>
                            <GridVirtuosoItemWrapper data-index={index} height={browserHeight * 0.25}>
                                <Suspense fallback={<LazyLoader />}>
                                    <GridViewItem closeContext={closeContext} document={document} key={document.path} splitScreen />
                                </Suspense>
                            </GridVirtuosoItemWrapper>
                        </>
                    )}
                />
            )}

            <PermissionsDialog />
            <FileViewerDialog />
        </>
    );
}
