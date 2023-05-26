import React from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Divider, ListItemButton, Stack, Typography, lighten } from '@mui/material';
import { theme } from '../../Themes/theme';
import { fileIcon } from 'components/documents/Icons/fileIcon';
import { ItemTypes } from 'components/documents/Interface/Constants';
import { DragSourceMonitor, useDrop, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useStore } from 'components/documents/data/global_state/';
import ActionMenu from 'components/documents/views/UI/Menus/DocumentActionMenu';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { MemorizedFcFolder } from 'components/documents/views/item/GridViewItem';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { GenericDocument, GetFetchedFoldersProps } from 'global/interfaces';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useMoveFolderMutation } from 'store/async/dms/folders/foldersApi';

export function ListViewItem({
    document,
    closeContext,
    isColored,
    width
}: {
    document: GenericDocument;
    isColored: boolean;
    width?: string | number;
    height?: string | number;
    closeContext: boolean;
}): React.ReactElement {
    const { browserHeight } = useViewStore();
    const { author, created, doc_name, path, permissions, subscribed, is_dir, size, mimeType, locked } = document;
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [contextMenu, setContextMenu] = React.useState<{ mouseX: number; mouseY: number } | null>(null);
    const { setDragging, addToClipBoard } = useStore((state) => state);
    const [renameTarget, setRenameTarget] = React.useState<{ id: string; rename: boolean } | null>(null);
    const [disableDoubleClick, setDisableDoubleClick] = React.useState<boolean>(false);
    const { actions, selected, focused } = useBrowserStore();
    const isFocused = React.useMemo(() => {
        return path === focused.id;
    }, [path, focused]);

    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: is_dir ? ItemTypes.Folder : ItemTypes.File,
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: !!monitor.isDragging()
        }),
        item: { path, doc_name, is_dir, parent }
    }));
    // ================================= | Routes | ============================= //
    const navigate = useNavigate();
    const { pathParam } = useParams();
    const { pathname } = useLocation();

    // ================================= | RTK MUTATIONS | ============================ //
    const [move] = useMoveFolderMutation();

    const [{ isOver }, drop] = useDrop(() => ({
        accept: [ItemTypes.Folder, ItemTypes.File],
        drop: (item: GetFetchedFoldersProps) => {
            try {
                // eslint-disable-next-line no-restricted-globals
                const moveDoc = confirm(`You are about to move ${item.doc_name} to ${doc_name}`);
                if (moveDoc === true && item.path !== undefined && item.path !== null && path !== undefined && path !== null) {
                    move({ fldId: item.path, dstId: path });
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
            return item.path !== path && is_dir ? true : false;
        }
    }));
    React.useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    React.useEffect(() => {
        setDragging(isDragging);
        if (isDragging) {
            path !== undefined && actions.setFocused(path, is_dir);
        }
    }, [path, isDragging, setDragging]);

    React.useEffect(() => {
        closeContext && setContextMenu(null);
    }, [closeContext]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.nativeEvent.button === 0) {
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
        }
    };
    const handleDoubleClick = (is_dir: boolean) => {
        if (disableDoubleClick) return true;
        if (path !== undefined && path !== null) {
            handleChangeRoute(path, is_dir);
        }
    };
    const handleMenuClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setContextMenu(null);
    };

    /**
     * Function that add the seleted folder path to the route
     * This is critical for reload purposes
     * @param folderId: string
     * @param folderName: string
     * @returns void
     */
    const handleChangeRoute = (path: string, is_dir: boolean) => {
        if (path !== null || path !== undefined) {
            actions.setSelected([{ id: path, is_dir }]);
            const encodedPathParam = encodeURIComponent(path);
            const documentPath = pathParam
                ? pathname.replace(`/${encodeURIComponent(pathParam)}`, `/${encodedPathParam}`)
                : `${pathname}/${encodedPathParam}`;
            navigate(documentPath);
        }
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
                        if (path !== undefined) {
                            if (is_dir) {
                                if (path !== null || path !== undefined) {
                                    handleChangeRoute(path, is_dir);
                                }
                            }
                        }
                        break;
                    case 'copy':
                    case 'cut':
                        addToClipBoard({ id: selected[selected.length - 1].id, action: type });
                        setContextMenu(null);
                        break;
                    case 'delete':
                        try {
                            // const res = confirm(`You are about to DELETE ${doc_name}. Delete the document?`);
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
                        setRenameTarget(() => ({ id: path, rename: true }));
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
    const isRenaming = React.useMemo(() => renameTarget && document !== undefined && renameTarget.id === path && renameTarget.rename, [
        path,
        renameTarget
    ]);
    // const closeRename = () => {
    //   setRenameTarget(null);
    // };
    return (
        <ListItemButton
            ref={document !== undefined && is_dir ? drop : null}
            sx={{
                cursor: isDragging ? 'grabbing !important' : isOver ? 'move' : 'pointer',
                height: 'max-content',
                minWidth: width,
                webkitTransform: 'translate3d(0, 0, 0)',
                px: 0,
                '& .MuiListItemButton-root:hover': {
                    bgcolor: 'transparent',
                    transition: 'none'
                }
            }}
            onFocus={() => {
                actions.setFocused(path, is_dir);
            }}
            onBlur={() => focused.id === path && actions.setFocused(null, false)}
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
                        (isFocused || isOver) && !isRenaming
                            ? lighten(theme.palette.primary.main, 0.6)
                            : isHovered && !isRenaming
                            ? lighten(theme.palette.primary.main, 0.7)
                            : isColored
                            ? lighten(theme.palette.secondary.light, 0.7)
                            : lighten(theme.palette.secondary.light, 0.8)
                    }
                    color={isFocused || isOver ? theme.palette.text.primary : theme.palette.text.secondary}
                    borderRadius={1}
                    onClick={handleClick}
                    onContextMenu={handleClick}
                    onDoubleClick={() => handleDoubleClick(is_dir)}
                    onMouseOver={() => {
                        setIsHovered(true);
                    }}
                    onMouseLeave={() => {
                        setIsHovered(false);
                    }}
                    sx={{
                        '& :hover': {
                            cursor: isRenaming ? 'text' : 'pointer'
                        },
                        '& .MuiDivider-root': {
                            borderColor: lighten(theme.palette.secondary.light, 0.6)
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
                            (isFocused || isOver) && !isRenaming
                                ? lighten(theme.palette.primary.main, 0.6)
                                : isHovered && !isRenaming
                                ? lighten(theme.palette.primary.main, 0.7)
                                : isColored
                                ? lighten(theme.palette.secondary.light, 0.7)
                                : lighten(theme.palette.secondary.light, 0.8)
                        }
                        color={isFocused || isOver ? theme.palette.text.primary : theme.palette.text.secondary}
                        pl={1}
                        margin={0}
                        justifyContent="space-between"
                    >
                        <Grid xs={1} display="flex" padding={0} alignItems="center">
                            {is_dir ? <MemorizedFcFolder size={25} /> : fileIcon(mimeType, browserHeight * 0.025, 0)}
                        </Grid>
                        <Grid xs={11} maxWidth="80%" alignItems="center">
                            <Typography noWrap fontSize=".85rem">
                                {doc_name}
                            </Typography>
                        </Grid>
                        <Divider orientation="vertical" />
                    </Grid>
                    <Grid xs={2} alignItems="center" pl={2} py={0} component={Stack} justifyContent="space-between" direction="row">
                        <Typography noWrap fontSize=".85rem" fontWeight={isFocused || isOver ? 500 : 400}>
                            {' '}
                            {author}
                        </Typography>
                        <Divider orientation="vertical" />
                    </Grid>
                    <Grid xs={3} alignItems="center" pl={2} py={0} component={Stack} direction="row" justifyContent="space-between">
                        <Typography noWrap fontSize=".85rem" fontWeight={isFocused || isOver ? 500 : 400}>
                            {created}
                        </Typography>
                        <Divider orientation="vertical" />
                    </Grid>
                    <Grid xs={2} alignItems="center" pl={2} py={0} component={Stack} direction="row" justifyContent="space-between">
                        <Typography noWrap fontSize=".85rem" fontWeight={isFocused || isOver ? 500 : 400}>
                            {subscribed ? 'Yes' : 'No'}
                        </Typography>
                        <Divider orientation="vertical" />
                    </Grid>
                    <Grid xs={2} alignItems="center" pr={1} pl={2}>
                        <Typography noWrap fontSize=".85rem" fontWeight={isFocused || isOver ? 500 : 400}>
                            {permissions}
                        </Typography>
                    </Grid>
                    <ActionMenu
                        contextMenu={contextMenu}
                        handleMenuClose={handleMenuClose}
                        handleMenuClick={handleMenuClick}
                        is_dir={is_dir}
                        locked={locked ?? false}
                    />
                </Grid>
            ) : (
                <></>
            )}
        </ListItemButton>
    );
}