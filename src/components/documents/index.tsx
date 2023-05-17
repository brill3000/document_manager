import React from 'react';
import FileBrowser from './components/FileBrowser';
import '@fontsource/quicksand';
import './Themes/Sass/App.css';
import { SnackbarProvider } from 'notistack';
const FolderView = ({ title }: { title: string }) => {
    return (
        <SnackbarProvider
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            dense={true}
            style={{ fontSize: '.85rem', padding: '4px 8px' }}
        >
            <FileBrowser title={title} height="80vh" width="100%" />
        </SnackbarProvider>
    );
};

export default FolderView;
