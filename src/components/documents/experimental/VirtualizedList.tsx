import { Components, TableVirtuoso } from 'react-virtuoso';
import React from 'react';
import Table, { TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { StyledTableCell, StyledTableRow } from 'components/documents/views/UI/Tables';
import { MemorizedFcFolder } from '../views/item/GridViewItem';
import { Box, Checkbox, Stack, Typography, lighten, useTheme } from '@mui/material';
import { useGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
import { useBrowserStore } from '../data/global_state/slices/BrowserMock';
import { isArray, isEmpty, isObject, isUndefined } from 'lodash';
import { useGetFolderChildrenFilesQuery } from 'store/async/dms/files/filesApi';
import { getDateFromObject } from 'utils/constants/UriHelper';
import { useViewStore } from '../data/global_state/slices/view';
import { FileIconProps, fileIcon } from '../Icons/fileIcon';
import { PermissionIconProps, permissionsIcon } from '../Icons/permissionsIcon';
import { PermissionTypes } from '../Interface/FileBrowser';
import DragDropTableRow from './DragDropTableRow';
import { useHandleActionMenu } from 'utils/hooks';
import ActionMenu from '../views/UI/Menus/DocumentActionMenu';
import { PermissionsDialog } from 'components/documents/views/UI/Dialogs';

export function VirtualizedList({ height }: { height: number }) {
    // ========================= | STATE | =========================== //
    const [contextMenu, setContextMenu] = React.useState<{ mouseX: number; mouseY: number } | null>(null);

    const [rowSelected, setRowSelected] = React.useState<{ path: string; locked?: boolean; doc_name: string; is_dir: boolean }>({
        path: '',
        doc_name: '',
        locked: false,
        is_dir: false
    });
    const [renameTarget, setRenameTarget] = React.useState<{ id: string; rename: boolean } | null>(null);
    const [disableDoubleClick, setDisableDoubleClick] = React.useState<boolean>(false);

    // ========================= | THEME | =========================== //
    const theme = useTheme();
    // ========================= | ZUSTAND HOOKS | =========================== //
    const { selected } = useBrowserStore();
    const { browserHeight } = useViewStore();

    // ========================= | ICONS | =========================== //
    const memorizedFileIcon = React.useCallback((args: FileIconProps) => fileIcon({ ...args }), []);
    const memorizedPermissionsIcon = React.useCallback((args: PermissionIconProps) => permissionsIcon({ ...args }), []);
    // ================================= | Action Menu | ============================= //
    const { handleMenuClick, handleMenuClose, renameFn } = useHandleActionMenu({
        is_dir: rowSelected.is_dir,
        path: rowSelected.path,
        doc_name: rowSelected.doc_name,
        setContextMenu,
        setRenameTarget
    });

    // ========================= | MUTATIONS | =========================== //
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
    // ========================= | TABLE COMPONENTS | =========================== //

    const TableComponents: Components = React.useMemo(
        () => ({
            Scroller: React.forwardRef((props, ref) => <TableContainer component={Box} {...props} ref={ref} />),
            Table: (props: TableProps) => <Table {...props} sx={{ borderCollapse: 'separate', width: '80vw', borderRadius: 0 }} />,
            TableHead: TableHead,
            TableRow: React.forwardRef((props: React.ComponentPropsWithoutRef<typeof TableRow>, ref: React.Ref<HTMLTableRowElement>) => {
                return (
                    // @ts-expect-error expected
                    <DragDropTableRow
                        setRenameTarget={setRenameTarget}
                        parentContextMenu={contextMenu}
                        setContextParentMenu={setContextMenu}
                        setRowSelected={setRowSelected}
                        setDisableDoubleClick={setDisableDoubleClick}
                        disableDoubleClick={disableDoubleClick}
                        {...props}
                        ref={ref}
                    />
                );
            }),
            // @ts-expect-error ref
            TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />)
        }),
        []
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
        <>
            <TableVirtuoso
                style={{ height: height }}
                data={
                    folderChildren !== undefined &&
                    childrenDocuments !== undefined &&
                    isArray(folderChildren?.folders) &&
                    isArray(childrenDocuments?.documents)
                        ? [...folderChildren.folders, ...childrenDocuments.documents]
                        : []
                }
                components={TableComponents}
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
                    <>
                        <StyledTableCell
                            sx={{
                                width: 350,
                                position: 'sticky',
                                left: 0,
                                borderRight: `1px solid ${theme.palette.divider}`
                            }}
                        >
                            <Stack direction="row" spacing={1}>
                                <Checkbox
                                    size="small"
                                    checked={rowSelected.path === document.path}
                                    inputProps={{
                                        'aria-labelledby': document.path
                                    }}
                                    sx={{ p: 0 }}
                                />
                                {document.is_dir ? (
                                    <MemorizedFcFolder size={18} />
                                ) : (
                                    memorizedFileIcon({ mimeType: document.mimeType, size: browserHeight * 0.02, file_icon_margin: 0 })
                                )}
                                <Typography variant="caption" noWrap maxWidth="80%">
                                    {document.doc_name}
                                </Typography>
                            </Stack>
                        </StyledTableCell>
                        <StyledTableCell>{getDateFromObject(document.created).toString()}</StyledTableCell>

                        {isObject(document.permissions) &&
                            !isUndefined(document.permissions) &&
                            Object.entries(document.permissions).map((p: [string, boolean]) => {
                                const perm = p[0] as keyof PermissionTypes;
                                return (
                                    <StyledTableCell key={p[0]} sx={{ pl: 1.5 }}>
                                        {memorizedPermissionsIcon({
                                            type: perm,
                                            permission: p[1],
                                            theme: theme,
                                            size: 10,
                                            file_icon_margin: 0
                                        })}
                                    </StyledTableCell>
                                );
                            })}
                        <StyledTableCell>{String(document.subscribed)}</StyledTableCell>
                    </>
                )}
            />
            <ActionMenu
                is_dir={rowSelected.is_dir}
                locked={rowSelected.locked ?? false}
                contextMenu={contextMenu}
                handleMenuClose={handleMenuClose}
                handleMenuClick={handleMenuClick}
            />
            <PermissionsDialog />
        </>
    );
}
