import * as React from 'react';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { HiChevronLeft } from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi";
import { HiOutlineDocumentAdd, HiOutlineDocumentDownload, HiOutlineTrash, HiOutlineDocumentSearch } from "react-icons/hi";
import { Box, ButtonBase } from '../../../node_modules/@mui/material/index';

export function FolderViewerHeader({ name, backwardNavigation, forwardNavigation, selected, newSelected }) {
  return (
    <Grid container direction="row">
      <Grid item xs={2} md={1}>
        <Stack direction="row" spacing={1}>
          <IconButton
            aria-label="backward"
            size="small"
            onClick={() => backwardNavigation()}
            disabled={selected < 1}
          >
            <HiChevronLeft style={{ fontSize: '16px' }} />
          </IconButton>
          <IconButton
            aria-label="forward"
            size="small"
            onClick={() => forwardNavigation()}
            disabled={newSelected < 1}
          >
            <HiChevronRight style={{ fontSize: '16px' }} />
          </IconButton>
        </Stack>
      </Grid>
      <Grid item xs={2} md={2}>
        <Typography variant="h6" color="secondary.600" sx={{ pt: .5 }}>
          {name}
        </Typography>
      </Grid>
      <Grid item xs={8} md={9}>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          justifyContent='flex-end'
        >
          <ButtonBase variant="outlined" sx={{ p: .5, borderRadius: 1 }}>
            <Stack direction="row">
              <Box sx={{ p: .3 }}>
                <HiOutlineDocumentSearch style={{ fontSize: '16px' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ fontSize: 13 }} color="secondary.600">Search</Typography>
            </Stack>
          </ButtonBase>
          <ButtonBase variant="outlined" sx={{ p: .5, borderRadius: 1 }}>
            <Stack direction="row">
              <Box sx={{ p: .3 }}>
                <HiOutlineDocumentDownload style={{ fontSize: '16px' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ fontSize: 13 }} color="secondary.600">Download</Typography>
            </Stack>
          </ButtonBase>
          <ButtonBase variant="outlined" sx={{ p: .5, borderRadius: 1 }}>
            <Stack direction="row">
              <Box sx={{ p: .3 }}>
                <HiOutlineDocumentAdd style={{ fontSize: '16px' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ fontSize: 13 }} color="secondary.600">Add</Typography>
            </Stack>
          </ButtonBase>
          <ButtonBase variant="outlined" sx={{ p: .5, borderRadius: 1 }}>
            <Stack direction="row">
              <Box sx={{ p: .3 }}>
                <HiOutlineTrash style={{ fontSize: '16px', color: 'red' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ fontSize: 13, color: 'red' }}>Remove</Typography>
            </Stack>
          </ButtonBase>
        </Stack>
      </Grid>
    </Grid>
  );
}
