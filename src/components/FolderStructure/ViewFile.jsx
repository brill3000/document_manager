import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenFileView } from 'store/reducers/documents';
import { Box, Grid, Typography } from '@mui/material';
import SignatureCanvas from 'react-signature-canvas';
import { Stack } from '@mui/system';

export default function ViewFile({ children, modalType, viewUrl, isFullScreen }) {
    const open = useSelector((state) => state.documents.openFileView);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();

    return (
        <div>
            <Dialog
                fullScreen={fullScreen || isFullScreen}
                open={open}
                onClose={() => dispatch(setOpenFileView({ openFileView: false }))}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{modalType ?? 'Modal'}</DialogTitle>
                <DialogContent>
                    <Stack direction={'column'}>
                        {children}
                        {modalType === 'e_signature' && (
                            <Stack
                                direction={'column'}
                                sx={{
                                    position: 'absolute',
                                    bgcolor: 'wheat',
                                    borderRadius: 3,
                                    bottom: 10,
                                    left: '20%',
                                    zIndex: 2500,
                                    p: 1
                                }}
                            >
                                <Typography variant="body1">Enter Signature below...</Typography>
                                <SignatureCanvas penColor="green" canvasProps={{ width: 200, height: 200, className: 'sigCanvas' }} />
                            </Stack>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus variant="outlined" color="error" onClick={() => dispatch(setOpenFileView({ openFileView: false }))}>
                        Cancel
                    </Button>
                    {modalType?.toLowerCase() === 'view' && (
                        <Button variant="contained" color="primary" onClick={() => dispatch(setOpenFileView({ openFileView: false }))}>
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
