import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MenuItem, Stack } from '@mui/material';
import { HiOutlineTrash, HiOutlineDocumentDuplicate, HiEyeOff, HiOutlinePencil, HiOutlineBookOpen } from 'react-icons/hi';
import Divider from '@mui/material/Divider';
import { StyledMenu } from '../FolderViewer';

import { FaFileSignature } from 'react-icons/fa';
import { TiFlowMerge } from 'react-icons/ti';

export const ActionMenu = ({ contextMenu, handleClose, handleMenuClick, isFolder }) => {
    return (
        <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
                'aria-labelledby': 'demo-customized-button'
            }}
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
        >
            <MenuItem
                onClick={(e) => {
                    handleMenuClick(e, 'view');
                }}
            >
                <Stack direction="row">
                    <Box sx={{ p: 0.3 }}>
                        <HiOutlineBookOpen size={18} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">
                        {isFolder ? 'Open' : 'View'}
                    </Typography>
                </Stack>
            </MenuItem>
            <MenuItem
                onClick={(e) => {
                    handleMenuClick(e, 'copy');
                }}
            >
                <Stack direction="row">
                    <Box sx={{ p: 0.3 }}>
                        <HiOutlineDocumentDuplicate size={18} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">
                        Copy
                    </Typography>
                </Stack>
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
                onClick={(e) => {
                    handleMenuClick(e, 'rename');
                }}
            >
                <Stack direction="row">
                    <Box sx={{ p: 0.3 }}>
                        <HiOutlinePencil size={18} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">
                        Rename
                    </Typography>
                </Stack>
            </MenuItem>
            <MenuItem
                onClick={(e) => {
                    handleMenuClick(e, 'e_signature');
                }}
            >
                <Stack direction="row">
                    <Box sx={{ p: 0.3 }}>
                        <FaFileSignature size={16} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">
                        E Signature
                    </Typography>
                </Stack>
            </MenuItem>
            <MenuItem
                onClick={(e) => {
                    handleMenuClick(e, 'edit');
                }}
            >
                <Stack direction="row">
                    <Box sx={{ p: 0.3 }}>
                        <HiEyeOff size={17} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">
                        Edit Access
                    </Typography>
                </Stack>
            </MenuItem>
            <MenuItem
                onClick={(e) => {
                    handleMenuClick(e, 'workflow');
                }}
            >
                <Stack direction="row">
                    <Box sx={{ p: 0.3 }}>
                        <TiFlowMerge size={20} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">
                        Start Approval Workflow
                    </Typography>
                </Stack>
            </MenuItem>
            <MenuItem
                onClick={(e) => {
                    handleMenuClick(e, 'delete');
                }}
            >
                <Stack direction="row">
                    <Box sx={{ p: 0.3 }}>
                        <HiOutlineTrash size={18} style={{ color: 'red' }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1, color: 'red' }} color="secondary.600">
                        Delete
                    </Typography>
                </Stack>
            </MenuItem>
        </StyledMenu>
    );
};
