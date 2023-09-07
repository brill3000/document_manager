import { Chip, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography, useTheme } from '@mui/material';
import Dot from 'components/@extended/Dot';
import { MutableRefObject, useEffect, useState } from 'react';
import { BsCheck } from 'react-icons/bs';
import { Virtuoso } from 'react-virtuoso';
// ListChildComponentProps

const InnerList = <T,>({ data, index }: { data: T & { title: string; creator: string }; index: number }) => {
    const theme = useTheme();
    const { title, creator } = data;
    return (
        <ListItemButton
            key={index}
            component="div"
            sx={{
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                '& .MuiListItemAvatar-root': {
                    minWidth: 'max-content',
                    pr: 2,
                    display: 'flex',
                    alignItems: 'start'
                }
            }}
        >
            <ListItemAvatar>
                <Dot size={4} color={theme.palette.secondary.main} />
            </ListItemAvatar>
            <ListItemText>
                <Stack direction="column" spacing={0.5}>
                    <Typography variant="body1" color="text.primary">
                        {title}
                    </Typography>
                    <Stack direction="row" spacing={0.5} justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                            {creator}
                        </Typography>
                        <Chip
                            icon={<BsCheck />}
                            label="complete"
                            variant="outlined"
                            color="success"
                            sx={{ width: 'max-content', height: 20 }}
                        />
                    </Stack>
                </Stack>
            </ListItemText>
        </ListItemButton>
    );
};

export function WorkflowList({
    innerRef,
    outerRef
}: {
    innerRef: MutableRefObject<HTMLDivElement | null>;
    outerRef: MutableRefObject<HTMLDivElement | null>;
}) {
    const [height, setHeight] = useState<number | null>(null);
    const [width, setWidth] = useState<number | null>(null);

    useEffect(() => {
        if (innerRef.current !== null && innerRef !== undefined && outerRef.current !== null && outerRef.current !== undefined) {
            setHeight(outerRef.current.clientHeight - innerRef.current.clientHeight);
            setWidth(outerRef.current.clientWidth);
        }
    }, []);
    return (
        <>
            <Virtuoso
                style={{ height: height ?? '60vh', width: '100%' }}
                components={{
                    Item: List
                }}
                data={[
                    { id: 1, title: 'Motion tabling', creator: 'Administrator' },
                    { id: 2, title: 'Create order paper', creator: 'Brilliant' }
                ]}
                itemContent={(index, instance) => <InnerList data={instance} index={index} />}
            />
        </>
    );
}
