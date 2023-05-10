import React from 'react';
import { closeSnackbar, SnackbarKey } from "notistack";
import { Button } from '@mui/material';

// add action to an individual snackbar
const WithUndo = (snackbarId: SnackbarKey) => (
  <>
    <Button
      size='small'
      onClick={() => { alert(`I belong to snackbar with id ${snackbarId}`) }}
      sx={{
        textTransform: 'lowercase'
      }}
    >
      Undo
    </Button>
    <Button
      size='small'
      onClick={() => { closeSnackbar(snackbarId) }} color='error'
      sx={{
        textTransform: 'lowercase'
      }}
    >
      Dismiss
    </Button>
  </>
);


export {
  WithUndo
}