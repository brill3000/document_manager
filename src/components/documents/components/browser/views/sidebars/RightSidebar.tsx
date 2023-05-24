import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Box, Divider, ListItemIcon, Stack, Typography } from '@mui/material';
// import { FiHardDrive } from 'react-icons/fi';
import { FiEdit } from 'react-icons/fi';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { MemorizedFcFolder } from '../../item/GridViewItem';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { BsCalendar2Check, BsFilePerson } from 'react-icons/bs';
import { useGetFoldersPropertiesQuery } from 'store/async/dms/folders/foldersApi';
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';
import { SiAuth0 } from 'react-icons/si';

export default function RightSidebar() {
    const { browserHeight } = useViewStore();
    const { focused, splitScreen } = useBrowserStore();

    const {
        data: folderInfo,
        error: folderInfoError,
        isFetching: folderInfoIsFetching,
        isLoading: folderInfoIsLoading,
        isSuccess: folderInfoIsSuccess
    } = useGetFoldersPropertiesQuery(
        { fldId: focused !== null ? focused : '' },
        {
            skip: focused === null || focused === undefined || focused.length < 1
        }
    );
    {
        /*      <Box display="flex" justifyContent="center" pt={1}>
                       {fileIcon(selected[0].type, browserHeight * 0.1, 0)}
                     </Box>
                 <Typography>Nothing Selected</Typography> */
    }
    return (
        <>
            {folderInfoIsFetching || folderInfoIsLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <GoogleLoader height={100} width={100} loop={true} />
                </Box>
            ) : folderInfoError ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <Error height={50} width={50} />
                </Box>
            ) : folderInfoIsSuccess && folderInfo ? (
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
                        {/* {[{ title: 'General Infomation' }, { title: 'Permissions & Access' }, { title: 'tags' }].map((sectionId, i) => ( */}
                        <li>
                            <ul
                                style={{
                                    minHeight: 'max-content',
                                    padding: 0
                                }}
                            >
                                <ListSubheader color="primary">General Infomation</ListSubheader>
                                <Divider variant="middle" />
                                <ListItem>
                                    <ListItemText secondary={<span>{folderInfo.doc_name}</span>} sx={{ width: '90%' }} />
                                    <ListItemIcon>
                                        <FiEdit />
                                    </ListItemIcon>
                                </ListItem>
                                <Divider variant="middle" />
                                <ListItem>
                                    <ListItemText secondary={<span>{folderInfo.author}</span>} sx={{ width: '90%' }} />
                                    <ListItemIcon>
                                        <BsFilePerson />
                                    </ListItemIcon>
                                </ListItem>
                                <Divider variant="middle" />
                                <ListItem>
                                    <ListItemText secondary={<span>{folderInfo.created}</span>} sx={{ width: '90%' }} />
                                    <ListItemIcon>
                                        <BsCalendar2Check />
                                    </ListItemIcon>
                                </ListItem>
                                <Divider variant="middle" />
                                <ListItem>
                                    <ListItemText secondary={<span>{folderInfo.hasChildren}</span>} sx={{ width: '90%' }} />
                                    <ListItemIcon>
                                        <BsCalendar2Check />
                                    </ListItemIcon>
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
                                <Divider variant="middle" />
                                <ListItem>
                                    <ListItemText secondary={<span>{folderInfo.permissions}</span>} sx={{ width: '90%' }} />
                                    <ListItemIcon>
                                        <SiAuth0 />
                                    </ListItemIcon>
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
                                <Divider variant="middle" />
                                <ListItem>
                                    <ListItemText secondary={<span>{folderInfo.subscribed}</span>} sx={{ width: '90%' }} />
                                    <ListItemIcon>
                                        <SiAuth0 />
                                    </ListItemIcon>
                                </ListItem>
                            </ul>
                        </li>
                        {/* ))} */}
                    </List>
                </Stack>
            ) : (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100%"
                    minWidth="100%"
                    sx={{
                        opacity: splitScreen ? 1 : 0,
                        transition: '0.2s all',
                        transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
                    }}
                >
                    <Typography>Nothing Selected</Typography>
                </Box>
            )}
        </>
    );
}
