import {
    Box,
    Divider,
    Fade,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    Popper,
    Stack,
    Typography
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { StyledMenu } from './StyledMenu';
import { theme } from '../../../Themes/theme';
import { MemorizedBsFillFileEarmarkUnZipFill } from 'components/documents/Icons/fileIcon';
import { RiFileWarningLine, RiFolderWarningLine } from 'react-icons/ri';
import { DocumentActionMenuType } from 'global/interfaces';
import zIndex from '@mui/material/styles/zIndex';

import { MdSecurity } from 'react-icons/md';
import { CiEdit, CiEraser } from 'react-icons/ci';
import { BsCaretLeft, BsCaretRight, BsDatabaseAdd, BsFolderPlus, BsGear, BsKey, BsTrash } from 'react-icons/bs';
import { IoMdCopy } from 'react-icons/io';
import { IoCutOutline } from 'react-icons/io5';
import { TbCategory2 } from 'react-icons/tb';
import { LeftSidebar } from '../../main/sidebars';
import { UriHelper } from 'utils/constants/UriHelper';
import { RenderTree } from 'components/documents/Interface/FileBrowser';
import { useAddToCategoryMutation, useLazyGetFilePropertiesQuery, useRemoveFromCategoryMutation } from 'store/async/dms/files/filesApi';
import { enqueueSnackbar } from 'notistack';
import { useLazyGetFoldersPropertiesQuery } from 'store/async/dms/folders/foldersApi';
import { uniq } from 'lodash';

interface ActionMenuProps {
    contextMenu: { mouseX: number; mouseY: number } | null;
    locked: boolean;
    is_dir: boolean;
    is_zip?: boolean;
    nodeId: string | null;
    handleMenuClose: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    handleMenuClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>, type: DocumentActionMenuType['type']) => void;
}

