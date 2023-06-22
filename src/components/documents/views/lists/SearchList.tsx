import { GroupedVirtuoso } from 'react-virtuoso';
import { generateGroupedUsers } from './data';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import React, { forwardRef } from 'react';
import { alpha, lighten, useTheme } from '@mui/material';
import { Assignment } from '@mui/icons-material';

// interface User {
//     name: string;
//     initials: string;
//     description: string;
// }

export default function SearchList({ height }: { height?: number | string }) {
    const { users, groups, groupCounts } = generateGroupedUsers(500);
    const theme = useTheme();
    return (
        <GroupedVirtuoso
            style={{ height: height ?? 300, borderRadius: 3 }}
            groupCounts={groupCounts}
            // @ts-expect-error expected
            components={MUIComponents}
            groupContent={(index) => {
                return <div>{groups[index]}</div>;
            }}
            itemContent={(index) => {
                const user = users[index];
                return (
                    <>
                        <ListItemAvatar>
                            <Avatar
                                variant="rounded"
                                sx={{
                                    bgcolor: theme.palette.warning.light,
                                    color: lighten(theme.palette.common.black, 0.3)
                                }}
                            >
                                <Assignment />
                            </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                            sx={{
                                '& .MuiListItemText-secondary': {
                                    color: theme.palette.warning.light
                                }
                            }}
                            primary={user.name}
                            secondary={<span>{user.longText}</span>}
                        />
                    </>
                );
            }}
        />
    );
}

interface MUIComponentsProps {
    style: React.CSSProperties;
    children: React.ReactNode;
}

const MUIComponents = {
    List: forwardRef<HTMLDivElement, MUIComponentsProps>(({ style, children }, listRef) => {
        return (
            <List style={{ padding: 0, ...style, margin: 0 }} component="div" ref={listRef}>
                {children}
            </List>
        );
    }),

    Item: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
        return (
            <ListItem component="div" {...props} style={{ margin: 0 }}>
                {children}
            </ListItem>
        );
    },

    Group: ({ children, style, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
        const theme = useTheme();
        return (
            // @ts-expect-error expected
            <ListSubheader
                {...props}
                sx={{
                    ...style,
                    backdropFilter: 'blur(3px)', // This be the blur
                    bgcolor: alpha(theme.palette.common.black, 0.4),
                    borderColor: theme.palette.grey[500],
                    borderWidth: 0.5,
                    borderStyle: 'solid',
                    borderRadius: 3,
                    color: theme.palette.info.light,
                    margin: 0
                }}
            >
                {children}
            </ListSubheader>
        );
    }
};
