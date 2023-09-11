import { Dialog, DialogContent, DialogTitle, Divider, List, ListItem, ListItemIcon, ListItemText, Typography, alpha } from '@mui/material';
import { LazyLoader } from 'components/documents/views';
import { useAppContext } from 'context/appContext';
import { MdAdminPanelSettings } from 'react-icons/md';
import { useGetNameQuery, useGetRolesByUserQuery } from 'store/async/dms/auth/authApi';

function RolesDialog({ open, handleClose }: { open: boolean; handleClose: () => void }) {
    const { user } = useAppContext();

    const { data: roles, isLoading } = useGetRolesByUserQuery({ user: user });
    const { data: userName, isError } = useGetNameQuery({ user: user });
    return (
        <Dialog
            maxWidth="xs"
            fullWidth
            sx={{
                '& .MuiPaper-root': {
                    boxShadow: (theme) =>
                        `inset 0 0 4px ${alpha(theme.palette.common.black, 0.09)}, 0 0 20px ${alpha(theme.palette.common.black, 0.15)} `,
                    borderRadius: 2,
                    height: '60vh'
                }
            }}
            open={open}
            onClose={() => handleClose()}
        >
            <DialogTitle>{userName + ' Roles'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 0 }}>
                {isLoading === true && <LazyLoader />}
                {roles && Array.isArray(roles.roles) && (
                    <List>
                        {roles.roles.map((role: string) => {
                            return (
                                <ListItem>
                                    <ListItemIcon>
                                        <MdAdminPanelSettings />
                                    </ListItemIcon>
                                    <ListItemText primary={role} />
                                </ListItem>
                            );
                        })}
                    </List>
                )}
                {isLoading === false && Array.isArray(roles) && roles.length === 0 && <Typography>User has no roles assigned</Typography>}
            </DialogContent>
        </Dialog>
    );
}

export default RolesDialog;
