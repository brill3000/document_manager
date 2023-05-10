import { alpha, Box, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoReturnUpBackOutline } from "react-icons/io5";
import { IoReturnUpForwardOutline } from "react-icons/io5";
import { DocumentType } from '../../Interface/FileBrowser';
import { HtmlTooltip } from './UI/Poppers/CustomPoppers';

// NEED TO REFACTOR THE ICON BUTTON USING STYLED COMPONENTS

export default function TopNavHandles({ handleBack, handleForward, doc }: { handleBack: () => void, handleForward: () => void, doc: DocumentType | undefined }) {
  const tooltipDelay = 200

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: 'max-content',
        justifyContent: 'space-between',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        bgcolor: 'background.paper',
        color: 'text.secondary',
        '& svg': {
          m: 0,
        },
        '& hr': {
          mx: 0,
        },
      }}
    >
      <Stack direction='row' sx={{
        transition: 'all .2s',
        transitionTimingFunction: 'ease-in-out',
        justifyContent: 'space-between',
        p: .5,
        '&:hover': {
          px: 1,
          bgcolor: theme => alpha(theme.palette.secondary.main, .05),
        }
      }}>
        <HtmlTooltip enterNextDelay={tooltipDelay} placement='bottom-end' title={
          <React.Fragment>
            <Typography color="inherit" variant='body2'>Move Back</Typography>
            <Typography fontSize={10.5}> to previous folder</Typography>
          </React.Fragment>
        } arrow>
          <IconButton
            color='warning'
            sx={{
              p: .3,
              borderRadius: 1,
              '&:hover': {
                color: theme => theme.palette.warning.contrastText,
                bgcolor: theme => theme.palette.warning.main
              }
            }}
            onClick={handleBack}
          >
            <IoReturnUpBackOutline size={17} />
          </IconButton>
        </HtmlTooltip>

        <HtmlTooltip enterNextDelay={tooltipDelay} placement='bottom-start' title={
          <React.Fragment>
            <Typography color="inherit" variant='body2'>Move Forward</Typography>
            <Typography fontSize={10.5}>Move to next folder</Typography>
          </React.Fragment>
        } arrow>
          <IconButton
            color='success'
            sx={{
              p: .3,
              borderRadius: 1,
              '&:hover': {
                color: theme => theme.palette.success.contrastText,
                bgcolor: theme => theme.palette.success.main
              }
            }}
            onClick={handleForward}>
            <IoReturnUpForwardOutline size={17} />
          </IconButton>
        </HtmlTooltip>
      </Stack>
      <Divider orientation="vertical" variant="fullWidth" flexItem />
      <Stack sx={{
        transition: 'all .2s',
        transitionTimingFunction: 'ease-in-out',
        py: .4,
        pr: .4,
        pl: .7,
        '&:hover': {
          px: 2,
          bgcolor: theme => alpha(theme.palette.secondary.main, .1),
          cursor: 'text'
        }
      }}
        direction='row'
        rowGap={1}
        alignItems='center'
      >
        <Typography variant='body2' width={250} noWrap>{doc === undefined ? 'Current folder' : doc.doc_name} </Typography>
        <IconButton
          color='secondary'
          sx={{
            p: .5,
            borderRadius: '50%',
            '&:hover': {
              color: theme => theme.palette.secondary.contrastText,
              bgcolor: theme => theme.palette.secondary.main
            }
          }}
          onClick={() => console.log('')}>
          <CiSearch size={18} />
        </IconButton>
      </Stack>
    </Box>
  );
}
