import React from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Divider, Stack, Typography, lighten } from '@mui/material';
import { DocumentProps, DocumentType } from '../../Interface/FileBrowser';
import ListItem from '@mui/material/ListItem';
import { theme } from '../../Themes/theme';
import { fileIcon } from '../../Icons/fileIcon';
import { ItemTypes } from '../../Interface/Constants';
import { DragSourceMonitor, useDrop, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useStore } from '../../data/global_state';
import ActionMenu from './UI/Menus/DocumentActionMenu';
import { useViewStore } from '../../data/global_state/slices/view';
import { MemorizedFcFolder } from './Document';

export function ListDocument({
    document,
    selected,
    setSelected,
    select,
    actions,
    setIsOverDoc,
    closeContext,
    isColored,
    width,
    height
}: DocumentProps & { isColored: boolean; width?: string | number; height?: string | number }): React.ReactElement {
    const { browserHeight } = useViewStore();
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [contextMenu, setContextMenu] = React.useState<{ mouseX: number; mouseY: number } | null>(null);
    const { setDragging, addToClipBoard } = useStore((state) => state);
    const [renameTarget, setRenameTarget] = React.useState<{ doc: DocumentType; rename: boolean } | null>(null);
    const [disableDoubleClick, setDisableDoubleClick] = React.useState<boolean>(false);
    const { id, doc_name, is_dir, type, parent } =
        document !== undefined ? document : { id: null, doc_name: null, is_dir: null, type: null, parent: null };

    // const disableDoubleClickFn = (disabled: boolean) => {
    //   setDisableDoubleClick(disabled);
    // };
    const isSelected = React.useMemo(() => {
        return Array.isArray(selected) && selected.some((x) => document !== undefined && x.id === document.id);
    }, [document, selected]);

    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: is_dir ? ItemTypes.Folder : ItemTypes.File,
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: !!monitor.isDragging()
        }),
        item: { id, doc_name, is_dir, type, parent }
    }));
    // const renameFn = (value: string) => {
    //   if (value && renameTarget && renameTarget.doc.id && renameTarget.doc.doc_name !== value) {
    //     try {
    //       const res = confirm('Rename document ? ');
    //       if (res === true) {
    //         actions.changeDetails(renameTarget.doc.id, { doc_name: value });
    //         closeRename();
    //       } else {
    //         closeRename();
    //       }
    //     } catch (e) {
    //       if(e instanceof Error){
    //   console.log(e.message)
    // }else{
    //   console.log(e)
    // };
    //     }

    //   } else {
    //     closeRename();
    //   }
    // };

    const [{ isOver }, drop] = useDrop(() => ({
        accept: [ItemTypes.Folder, ItemTypes.File],
        drop: (item: DocumentType) => {
            try {
                // eslint-disable-next-line no-restricted-globals
                const moveDoc = confirm(`You are about to move ${item.doc_name} to ${doc_name}`);
                if (moveDoc) {
                    actions.move(item.id, id);
                }
            } catch (e) {
                if (e instanceof Error) {
                    console.log(e.message);
                } else {
                    console.log(e);
                }
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        }),
        canDrop: (item) => {
            return item.id !== id && is_dir ? true : false;
        }
    }));
    React.useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    React.useEffect(() => {
        setDragging(isDragging);
        if (isDragging) {
            document !== undefined && setSelected([document]);
        }
    }, [document, isDragging, setDragging, setSelected]);

    React.useEffect(() => {
        closeContext && setContextMenu(null);
    }, [closeContext]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.nativeEvent.button === 0) {
            document !== undefined && setSelected([document]);
        } else if (e.nativeEvent.button === 2) {
            setContextMenu(
                contextMenu === null
                    ? {
                          mouseX: e.clientX + 2,
                          mouseY: e.clientY - 6
                      }
                    : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu

                      // Other native context menus might behave different.
                      // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                      null
            );
            document !== undefined && setSelected([document]);
        }
    };
    const handleDoubleClick = () => {
        if (disableDoubleClick || document === undefined) return true;
        if (document.is_dir) {
            select(document.id);
        } else {
            setSelected([document]);
        }
    };
    const handleMenuClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setContextMenu(null);
    };
    const handleMenuClick = (
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        type: 'open' | 'copy' | 'cut' | 'rename' | 'edit' | 'delete'
    ) => {
        e.preventDefault();
        try {
            if (selected.length > 0) {
                switch (type) {
                    case 'open':
                        if (selected[selected.length - 1].is_dir) {
                            select(selected[selected.length - 1].id);
                            setContextMenu(null);
                        } else {
                            setContextMenu(null);
                        }
                        break;
                    case 'copy':
                    case 'cut':
                        addToClipBoard({ id: selected[selected.length - 1].id, action: type });
                        setContextMenu(null);
                        break;
                    case 'delete':
                        try {
                            // eslint-disable-next-line no-restricted-globals
                            const res = confirm(`You are about to DELETE ${selected[selected.length - 1].doc_name}. Delete the document?`);
                            const id = selected[selected.length - 1].id;
                            if (res === true) {
                                setSelected([...selected.filter((x) => x.id !== id)]);
                                const deleted = actions.delete(selected[selected.length - 1].id);
                                if (deleted !== true) {
                                    throw deleted;
                                }
                            }
                        } catch (e) {
                            if (e instanceof Error) {
                                console.log(e.message);
                            } else {
                                console.log(e);
                            }
                        }
                        setContextMenu(null);
                        break;
                    case 'rename':
                        setRenameTarget(() => ({ doc: selected[selected.length - 1], rename: true }));
                        setContextMenu(null);
                        break;
                    default:
                        break;
                }
            }
        } catch (e) {
            console.error(e);
        }
    };
    const isRenaming = React.useMemo(
        () => renameTarget && document !== undefined && renameTarget.doc.id === document.id && renameTarget.rename,
        [document, renameTarget]
    );
    // const closeRename = () => {
    //   setRenameTarget(null);
    // };
    return (
        <ListItem
            ref={document !== undefined && document.is_dir ? drop : null}
            sx={{
                cursor: isDragging ? 'grabbing !important' : isOver ? 'move' : 'pointer',
                height: 'max-content',
                minWidth: width,
                webkitTransform: 'translate3d(0, 0, 0)',
                px: 0
            }}
        >
            {document !== undefined ? (
                <Grid
                    container
                    direction="row"
                    minWidth={'100vw'}
                    height="max-content"
                    position="relative"
                    ref={drag}
                    display={isDragging ? 'none' : 'flex'}
                    bgcolor={(theme) =>
                        (isSelected || isOver) && !isRenaming
                            ? theme.palette.primary.main
                            : isHovered && !isRenaming
                            ? 'rgba(225, 232, 240, 1)'
                            : isColored
                            ? lighten(theme.palette.secondary.light, 0.7)
                            : lighten(theme.palette.secondary.light, 0.9)
                    }
                    color={isSelected || isOver ? theme.palette.primary.contrastText : theme.palette.text.secondary}
                    borderRadius={1}
                    onClick={handleClick}
                    onContextMenu={handleClick}
                    onDoubleClick={handleDoubleClick}
                    onMouseOver={() => {
                        setIsHovered(true);
                        setIsOverDoc(true);
                    }}
                    onMouseLeave={() => {
                        setIsHovered(false);
                        setIsOverDoc(false);
                    }}
                    sx={{
                        '& :hover': {
                            cursor: isRenaming ? 'text' : 'pointer'
                        }
                    }}
                    ml={1}
                >
                    <Grid
                        container
                        xs={3}
                        direction="row"
                        alignItems="center"
                        zIndex={1}
                        top="1%"
                        left={0}
                        position="sticky"
                        borderRadius={1}
                        sx={{
                            borderTopRightRadius: 1,
                            borderBottomRightRadius: 1
                        }}
                        bgcolor={(theme) =>
                            (isSelected || isOver) && !isRenaming
                                ? theme.palette.primary.main
                                : isHovered && !isRenaming
                                ? 'rgba(225, 232, 240, 1)'
                                : isColored
                                ? lighten(theme.palette.secondary.light, 0.7)
                                : lighten(theme.palette.secondary.light, 0.9)
                        }
                        color={isSelected || isOver ? theme.palette.primary.contrastText : theme.palette.text.secondary}
                        pl={1}
                        margin={0}
                        justifyContent="space-between"
                    >
                        <Grid xs={1} display="flex" padding={0} alignItems="center">
                            {is_dir ? <MemorizedFcFolder size={25} /> : fileIcon(document.type, browserHeight * 0.025, 0)}
                        </Grid>
                        <Grid xs={11} maxWidth="80%" alignItems="center">
                            <Typography noWrap fontSize=".85rem">
                                {document.doc_name}
                            </Typography>
                        </Grid>
                        <Divider orientation="vertical" />
                    </Grid>
                    <Grid xs={2} alignItems="center" pl={2} py={0} component={Stack} justifyContent="space-between" direction="row">
                        <Typography noWrap fontSize=".85rem" fontWeight={isSelected || isOver ? 500 : 400}>
                            {' '}
                            {document.type}
                        </Typography>
                        <Divider orientation="vertical" />
                    </Grid>
                    <Grid xs={3} alignItems="center" pl={2} py={0} component={Stack} direction="row" justifyContent="space-between">
                        <Typography noWrap fontSize=".85rem" fontWeight={isSelected || isOver ? 500 : 400}>
                            {new Date().toDateString()}
                        </Typography>
                        <Divider orientation="vertical" />
                    </Grid>
                    <Grid xs={2} alignItems="center" pl={2} py={0} component={Stack} direction="row" justifyContent="space-between">
                        <Typography noWrap fontSize=".85rem" fontWeight={isSelected || isOver ? 500 : 400}>
                            {document.is_archived ? 'Yes' : 'No'}
                        </Typography>
                        <Divider orientation="vertical" />
                    </Grid>
                    <Grid xs={2} alignItems="center" pr={1} pl={2}>
                        <Typography noWrap fontSize=".85rem" fontWeight={isSelected || isOver ? 500 : 400}>
                            {document.size}
                        </Typography>
                    </Grid>
                    <ActionMenu contextMenu={contextMenu} handleMenuClose={handleMenuClose} handleMenuClick={handleMenuClick} />
                </Grid>
            ) : (
                <></>
            )}
        </ListItem>
    );
}