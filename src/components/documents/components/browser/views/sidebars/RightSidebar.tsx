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
import { DocumentType } from 'components/documents/Interface/FileBrowser';
import { BsFilePerson } from 'react-icons/bs';

export default function LeftSidebar() {
    const { browserHeight } = useViewStore();
    const { actions, focused, selected } = useBrowserStore();
    const [current, setCurrent] = React.useState<DocumentType | null>(null);

    React.useEffect(() => {
        if (focused !== null && focused !== undefined) {
            const doc = actions.getDocument(focused);
            if (doc !== undefined) {
                setCurrent(doc);
            }
        }
    }, [focused]);

    {
        /*      <Box display="flex" justifyContent="center" pt={1}>
                       {fileIcon(selected[0].type, browserHeight * 0.1, 0)}
                     </Box>
                 <Typography>Nothing Selected</Typography> */
    }
    return (
        <>
            {focused !== null && focused !== undefined ? (
                <Stack spacing={2} height="100%" width="100%">
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
                        {[{ title: 'General Infomation' }, { title: 'Permissions & Access' }, { title: 'tags' }].map((sectionId, i) => (
                            <li key={`section-${sectionId.title}`}>
                                <ul
                                    style={{
                                        minHeight:
                                            i === 2
                                                ? browserHeight !== 0 && browserHeight !== undefined
                                                    ? browserHeight * 0.7 * 0.4
                                                    : '40%'
                                                : 'max-content',
                                        padding: 0
                                    }}
                                >
                                    <ListSubheader color="primary">{sectionId.title}</ListSubheader>
                                    <Divider variant="middle" />
                                    <ListItem>
                                        <ListItemText secondary={current?.doc_name} sx={{ width: '90%' }} />
                                        <ListItemIcon>
                                            <FiEdit />
                                        </ListItemIcon>
                                    </ListItem>
                                    <Divider variant="middle" />
                                    <ListItem>
                                        <ListItemText secondary={current?.size} sx={{ width: '90%' }} />
                                        <ListItemIcon>
                                            <BsFilePerson />
                                        </ListItemIcon>
                                    </ListItem>
                                    <Divider variant="middle" />
                                    <ListItem>
                                        <ListItemText secondary={current?.type ?? 'folder'} sx={{ width: '90%' }} />
                                        <ListItemIcon>
                                            <FiEdit />
                                        </ListItemIcon>
                                    </ListItem>
                                    {/* <Divider /> */}
                                </ul>
                            </li>
                        ))}
                    </List>
                </Stack>
            ) : (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <Typography>Nothing Selected</Typography>
                </Box>
            )}
        </>
    );
}
