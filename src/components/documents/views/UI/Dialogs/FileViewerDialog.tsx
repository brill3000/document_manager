import * as React from 'react';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { useGetFileContentQuery, useGetFilePropertiesQuery } from 'store/async/dms/files/filesApi';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { isArray, isEmpty } from 'lodash';

export function FileViewerDialog() {
    const { open, scrollType } = useViewStore((state) => state.viewFile);
    const setViewFile = useViewStore((state) => state.setViewFile);
    const { selected } = useBrowserStore();

    // const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    //     setOpen(true);
    //     setScroll(scrollType);
    // };

    const handleClose = () => {
        setViewFile(false, 'paper');
    };

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);
    // ================================= | Getters | ============================= //
    const {
        data: fileContent,
        error: fileContentError,
        isFetching: fileContentIsFetching,
        isLoading: fileContentIsLoading
    } = useGetFileContentQuery(
        { docId: isArray(selected) && !isEmpty(selected) ? selected[selected.length - 1].id : '' },
        {
            skip:
                !isArray(selected) ||
                isEmpty(selected) ||
                selected[selected?.length - 1]?.is_dir ||
                isEmpty(selected[selected?.length - 1]?.id)
        }
    );
    const {
        data: fileInfo,
        error: fileInfoError,
        isFetching: fileInfoIsFetching,
        isLoading: fileInfoIsLoading
    } = useGetFilePropertiesQuery(
        { docId: isArray(selected) && !isEmpty(selected) ? selected[selected.length - 1].id : '' },
        {
            skip:
                !isArray(selected) ||
                isEmpty(selected) ||
                selected[selected?.length - 1]?.is_dir ||
                isEmpty(selected[selected?.length - 1]?.id)
        }
    );
    return <></>;
}