export const ActionMenu = ({ contextMenu, handleMenuClose, handleMenuClick, locked, is_dir, is_zip, nodeId }: ActionMenuProps) => {
    const [selected, setSelected] = React.useState<DocumentActionMenuType['type'] | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLLIElement | null>(null);
    const [open, setOpen] = useState(false);

    const handleOpenSubMenu = useCallback((event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        setAnchorEl(open === true ? null : event.currentTarget);
        setOpen((prev) => !prev);
    }, []);

    React.useEffect(() => {
        return () => {
            setSelected(null);
            setOpen(false);
            setAnchorEl(null);
        };
    }, []);
    return (
        <>
            <AddMenuOption open={open} anchorEl={anchorEl} uuid={nodeId} is_dir={is_dir} />
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button'
                }}
                open={contextMenu !== null}
                onClose={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                    handleMenuClose(e);
                    setSelected(null);
                    setOpen(false);
                    setAnchorEl(null);
                }}
                anchorReference="anchorPosition"
                verticalOrigin="top"
                horizontalOrigin="left"
                anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
                disableAutoFocusItem={true}
            >
                <MenuItem
                    selected={selected === 'open'}
                    onClick={(e) => {
                        setSelected('open');
                        handleMenuClick(e, 'open');
                    }}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        <BsFolderPlus size={18} />
                        <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Open
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem
                    selected={selected === 'copy'}
                    onClick={(e) => {
                        setSelected('copy');
                        handleMenuClick(e, 'copy');
                    }}
                    disabled={locked}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        <IoMdCopy size={20} />
                        <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Copy
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem
                    selected={selected === 'cut'}
                    onClick={(e) => {
                        setSelected('cut');
                        handleMenuClick(e, 'cut');
                    }}
                    disabled={locked}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        <IoCutOutline size={20} />
                        <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Cut
                        </Typography>
                    </Stack>
                </MenuItem>
                <Divider sx={{ my: 0.2 }} variant="middle" />
                <MenuItem
                    selected={selected === 'rename'}
                    onClick={(e) => {
                        setSelected('rename');
                        handleMenuClick(e, 'rename');
                    }}
                    disabled={locked}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        <CiEdit size={21} />
                        <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Rename
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem
                    selected={selected === 'edit'}
                    onClick={(e) => {
                        setSelected('edit');
                        handleMenuClick(e, 'edit');
                    }}
                    disabled={locked}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        <CiEraser size={20} />
                        <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Edit
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem
                    selected={selected === 'extract'}
                    onClick={(e) => {
                        setSelected('extract');
                        handleMenuClick(e, 'extract');
                    }}
                    disabled={locked || is_dir || !is_zip}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        <MemorizedBsFillFileEarmarkUnZipFill size={17} />
                        <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Extract
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem
                    selected={selected === 'permissions'}
                    onClick={(e) => {
                        setSelected('permissions');
                        handleMenuClick(e, 'permissions');
                    }}
                    disabled={locked}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        <MdSecurity size={18} color={theme.palette.info.main} />
                        <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Permissions
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem
                    selected={selected === 'add'}
                    onClick={(e) => {
                        setSelected('add');
                        handleMenuClick(e, 'add');
                        handleOpenSubMenu(e);
                    }}
                    disabled={locked}
                >
                    <Stack
                        height="max-content"
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                        spacing={1}
                        p={0.3}
                        borderRadius={1}
                    >
                        <Stack spacing={1} width="max-content" direction="row">
                            <BsGear size={18} color={theme.palette.warning.dark} />
                            <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                                Add
                            </Typography>
                        </Stack>
                        {open === true ? (
                            <BsCaretLeft color={theme.palette.primary.main} />
                        ) : (
                            <BsCaretRight color={theme.palette.primary.main} />
                        )}
                    </Stack>
                </MenuItem>
                <Divider sx={{ my: 0.2 }} variant="middle" />
                <MenuItem
                    selected={selected === 'moveToTrash'}
                    onClick={(e) => {
                        setSelected('moveToTrash');
                        handleMenuClick(e, 'moveToTrash');
                    }}
                    disabled={locked}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        <BsTrash size={17} color={theme.palette.error.main} />
                        <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Move {is_dir ? 'folder' : 'file'} to Trash
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem
                    selected={selected === 'delete'}
                    onClick={(e) => {
                        setSelected('delete');
                        handleMenuClick(e, 'delete');
                    }}
                    disabled={locked}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        {is_dir ? (
                            <RiFolderWarningLine size={17} color={theme.palette.error.main} />
                        ) : (
                            <RiFileWarningLine size={17} color={theme.palette.error.main} />
                        )}
                        <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Delete {is_dir ? 'folder' : 'file'}
                        </Typography>
                    </Stack>
                </MenuItem>
            </StyledMenu>
        </>
    );
};

