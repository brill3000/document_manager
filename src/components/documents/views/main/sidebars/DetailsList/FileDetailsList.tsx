import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Badge, Box, Divider, ListItemIcon, Stack, Typography, useTheme } from '@mui/material';
import { FiEdit } from 'react-icons/fi';
import { BsCalendar2Check, BsFilePerson, BsLockFill } from 'react-icons/bs';
import { SiAuth0 } from 'react-icons/si';
import { TbHierarchy3 } from 'react-icons/tb';
import { FileIconProps, fileIcon } from 'components/documents/Icons/fileIcon';
import { FileInterface } from 'global/interfaces';
import { orange } from '@mui/material/colors';
import { getDateFromObject } from 'utils/constants/UriHelper';
import { isObject, isUndefined } from 'lodash';
import { PermissionTypes } from 'components/documents/Interface/FileBrowser';
import { PermissionIconProps, permissionsIcon } from 'components/documents/Icons/permissionsIcon';

export function FileDetailsList({
    splitScreen,
    browserHeight,
    fileInfo
}: {
    splitScreen: boolean;
    browserHeight: number;
    fileInfo: FileInterface;
}) {
    const theme = useTheme();
    const memorizedFileIcon = React.useCallback((args: FileIconProps) => fileIcon({ ...args }), []);
    const memorizedPermissionsIcon = React.useCallback((args: PermissionIconProps) => permissionsIcon({ ...args }), []);

    return (
        <Stack
            spacing={2}
            height="100%"
            width="100%"
            sx={{
                opacity: splitScreen ? 1 : 0,
                transition: '0.1s all',
                transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
            }}
        >
            <Box display="flex" justifyContent="center" pt={1}>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={fileInfo.locked ? <BsLockFill size={browserHeight * 0.025} color={orange[500]} /> : 0}
                >
                    {memorizedFileIcon({ mimeType: fileInfo.mimeType, size: browserHeight * 0.1, file_icon_margin: 0 })}
                </Badge>
            </Box>
            <List
                sx={{
                    width: '100%',
                    height: 'max-content',
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: browserHeight !== 0 && browserHeight !== undefined ? browserHeight * 0.7 * 0.8 : '50%',
                    '& ul': { padding: 0 }
                }}
                subheader={<li />}
            >
                <li>
                    <ul
                        style={{
                            minHeight: 'max-content',
                            padding: 0
                        }}
                    >
                        <ListSubheader color="primary">General Infomation</ListSubheader>
                        <Divider variant="middle">
                            <Typography fontSize={10} color="text.secondary">
                                name
                            </Typography>
                        </Divider>
                        <ListItem>
                            <ListItemIcon>
                                <FiEdit />
                            </ListItemIcon>
                            <ListItemText secondary={<span>{fileInfo.doc_name}</span>} sx={{ width: '90%' }} />
                        </ListItem>
                        <Divider variant="middle">
                            <Typography fontSize={10} color="text.secondary">
                                author
                            </Typography>
                        </Divider>
                        <ListItem>
                            <ListItemIcon>
                                <BsFilePerson />
                            </ListItemIcon>
                            <ListItemText secondary={<span>{fileInfo.author}</span>} sx={{ width: '90%' }} />
                        </ListItem>
                        <Divider variant="middle">
                            <Typography fontSize={10} color="text.secondary">
                                date created
                            </Typography>
                        </Divider>
                        <ListItem>
                            <ListItemIcon>
                                <BsCalendar2Check />
                            </ListItemIcon>
                            <ListItemText
                                secondary={<span>{getDateFromObject(fileInfo.created).toLocaleString()}</span>}
                                sx={{ width: '90%' }}
                            />
                        </ListItem>
                        <Divider variant="middle">
                            <Typography fontSize={10} color="text.secondary">
                                mime type
                            </Typography>
                        </Divider>
                        <ListItem>
                            <ListItemIcon>
                                <TbHierarchy3 />
                            </ListItemIcon>
                            <ListItemText secondary={<span>{String(fileInfo.mimeType)}</span>} sx={{ width: '90%' }} />
                        </ListItem>
                        {/* <Divider /> */}
                    </ul>
                </li>
                <li>
                    <ul
                        style={{
                            minHeight: 'max-content',
                            padding: 0
                        }}
                    >
                        <ListSubheader color="primary">Permissions & Access</ListSubheader>
                        <Divider variant="middle">
                            <Typography fontSize={10} color="text.secondary">
                                locked
                            </Typography>
                        </Divider>
                        <ListItem>
                            <ListItemIcon>
                                <BsLockFill />
                            </ListItemIcon>
                            <ListItemText secondary={<span>{fileInfo.locked ? 'Yes' : 'No'}</span>} sx={{ width: '90%' }} />
                        </ListItem>
                        <Divider variant="middle">
                            <Typography fontSize={10} color="text.secondary">
                                permission group
                            </Typography>
                        </Divider>

                        {isObject(fileInfo.permissions) &&
                            !isUndefined(fileInfo.permissions) &&
                            Object.entries(fileInfo.permissions).map((p: [string, boolean]) => {
                                const perm = p[0] as keyof PermissionTypes;
                                return (
                                    <ListItem key={p[0]}>
                                        <ListItemIcon>
                                            {memorizedPermissionsIcon({
                                                type: perm,
                                                permission: p[1],
                                                theme: theme,
                                                size: 15,
                                                file_icon_margin: 0
                                            })}
                                        </ListItemIcon>
                                        <ListItemText secondary={<span>{String(p[0])}</span>} sx={{ width: '90%' }} />
                                    </ListItem>
                                );
                            })}
                        <Divider variant="middle">
                            <Typography fontSize={10} color="text.secondary">
                                signed
                            </Typography>
                        </Divider>
                        <ListItem>
                            <ListItemIcon>
                                <SiAuth0 />
                            </ListItemIcon>
                            <ListItemText secondary={<span>{fileInfo.signed ? 'Yes' : 'No'}</span>} sx={{ width: '90%' }} />
                        </ListItem>
                    </ul>
                </li>
                <li>
                    <ul
                        style={{
                            minHeight: 'max-content',
                            padding: 0
                        }}
                    >
                        <ListSubheader color="primary">Subscriptions</ListSubheader>
                        <Divider variant="middle">
                            <Typography fontSize={10} color="text.secondary">
                                is subscribed
                            </Typography>
                        </Divider>
                        <ListItem>
                            <ListItemIcon>
                                <SiAuth0 />
                            </ListItemIcon>
                            <ListItemText secondary={<span>{fileInfo.subscribed ? 'Yes' : 'No'}</span>} sx={{ width: '90%' }} />
                        </ListItem>
                    </ul>
                </li>
                {/* ))} */}
            </List>
        </Stack>
    );
}
