import { Divider, MenuItem, Stack, Typography } from '@mui/material';
import React from 'react';
import { BsFolderPlus } from 'react-icons/bs';
import { CiEraser } from 'react-icons/ci';
import { StyledMenu } from './StyledMenu';
import { BiPaste, BiBrush } from 'react-icons/bi';
import { IoMdTrash } from 'react-icons/io';
import { theme } from '../../../../Themes/theme';
import { useCopyFoldersMutation, useMoveFolderMutation } from 'store/async/dms/folders/foldersApi';
import { useStore } from 'components/documents/data/global_state';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';

interface ActionMenuProps {
    contextMenu: { mouseX: number; mouseY: number } | null;
    handleMenuClose: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, close: () => void) => void;
    handleMenuClick: (
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        type: 'new_folder' | 'paste' | 'paste_all' | 'edit' | 'delete'
    ) => void;
}

export const FolderActionMenu = ({ contextMenu, handleMenuClose, handleMenuClick }: ActionMenuProps) => {
    const [selected, setSelected] = React.useState<'new_folder' | 'paste' | 'paste_all' | 'edit' | 'delete' | null>(null);
    // ================================= | Mutations | ============================= //
    const { clipboard, addToClipBoard } = useStore();
    const [move] = useMoveFolderMutation();
    const [copy] = useCopyFoldersMutation();
    const { selected: dstFldArray } = useBrowserStore();

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
                selected={selected === 'new_folder'}
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
                selected={selected === 'paste'}
                onClick={(e) => {
                    setSelected('paste');
                    handleMenuClick(e, 'paste');
                    if (clipboard.size > 0 && Array.isArray(dstFldArray) && dstFldArray.length > 0) {
                        const keysArray = [...clipboard.keys()];
                        const fldId = keysArray[keysArray.length - 1];
                        const type = clipboard.get(fldId);
                        const dstId = dstFldArray[dstFldArray.length - 1].id;
                        if (type === 'copy') {
                            copy({ fldId, dstId });
                        } else if (type === 'cut') {
                            move({ fldId, dstId });
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
                selected={selected === 'paste_all'}
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
                selected={selected === 'edit'}
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
            <MenuItem
                selected={selected === 'delete'}
                onClick={(e) => {
                    setSelected('delete');
                    handleMenuClick(e, 'delete');
                }}
            >
                <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                    <IoMdTrash size={20} color={theme.palette.error.main} />
                    <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                        Delete
                    </Typography>
                </Stack>
            </MenuItem>
        </StyledMenu>
    );
};

export default FolderActionMenu;
