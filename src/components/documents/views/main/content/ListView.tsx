import { Components, ListRange, TableVirtuoso, TableVirtuosoHandle } from 'react-virtuoso';
import { ComponentPropsWithoutRef, Ref, Suspense, forwardRef, lazy, useEffect, useMemo, useRef, useState } from 'react';
import Table, { TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { StyledTableCell, StyledTableRow } from 'components/documents/views/UI/Tables';
import { Box, Checkbox, Stack, Typography } from '@mui/material';
import { useLazyGetCategorizedChildrenFoldersQuery, useLazyGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
import { useBrowserStore } from '../../../data/global_state/slices/BrowserMock';
import { isArray, isEmpty, isNull, isString, isUndefined } from 'lodash';
import { useLazyGetCategorizedChildrenFilesQuery, useLazyGetFolderChildrenFilesQuery } from 'store/async/dms/files/filesApi';
import { useHandleActionMenu, useHandleChangeRoute } from 'utils/hooks';
import ActionMenu from '../../UI/Menus/DocumentActionMenu';
import { PermissionsDialog } from 'components/documents/views/UI/Dialogs';
import { FolderEmpty } from 'ui-component/LoadHandlers';
import { GenericDocument, ListViewRowSelectedProps } from 'global/interfaces';
import { LazyLoader } from '../..';
import { ListViewItem } from '../../item';

const ListViewRowWrapper = lazy(() => import('components/documents/views/item').then((module) => ({ default: module.ListViewRowWrapper })));

export function VirtualizedList({ height }: { height: number }) {
    // ========================= | STATE | =========================== //
    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);
    const [newFiles, setNewFiles] = useState<GenericDocument[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const virtuoso = useRef<TableVirtuosoHandle | null>(null);
    const [listRange, setListRange] = useState<ListRange>({ startIndex: 0, endIndex: 0 });

    const [rowSelected, setRowSelected] = useState<ListViewRowSelectedProps>({
        uuid: '',
        path: '',
        doc_name: '',
        locked: false,
        is_dir: false,
        newDoc: false
    });
    const [disableDoubleClick, setDisableDoubleClick] = useState<boolean>(false);

    // ========================= | EVENTS | =========================== //

    const disableDoubleClickFn = (disabled: boolean) => {
        setDisableDoubleClick(disabled);
    };

    // ========================= | THEME | =========================== //
    // ========================= | ZUSTAND HOOKS | =========================== //
    const { quickSearchString, newFolder, uploadFiles, focused } = useBrowserStore();

    // ================================= | ROUTES | ================================ //
    const { currentFolder, rootPath } = useHandleChangeRoute();

    // ========================= | ICONS | =========================== //
    // ================================= | Action Menu | ============================= //
    const { handleMenuClick, handleMenuClose } = useHandleActionMenu({
        is_dir: rowSelected.is_dir,
        path: rowSelected.path,
        doc_name: rowSelected.doc_name,
        setContextMenu,
        is_new: rowSelected.newDoc ?? false
    });
    // ================================= | RTK QUERY | ================================ //
    const [getCategorizedDocuments, categorizedDocuments] = useLazyGetCategorizedChildrenFilesQuery();
    const [getCategorizedFolders, catFolders] = useLazyGetCategorizedChildrenFoldersQuery();

    const [getFolderChildrenFiles, childrenDocuments] = useLazyGetFolderChildrenFilesQuery();
    const [getFolderChildren, folderChildren] = useLazyGetFoldersChildrenQuery();

    // ========================= | TABLE COMPONENTS | =========================== //

    const TableComponents: Components = useMemo(
        () => ({
            Scroller: forwardRef((props, ref) => <TableContainer component={Box} {...props} ref={ref} />),
            Table: (props: TableProps) => <Table {...props} sx={{ borderCollapse: 'separate', width: '80vw', borderRadius: 0 }} />,
            TableHead: TableHead,
            TableRow: forwardRef((props: ComponentPropsWithoutRef<typeof TableRow>, ref: Ref<HTMLTableRowElement>) => {
                return (
                    <Suspense fallback={<TableRow ref={ref} />}>
                        {
                            // @ts-expect-error expected
                            <ListViewRowWrapper
                                parentContextMenu={contextMenu}
                                setContextParentMenu={setContextMenu}
                                setRowSelected={setRowSelected}
                                setDisableDoubleClick={setDisableDoubleClick}
                                disableDoubleClick={disableDoubleClick}
                                {...props}
                                ref={ref}
                            />
                        }
                    </Suspense>
                );
            }),
            // @ts-expect-error ref
            TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref} />)
        }),
        []
    );

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
        }, 100);

        return () => {
            clearTimeout(timer);
        };
    }, [focused, isLoading]);
    // ================================ | EVENTS | ========================= //
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
                    minHeight={height * 0.25}
                    minWidth="100%"
                >
                    <LazyLoader />
                </Box>
            ) : isEmpty(documents) ? (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <FolderEmpty height={100} width={100} />
                    <Typography variant="caption">Empty Folders</Typography>
                </Box>
            ) : (
                <TableVirtuoso
                    style={{ height: height }}
                    data={documents}
                    components={TableComponents}
                    ref={virtuoso}
                    rangeChanged={handleStateChange}
                    fixedHeaderContent={() => (
                        <StyledTableRow>
                            <StyledTableCell
                                sx={{
                                    width: 350,
                                    position: 'sticky',
                                    left: 0,
                                    borderRight: `1px solid`,
                                    borderColor: (theme) => theme.palette.divider
                                }}
                            >
                                <Stack direction="row">
                                    <Checkbox
                                        size="small"
                                        inputProps={{
                                            'aria-labelledby': 'select_all'
                                        }}
                                        sx={{ p: 0 }}
                                    />
                                    <Box pl={1}>Name</Box>
                                </Stack>
                            </StyledTableCell>
                            <StyledTableCell>Date Created</StyledTableCell>
                            <StyledTableCell>Notes</StyledTableCell>
                            <StyledTableCell>Read</StyledTableCell>
                            <StyledTableCell>Write</StyledTableCell>
                            <StyledTableCell>Delete</StyledTableCell>
                            <StyledTableCell>Security</StyledTableCell>
                            <StyledTableCell>Subscribed</StyledTableCell>
                        </StyledTableRow>
                    )}
                    itemContent={(index, document) => (
                        <ListViewItem
                            rowSelected={rowSelected}
                            document={document}
                            setContextMenu={setContextMenu}
                            disableDoubleClickFn={disableDoubleClickFn}
                        />
                    )}
                />
            )}

            <ActionMenu
                is_dir={rowSelected.is_dir}
                nodeId={rowSelected.uuid}
                node_name={rowSelected.doc_name}
                locked={rowSelected.locked ?? false}
                contextMenu={contextMenu}
                handleMenuClose={handleMenuClose}
                handleMenuClick={handleMenuClick}
                is_zip={rowSelected.mimeType === 'application/zip'}
            />
            <PermissionsDialog />
        </>
    );
}
