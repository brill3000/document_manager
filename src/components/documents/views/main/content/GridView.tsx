import React, { Suspense } from 'react';
import { VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso';
import { GridVirtuosoContainer, GridVirtuosoItem, GridVirtuosoItemWrapper } from 'components/documents/views/UI/Grid';
import { GenericDocument } from 'global/interfaces';
import { useBrowserStore } from '../../../data/global_state/slices/BrowserMock';
import { useGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
import { useGetFolderChildrenFilesQuery } from 'store/async/dms/files/filesApi';
import { isArray, isEmpty, isNull, isUndefined } from 'lodash';
import { ViewsProps } from 'components/documents/Interface/FileBrowser';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { FileViewerDialog, PermissionsDialog } from 'components/documents/views/UI/Dialogs';
import { LazyLoader } from '../..';
import { Box, Typography } from '@mui/material';
import { FolderEmpty } from 'ui-component/LoadHandlers';
import { useHandleChangeRoute } from 'utils/hooks';

const GridViewItem = React.lazy(() => import('components/documents/views/item').then((module) => ({ default: module.GridViewItem })));
export function VirtualizedGrid({ height, closeContext }: ViewsProps & { height: number }) {
    // ================================= | STATE | ================================ //
    const [newFiles, setNewFiles] = React.useState<GenericDocument[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    // const [isScrolling, setIsScrolling] = React.useState(false);
    const virtuoso = React.useRef<VirtuosoGridHandle | null>(null);

    // ================================= | ZUSTAND | ================================ //
    const { uploadFiles, newFolder, focused } = useBrowserStore();
    const { browserHeight } = useViewStore();

    // ================================= | ROUTES | ================================ //
    const { paramArray, is_dir: route_is_dir, currenFolder } = useHandleChangeRoute();

    // ================================= | RTK QUERY | ================================ //
    const { data: folderChildren, isLoading: folderChildrenIsLoading } = useGetFoldersChildrenQuery(
        { fldId: !isUndefined(currenFolder) && !isNull(currenFolder) ? currenFolder : '' },
        {
            skip: currenFolder === null || currenFolder === undefined || isEmpty(currenFolder) || !route_is_dir
        }
    );
    const { data: childrenDocuments, isLoading: childrenDocumentsIsLoading } = useGetFolderChildrenFilesQuery(
        { fldId: Array.isArray(paramArray) && paramArray.length > 0 ? paramArray[paramArray.length - 1] : '' },
        {
            skip: currenFolder === null || currenFolder === undefined || isEmpty(currenFolder) || !route_is_dir
        }
    );
    // ================================= | DATA | ================================ //

    const documents: GenericDocument[] = React.useMemo(() => {
        if (!isUndefined(folderChildren) && !isUndefined(childrenDocuments)) {
            const doc = [
                ...(!isNull(newFolder) ? [newFolder] : []),
                ...(isArray(folderChildren?.folders) ? folderChildren.folders : []),
                ...(isArray(childrenDocuments?.documents) ? childrenDocuments.documents : []),
                ...newFiles
            ];
            return doc;
        } else return [];
    }, [childrenDocuments, folderChildren, newFiles, newFolder]);
    // ================================= | EFFECTS | ================================ //

    React.useEffect(() => {
        if (folderChildrenIsLoading || childrenDocumentsIsLoading) {
            setIsLoading(true);
        } else if (!isUndefined(folderChildren) && !isUndefined(childrenDocuments)) {
            setIsLoading(false);
        }
    }, [paramArray, folderChildrenIsLoading, childrenDocumentsIsLoading, documents]);

    React.useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const filesArray = Array.from(uploadFiles, ([_, value]) => value);
        setNewFiles(filesArray);
    }, [uploadFiles]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            const index = isArray(documents) ? documents.findIndex((x) => x.path === focused.id) : null;
            if (!isNull(index) && index > -1) {
                virtuoso?.current?.scrollToIndex({
                    index: index,
                    align: 'center',
                    behavior: 'smooth'
                });
            }
        }, 100);

        return () => {
            clearTimeout(timer);
        };
    }, [focused, documents, isLoading]);

    return (
        <>
            {isLoading ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={browserHeight * 0.25}
                    minWidth="100%"
                >
                    <LazyLoader />
                </Box>
            ) : isEmpty(documents) ? (
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
                    ref={virtuoso}
                    // isScrolling={setIsScrolling}
                    itemContent={(index, document) => (
                        <>
                            <GridVirtuosoItemWrapper data-index={index} height={browserHeight * 0.25}>
                                <Suspense fallback={<LazyLoader />}>
                                    <GridViewItem
                                        closeContext={closeContext}
                                        document={document}
                                        key={document.path}
                                        index={index}
                                        // isScrolling={isScrolling}
                                        virtuoso={virtuoso}
                                        splitScreen
                                    />
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
