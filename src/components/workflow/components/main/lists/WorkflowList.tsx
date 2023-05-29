import * as React from 'react';
import { FixedSizeList } from 'react-window';
import { Chip, ListItemAvatar, ListItemButton, Stack, Typography, useTheme } from '@mui/material';
import Dot from 'components/@extended/Dot';
import { BsCheck } from 'react-icons/bs';
import ListItemContent from '@mui/joy/ListItemContent/ListItemContent';
// ListChildComponentProps

function renderRow(props: any) {
    const { index, style } = props;
    const theme = useTheme();
    return (
        <ListItemButton
            style={style}
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
            <ListItemContent>
                <Stack direction="column" spacing={0.5}>
                    <Typography variant="body1" color="text.primary">
                        Loan Application workflow
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Brilliant Kaboi
                    </Typography>
                    <Chip
                        icon={<BsCheck />}
                        label="complete"
                        variant="outlined"
                        color="success"
                        sx={{ width: 'max-content', height: 20 }}
                    />
                </Stack>
            </ListItemContent>
        </ListItemButton>
    );
}

export function WorkflowList({
    innerRef,
    outerRef
}: {
    innerRef: React.MutableRefObject<HTMLDivElement | null>;
    outerRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
    const [height, setHeight] = React.useState<number | null>(null);
    const [width, setWidth] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (innerRef.current !== null && innerRef !== undefined && outerRef.current !== null && outerRef.current !== undefined) {
            setHeight(outerRef.current.clientHeight - innerRef.current.clientHeight);
            setWidth(outerRef.current.clientWidth);
        }
    }, []);
    return (
        <>
            {height !== null && width !== null ? (
                <FixedSizeList itemSize={110} itemCount={200} overscanCount={5} height={height} width={width}>
                    {renderRow}
                </FixedSizeList>
            ) : (
                <></>
            )}
        </>
    );
}
