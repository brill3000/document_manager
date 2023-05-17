import React from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Typography, darken, lighten } from '@mui/material';
import { DocumentListProps } from '../../Interface/FileBrowser';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListDocument } from './ListDocument';
// import VirtualizedList from './UI/Virtualizer/VirtualizedList';

export function DocumentList({ documents, selected, setSelected, select, actions, setIsOverDoc, closeContext, setCloseContext, isOverDoc, scrollPosition, width, height }: DocumentListProps): React.ReactElement {

  return (
    <List sx={{
      width: width,
      p: 0
    }}>
      <ListItem sx={{
        position: 'sticky',
        width: width,
        top: 0,
        zIndex: 2,
        pt: 0,
        pb: .5,
        px: 0,
        webkitTransform: 'translate3d(0, 0, 0)',
        bgcolor: theme => lighten(theme.palette.primary.light, .9),
        borderBottom: theme => `1px solid ${darken(theme.palette.divider, .03)}`,
        minWidth: '100vw'
      }}>
        <Grid
          container
          direction='row'
          minWidth={'100vw'}
          position='relative'
          ml={1}
        >
          <Grid
            xs={3}
            zIndex={2}
            top='1%'
            left={0}
            position='sticky'
            bgcolor={theme => lighten(theme.palette.primary.light, .9)}
            borderRight={theme => `1px solid ${darken(theme.palette.divider, .03)}`}
            py={1}
            pl={1}
          >
            <Typography noWrap color={theme => theme.palette.primary.main} fontSize='.85rem'>Name</Typography>
          </Grid>
          <Grid
            xs={2}
            pl={2}
            bgcolor={theme => lighten(theme.palette.secondary.light, .7)}

            borderRight={theme => `1px solid ${darken(theme.palette.divider, .03)}`}
            py={1}
          >
            <Typography noWrap fontSize='.85rem'>Type</Typography>
          </Grid>
          <Grid
            xs={3}
            pl={2}
            bgcolor={theme => lighten(theme.palette.secondary.light, .7)}
            borderRight={theme => `1px solid ${darken(theme.palette.divider, .03)}`}
            py={1}
          >
            <Typography noWrap fontSize='.85rem'>Date Added</Typography>
          </Grid>
          <Grid
            xs={2}
            pl={2}
            bgcolor={theme => lighten(theme.palette.secondary.light, .7)}
            borderRight={theme => `1px solid ${darken(theme.palette.divider, .03)}`}
            py={1}
          >
            <Typography noWrap fontSize='.85rem'>Archived</Typography>
          </Grid>
          <Grid
            xs={2}
            pl={2}
            bgcolor={theme => lighten(theme.palette.secondary.light, .7)}
            py={1}
          >
            <Typography noWrap fontSize='.85rem'>Size</Typography>
          </Grid>
        </Grid>
      </ListItem>
      {
        documents.map((document, i: number) =>
          <ListDocument
            isColored={i % 2 === 0}
            setCloseContext={setCloseContext}
            closeContext={closeContext}
            key={document !== undefined ? document.id : i}
            document={document}
            selected={selected} setSelected={setSelected}
            select={select}
            actions={actions}
            isOverDoc={isOverDoc}
            setIsOverDoc={setIsOverDoc}
            scrollPosition={scrollPosition}
            width={width}
            height={height}
          />
        )
      }
    </List >
    // <VirtualizedList />
  );
}

