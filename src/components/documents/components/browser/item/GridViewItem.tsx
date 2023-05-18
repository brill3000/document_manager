import React from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { alpha, Box, ButtonBase, Stack } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import { fileIcon } from '../../../Icons/fileIcon';
import { FcFolder, FcOpenedFolder } from 'react-icons/fc';
import { ItemTypes } from 'components/documents/Interface/Constants';
import { theme } from '../../../Themes/theme';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ActionMenu from '../UI/Menus/DocumentActionMenu';
import { RenameDocument } from './Rename';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { useStore } from 'components/documents/data/global_state';
import { DocumentType, DocumentProps } from 'components/documents/Interface/FileBrowser';

export const MemorizedFcFolder = React.memo(FcFolder);
export const MemorizedFcFolderOpen = React.memo(FcOpenedFolder);

function GridViewItem({ document, selected, setSelected, select, actions, setIsOverDoc, closeContext }: DocumentProps): JSX.Element {
    const { browserHeight } = useViewStore();
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [contextMenu, setContextMenu] = React.useState<{ mouseX: number; mouseY: number } | null>(null);
    const { setDragging, addToClipBoard } = useStore((state) => state);
    const [renameTarget, setRenameTarget] = React.useState<{ doc: DocumentType; rename: boolean } | null>(null);
    const [disableDoubleClick, setDisableDoubleClick] = React.useState<boolean>(false);
    const disableDoubleClickFn = (disabled: boolean) => {
        setDisableDoubleClick(disabled);
    };
    const { id, doc_name, is_dir, type, parent } =
        document !== undefined ? document : { id: null, doc_name: null, is_dir: null, type: null, parent: null };
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
    const renameFn = (value: string) => {
        if (value && renameTarget && renameTarget.doc.id && renameTarget.doc.doc_name !== value) {
            try {
                // eslint-disable-next-line no-restricted-globals
                const res = confirm('Rename document ? ');
                if (res === true) {
                    actions.changeDetails(renameTarget.doc.id, { doc_name: value });
                    closeRename();
                } else {
                    closeRename();
                }
            } catch (e) {
                if (e instanceof Error) {
                    console.error(e.message);
                } else console.log(e);
            }
        } else {
            closeRename();
        }
    };

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
    }, [isDragging]);

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
        if (disableDoubleClick) return true;
        if (document !== undefined && document.is_dir) {
            select(document.id);
        } else {
            document !== undefined && setSelected([document]);
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
        [renameTarget]
    );
    const closeRename = () => {
        setRenameTarget(null);
    };

    return (
        <Grid
            key={document !== undefined ? document.id : 'key'}
            height="max-content"
            justifyContent="center"
            alignItems="center"
            display="flex"
            xs={12}
            sm={6}
            md={4}
            lg={4}
            xl={3}
        >
            {document !== undefined ? (
                document.is_dir ? (
                    <Box
                        ref={drop}
                        sx={{
                            cursor: isDragging ? 'grabbing !important' : isOver ? 'move' : 'pointer'
                        }}
                    >
                        <Stack justifyContent="center" alignItems="center" spacing={1} ref={drag} display={isDragging ? 'none' : 'flex'}>
                            <Box
                                borderRadius={2}
                                {...(isSelected || isOver
                                    ? { bgcolor: alpha(grey[300], 0.5) }
                                    : isHovered
                                    ? { bgcolor: alpha(grey[300], 0.2) }
                                    : {})}
                                width="max-content"
                                height="max-content"
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
                                        cursor: 'pointer'
                                    }
                                }}
                                component={ButtonBase}
                            >
                                <MemorizedFcFolder size={browserHeight * 0.14} />
                            </Box>
                            <Box
                                borderRadius={1}
                                px={isRenaming ? 0 : 1}
                                py={isRenaming ? 0 : 1}
                                bgcolor={(theme) =>
                                    (isSelected || isOver) && !isRenaming
                                        ? theme.palette.primary.main
                                        : isHovered && !isRenaming
                                        ? alpha(theme.palette.primary.main, 0.1)
                                        : '#f9f7f6'
                                }
                                width={isRenaming ? '100%' : 115}
                                height="max-content"
                                border={isRenaming ? 0 : 0.3}
                                borderColor={(theme) => theme.palette.secondary.light}
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
                                    },
                                    fontFamily: 'inherit'
                                }}
                                component={ButtonBase}
                            >
                                {isRenaming ? (
                                    <RenameDocument
                                        selected={selected}
                                        renameFn={renameFn}
                                        renameTarget={renameTarget}
                                        disableDoubleClick={disableDoubleClickFn}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            overflow: 'hidden',
                                            color: isSelected || isOver ? theme.palette.primary.contrastText : theme.palette.text.primary,
                                            fontWeight: isSelected || isOver ? 500 : 400,
                                            textOverflow: 'ellipsis',
                                            fontSize: '.84rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: '3',
                                            WebkitBoxOrient: 'vertical',
                                            textAlign: 'center',
                                            lineHeight: 1.1
                                        }}
                                    >
                                        {document.doc_name}
                                    </Box>
                                )}
                            </Box>
                        </Stack>
                    </Box>
                ) : (
                    <Stack justifyContent="center" alignItems="center" spacing={1} ref={drag} display={isDragging ? 'none' : 'flex'}>
                        <Box
                            borderRadius={2}
                            {...(isSelected ? { bgcolor: alpha(grey[300], 0.5) } : isHovered ? { bgcolor: alpha(grey[300], 0.2) } : {})}
                            width="max-content"
                            height="max-content"
                            pt={2}
                            pb={0.5}
                            px={0.5}
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
                                    cursor: 'pointer'
                                }
                            }}
                            component={ButtonBase}
                        >
                            {fileIcon(document.type, browserHeight * 0.1, browserHeight * 0.005)}
                        </Box>
                        <Box
                            borderRadius={1}
                            px={isRenaming ? 0 : 1}
                            py={isRenaming ? 0 : 1}
                            bgcolor={
                                (isSelected || isOver) && !isRenaming
                                    ? blue[600]
                                    : isHovered && !isRenaming
                                    ? alpha(blue[100], 0.4)
                                    : alpha(blue[100], 0)
                            }
                            width={isRenaming ? '100%' : 115}
                            height="max-content"
                            border={isRenaming ? 0 : 0.1}
                            borderColor={(theme) => theme.palette.secondary.light}
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
                                },
                                fontFamily: 'inherit'
                            }}
                            component={ButtonBase}
                        >
                            {isRenaming ? (
                                <RenameDocument
                                    selected={selected}
                                    renameFn={renameFn}
                                    renameTarget={renameTarget}
                                    disableDoubleClick={disableDoubleClickFn}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        overflow: 'hidden',
                                        color: isSelected || isOver ? theme.palette.primary.contrastText : theme.palette.text.primary,
                                        fontWeight: isSelected || isOver ? 500 : 400,
                                        textOverflow: 'ellipsis',
                                        fontSize: '.84rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '3',
                                        WebkitBoxOrient: 'vertical',
                                        textAlign: 'center',
                                        lineHeight: 1.1
                                    }}
                                >
                                    {document.doc_name}
                                </Box>
                            )}
                        </Box>
                    </Stack>
                )
            ) : (
                <></>
            )}
            <ActionMenu contextMenu={contextMenu} handleMenuClose={handleMenuClose} handleMenuClick={handleMenuClick} />
        </Grid>
    );
}

export { GridViewItem };
