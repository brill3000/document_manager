import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { ListRange, VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso';
import { GridVirtuosoContainer, GridVirtuosoItem, GridVirtuosoItemWrapper } from 'components/documents/views/UI/Grid';
import { GenericDocument } from 'global/interfaces';
import { useBrowserStore } from '../../../data/global_state/slices/BrowserMock';
import { useLazyGetCategorizedChildrenFoldersQuery, useLazyGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
import { useLazyGetCategorizedChildrenFilesQuery, useLazyGetFolderChildrenFilesQuery } from 'store/async/dms/files/filesApi';
import { isArray, isEmpty, isNull, isString, isUndefined } from 'lodash';
import { ViewsProps } from 'components/documents/Interface/FileBrowser';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { PermissionsDialog } from 'components/documents/views/UI/Dialogs';
import { LazyLoader } from '../..';
import { Box, Typography } from '@mui/material';
import { FolderEmpty } from 'ui-component/LoadHandlers';
import { useHandleChangeRoute } from 'utils/hooks';

const GridViewItem = lazy(() => import('components/documents/views/item').then((module) => ({ default: module.GridViewItem })));
export function VirtualizedGrid({ height, closeContext }: ViewsProps & { height: number }) {
    // ================================= | STATE | ================================ //
    const [newFiles, setNewFiles] = useState<GenericDocument[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [listRange, setListRange] = useState<ListRange>({ startIndex: 0, endIndex: 0 });
    // ================================= | REFS | ================================ //
    const virtuoso = useRef<VirtuosoGridHandle | null>(null);

    // ================================= | ZUSTAND | ================================ //
    const { uploadFiles, newFolder, focused, quickSearchString } = useBrowserStore();
    const { browserHeight } = useViewStore();

    // ================================= | ROUTES | ================================ //
    const { currentFolder, rootPath } = useHandleChangeRoute();

    // ================================= | RTK QUERY | ================================ //
    const [getCategorizedDocuments, categorizedDocuments] = useLazyGetCategorizedChildrenFilesQuery();
    const [getCategorizedFolders, catFolders] = useLazyGetCategorizedChildrenFoldersQuery();

    const [getFolderChildrenFiles, childrenDocuments] = useLazyGetFolderChildrenFilesQuery();
    const [getFolderChildren, folderChildren] = useLazyGetFoldersChildrenQuery();

    // ================================= | DATA | ================================ //
    const folders: GenericDocument[] = useMemo(() => {
        const folderChildrenCopy: GenericDocument[] =
            !isUndefined(folderChildren.data) && isArray(folderChildren.data.folders)
                ? isString(quickSearchString) && !isEmpty(quickSearchString)
                    ? folderChildren.data?.folders.filter((fld) => fld.doc_name.includes(quickSearchString.toLowerCase()))
                    : folderChildren.data?.folders
                : [];

        const newFolderCopy: GenericDocument[] = !isNull(newFolder)
            ? isString(quickSearchString) && !isEmpty(quickSearchString) && newFolder.doc_name.includes(quickSearchString.toLowerCase())
                ? newFolder.doc_name.includes(quickSearchString)
                    ? [newFolder]
                    : []
                : [newFolder]
            : [];
        return [...newFolderCopy, ...folderChildrenCopy].sort((a, b) => {
            if (a.doc_name < b.doc_name) {
                return -1;
            }
            if (a.doc_name > b.doc_name) {
                return 1;
            }
            return 0;
        });
    }, [folderChildren, newFiles, newFolder, quickSearchString]);

    const files: GenericDocument[] = useMemo(() => {
        const childrenDocumentsCopy: GenericDocument[] =
            !isUndefined(childrenDocuments.data) && isArray(childrenDocuments.data.documents)
                ? isString(quickSearchString) && !isEmpty(quickSearchString)
                    ? childrenDocuments.data.documents.filter((file) =>
                          isString(file.doc_name) ? file.doc_name.toLowerCase().includes(quickSearchString.toLowerCase()) : true
                      )
                    : childrenDocuments.data.documents
                : [];
        const newFilesCopy: GenericDocument[] = isArray(newFiles)
            ? isString(quickSearchString) && !isEmpty(quickSearchString)
                ? newFiles.filter((newFile) => newFile.doc_name.includes(quickSearchString.toLowerCase()))
                : newFiles
            : [];
        const doc = [...childrenDocumentsCopy, ...newFilesCopy].sort((a, b) => {
            if (a.doc_name < b.doc_name) {
                return -1;
            }
            if (a.doc_name > b.doc_name) {
                return 1;
            }
            return 0;
        });
        return doc;
    }, [childrenDocuments, newFiles, quickSearchString]);
    const categorizedFiles: GenericDocument[] = useMemo(() => {
        const categorizedDocumentsCopy: GenericDocument[] =
            !isUndefined(categorizedDocuments.data) && isArray(categorizedDocuments.data.documents)
                ? isString(quickSearchString) && !isEmpty(quickSearchString)
                    ? categorizedDocuments.data.documents.filter((file) =>
                          isString(file.doc_name) ? file.doc_name.toLowerCase().includes(quickSearchString.toLowerCase()) : true
                      )
                    : categorizedDocuments.data.documents
                : [];
        return [...categorizedDocumentsCopy].sort((a, b) => {
            if (a.doc_name < b.doc_name) {
                return -1;
            }
            if (a.doc_name > b.doc_name) {
                return 1;
            }
            return 0;
        });
    }, [categorizedDocuments]);
    const categorizedFolders: GenericDocument[] = useMemo(() => {
        const catFoldersCopy: GenericDocument[] =
            !isUndefined(catFolders.data) && isArray(catFolders.data.folders)
                ? isString(quickSearchString) && !isEmpty(quickSearchString)
                    ? catFolders.data.folders.filter((file) =>
                          isString(file.doc_name) ? file.doc_name.toLowerCase().includes(quickSearchString.toLowerCase()) : true
                      )
                    : catFolders.data.folders
                : [];
        return [...catFoldersCopy].sort((a, b) => {
            if (a.doc_name < b.doc_name) {
                return -1;
            }
            if (a.doc_name > b.doc_name) {
                return 1;
            }
            return 0;
        });
    }, [catFolders]);

    const documents: GenericDocument[] = useMemo(
        () => (rootPath === 'categories' ? [...folders, ...categorizedFolders, ...categorizedFiles] : [...folders, ...files]),
        [folders, files, categorizedFiles, categorizedFolders]
    );
    // ================================= | EFFECTS | ================================ //
    useEffect(() => {
        setIsLoading(true);
        if (currentFolder === null || currentFolder === undefined || isEmpty(currentFolder)) return;
        if (rootPath === 'categories') {
            const promises = [
                getCategorizedDocuments({ categoryId: currentFolder }),
                getCategorizedFolders({ categoryId: currentFolder }),
                getFolderChildren({ fldId: currentFolder })
            ];
            Promise.allSettled(promises).then(() => setIsLoading(false));
        } else {
            const promises = [getFolderChildrenFiles({ fldId: currentFolder }), getFolderChildren({ fldId: currentFolder })];
            Promise.allSettled(promises).then(() => setIsLoading(false));
        }
    }, [currentFolder]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const filesArray = Array.from(uploadFiles, ([_, value]) => value);
        setNewFiles(filesArray);
    }, [uploadFiles]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const index = isArray(documents) ? documents.findIndex((x) => x.path === focused.id) : null;
            if (!isNull(index) && index > -1) {
                if (index > listRange.startIndex && index < listRange.endIndex) return;
                virtuoso?.current?.scrollToIndex({
                    index: index,
                    align: 'start',
                    behavior: 'smooth'
                });
            }
        }, 50);

        return () => {
            clearTimeout(timer);
        };
    }, [focused, isLoading]);
    const handleStateChange = ({ startIndex, endIndex }: ListRange) => {
        setListRange({ startIndex, endIndex });
    };

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
                    rangeChanged={handleStateChange}
                    itemContent={(index, document) => (
                        <>
                            <GridVirtuosoItemWrapper data-index={index} height={browserHeight * 0.22}>
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
