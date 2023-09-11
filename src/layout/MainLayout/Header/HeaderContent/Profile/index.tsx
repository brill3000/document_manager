import PropTypes from 'prop-types';
import { ReactNode, SyntheticEvent, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    ButtonBase,
    CardContent,
    ClickAwayListener,
    Grid,
    IconButton,
    Paper,
    Popper,
    Stack,
    Tab,
    Tabs,
    Typography
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';

// assets
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { getInitials } from 'components/departments/utils/get-initials';
import { authApi, useGetNameQuery, useLogoutUserMutation } from 'store/async/dms/auth/authApi';
import { isNull } from 'lodash';
import { useDispatch } from 'react-redux';
import { foldersApi } from 'store/async/dms/folders/foldersApi';
import { filesApi } from 'store/async/dms/files/filesApi';
import { useAppContext } from 'context/appContext';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }: { children: ReactNode; value: number; index: number; dir: string }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
            {value === index && children}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index: number) {
    return {
        id: `profile-tab-${index}`,
        'aria-controls': `profile-tabpanel-${index}`
    };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
    // ==============================|| THEME ||============================== //
    const theme = useTheme();
    // ==============================|| STATES ||============================== //
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<number>(0);

    // ==============================|| REF ||============================== //
    const anchorRef = useRef<HTMLButtonElement>(null);
    // ==============================|| ROUTER ||============================== //
    const navigator = useNavigate();
    // const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    // ==============================|| CONTEXT ||============================== //
    const { user, logout } = useAppContext();
    // ==============================|| EVENTS ||============================== //
    const handleLogout = async () => {
        try {
            typeof logout === 'function' && logout();
            dispatch(foldersApi.util.resetApiState());
            dispatch(filesApi.util.resetApiState());
            dispatch(authApi.util.resetApiState());
            navigator('/login');
        } catch (err) {
            navigator('/login');
            // const message = `User Logout Failed`;
            // enqueueSnackbar(message, { variant: 'error' });
        }
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: MouseEvent | TouchEvent) => {
        // @ts-expect-error expected
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const iconBackColorOpen = 'grey.300';

    const { data: userName, isError } = useGetNameQuery({ user: user });

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <ButtonBase
                sx={{
                    p: 0.25,
                    bgcolor: open ? iconBackColorOpen : 'transparent',
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'secondary.lighter' }
                }}
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
                    <Avatar
                        variant="rounded"
                        alt="profile user"
                        sx={{ width: 32, height: 32, bgcolor: (theme) => theme.palette.primary.main }}
                    >
                        {getInitials(!isError && !isNull(userName) ? userName : 'User')}
                    </Avatar>
                    <Typography variant="subtitle1">{!isError && !isNull(user) ? userName : 'User'}</Typography>
                </Stack>
            </ButtonBase>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 9]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    // @ts-expect-error expected
                    <Transitions type="fade" in={open} {...TransitionProps}>
                        {open && (
                            <Paper
                                sx={{
                                    // @ts-expect-error expected
                                    boxShadow: theme.customShadows.z1,
                                    width: 290,
                                    minWidth: 240,
                                    maxWidth: 290,
                                    [theme.breakpoints.down('md')]: {
                                        maxWidth: 250
                                    }
                                }}
                            >
                                <ClickAwayListener onClickAway={handleClose}>
                                    {/** @ts-expect-error expected */}
                                    <MainCard elevation={0} border={false} content={false}>
                                        <CardContent sx={{ px: 2.5, pt: 3 }}>
                                            <Grid container justifyContent="space-between" alignItems="center">
                                                <Grid item>
                                                    <Stack direction="row" spacing={1.25} alignItems="center">
                                                        <Avatar
                                                            sx={{ width: 32, height: 32, bgcolor: (theme) => theme.palette.primary.main }}
                                                        >
                                                            {getInitials(!isError && !isNull(user) ? user : 'User')}
                                                        </Avatar>
                                                        <Stack>
                                                            <Typography variant="h6">
                                                                {!isError && !isNull(user) ? user : 'User'}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                User
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Grid>
                                                <Grid item>
                                                    <IconButton size="large" color="secondary" onClick={handleLogout}>
                                                        <LogoutOutlined />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                        {open && (
                                            <>
                                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                    <Tabs
                                                        variant="fullWidth"
                                                        value={value}
                                                        onChange={handleChange}
                                                        aria-label="profile tabs"
                                                    >
                                                        <Tab
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                textTransform: 'capitalize'
                                                            }}
                                                            icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                                                            label="Profile"
                                                            {...a11yProps(0)}
                                                        />
                                                        <Tab
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                textTransform: 'capitalize'
                                                            }}
                                                            icon={<SettingOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                                                            label="Setting"
                                                            {...a11yProps(1)}
                                                        />
                                                    </Tabs>
                                                </Box>
                                                <TabPanel value={value} index={0} dir={theme.direction}>
                                                    <ProfileTab handleLogout={handleLogout} />
                                                </TabPanel>
                                                <TabPanel value={value} index={1} dir={theme.direction}>
                                                    <SettingTab />
                                                </TabPanel>
                                            </>
                                        )}
                                    </MainCard>
                                </ClickAwayListener>
                            </Paper>
                        )}
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
};

export default Profile;
