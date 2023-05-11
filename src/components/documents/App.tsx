import React from 'react'
import FileBrowser from './components/FileBrowser'
import "@fontsource/quicksand";
import './Themes/Sass/App.css'
import { SnackbarProvider } from 'notistack';
const App = () => {
  return (
        <SnackbarProvider
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          dense={true}
          style={{ fontSize: '.85rem', padding: '4px 8px' }}
        >
          <FileBrowser height='80vh' width='100%'/>
        </SnackbarProvider>
  )
}


export default App