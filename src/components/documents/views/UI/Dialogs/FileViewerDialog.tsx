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
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';
import { Box, Typography } from '@mui/material';

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
                        p: 0,
                        minHeight: '80vh'
                    }
                }}
            >
                {fileContentIsFetching || fileContentIsLoading || fileInfoIsFetching || fileInfoIsLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="100%" minWidth="100%">
                        <GoogleLoader height={100} width={100} loop={true} />
                    </Box>
                ) : fileContentError || fileInfoError ? (
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="100%" minWidth="100%">
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
                                <PdfViewer content={fileContent} title={fileInfo.doc_name} />
                            ) : (
                                <Typography>Cannot View Ms Suite files</Typography>
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
