import React, { Suspense } from 'react';
import { VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso';
import { GridVirtuosoContainer, GridVirtuosoItem, GridVirtuosoItemWrapper } from 'components/documents/views/UI/Grid';
import { GenericDocument } from 'global/interfaces';
import { useBrowserStore } from '../../../data/global_state/slices/BrowserMock';
import { useGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
import { useGetFolderChildrenFilesQuery } from 'store/async/dms/files/filesApi';
import { isArray, isEmpty, isNull, isString, isUndefined } from 'lodash';
import { ViewsProps } from 'components/documents/Interface/FileBrowser';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { PermissionsDialog } from 'components/documents/views/UI/Dialogs';
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
    const { uploadFiles, newFolder, focused, quickSearchString } = useBrowserStore();
    const { browserHeight } = useViewStore();

    // ================================= | ROUTES | ================================ //
    const { paramArray, currentFolder } = useHandleChangeRoute();

    // ================================= | RTK QUERY | ================================ //
    const { data: folderChildren, isLoading: folderChildrenIsLoading } = useGetFoldersChildrenQuery(
        { fldId: !isUndefined(currentFolder) && !isNull(currentFolder) ? currentFolder : '' },
        {
            skip: currentFolder === null || currentFolder === undefined || isEmpty(currentFolder)
        }
    );
    const { data: childrenDocuments, isLoading: childrenDocumentsIsLoading } = useGetFolderChildrenFilesQuery(
        { fldId: !isUndefined(currentFolder) && !isNull(currentFolder) ? currentFolder : '' },
        {
            skip: currentFolder === null || currentFolder === undefined || isEmpty(currentFolder)
        }
    );
    // ================================= | DATA | ================================ //

    const documents: GenericDocument[] = React.useMemo(() => {
        const folderChildrenCopy: GenericDocument[] =
            !isUndefined(folderChildren) && isArray(folderChildren?.folders)
                ? isString(quickSearchString) && !isEmpty(quickSearchString)
                    ? folderChildren?.folders.filter((fld) => fld.doc_name.includes(quickSearchString.toLowerCase()))
                    : folderChildren?.folders
                : [];
        const childrenDocumentsCopy: GenericDocument[] =
            !isUndefined(childrenDocuments) && isArray(childrenDocuments.documents)
                ? isString(quickSearchString) && !isEmpty(quickSearchString)
                    ? childrenDocuments.documents.filter((file) =>
                          isString(file.doc_name) ? file.doc_name.toLowerCase().includes(quickSearchString.toLowerCase()) : true
                      )
                    : childrenDocuments.documents
                : [];
        const newFilesCopy: GenericDocument[] = isArray(newFiles)
            ? isString(quickSearchString) && !isEmpty(quickSearchString)
                ? newFiles.filter((newFile) => newFile.doc_name.includes(quickSearchString.toLowerCase()))
                : newFiles
            : [];
        const newFolderCopy: GenericDocument[] = !isNull(newFolder)
            ? isString(quickSearchString) && !isEmpty(quickSearchString) && newFolder.doc_name.includes(quickSearchString.toLowerCase())
                ? newFolder.doc_name.includes(quickSearchString)
                    ? [newFolder]
                    : []
                : [newFolder]
            : [];
        const doc = [...newFolderCopy, ...folderChildrenCopy, ...childrenDocumentsCopy, ...newFilesCopy];
        return doc;
    }, [childrenDocuments, folderChildren, newFiles, newFolder, quickSearchString]);
    // ================================= | EFFECTS | ================================ //

    React.useEffect(() => {
        if (folderChildrenIsLoading || childrenDocumentsIsLoading) {
            setIsLoading(true);
        } else {
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
    }, [focused, isLoading]);

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
                            <GridVirtuosoItemWrapper data-index={index} height={browserHeight * 0.23}>
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
        </>
    );
}
