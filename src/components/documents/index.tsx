import React from 'react';
import FileBrowser from 'components/documents/FileBrowser';
import '@fontsource/quicksand';
import { SearchDialog } from 'components/documents/views/UI/Dialogs';
import { useBrowserStore } from './data/global_state/slices/BrowserMock';
const FolderView = ({ title }: { title: string }) => {
    const { searchDialogIsOpen } = useBrowserStore();
    return (
        <>
            <FileBrowser title={title} height="85vh" width="100%" />
            {searchDialogIsOpen && <SearchDialog />}
        </>
    );
};

export default FolderView;
