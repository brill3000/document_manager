import { ThemeProvider } from '@mui/material'
import React from 'react'
import FileBrowser from './components/FileBrowser'
import { theme } from './Themes/theme'
import "@fontsource/quicksand";
import './Themes/Sass/App.css'
import { SnackbarProvider } from 'notistack';
const App = () => {
  return (
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          dense={true}
          style={{ fontSize: '.85rem', padding: '4px 8px' }}
        >
          <FileBrowser height='80vh' width='100%'/>
        </SnackbarProvider>
      </ThemeProvider>
  )
}


export default App