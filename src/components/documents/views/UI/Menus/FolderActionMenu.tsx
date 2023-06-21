import { Divider, MenuItem, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { BsFolderPlus, BsTrash } from 'react-icons/bs';
import { CiEraser } from 'react-icons/ci';
import { StyledMenu } from './StyledMenu';
import { BiPaste, BiBrush } from 'react-icons/bi';
import { useCopyFoldersMutation, useMoveFolderMutation } from 'store/async/dms/folders/foldersApi';
import { useStore } from 'components/documents/data/global_state';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { useCopyFileMutation, useMoveFileMutation } from 'store/async/dms/files/filesApi';
import { useHandleChangeRoute } from 'utils/hooks';
import { MemorizedBsEmptyTrashFill } from 'components/documents/Icons/fileIcon';
import { FolderActionMenuType } from 'global/interfaces';
import { RiFolderWarningLine } from 'react-icons/ri';
import { isString } from 'lodash';

interface ActionMenuProps {
    contextMenu: { mouseX: number; mouseY: number } | null;
    handleMenuClose: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, close: () => void) => void;
    handleMenuClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>, type: FolderActionMenuType['type']) => void;
}

export const FolderActionMenu = ({ contextMenu, handleMenuClose, handleMenuClick }: ActionMenuProps) => {
    // ================================= | STATES | ============================= //
    const [selected, setSelected] = React.useState<FolderActionMenuType['type'] | null>(null);
    // ================================= | ZUSTAND | ============================= //
    const { selected: dstFldArray } = useBrowserStore();

    // ================================= | Mutations | ============================= //
    const { clipboard } = useStore();
    const [moveFolder] = useMoveFolderMutation();
    const [copyFolder] = useCopyFoldersMutation();
    const [moveFile] = useMoveFileMutation();
    const [copyFile] = useCopyFileMutation();
    // =========================== | THEME | ================================//
    const theme = useTheme();
    // ================================= | ROUTEs | ============================= //
    const { isTrashFolder } = useHandleChangeRoute();

    React.useEffect(() => {
        return () => {
            setSelected(null);
        };
    }, []);

    return (
        <StyledMenu
            id="document-action-menu"
            MenuListProps={{
                'aria-labelledby': 'document-action-menu'
            }}
            open={contextMenu !== null}
            onClose={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleMenuClose(e, () => setSelected(null))}
            anchorReference="anchorPosition"
            verticalOrigin="top"
            horizontalOrigin="left"
            anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
            disableAutoFocusItem={true}
        >
            <MenuItem
                onClick={(e) => {
                    setSelected('new_folder');
                    handleMenuClick(e, 'new_folder');
                }}
            >
                <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                    <BsFolderPlus size={18} />
                    <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                        New Folder
                    </Typography>
                </Stack>
            </MenuItem>
            <MenuItem
                onClick={(e) => {
                    setSelected('paste');
                    handleMenuClick(e, 'paste');
                    if (clipboard.size > 0 && Array.isArray(dstFldArray) && dstFldArray.length > 0) {
                        const keysArray = [...clipboard.keys()];
                        const id = keysArray[keysArray.length - 1];
                        const type = clipboard.get(id);
                        const dstId = dstFldArray[dstFldArray.length - 1].id;

                        if (type?.is_dir) {
                            if (type?.action === 'copy') {
                                copyFolder({ fldId: id, dstId });
                            } else if (type?.action === 'cut') {
                                const fldId = id;
                                const oldPathArray = id.split('/');
                                oldPathArray.pop();
                                const newPath = dstId + '/' + oldPathArray;
                                if (isString(oldPathArray?.join('/'))) {
                                    moveFolder({
                                        fldId,
                                        currentId: oldPathArray.join('/'),
                                        newPath: newPath,
                                        dstId,
                                        oldPath: fldId
                                    }).unwrap();
                                }
                            }
                        } else {
                            if (type?.action === 'copy') {
                                copyFile({ docId: id, dstId });
                            } else if (type?.action === 'cut') {
                                const docId = id;
                                const oldPathArray = id.split('/');
                                oldPathArray.pop();
                                const newPath = dstId + '/' + oldPathArray;
                                if (isString(oldPathArray.join('/'))) {
                                    moveFile({
                                        docId,
                                        currentId: oldPathArray.join('/'),
                                        newPath: newPath,
                                        dstId,
                                        oldPath: docId
                                    }).unwrap();
                                }
                            }
                        }
                    }
                }}
            >
                <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                    <BiBrush size={20} />
                    <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                        Paste
                    </Typography>
                </Stack>
            </MenuItem>
            <MenuItem
                onClick={(e) => {
                    setSelected('paste_all');
                    handleMenuClick(e, 'paste_all');
                }}
            >
                <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                    <BiPaste size={20} />
                    <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                        Paste All
                    </Typography>
                </Stack>
            </MenuItem>
            <Divider sx={{ my: 0.2 }} variant="middle" />
            <MenuItem
                onClick={(e) => {
                    setSelected('edit');
                    handleMenuClick(e, 'edit');
                }}
            >
                <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                    <CiEraser size={20} />
                    <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                        Edit
                    </Typography>
                </Stack>
            </MenuItem>
            <Divider sx={{ my: 0.2 }} variant="middle" />
            {isTrashFolder && (
                <MenuItem
                    selected={selected === 'purgeTrash'}
                    onClick={(e) => {
                        setSelected('purgeTrash');
                        handleMenuClick(e, 'purgeTrash');
                    }}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1} alignItems="center">
                        <MemorizedBsEmptyTrashFill size={19} />
                        <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Empty Trash
                        </Typography>
                    </Stack>
                </MenuItem>
            )}
            <MenuItem
                selected={selected === 'moveToTrash'}
                onClick={(e) => {
                    setSelected('moveToTrash');
                    handleMenuClick(e, 'moveToTrash');
                }}
            >
                <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1} alignItems="center">
                    <BsTrash size={17} color={theme.palette.error.main} />
                    <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                        Move Folder to Trash
                    </Typography>
                </Stack>
            </MenuItem>
            <MenuItem
                selected={selected === 'purgeFolder'}
                onClick={(e) => {
                    setSelected('purgeFolder');
                    handleMenuClick(e, 'purgeFolder');
                }}
            >
                <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                    <RiFolderWarningLine size={17} color={theme.palette.error.main} />
                    <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                        Delete Opened Folder
                    </Typography>
                </Stack>
            </MenuItem>
        </StyledMenu>
    );
};

export default FolderActionMenu;
