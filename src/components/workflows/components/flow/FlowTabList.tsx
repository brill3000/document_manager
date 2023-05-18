import * as React from 'react';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';

export function FlowTabList() {
    return (
        <TabList
            variant="plain"
            sx={{
                alignSelf: 'flex-start',
                [`& .${tabClasses.root}`]: {
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    '&:hover': {
                        bgcolor: 'transparent'
                    },
                    [`&.${tabClasses.selected}`]: {
                        color: 'primary.plainColor',
                        fontWeight: 'lg',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            zIndex: 1,
                            bottom: '-1px',
                            left: 'var(--List-item-paddingLeft)',
                            right: 'var(--List-item-paddingRight)',
                            height: '3px',
                            borderTopLeftRadius: '3px',
                            borderTopRightRadius: '3px',
                            bgcolor: 'primary.500'
                        }
                    }
                }
            }}
        >
            <Tab>Design Forms</Tab>
            <Tab>Design Workflow</Tab>
            <Tab>Initiate Workflow</Tab>
        </TabList>
    );
}
