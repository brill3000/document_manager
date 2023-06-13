import React from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { GridVirtuosoContainer, GridVirtuosoItem, GridVirtuosoItemWrapper } from 'components/documents/views/UI/Grid';
import { GenericDocument } from 'global/interfaces';
import { useBrowserStore } from '../data/global_state/slices/BrowserMock';
import { useGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
import { useGetFolderChildrenFilesQuery } from 'store/async/dms/files/filesApi';
import { isArray, isEmpty, isUndefined } from 'lodash';
import { GridViewItem } from 'components/documents/views/item';
import { ViewsProps } from 'components/documents/Interface/FileBrowser';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { FileViewerDialog, PermissionsDialog } from 'components/documents/views/UI/Dialogs';

export function VirtualizedGrid({ height, closeContext }: ViewsProps & { height: number }) {
    const { selected, uploadFiles } = useBrowserStore();
    const { browserHeight } = useViewStore();
    const [newFiles, setNewFiles] = React.useState<GenericDocument[]>([]);
    const { data: folderChildren, error: folderChildrenError, isLoading: folderChildrenIsLoading } = useGetFoldersChildrenQuery(
        { fldId: Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1].id : '' },
        {
            skip:
                selected === null ||
                selected === undefined ||
                selected?.length < 1 ||
                isEmpty(selected[selected.length - 1]?.id) ||
                !selected[selected.length - 1]?.is_dir
        }
    );
    const {
        data: childrenDocuments,
        error: childrenDocumentsError,
        isFetching: childrenDocumentsIsFetching
    } = useGetFolderChildrenFilesQuery(
        { fldId: Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1].id : '' },
        {
            skip:
                selected === null ||
                selected === undefined ||
                selected?.length < 1 ||
                isEmpty(selected[selected.length - 1]?.id) ||
                !selected[selected.length - 1]?.is_dir
        }
    );

    React.useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const filesArray = Array.from(uploadFiles, ([_, value]) => value);
        setNewFiles(filesArray);
    }, [uploadFiles]);

    return (
        <>
            <VirtuosoGrid
                style={{ height: height ?? 400, width: '100%' }}
                data={
                    !isUndefined(folderChildren) && !isUndefined(childrenDocuments)
                        ? [
                              ...(isArray(folderChildren?.folders) ? folderChildren.folders : []),
                              ...(isArray(childrenDocuments?.documents) ? childrenDocuments.documents : []),
                              ...newFiles
                          ]
                        : []
                }
                components={{
                    Item: GridVirtuosoItem,
                    List: GridVirtuosoContainer
                }}
                itemContent={(index, document) => (
                    <GridVirtuosoItemWrapper data-index={index} height={browserHeight * 0.25}>
                        <GridViewItem closeContext={closeContext} document={document} key={document.path} splitScreen />
                    </GridVirtuosoItemWrapper>
                )}
            />
            <PermissionsDialog />
            <FileViewerDialog />
        </>
    );
}
