import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Box, Divider, ListItemButton, ListItemIcon, Stack, Typography, useTheme } from '@mui/material';
import { FiEdit } from 'react-icons/fi';
import { MemorizedFcFolder } from '../../../item/GridViewItem';
import { BsCalendar2Check, BsFilePerson } from 'react-icons/bs';
import { SiAuth0 } from 'react-icons/si';
import { TbHierarchy3 } from 'react-icons/tb';
import { getDateFromObject } from 'utils/constants/UriHelper';
import { FolderInterface } from 'global/interfaces';
import { PermissionTypes } from 'components/documents/Interface/FileBrowser';
import { isObject, isUndefined, startsWith } from 'lodash';
import { PermissionIconProps, permissionsIcon } from 'components/documents/Icons/permissionsIcon';
import { FileIconProps, fileIcon } from 'components/documents/Icons/fileIcon';
import { NoteDisplay } from 'components/documents/views/UI/notes';

export function FolderDetailsList({
    splitScreen,
    browserHeight,
    folderInfo
}: {
    splitScreen: boolean;
    browserHeight: number;
    folderInfo: FolderInterface;
}) {
    const theme = useTheme();
    const memorizedPermissionsIcon = React.useCallback((args: PermissionIconProps) => permissionsIcon({ ...args }), []);
    const memorizedFileIcon = React.useCallback((args: FileIconProps) => fileIcon({ ...args }), []);

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
            <Box display="flex" justifyContent="center" py={1}>
                {startsWith(folderInfo.path, '/okm:categories') ? (
                    memorizedFileIcon({ mimeType: 'database', size: browserHeight * 0.1, file_icon_margin: 0 })
                ) : (
                    <MemorizedFcFolder size={browserHeight * 0.12} />
                )}
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
                            <Typography fontSize={10}>name</Typography>
                        </Divider>
                        <ListItem>
                            <ListItemIcon>
                                <FiEdit />
                            </ListItemIcon>
                            <ListItemText secondary={<span>{folderInfo.doc_name}</span>} sx={{ width: '90%' }} />
                        </ListItem>
                        <Divider variant="middle">
                            <Typography fontSize={10}>author</Typography>
                        </Divider>
                        <ListItem>
                            <ListItemIcon>
                                <BsFilePerson />
                            </ListItemIcon>
                            <ListItemText secondary={<span>{folderInfo.author}</span>} sx={{ width: '90%' }} />
                        </ListItem>
                        <Divider variant="middle">
                            <Typography fontSize={10}>date created</Typography>
                        </Divider>
                        <ListItem>
                            <ListItemIcon>
                                <BsCalendar2Check />
                            </ListItemIcon>
                            <ListItemText
                                secondary={<span>{getDateFromObject(folderInfo.created).toLocaleString()}</span>}
                                sx={{ width: '90%' }}
                            />
                        </ListItem>
                        <Divider variant="middle">
                            <Typography fontSize={10}>has children</Typography>
                        </Divider>
                        <ListItem>
                            <ListItemIcon>
                                <TbHierarchy3 />
                            </ListItemIcon>
                            <ListItemText secondary={<span>{String(folderInfo.hasChildren)}</span>} sx={{ width: '90%' }} />
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
                            <Typography fontSize={10}>permission group</Typography>
                        </Divider>
                        {isObject(folderInfo.permissions) &&
                            !isUndefined(folderInfo.permissions) &&
                            Object.entries(folderInfo.permissions).map((p: [string, boolean]) => {
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
                    </ul>
                </li>
                <li>
                    <ul
                        style={{
                            minHeight: 'max-content',
                            padding: 0
                        }}
                    >
                        <ListSubheader color="primary">Notes</ListSubheader>
                        <Divider variant="middle">
                            <Typography fontSize={10}>notes</Typography>
                        </Divider>
                        {Array.isArray(folderInfo.notes) &&
                            folderInfo.notes.map((note) => (
                                <ListItemButton key={note.path}>
                                    <NoteDisplay note={note} />
                                </ListItemButton>
                            ))}
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
                            <Typography fontSize={10}>is subscribed</Typography>
                        </Divider>
                        <ListItem>
                            <ListItemIcon>
                                <SiAuth0 />
                            </ListItemIcon>
                            <ListItemText secondary={<span>{folderInfo.subscribed}</span>} sx={{ width: '90%' }} />
                        </ListItem>
                    </ul>
                </li>
                {/* ))} */}
            </List>
        </Stack>
    );
}
