import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { useGetFilePropertiesQuery } from 'store/async/dms/files/filesApi';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { isArray, isEmpty, isNull } from 'lodash';
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';
import { Box } from '@mui/material';
import { useGetFoldersPropertiesQuery } from 'store/async/dms/folders/foldersApi';
import PermissionsTable from '../../tables/PermissionsTable';
import { useGetGrantedUsersQuery, useGetNameQuery, useGetUsersQuery } from 'store/async/dms/auth/authApi';

export default function PermissionsDialog() {
    const { open, scrollType } = useViewStore((state) => state.openPermissionDialog);
    const setOpenPermissionDialog = useViewStore((state) => state.setOpenPermissionDialog);
    const { focused } = useBrowserStore();
    const [userList, setUsersList] = React.useState<{ id: string; name: string | null }[] | null>(null);

    const handleClose = () => {
        setOpenPermissionDialog(false, 'paper');
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
        data: fileInfo,
        error: fileInfoError,
        isFetching: fileInfoIsFetching,
        isLoading: fileInfoIsLoading
    } = useGetFilePropertiesQuery(
        { docId: !isNull(focused) && !isEmpty(focused) && !isNull(focused.id) ? focused.id : '' },
        {
            skip: isNull(focused) || isEmpty(focused) || isNull(focused.id) || focused.is_dir
        }
    );
    const {
        data: folderInfo,
        error: folderInfoError,
        isFetching: folderInfoIsFetching,
        isLoading: folderInfoIsLoading
    } = useGetFoldersPropertiesQuery(
        { fldId: !isNull(focused) && !isEmpty(focused) && !isNull(focused.id) ? focused.id : '' },
        {
            skip: isNull(focused) || isEmpty(focused) || isNull(focused.id) || !focused.is_dir
        }
    );
    const { data: users, isError: usersIsError, isFetching: usersIsFetching, isLoading: usersIsLoading } = useGetGrantedUsersQuery(
        { nodeId: !isNull(focused) && !isEmpty(focused) && !isNull(focused.id) ? focused.id : '' },
        {
            skip: isNull(focused) || isEmpty(focused) || isNull(focused.id) || !focused.is_dir
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
                        backdropFilter: 'blur(3px)', // This be the blur
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        opacity: 1,
                        transition: 'opacity blur 125ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
                    },
                    '& .MuiDialog-paper': {
                        minHeight: '70vh',
                        transition: 'box-shadow 30ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
                    }
                }}
            >
                {usersIsFetching || usersIsLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="70vh" minWidth="100%">
                        <GoogleLoader height={100} width={100} loop={true} />
                    </Box>
                ) : usersIsError ? (
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="70vh" minWidth="100%">
                        <Error height={50} width={50} />
                    </Box>
                ) : isArray(users) ? (
                    <>
                        <DialogTitle id="scroll-dialog-title">Permissions</DialogTitle>
                        <DialogContent
                            dividers={scrollType === 'paper'}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <PermissionsTable users={users} />
                        </DialogContent>
                    </>
                ) : (
                    <></>
                )}

                <DialogActions>
                    <Button onClick={handleClose} color="error" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="success" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
