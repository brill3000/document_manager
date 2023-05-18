import { Box, Grid, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import React from 'react';
import type { XYCoord } from 'react-dnd';
import { useDragLayer } from 'react-dnd';
import { useViewStore } from '../../../data/global_state/slices/view';
import { fileIcon } from '../../../Icons/fileIcon';
import { ItemTypes } from '../../../Interface/Constants';
import { theme } from '../../../Themes/theme';
import { MemorizedFcFolder } from '../Document';

export const CustomDragDocument = () => {
    const { itemType, isDragging, item, currentOffset } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    }));
    const { browserHeight } = useViewStore();
    const renderItem = () => {
        switch (itemType) {
            case item.is_dir ? ItemTypes.Folder : ItemTypes.File:
                return (
                    <Grid
                        container
                        bgcolor={blue[500]}
                        height="max-content"
                        width={200}
                        direction="row"
                        px={0.4}
                        pt={0.4}
                        borderRadius={1}
                        sx={{ cursor: 'grabbing !important' }}
                    >
                        <Grid item xs={1.5} p={0}>
                            {item.is_dir ? <MemorizedFcFolder size={18} /> : fileIcon(item.type, browserHeight * 0.02, 0)}
                        </Grid>
                        <Grid item xs={10.5} p={0}>
                            <Typography variant="body2" fontSize={12} color={theme.palette.primary.contrastText} noWrap>
                                {item.doc_name}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            default:
                return null;
        }
    };

    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

    function handleMouseMove(event: MouseEvent) {
        setMousePosition({ x: event.clientX, y: event.clientY });
    }

    React.useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const getItemStyles = React.useCallback(
        (currentOffset: XYCoord | null) => {
            if (!currentOffset) return { display: 'none' };
            const { x, y } = mousePosition;
            const transform = `translate(${x - 50}px, ${y - 10}px)`;
            return {
                transform,
                WebkitTransform: transform,
                cursor: 'grabbing !important'
            };
        },
        [mousePosition]
    );
    if (!isDragging) return null;
    return (
        <Box
            sx={{
                position: 'absolute',
                pointerEvents: 'none',
                cursor: 'grabbing !important',
                zIndex: 1500,
                left: 0,
                top: 0,
                width: '100%',
                height: '100%'
            }}
        >
            <Box sx={getItemStyles(currentOffset)}>{renderItem()}</Box>
        </Box>
    );
};
