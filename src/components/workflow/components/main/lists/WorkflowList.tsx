import { Chip, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography, useTheme } from '@mui/material';
import Dot from 'components/@extended/Dot';
import { useAppContext } from 'context/appContext';
import { IWorkflowInstance } from 'global/interfaces';
import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useState } from 'react';
import { BsCheck } from 'react-icons/bs';
import { Virtuoso } from 'react-virtuoso';
// ListChildComponentProps

const InnerList = ({
    data,
    index,
    handleSelect,
    selected
}: {
    data: IWorkflowInstance;
    index: number;
    handleSelect: (id: string) => void;
    selected: string | null;
}) => {
    const theme = useTheme();
    const { id, title, createdBy, status } = data;
    return (
        <ListItemButton
            key={index}
            component="div"
            selected={id === selected}
            onClick={() => handleSelect(id)}
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
                            {createdBy}
                        </Typography>
                        <Chip
                            icon={<BsCheck />}
                            label={status}
                            variant="outlined"
                            color={
                                status === 'canceled'
                                    ? 'error'
                                    : status === 'completed'
                                    ? 'success'
                                    : status === 'inprogress'
                                    ? 'warning'
                                    : status === 'pending'
                                    ? 'primary'
                                    : 'default'
                            }
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
    outerRef,
    selected,
    setSelected,
    workflows
}: {
    innerRef: MutableRefObject<HTMLDivElement | null>;
    outerRef: MutableRefObject<HTMLDivElement | null>;
    selected: string | null;
    setSelected: Dispatch<SetStateAction<string | null>>;
    workflows: IWorkflowInstance[];
}) {
    const [height, setHeight] = useState<number | null>(null);
    const [width, setWidth] = useState<number | null>(null);
    const handleSelect = useCallback((id: string) => setSelected(id), []);

    useEffect(() => {
        if (innerRef.current !== null && innerRef !== undefined && outerRef.current !== null && outerRef.current !== undefined) {
            setHeight(outerRef.current.clientHeight - innerRef.current.clientHeight);
            setWidth(outerRef.current.clientWidth);
        }
    }, []);
    console.log(workflows, 'WORKFLOWS');
    return (
        <>
            <Virtuoso
                style={{ height: height ?? '60vh', width: '100%' }}
                components={{
                    Item: List
                }}
                data={workflows}
                itemContent={(index, instance) => (
                    <InnerList key={index} data={instance} index={index} handleSelect={handleSelect} selected={selected} />
                )}
            />
        </>
    );
}
