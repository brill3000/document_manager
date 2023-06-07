import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { useGetFileContentQuery, useGetFilePropertiesQuery } from 'store/async/dms/files/filesApi';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { isArray, isEmpty } from 'lodash';
import PdfViewer from './PDFViewer';
import { Error } from 'ui-component/LoadHandlers';
import { Box } from '@mui/material';
import MsFileViewer from './MsFileViewer';
import { LazyLoader } from '../..';

export default function FileViewerDialog() {
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
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scrollType}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullWidth
                sx={{
                    '& .MuiDialogContent-root': {
                        minHeight: '70vh',
                        p: 0
                    },
                    '& .MuiBackdrop-root': {
                        backdropFilter: 'blur(2.5px)', // This be the blur
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        opacity: 1,
                        transition: 'opacity blur 125ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
                    },
                    '& .MuiDialog-paper': {
                        minHeight: '70vh',
                        boxShadow:
                            '0px 11px 15px -7px rgba(0, 0, 0, 0.01),0px 24px 38px 3px rgba(0, 0, 0, 0.02),0px 9px 46px 8px rgba(0, 0, 0, 0.04)'
                    }
                }}
            >
                {fileContentIsFetching || fileContentIsLoading || fileInfoIsFetching || fileInfoIsLoading ? (
                    <LazyLoader />
                ) : fileContentError || fileInfoError ? (
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="70vh" minWidth="100%">
                        <Error height={50} width={50} />
                    </Box>
                ) : fileContent !== null && fileContent !== undefined && fileInfo !== null && fileInfo !== undefined ? (
                    <>
                        <DialogTitle id="scroll-dialog-title">{fileInfo.doc_name}</DialogTitle>
                        <DialogContent
                            dividers={scrollType === 'paper'}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            {!(
                                fileInfo.mimeType.includes('doc') ||
                                fileInfo.mimeType.includes('docx') ||
                                fileInfo.mimeType.includes('application/msword') ||
                                fileInfo.mimeType.includes('application/msword') ||
                                fileInfo.mimeType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                                fileInfo.mimeType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
                                fileInfo.mimeType.includes('application/vnd.ms-powerpoint') ||
                                fileInfo.mimeType.includes('application/vnd.openxmlformats-officedocument.presentationml.presentation')
                            ) ? (
                                <PdfViewer content={fileContent} title={fileInfo.doc_name} mimeType={fileInfo.mimeType} />
                            ) : (
                                <MsFileViewer content={fileContent} title={fileInfo.doc_name} mimeType={fileInfo.mimeType} />
                            )}
                        </DialogContent>
                    </>
                ) : (
                    <></>
                )}

                <DialogActions>
                    <Button onClick={handleClose} color="error" variant="contained">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary" variant="outlined">
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
