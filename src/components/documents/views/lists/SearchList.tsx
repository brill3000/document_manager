import { GroupedVirtuoso, ItemProps } from 'react-virtuoso';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import React, { forwardRef } from 'react';
import { ListItemButton, Rating, alpha, lighten, useTheme } from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { QueryResults, SearchResultsInterface } from 'global/interfaces';
import { Dictionary, groupBy, isArray, isNull, isObject, isString, isUndefined, last } from 'lodash';
import { Interweave } from 'interweave';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { MimeTypeConfig } from 'utils/constants/MimeTypes';
import { useHandleChangeRoute } from 'utils/hooks';

// interface User {
//     name: string;
//     initials: string;
//     description: string;
// }

export default function SearchList({ height, searchList }: { height?: number | string; searchList: SearchResultsInterface | null }) {
    // ============================= | STATE | ================================ //
    const documents: QueryResults[] = React.useMemo(() => {
        if (!isNull(searchList) && !isUndefined(searchList) && isArray(searchList.queryResults)) {
            return searchList.queryResults;
        } else return [];
    }, [searchList]);
    const groupedDocuments: Dictionary<QueryResults[]> = React.useMemo(() => {
        if (!isNull(searchList) && !isUndefined(searchList) && isArray(searchList.queryResults)) {
            return groupBy(searchList.queryResults, (val) => {
                if (val.score <= 20) return 1;
                else if (val.score <= 40) return 2;
                else if (val.score <= 60) return 3;
                else if (val.score <= 80) return 4;
                else if (val.score > 80) return 5;
            });
        } else return ([] as unknown) as Dictionary<QueryResults[]>;
    }, [searchList]);
    const groupCounts =
        isObject(groupedDocuments) && !isNull(groupedDocuments) ? Object.values(groupedDocuments).map((users) => users.length) : null;
    const groups = isObject(groupedDocuments) && !isNull(groupedDocuments) ? Object.keys(groupedDocuments).reverse() : null;
    // ============================= | THEME | ================================ //
    const theme = useTheme();
    // ============================= | ZUSTAND | ================================ //
    const { openFile } = useViewStore();
    const { actions } = useBrowserStore();
    // ============================= | HOOKS | ================================ //
    const { handleChangeRoute } = useHandleChangeRoute();

    const MUIComponents = React.useMemo(
        () => ({
            List: forwardRef<HTMLDivElement, MUIComponentsProps>(({ style, children }, listRef) => {
                return (
                    <List style={{ padding: 0, ...style, margin: 0 }} component="div" ref={listRef}>
                        {children}
                    </List>
                );
            }),

            Item: ({ children, ...props }: ItemProps<'div'>) => {
                return (
                    <ListItemButton
                        component="div"
                        {...props}
                        sx={{
                            m: 0,
                            borderRadius: 1
                        }}
                        onClick={() => {
                            const doc = documents[props['data-item-index']];
                            if (!isUndefined(doc) && !isNull(doc.node) && !isUndefined(doc.node)) {
                                handleChangeRoute(doc.node.path, false);
                                if (MimeTypeConfig.MIME_ZIP === doc.node.mimeType) return;
                                openFile(doc.node.path);
                                actions.closeSearchDialog();
                            }
                        }}
                    >
                        {children}
                    </ListItemButton>
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
                            backdropFilter: 'blur(5px)', // This be the blur
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
        }),
        [documents]
    );

    return !isNull(groupCounts) && !isNull(groups) ? (
        <GroupedVirtuoso
            style={{ height: height ?? 300, borderRadius: 3 }}
            groupCounts={groupCounts}
            // @ts-expect-error expected
            components={MUIComponents}
            groupContent={(index) => {
                return <Rating name="score-rating" defaultValue={Number(groups[index])} size="small" />;
            }}
            itemContent={(index) => {
                const document = documents[index];
                const doc_name =
                    !isUndefined(document) && !isUndefined(document.node) && isString(document.node.path)
                        ? last(document.node.path.split('/'))
                        : '';
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
                                },
                                '& .highlight': {
                                    color: theme.palette.common.white,
                                    fontWeight: 800,
                                    fontSize: 14
                                }
                            }}
                            primary={doc_name}
                            secondary={<Interweave content={isString(document.excerpt) ? document.excerpt : ''} />}
                        />
                    </>
                );
            }}
        />
    ) : (
        <></>
    );
}

interface MUIComponentsProps {
    style: React.CSSProperties;
    children: React.ReactNode;
}
