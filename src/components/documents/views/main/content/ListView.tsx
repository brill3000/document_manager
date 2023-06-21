import { Components, TableVirtuoso, TableVirtuosoHandle } from 'react-virtuoso';
import React, { Suspense } from 'react';
import Table, { TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { StyledTableCell, StyledTableRow } from 'components/documents/views/UI/Tables';
import { Box, Checkbox, Stack, Typography, lighten, useTheme } from '@mui/material';
import { useGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
import { useBrowserStore } from '../../../data/global_state/slices/BrowserMock';
import { isArray, isEmpty, isNull, isUndefined } from 'lodash';
import { useGetFolderChildrenFilesQuery } from 'store/async/dms/files/filesApi';
import { useHandleActionMenu, useHandleChangeRoute } from 'utils/hooks';
import ActionMenu from '../../UI/Menus/DocumentActionMenu';
import { PermissionsDialog } from 'components/documents/views/UI/Dialogs';
import { FolderEmpty } from 'ui-component/LoadHandlers';
import { GenericDocument, ListViewRowSelectedProps } from 'global/interfaces';
import { LazyLoader } from '../..';
import { ListViewItem } from '../../item';

const ListViewRowWrapper = React.lazy(() =>
    import('components/documents/views/item').then((module) => ({ default: module.ListViewRowWrapper }))
);

export function VirtualizedList({ height }: { height: number }) {
    // ========================= | STATE | =========================== //
    const [contextMenu, setContextMenu] = React.useState<{ mouseX: number; mouseY: number } | null>(null);
    const [newFiles, setNewFiles] = React.useState<GenericDocument[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const virtuoso = React.useRef<TableVirtuosoHandle | null>(null);

    const [rowSelected, setRowSelected] = React.useState<ListViewRowSelectedProps>({
        path: '',
        doc_name: '',
        locked: false,
        is_dir: false,
        newDoc: false
    });
    const [disableDoubleClick, setDisableDoubleClick] = React.useState<boolean>(false);

    const disableDoubleClickFn = (disabled: boolean) => {
        setDisableDoubleClick(disabled);
    };

    // ========================= | THEME | =========================== //
    const theme = useTheme();
    // ========================= | ZUSTAND HOOKS | =========================== //
    const { selected, newFolder, uploadFiles, focused } = useBrowserStore();

    // ================================= | ROUTES | ================================ //
    const { pathParam, currentFolder, is_dir: route_is_dir } = useHandleChangeRoute();

    // ========================= | ICONS | =========================== //
    // ================================= | Action Menu | ============================= //
    const { handleMenuClick, handleMenuClose } = useHandleActionMenu({
        is_dir: rowSelected.is_dir,
        path: rowSelected.path,
        doc_name: rowSelected.doc_name,
        setContextMenu,
        is_new: rowSelected.newDoc ?? false
    });

    // ========================= | MUTATIONS | =========================== //
    const {
        data: folderChildren,
        // error: folderChildrenError,
        // isFetching: folderChildrenIsFetching,
        isLoading: folderChildrenIsLoading
    } = useGetFoldersChildrenQuery(
        { fldId: !isUndefined(currentFolder) && !isNull(currentFolder) ? currentFolder : '' },
        {
            skip: currentFolder === null || currentFolder === undefined || isEmpty(currentFolder) || !route_is_dir
        }
    );
    // ========================= | TABLE COMPONENTS | =========================== //

    const TableComponents: Components = React.useMemo(
        () => ({
            Scroller: React.forwardRef((props, ref) => <TableContainer component={Box} {...props} ref={ref} />),
            Table: (props: TableProps) => <Table {...props} sx={{ borderCollapse: 'separate', width: '80vw', borderRadius: 0 }} />,
            TableHead: TableHead,
            TableRow: React.forwardRef((props: React.ComponentPropsWithoutRef<typeof TableRow>, ref: React.Ref<HTMLTableRowElement>) => {
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
            TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />)
        }),
        []
    );
    const {
        data: childrenDocuments,
        // error: childrenDocumentsError,
        // isFetching: childrenDocumentsIsFetching,
        isLoading: childrenDocumentsIsLoading
    } = useGetFolderChildrenFilesQuery(
        { fldId: !isUndefined(currentFolder) && !isNull(currentFolder) ? currentFolder : '' },
        {
            skip: currentFolder === null || currentFolder === undefined || isEmpty(currentFolder) || !route_is_dir
        }
    );

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
    // ========================= | EFFECTS | =========================== //
    React.useEffect(() => {
        if (folderChildrenIsLoading || childrenDocumentsIsLoading) {
            setIsLoading(true);
        } else if (!isUndefined(folderChildren) && !isUndefined(childrenDocuments)) {
            setIsLoading(false);
        }
    }, [pathParam, folderChildrenIsLoading, childrenDocumentsIsLoading, documents]);
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
                    fixedHeaderContent={() => (
                        <StyledTableRow>
                            <StyledTableCell
                                sx={{
                                    width: 350,
                                    position: 'sticky',
                                    left: 0,
                                    borderRight: `1px solid ${lighten(theme.palette.secondary.light, 0.2)}`
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
