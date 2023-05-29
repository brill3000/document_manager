import * as React from 'react';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import { ListItemAvatar, ListItemButton, Typography, useTheme } from '@mui/material';
import Dot from 'components/@extended/Dot';
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
            <ListItemText
                primary="Brunch this weekend?"
                secondary={
                    <React.Fragment>
                        <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                            Brilliant Kaboi
                        </Typography>
                        {" — I'll be in your neighborhood doing errands this…"}
                    </React.Fragment>
                }
            />
        </ListItemButton>
    );
}

export default function MailsList({
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
