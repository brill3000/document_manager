import React from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Typography } from '@mui/material';
import { DocumentListProps } from '../../Interface/FileBrowser';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListDocument } from './ListDocument';
// import VirtualizedList from './UI/Virtualizer/VirtualizedList';

export function DocumentList({ documents, selected, setSelected, select, actions, setIsOverDoc, closeContext, setCloseContext, isOverDoc, scrollPosition }: DocumentListProps): React.ReactElement {

  return (
    <List sx={{
      width: '100%',
      p: 0
    }}>
      <ListItem sx={{
        position: 'sticky',
        width: '100vw',
        top: 0,
        zIndex: 2,
        pt: 0,
        pb: .5,
        borderBottom: '1px solid lightGray',
        webkitTransform: 'translate3d(0, 0, 0)'

      }}>
        <Grid container direction='row' minWidth='100vw' position='relative'>
          <Grid
            xs={3}
            zIndex={2}
            top='1%'
            left={0}
            position='sticky'
            bgcolor='#f9f7f6'
            // bgcolor='lightGrey'
            borderRight={theme => `1px solid ${theme.palette.divider}`}
            py={1}
            pl={1}
          >
            <Typography noWrap fontSize='.85rem'>Document</Typography>
          </Grid>
          <Grid
            xs={2}
            pl={2}
            // bgcolor='#f9f7f6'
            bgcolor='lightGrey'
            borderRight={theme => `1px solid ${theme.palette.divider}`}
            py={1}
          >
            <Typography noWrap fontSize='.85rem'>Type</Typography>
          </Grid>
          <Grid
            xs={3}
            pl={2}
            // bgcolor='#f9f7f6'
            bgcolor='lightGrey'
            borderRight={theme => `1px solid ${theme.palette.divider}`}
            py={1}
          >
            <Typography noWrap fontSize='.85rem'>Date Added</Typography>
          </Grid>
          <Grid
            xs={2}
            pl={2}
            // bgcolor='#f9f7f6'
            bgcolor='lightGrey'
            borderRight={theme => `1px solid ${theme.palette.divider}`}
            py={1}
          >
            <Typography noWrap fontSize='.85rem'>Archived</Typography>
          </Grid>
          <Grid
            xs={2}
            pl={2}
            // bgcolor='#f9f7f6'
            bgcolor='lightGrey'
            borderRight={theme => `1px solid ${theme.palette.divider}`}
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
          />
        )
      }
    </List >
    // <VirtualizedList />
  );
}

