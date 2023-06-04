import React from 'react';
import FileBrowser from 'components/documents/FileBrowser';
import '@fontsource/quicksand';

const FolderView = ({ title }: { title: string }) => {
    return <FileBrowser title={title} height="85vh" width="100%" />;
};

export default FolderView;
