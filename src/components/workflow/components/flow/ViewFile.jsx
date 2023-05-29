import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { CancelRounded } from '@mui/icons-material';

export default function ViewFile({ children, modalType, viewUrl, isFullScreen, openView, setOpenView }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <div>
            <Dialog
                fullScreen={fullScreen || isFullScreen}
                open={openView}
                onClose={() => setOpenView(false)}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{modalType ?? 'Modal'}</DialogTitle>
                <DialogContent>{children}</DialogContent>
                <DialogActions>
                    <Button autoFocus variant="contained" startIcon={<CancelRounded />} color="error" onClick={() => setOpenView(false)}>
                        Close
                    </Button>
                    {modalType.toLowerCase() === 'view' && (
                        <Button variant="contained" color="primary" onClick={() => setOpenView(false)}>
                            {viewUrl ? (
                                <a href={viewUrl} download>
                                    Download
                                </a>
                            ) : (
                                'Download'
                            )}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}
