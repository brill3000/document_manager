import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { useGetFilePropertiesQuery } from 'store/async/dms/files/filesApi';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { isArray, isEmpty, isNull, isUndefined } from 'lodash';
import { Error } from 'ui-component/LoadHandlers';
import { Box, ButtonBase, Slide, Stack, Typography, lighten, useTheme } from '@mui/material';
import { useGetFoldersPropertiesQuery } from 'store/async/dms/folders/foldersApi';
import { PermissionsUsersTable, PermissionsRolesTable } from '../../tables';
import { useGetGrantedRolesQuery, useGetGrantedUsersQuery } from 'store/async/dms/auth/authApi';
import { Close } from '@mui/icons-material';
import { LazyLoader } from '../..';

export function PermissionsDialog() {
    const { open, scrollType } = useViewStore((state) => state.openPermissionDialog);
    const setOpenPermissionDialog = useViewStore((state) => state.setOpenPermissionDialog);
    const { focused } = useBrowserStore();
    const contentRef = React.useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const [tab, setTab] = React.useState<'users' | 'roles'>('users');

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
    const { data: fileInfo, isFetching: fileInfoIsFetching } = useGetFilePropertiesQuery(
        { docId: !isNull(focused) && !isEmpty(focused) && !isNull(focused.id) ? focused.id : '' },
        {
            skip: isNull(focused) || isEmpty(focused) || isNull(focused.id) || focused.is_dir
        }
    );
    const { data: folderInfo, isFetching: folderInfoIsFetching } = useGetFoldersPropertiesQuery(
        { fldId: !isNull(focused) && !isEmpty(focused) && !isNull(focused.id) ? focused.id : '' },
        {
            skip: isNull(focused) || isEmpty(focused) || isNull(focused.id) || !focused.is_dir
        }
    );
    const { data: users, isError: usersIsError, isFetching: usersIsFetching, isLoading: usersIsLoading } = useGetGrantedUsersQuery(
        { nodeId: !isNull(focused) && !isEmpty(focused) && !isNull(focused.id) ? focused.id : '' },
        {
            skip: isNull(focused) || isEmpty(focused) || isNull(focused.id) || tab === 'roles'
        }
    );
    const { data: roles, isError: rolesIsError, isFetching: rolesIsFetching, isLoading: rolesIsLoading } = useGetGrantedRolesQuery(
        { nodeId: !isNull(focused) && !isEmpty(focused) && !isNull(focused.id) ? focused.id : '' },
        {
            skip: isNull(focused) || isEmpty(focused) || isNull(focused.id) || tab === 'users'
        }
    );

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={scrollType}
            aria-labelledby="permission-dialog-title"
            aria-describedby="permission-dialog-description"
            fullWidth
            sx={{
                '& .MuiDialogContent-root': {
                    minHeight: '70vh',
                    p: 0
                },
                '& .MuiDialog-paper': {
                    minHeight: '70vh'
                }
            }}
        >
            <DialogTitle
                id="permission-dialog-title"
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative'
                }}
            >
                <Typography>
                    Permissions for{' '}
                    {!isUndefined(fileInfo) && !isNull(fileInfo) && !fileInfoIsFetching && focused.id === fileInfo.path
                        ? fileInfo.doc_name + ' file'
                        : !isUndefined(folderInfo) && !isNull(folderInfo) && !folderInfoIsFetching && focused.id === folderInfo.path
                        ? folderInfo.doc_name + ' folder'
                        : 'Loading...'}
                </Typography>
                <Stack position="absolute" bottom={-0.8} right={5} width="10%" direction="row" justifyContent="flex-end" spacing={1}>
                    {['users', 'roles'].map((t) => (
                        <ButtonBase
                            key={t}
                            sx={{
                                py: 1,
                                px: 2,
                                color: tab === t ? theme.palette.primary.main : theme.palette.text.primary,
                                bgcolor: tab === t ? 'background.paper' : lighten(theme.palette.secondary.light, 0.8),
                                fontSize: theme.typography.body2.fontSize,
                                borderTopLeftRadius: 4,
                                borderTopRightRadius: 4,
                                borderTop: (theme) => `1px solid ${tab === t ? theme.palette.primary.light : theme.palette.divider}`,
                                borderLeft: (theme) => `1px solid ${tab === t ? theme.palette.primary.light : theme.palette.divider}`,
                                borderRight: (theme) => `1px solid ${tab === t ? theme.palette.primary.light : theme.palette.divider}`
                            }}
                            onClick={() => setTab(t as 'users' | 'roles')}
                        >
                            {t}
                        </ButtonBase>
                    ))}
                </Stack>
            </DialogTitle>
            {usersIsFetching || usersIsLoading || rolesIsFetching || rolesIsLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="70vh" minWidth="100%">
                    <LazyLoader />
                </Box>
            ) : usersIsError || rolesIsError ? (
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="70vh" minWidth="100%">
                    <Error height={50} width={50} />
                </Box>
            ) : !isNull(focused.id) ? (
                <DialogContent
                    dividers={scrollType === 'paper'}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    ref={contentRef}
                >
                    {isArray(users) && (
                        <Slide direction="right" in={tab === 'users'} container={contentRef.current}>
                            <PermissionsUsersTable users={users} nodeId={focused.id} contentRef={contentRef} isOpen={tab === 'users'} />
                        </Slide>
                    )}
                    {isArray(roles) && (
                        <Slide direction="left" in={tab === 'roles'} container={contentRef.current}>
                            <PermissionsRolesTable roles={roles} nodeId={focused.id} contentRef={contentRef} isOpen={tab === 'roles'} />
                        </Slide>
                    )}
                </DialogContent>
            ) : (
                <></>
            )}

            <DialogActions>
                <Button onClick={handleClose} color="error" variant="outlined" startIcon={<Close />}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
