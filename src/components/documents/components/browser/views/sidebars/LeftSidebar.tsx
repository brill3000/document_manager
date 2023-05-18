import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Divider, ListItemIcon } from '@mui/material';
import { FiHardDrive } from 'react-icons/fi';
import { FiEdit } from 'react-icons/fi';
import { DocumentType } from 'components/documents/Interface/FileBrowser';
import { useViewStore } from 'components/documents/data/global_state/slices/view';

interface DocumentDetailsProps {
    selected: DocumentType[];
}

export default function LeftSidebar({ selected }: DocumentDetailsProps) {
    const { browserHeight } = useViewStore();
    return (
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
                            <ListItemText secondary={selected[0].doc_name} sx={{ width: '90%' }} />
                            <ListItemIcon>
                                <FiEdit />
                            </ListItemIcon>
                        </ListItem>
                        <Divider variant="middle" />
                        <ListItem>
                            <ListItemText secondary={selected[0].size} sx={{ width: '90%' }} />
                            <ListItemIcon>
                                <FiHardDrive />
                            </ListItemIcon>
                        </ListItem>
                        <Divider variant="middle" />
                        <ListItem>
                            <ListItemText secondary={selected[0].type ?? 'folder'} sx={{ width: '90%' }} />
                            <ListItemIcon>
                                <FiEdit />
                            </ListItemIcon>
                        </ListItem>
                        {/* <Divider /> */}
                    </ul>
                </li>
            ))}
        </List>
    );
}
