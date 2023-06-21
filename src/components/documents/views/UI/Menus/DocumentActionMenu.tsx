import { Divider, MenuItem, Stack, Typography } from '@mui/material';
import React from 'react';
import { BsFolderPlus, BsTrash } from 'react-icons/bs';
import { IoMdCopy } from 'react-icons/io';
import { IoCutOutline } from 'react-icons/io5';
import { StyledMenu } from './StyledMenu';
import { CiEdit, CiEraser } from 'react-icons/ci';
import { theme } from '../../../Themes/theme';
import { MdSecurity } from 'react-icons/md';
import { MemorizedBsFillFileEarmarkUnZipFill } from 'components/documents/Icons/fileIcon';
import { RiFileWarningLine, RiFolderWarningLine } from 'react-icons/ri';
import { DocumentActionMenuType } from 'global/interfaces';

interface ActionMenuProps {
    contextMenu: { mouseX: number; mouseY: number } | null;
    locked: boolean;
    is_dir: boolean;
    is_zip?: boolean;
    handleMenuClose: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    handleMenuClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>, type: DocumentActionMenuType['type']) => void;
}

export const ActionMenu = ({ contextMenu, handleMenuClose, handleMenuClick, locked, is_dir, is_zip }: ActionMenuProps) => {
    const [selected, setSelected] = React.useState<DocumentActionMenuType['type'] | null>(null);
    React.useEffect(() => {
        return () => {
            setSelected(null);
        };
    });
    return (
        <>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button'
                }}
                open={contextMenu !== null}
                onClose={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                    handleMenuClose(e);
                    setSelected(null);
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

export default ActionMenu;
