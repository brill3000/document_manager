import React from 'react';
import FileBrowser from 'components/documents/FileBrowser';
import '@fontsource/montserrat';
import { FileViewerDialog, SearchDialog } from 'components/documents/views/UI/Dialogs';
import { useBrowserStore } from './data/global_state/slices/BrowserMock';
import { useViewStore } from './data/global_state/slices/view';
const FolderView = ({ title }: { title: string }) => {
    const { searchDialogIsOpen } = useBrowserStore();
    const { filesOpened } = useViewStore();
    const renderItem = React.useCallback(
        () => Array.from(filesOpened.values()).map((filePath) => <FileViewerDialog key={filePath} filePath={filePath} />),
        [filesOpened]
    );
    return (
        <>
            <FileBrowser title={title} height="85vh" width="100%" />
            {searchDialogIsOpen && <SearchDialog />}
            {renderItem()}
        </>
    );
};

export default FolderView;
