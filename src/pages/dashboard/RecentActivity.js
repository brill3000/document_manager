import * as React from 'react';
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';
import { avatarSX, actionSX } from './index';

// Icons
import { FileAddOutlined, QuestionCircleOutlined, DeleteOutlined, FolderAddOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons';
export function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

export function formatDate(date) {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
        ].join(':')
    );
}



export function RecentActivity({ recentActivity }) {
    return (
        <>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Typography variant="h5">Recent Activity</Typography>
                </Grid>
                <Grid item />
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
                <List
                    component="nav"
                    sx={{
                        px: 0,
                        py: 0,
                        '& .MuiListItemButton-root': {
                            py: 1.5,
                            '& .MuiAvatar-root': avatarSX,
                            '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                        }
                    }}
                >
                    {/* <ListItemButton divider>
    <ListItemAvatar>
        <Avatar
            sx={{
                color: 'success.main',
                bgcolor: 'success.lighter'
            }}
        >
            <FileAddOutlined />
        </Avatar>
    </ListItemAvatar>
    <ListItemText
        primary={<Typography variant="subtitle1">Added Budget Approval File</Typography>}
        secondary="Today, 2:00 AM"
    />
    <ListItemSecondaryAction>
        <Stack alignItems="flex-end">
            <Typography variant="h6" color="secondary" noWrap>
                Desktop
            </Typography>
        </Stack>
    </ListItemSecondaryAction>
</ListItemButton>
<ListItemButton divider>
    <ListItemAvatar>
        <Avatar
            sx={{
                color: 'primary.main',
                bgcolor: 'primary.lighter'
            }}
        >
            <DeleteOutlined />
        </Avatar>
    </ListItemAvatar>
    <ListItemText
        primary={<Typography variant="subtitle1">Deleted Sample2 File</Typography>}
        secondary="5 August, 1:45 PM"
    />
    <ListItemSecondaryAction>
        <Stack alignItems="flex-end">
            <Typography variant="h6" color="secondary" noWrap>
                Mobile
            </Typography>
        </Stack>
    </ListItemSecondaryAction>
</ListItemButton>
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
    <ListItemText primary={<Typography variant="subtitle1">Changed Password</Typography>} secondary="7 hours ago" />
    <ListItemSecondaryAction>
        <Stack alignItems="flex-end">
            <Typography variant="h6" color="secondary" noWrap>
                Mobile
            </Typography>
        </Stack>
    </ListItemSecondaryAction>
</ListItemButton> */}
                    {
                        recentActivity.isLoading || recentActivity.isFetching
                            ?
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                minHeight="100%"
                                minWidth="100%"
                            >
                                <GoogleLoader height={100} width={150} loop={true} />
                            </Box>
                            :
                            recentActivity.isError
                                ?
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    minHeight={450}
                                    minWidth="100%"
                                >
                                    <Stack direction="column">
                                        <Error height={50} width={50} />
                                        <Typography variant='body3'>{recentActivity.error ?? "Opps... An Error  has occured"}</Typography>
                                    </Stack>
                                </Box>
                                :
                                recentActivity.isSuccess && recentActivity.data && Array.isArray(recentActivity.data) &&
                                    recentActivity.data.length > 0 ?
                                    recentActivity.data.map(activity => {
                                        let newDate = formatDate(new Date(Date.parse(activity.date_created)))
                                        if (new Date(Date.parse(activity.date_created)).toDateString() === new Date().toDateString()) {
                                            newDate = "Today, " + newDate.split(" ")[1]
                                        }
                                        switch (activity.log_category) {
                                            case 'folders':
                                                return (
                                                    <ListItemButton divider>
                                                        <ListItemAvatar>
                                                            <Avatar
                                                                sx={{
                                                                    color: activity.log_type.includes('trash') || activity.log_type.includes('delete') ? 'error.main' : 'success.main',
                                                                    bgcolor: activity.log_type.includes('trash') || activity.log_type.includes('delete') ? 'error.lighter' : 'success.lighter'
                                                                }}
                                                            >
                                                                {
                                                                    activity.log_type.includes('trash') || activity.log_type.includes('delete')
                                                                        ?
                                                                        <DeleteOutlined />
                                                                        :
                                                                        activity.log_type.includes('create')
                                                                            ?
                                                                            <FolderAddOutlined />
                                                                            :
                                                                            <FolderOutlined />

                                                                }
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={<Typography variant="subtitle1">{activity.log_description}</Typography>}
                                                            secondary={newDate}
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <Stack alignItems="flex-end">
                                                                <Typography variant="h6" color="secondary" noWrap>
                                                                    {activity.log_category}
                                                                </Typography>
                                                            </Stack>
                                                        </ListItemSecondaryAction>
                                                    </ListItemButton>
                                                )
                                            case 'files':
                                                return (
                                                    <ListItemButton divider>
                                                        <ListItemAvatar>
                                                            <Avatar
                                                                sx={{
                                                                    color: activity.log_type.includes('trash') || activity.log_type.includes('delete') ? 'error.main' : 'success.main',
                                                                    bgcolor: activity.log_type.includes('trash') || activity.log_type.includes('delete') ? 'error.lighter' : 'success.lighter'
                                                                }}
                                                            >
                                                                {
                                                                    activity.log_type.includes('trash') || activity.log_type.includes('delete')
                                                                        ?
                                                                        <DeleteOutlined />
                                                                        :
                                                                        activity.log_type.includes('create')
                                                                            ?
                                                                            <FileAddOutlined />
                                                                            :
                                                                            <FileOutlined />
                                                                }
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={<Typography variant="subtitle1">{activity.log_description}</Typography>}
                                                            secondary={newDate}
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <Stack alignItems="flex-end">
                                                                <Typography variant="h6" color="secondary" noWrap>
                                                                    {activity.log_category}
                                                                </Typography>
                                                            </Stack>
                                                        </ListItemSecondaryAction>
                                                    </ListItemButton>
                                                )
                                            default:
                                                return (
                                                    <ListItemButton divider>
                                                        <ListItemAvatar>
                                                            <Avatar
                                                                sx={{
                                                                    color: 'success.main',
                                                                    bgcolor: 'success.lighter'
                                                                }}
                                                            >
                                                                <FolderOutlined />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={<Typography variant="subtitle1">{activity.log_description}</Typography>}
                                                            secondary={newDate}
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <Stack alignItems="flex-end">
                                                                <Typography variant="h6" color="secondary" noWrap>
                                                                    {activity.log_category}
                                                                </Typography>
                                                            </Stack>
                                                        </ListItemSecondaryAction>
                                                    </ListItemButton>
                                                );
                                        }

                                    })
                                    :
                                    <ListItemButton divider>
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    color: 'warning.main',
                                                    bgcolor: 'warning.lighter'
                                                }}
                                            >
                                                <QuestionCircleOutlined />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="subtitle1">No Recent Activity</Typography>}
                                        />
                                        <ListItemSecondaryAction>
                                            <Stack alignItems="flex-end">
                                                <Typography variant="h6" color="secondary" noWrap>
                                                    0 Activity
                                                </Typography>
                                            </Stack>
                                        </ListItemSecondaryAction>
                                    </ListItemButton>


                    }
                </List>
            </MainCard>
            <MainCard sx={{ mt: 2 }}>
                <Stack spacing={3}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Stack>
                                <Typography variant="h5" noWrap>
                                    Help & Support Chat
                                </Typography>
                                <Typography variant="caption" color="secondary" noWrap>
                                    Typical replay within 5 min
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                                <Avatar alt="Remy Sharp" src={avatar1} />
                                <Avatar alt="Travis Howard" src={avatar2} />
                                <Avatar alt="Cindy Baker" src={avatar3} />
                                <Avatar alt="Agnes Walker" src={avatar4} />
                            </AvatarGroup>
                        </Grid>
                    </Grid>
                    <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
                        Need Help?
                    </Button>
                </Stack>
            </MainCard>
        </>
    )
}
