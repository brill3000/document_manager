import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { useGetFileContentQuery } from 'store/async/dms/files/filesApi';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { isArray, isEmpty } from 'lodash';

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
        isLoading: fileContentIsLoading,
        isSuccess: fileContentIsSuccess
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

    return (
        <div>
            {/* <Button onClick={handleClickOpen('paper')}>scroll=paper</Button>
            <Button onClick={handleClickOpen('body')}>scroll=body</Button> */}
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scrollType}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
                <DialogContent dividers={scrollType === 'paper'}>
                    <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
                        {[...new Array(50)]
                            .map(
                                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
                            )
                            .join('\n')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
