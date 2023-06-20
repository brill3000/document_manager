import { Divider, MenuItem, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { BsFolderPlus } from 'react-icons/bs';
import { CiEraser } from 'react-icons/ci';
import { StyledMenu } from './StyledMenu';
import { BiPaste, BiBrush } from 'react-icons/bi';
import { useCopyFoldersMutation, useMoveFolderMutation } from 'store/async/dms/folders/foldersApi';
import { useStore } from 'components/documents/data/global_state';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { useCopyFileMutation, useMoveFileMutation } from 'store/async/dms/files/filesApi';
import { useHandleChangeRoute } from 'utils/hooks';
import { MemorizedBsEmptyFolder, MemorizedBsEmptyTrashFill } from 'components/documents/Icons/fileIcon';

interface ActionMenuProps {
    contextMenu: { mouseX: number; mouseY: number } | null;
    handleMenuClose: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, close: () => void) => void;
    handleMenuClick: (
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        type: 'new_folder' | 'paste' | 'paste_all' | 'edit' | 'purgeTrash' | 'purgeFolder'
    ) => void;
}

export const FolderActionMenu = ({ contextMenu, handleMenuClose, handleMenuClick }: ActionMenuProps) => {
    // ================================= | STATES | ============================= //

    const [selected, setSelected] = React.useState<'new_folder' | 'paste' | 'paste_all' | 'edit' | 'purgeTrash' | 'purgeFolder' | null>(
        null
    );
    // ================================= | Mutations | ============================= //
    const { clipboard } = useStore();
    const [moveFolder] = useMoveFolderMutation();
    const [copyFolder] = useCopyFoldersMutation();
    const [moveFile] = useMoveFileMutation();
    const [copyFile] = useCopyFileMutation();
    const { selected: dstFldArray } = useBrowserStore();
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
                                moveFolder({ fldId: id, dstId });
                            }
                        } else {
                            if (type?.action === 'copy') {
                                copyFile({ docId: id, dstId });
                            } else if (type?.action === 'cut') {
                                moveFile({ docId: id, dstId });
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
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        <MemorizedBsEmptyTrashFill size={19} />
                        <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Empty Trash
                        </Typography>
                    </Stack>
                </MenuItem>
            )}
            <MenuItem
                selected={selected === 'purgeFolder'}
                onClick={(e) => {
                    setSelected('purgeFolder');
                    handleMenuClick(e, 'purgeFolder');
                }}
            >
                <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                    <MemorizedBsEmptyFolder size={20} />
                    <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                        Empty Folder
                    </Typography>
                </Stack>
            </MenuItem>
        </StyledMenu>
    );
};

export default FolderActionMenu;