const AddMenuOption = ({ open, anchorEl, uuid, is_dir }: { open: boolean; anchorEl: any; uuid: string | null; is_dir: boolean }) => {
    // ======================== | STATE | ========================= //

    const [selected, setSelected] = useState<'metadata' | 'categories' | 'keyword' | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedFolders, setSelectedFolders] = useState<string[] | null>(null);
    const [addToCategory] = useAddToCategoryMutation();
    const [removeFromCategory] = useRemoveFromCategoryMutation();
    const [getFileInfo, fileInfo] = useLazyGetFilePropertiesQuery();
    const [getFolderInfo, folderInfo] = useLazyGetFoldersPropertiesQuery();

    // ======================== | EVENTS | ========================= //
    const handleSelectCategory = useCallback(async (node: RenderTree) => {
        if (node.id === '/okm:categories') return;
        if (uuid === null) return;
        let isSelected;
        const catId = node.id;
        const nodeId = uuid;
        setSelectedFolders((selectedFolders) => {
            if (!Array.isArray(selectedFolders)) return [node.id];
            isSelected = selectedFolders.some((selectedFolder) => selectedFolder === node.id);
            if (isSelected) {
                return [...selectedFolders?.filter((selectedFolder) => selectedFolder !== node.id)];
            } else {
                return [...selectedFolders, node.id];
            }
        });
        try {
            if (isSelected) {
                await removeFromCategory({
                    nodeId,
                    catId
                }).unwrap();
                enqueueSnackbar(`Category Removed`, { variant: 'success' });
            } else {
                await addToCategory({
                    nodeId,
                    catId
                }).unwrap();
                enqueueSnackbar(`Category Added`, { variant: 'success' });
            }
        } catch (error) {
            enqueueSnackbar(`Failed to ${isSelected === true ? 'Remove' : 'Add'} Category`, { variant: 'error' });
        }
    }, []);
    // ======================== | EFFECTS | ========================= //

    useEffect(() => {
        return () => {
            setSelectedFolders(null);
            setSelected(null);
        };
    }, []);
    useEffect(() => {
        if (open === false) return;
        setSelected(null);
        setSelectedFolders(null);
    }, [open]);
    useEffect(() => {
        if (open === false) return;
        if (is_dir === true) {
            if (folderInfo.data === null || folderInfo.data === undefined) return;
            const { categories: data } = folderInfo.data;
            const categories = Array.isArray(data) ? data.map((category) => category.path) : [];
            setSelectedFolders((selectedFolders) =>
                Array.isArray(selectedFolders) && selectedFolders.length > 0 ? uniq([...selectedFolders, ...categories]) : [...categories]
            );
        } else {
            if (fileInfo.data === null || fileInfo.data === undefined) return;
            const { categories: data } = fileInfo.data;
            const categories = Array.isArray(data) ? data.map((category) => category.path) : [];
            setSelectedFolders((selectedFolders) =>
                Array.isArray(selectedFolders) && selectedFolders.length > 0 ? uniq([...selectedFolders, ...categories]) : [...categories]
            );
        }
    }, [folderInfo, fileInfo]);
    useEffect(() => {
        if (uuid === null) return;
        setIsLoading(true);
        if (is_dir) {
            getFolderInfo({ fldId: uuid })
                .then(() => setIsLoading(false))
                .catch(() => setIsLoading(false));
        } else {
            getFileInfo({ docId: uuid })
                .then(() => setIsLoading(false))
                .catch(() => setIsLoading(false));
        }
    }, [selected, is_dir]);

    return (
        <Popper open={open} anchorEl={anchorEl} placement="right-start" transition sx={{ zIndex: zIndex.modal }}>
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Paper
                        sx={{
                            '& .MuiPaper-root': {
                                borderRadius: 6,
                                marginTop: theme.spacing(1),
                                minWidth: selected === 'categories' ? 300 : 180,
                                maxWidth: 200,
                                oveflowY: 'auto',
                                color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
                                boxShadow:
                                    'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px'
                            }
                        }}
                    >
                        {selected === null && (
                            <List disablePadding>
                                <ListItemButton onClick={() => setSelected('keyword')}>
                                    <ListItemIcon>
                                        <BsKey size={18} color={theme.palette.warning.dark} />
                                    </ListItemIcon>
                                    <ListItemText disableTypography primary={<Typography variant="caption">Keyword</Typography>} />
                                </ListItemButton>
                                <ListItemButton onClick={() => setSelected('categories')}>
                                    <ListItemIcon>
                                        <TbCategory2 size={18} color={theme.palette.warning.dark} />
                                    </ListItemIcon>
                                    <ListItemText disableTypography primary={<Typography variant="caption">Category</Typography>} />
                                </ListItemButton>
                                <ListItemButton onClick={() => setSelected('metadata')}>
                                    <ListItemIcon>
                                        <BsDatabaseAdd size={18} color={theme.palette.warning.dark} />
                                    </ListItemIcon>
                                    <ListItemText disableTypography primary={<Typography variant="caption">Metadata</Typography>} />
                                </ListItemButton>
                            </List>
                        )}
                        {selected === 'categories' && isLoading === false && (
                            <Stack p={1} width="100%" height="100%">
                                <Typography variant="caption">Select category</Typography>
                                <Box height={150} overflow="auto">
                                    <LeftSidebar
                                        standAlone
                                        root={UriHelper.REPOSITORY_GET_ROOT_CATEGORIES}
                                        customHandleClick={handleSelectCategory}
                                        selectedList={selectedFolders}
                                    />
                                </Box>
                            </Stack>
                        )}
                    </Paper>
                </Fade>
            )}
        </Popper>
    );
};
export default ActionMenu;
