import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Box, Divider, ListItemIcon, Stack, Typography } from '@mui/material';
import { FiEdit } from 'react-icons/fi';
import { MemorizedFcFolder } from '../../../item/GridViewItem';
import { BsCalendar2Check, BsFilePerson } from 'react-icons/bs';
import { SiAuth0 } from 'react-icons/si';
import { TbHierarchy3 } from 'react-icons/tb';
import { GetFetchedFoldersProps } from 'global/interfaces';

export function FolderDetailsList({
    splitScreen,
    browserHeight,
    folderInfo
}: {
    splitScreen: boolean;
    browserHeight: number;
    folderInfo: GetFetchedFoldersProps;
}) {
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
            <Box display="flex" justifyContent="center">
                <MemorizedFcFolder size={browserHeight !== 0 && browserHeight !== undefined ? browserHeight * 0.7 * 0.2 : '30%'} />
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
                            <ListItemText secondary={<span>{folderInfo.doc_name}</span>} sx={{ width: '90%' }} />
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
                            <ListItemText secondary={<span>{folderInfo.author}</span>} sx={{ width: '90%' }} />
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
                            <ListItemText secondary={<span>{new Date(folderInfo.created).toDateString()}</span>} sx={{ width: '90%' }} />
                        </ListItem>
                        <Divider variant="middle">
                            <Typography fontSize={10} color="text.secondary">
                                has children
                            </Typography>
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
                            <Typography fontSize={10} color="text.secondary">
                                permission group
                            </Typography>
                        </Divider>
                        <ListItem>
                            <ListItemIcon>
                                <SiAuth0 />
                            </ListItemIcon>
                            <ListItemText secondary={<span>{folderInfo.permissions}</span>} sx={{ width: '90%' }} />
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
                            <ListItemText secondary={<span>{folderInfo.subscribed}</span>} sx={{ width: '90%' }} />
                        </ListItem>
                    </ul>
                </li>
                {/* ))} */}
            </List>
        </Stack>
    );
}
