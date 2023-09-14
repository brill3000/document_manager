import { SyntheticEvent, useMemo, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Badge,
    Box,
    ClickAwayListener,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Paper,
    Popper,
    Typography,
    useMediaQuery,
    ListItem,
    Stack
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import { BellOutlined, CloseOutlined, GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import { useAppContext } from 'context/appContext';
import { ITask, IWorkflowInstance } from 'global/interfaces';
import { groupBy, isObject } from 'lodash';
import { BsUpload } from 'react-icons/bs';

// sx styles
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

const actionSX = {
    mt: '6px',
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',

    transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);

    const { tasks: taskData, user, workflowsInstances } = useAppContext();
    const tasks: ITask[] = useMemo(
        () => (isObject(taskData) && taskData !== null && taskData !== undefined ? Object.values(taskData) : []),
        [taskData]
    );
    const workflows: Record<string, IWorkflowInstance> = useMemo(() => workflowsInstances ?? {}, [workflowsInstances]);
    const my_tasks = tasks.filter((task) => task.assignee === user);
    const taskStatuses = useMemo(() => groupBy(tasks, (item) => item.status), [tasks]);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    console.log(tasks, 'MY TASKS');
    const handleClose = (event: SyntheticEvent) => {
        //@ts-expect-error expected
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const iconBackColorOpen = 'grey.300';
    const iconBackColor = 'grey.100';

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <Badge badgeContent={Array.isArray(my_tasks) ? my_tasks.length : 0} color="primary">
                <IconButton
                    disableRipple
                    color="secondary"
                    sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                    aria-label="open profile"
                    ref={anchorRef}
                    aria-controls={open ? 'profile-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                >
                    <Badge badgeContent={0} color="primary">
                        <BellOutlined />
                    </Badge>
                </IconButton>
            </Badge>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
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
                                offset: [matchesXs ? -5 : 0, 9]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    // @ts-expect-error expected
                    <Transitions type="fade" in={open} {...TransitionProps}>
                        <Paper
                            sx={{
                                // @ts-expect-error expected

                                boxShadow: theme.customShadows.z1,
                                width: '100%',
                                minWidth: 285,
                                maxWidth: 420,
                                [theme.breakpoints.down('md')]: {
                                    maxWidth: 285
                                }
                            }}
                        >
                            {/** @ts-expect-error expected */}
                            <ClickAwayListener onClickAway={handleClose}>
                                {/** @ts-expect-error expected */}
                                <MainCard
                                    title="Notification"
                                    elevation={0}
                                    border={false}
                                    content={false}
                                    secondary={
                                        <IconButton size="small" onClick={handleToggle}>
                                            <CloseOutlined />
                                        </IconButton>
                                    }
                                >
                                    <List
                                        component="nav"
                                        sx={{
                                            p: 0,
                                            '& .MuiListItemButton-root': {
                                                py: 0.5,
                                                '& .MuiAvatar-root': avatarSX,
                                                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                                            }
                                        }}
                                    >
                                        {Array.isArray(my_tasks) &&
                                            my_tasks.map((task) => {
                                                return (
                                                    <ListItemButton>
                                                        <ListItemAvatar>
                                                            <Avatar
                                                                sx={{
                                                                    color: 'success.main',
                                                                    bgcolor: 'success.lighter'
                                                                }}
                                                            >
                                                                <BsUpload />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="h6">
                                                                    Task:{' '}
                                                                    <span style={{ textTransform: 'capitalize' }}>{task.taskType}</span>{' '}
                                                                    file
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Stack>
                                                                    <Typography variant="caption">
                                                                        Workflow: {workflows && workflows[task.workflowInstanceId]?.title}
                                                                    </Typography>
                                                                    <Typography variant="caption">
                                                                        Process:{' '}
                                                                        {workflows &&
                                                                            workflows[task.workflowInstanceId]?.nodes.find(
                                                                                (x) => x.id === task.processId
                                                                            )?.data.label}
                                                                    </Typography>
                                                                </Stack>
                                                            }
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <Typography variant="caption" noWrap></Typography>
                                                        </ListItemSecondaryAction>
                                                    </ListItemButton>
                                                );
                                            })}
                                        {my_tasks.length === 0 && (
                                            <ListItem>
                                                <ListItemText>No notifications</ListItemText>
                                            </ListItem>
                                        )}

                                        {/* <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{
                                                        color: 'success.main',
                                                        bgcolor: 'success.lighter'
                                                    }}
                                                >
                                                    <GiftOutlined />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6">
                                                        It&apos;s{' '}
                                                        <Typography component="span" variant="subtitle1">
                                                            Cristina danny&apos;s
                                                        </Typography>{' '}
                                                        birthday today.
                                                    </Typography>
                                                }
                                                secondary="2 min ago"
                                            />
                                            <ListItemSecondaryAction>
                                                <Typography variant="caption" noWrap>
                                                    3:00 AM
                                                </Typography>
                                            </ListItemSecondaryAction>
                                        </ListItemButton>
                                        <Divider />
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{
                                                        color: 'primary.main',
                                                        bgcolor: 'primary.lighter'
                                                    }}
                                                >
                                                    <MessageOutlined />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6">
                                                        <Typography component="span" variant="subtitle1">
                                                            Aida Burg
                                                        </Typography>{' '}
                                                        commented your post.
                                                    </Typography>
                                                }
                                                secondary="5 August"
                                            />
                                            <ListItemSecondaryAction>
                                                <Typography variant="caption" noWrap>
                                                    6:00 PM
                                                </Typography>
                                            </ListItemSecondaryAction>
                                        </ListItemButton>
                                        <Divider />
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{
                                                        color: 'error.main',
                                                        bgcolor: 'error.lighter'
                                                    }}
                                                >
                                                    <SettingOutlined />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6">
                                                        Your Profile is Complete &nbsp;
                                                        <Typography component="span" variant="subtitle1">
                                                            60%
                                                        </Typography>{' '}
                                                    </Typography>
                                                }
                                                secondary="7 hours ago"
                                            />
                                            <ListItemSecondaryAction>
                                                <Typography variant="caption" noWrap>
                                                    2:45 PM
                                                </Typography>
                                            </ListItemSecondaryAction>
                                        </ListItemButton>
                                        <Divider />
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar
                                                    sx={{
                                                        color: 'primary.main',
                                                        bgcolor: 'primary.lighter'
                                                    }}
                                                >
                                                    C
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6">
                                                        <Typography component="span" variant="subtitle1">
                                                            Cristina Danny
                                                        </Typography>{' '}
                                                        invited to join{' '}
                                                        <Typography component="span" variant="subtitle1">
                                                            Meeting.
                                                        </Typography>
                                                    </Typography>
                                                }
                                                secondary="Daily scrum meeting time"
                                            />
                                            <ListItemSecondaryAction>
                                                <Typography variant="caption" noWrap>
                                                    9:10 PM
                                                </Typography>
                                            </ListItemSecondaryAction>
                                        </ListItemButton>
                                        <Divider />
                                        <ListItemButton sx={{ textAlign: 'center', py: `${12}px !important` }}>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6" color="primary">
                                                        View All
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton> */}
                                    </List>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
};

export default Notification;
