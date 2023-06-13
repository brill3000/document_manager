import { Box, Grid, Typography, useTheme } from '@mui/material';
import React from 'react';
import type { XYCoord } from 'react-dnd';
import { useDragLayer } from 'react-dnd';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { FileIconProps, fileIcon } from 'components/documents/Icons/fileIcon';
import { ItemTypes } from 'components/documents/Interface/Constants';
import { MemorizedFcFolder } from '../item/GridViewItem';
import { isNull } from 'lodash';

export const CustomDragDocument = ({ parentRef }: { parentRef: React.RefObject<HTMLDivElement> }) => {
    const theme = useTheme();
    const memorizedFileIcon = React.useCallback((args: FileIconProps) => fileIcon({ ...args }), []);
    const { itemType, isDragging, item, currentOffset } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getClientOffset(),
        isDragging: monitor.isDragging()
    }));
    const { browserHeight } = useViewStore();
    const renderItem = () => {
        switch (itemType) {
            case item.is_dir ? ItemTypes.Folder : ItemTypes.File:
                return (
                    <Grid
                        container
                        bgcolor={theme.palette.primary.main}
                        height="max-content"
                        width={200}
                        direction="row"
                        px={0.3}
                        pt={0.3}
                        borderRadius={1}
                        sx={{ cursor: 'grabbing !important' }}
                    >
                        <Grid item xs={1.5} p={0}>
                            {item.is_dir ? (
                                <MemorizedFcFolder size={18} />
                            ) : (
                                memorizedFileIcon({
                                    mimeType: item.type,
                                    size: browserHeight * 0.015,
                                    file_icon_margin: 0,
                                    contrast: theme.palette.primary.contrastText
                                })
                            )}
                        </Grid>
                        <Grid item xs={10.5} p={0}>
                            <Typography variant="body2" fontSize={12} color={theme.palette.primary.contrastText} noWrap>
                                {item.doc_name}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            default:
                return <Box bgcolor={theme.palette.primary.main}>{JSON.stringify(item)}</Box>;
        }
    };

    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

    function handleMouseMove(event: MouseEvent) {
        const localX = !isNull(parentRef.current) ? event.clientX - parentRef.current.offsetLeft : event.clientX;
        const localY = !isNull(parentRef.current) ? event.clientY - parentRef.current.offsetTop : event.clientY;
        setMousePosition({ x: localX, y: localY });
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
            // console.log(currentOffset.y, 'CURRENT OFFSET');
            // console.log(mousePosition.y, 'MOUSE POSITION');
            // console.log(parentRef.current?.offsetTop, 'PARENT OFFSET');

            const { x, y } = mousePosition;
            const transform = `translate(${x}px, ${y}px)`;
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
