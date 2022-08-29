import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MenuItem, Stack } from '@mui/material';
import { HiOutlineTrash, HiOutlineDocumentDuplicate, HiEyeOff, HiOutlinePencil, HiOutlineBookOpen } from "react-icons/hi";
import Divider from '@mui/material/Divider';
import { StyledMenu } from '../FolderViewer';

export const ActionMenu = ({ contextMenu, handleClose, handleMenuClick, isFolder }) => {
  return <StyledMenu
    id="demo-customized-menu"
    MenuListProps={{
      'aria-labelledby': 'demo-customized-button',
    }}
    open={contextMenu !== null}
    onClose={handleClose}
    anchorReference="anchorPosition"
    anchorPosition={contextMenu !== null
      ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
      : undefined}
  >
    <MenuItem
      onClick={(e) => {
        handleMenuClick(e, 'view');
      }}
    >
      <Stack direction="row">
        <Box sx={{ p: .3 }}>
          <HiOutlineBookOpen style={{ fontSize: '17px' }} />
        </Box>
        <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">{isFolder ? 'Open' : 'View'}</Typography>
      </Stack>
    </MenuItem>
    <MenuItem onClick={(e) => {
      handleMenuClick(e, 'copy');
    }}
    >
      <Stack direction="row">
        <Box sx={{ p: .3 }}>
          <HiOutlineDocumentDuplicate style={{ fontSize: '17px' }} />
        </Box>
        <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">Copy</Typography>
      </Stack>
    </MenuItem>
    <Divider sx={{ my: 0.5 }} />
    <MenuItem
      onClick={(e) => {
        handleMenuClick(e, 'rename');
      }}
    >
      <Stack direction="row">
        <Box sx={{ p: .3 }}>
          <HiOutlinePencil style={{ fontSize: '17px' }} />
        </Box>
        <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">Rename</Typography>
      </Stack>
    </MenuItem>
    <MenuItem
      onClick={(e) => {
        handleMenuClick(e, 'edit');
      }}
    >
      <Stack direction="row">
        <Box sx={{ p: .3 }}>
          <HiEyeOff style={{ fontSize: '17px' }} />
        </Box>
        <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">Edit Access</Typography>
      </Stack>
    </MenuItem>
    <MenuItem
      onClick={(e) => {
        handleMenuClick(e, 'delete');
      }}
    >
      <Stack direction="row">
        <Box sx={{ p: .3 }}>
          <HiOutlineTrash style={{ fontSize: '17px', color: 'red' }} />
        </Box>
        <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1, color: 'red' }} color="secondary.600">Delete</Typography>
      </Stack>
    </MenuItem>
  </StyledMenu>;
}
