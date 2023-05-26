import React from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { alpha, Badge, Box, ButtonBase, Stack } from '@mui/material';
import { grey, orange } from '@mui/material/colors';
import { fileIcon } from 'components/documents/Icons/fileIcon';
import { FcFolder, FcOpenedFolder } from 'react-icons/fc';
import { ItemTypes } from 'components/documents/Interface/Constants';
import { theme } from '../../Themes/theme';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ActionMenu from '../UI/Menus/DocumentActionMenu';
import { RenameDocument } from './Rename';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { useStore } from 'components/documents/data/global_state';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { GenericDocument, GetFetchedFoldersProps } from 'global/interfaces';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useMoveFolderMutation, useRenameFolderMutation } from 'store/async/dms/folders/foldersApi';
import { BsLockFill } from 'react-icons/bs';
import { useGetFileContentQuery } from 'store/async/dms/files/filesApi';
import { isArray, isEmpty } from 'lodash';
import FileViewerDialog from '../UI/Dialogs/FileViewerDialog';

export const MemorizedFcFolder = React.memo(FcFolder);
export const MemorizedFcFolderOpen = React.memo(FcOpenedFolder);

function GridViewItem({ document, closeContext }: { document: GenericDocument; closeContext: boolean }): JSX.Element {
    const { doc_name, path, is_dir, mimeType, size, locked } = document;
    const { browserHeight } = useViewStore();
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [contextMenu, setContextMenu] = React.useState<{ mouseX: number; mouseY: number } | null>(null);
    const { setDragging, addToClipBoard } = useStore((state) => state);
    const [renameTarget, setRenameTarget] = React.useState<{ id: string; rename: boolean } | null>(null);
    const [disableDoubleClick, setDisableDoubleClick] = React.useState<boolean>(false);
    const disableDoubleClickFn = (disabled: boolean) => {
        setDisableDoubleClick(disabled);
    };

    const { actions, selected, focused } = useBrowserStore();
    // ================================= | Routes | ============================= //
    const navigate = useNavigate();
    const { pathParam } = useParams();
    const { pathname } = useLocation();

    // ================================= | Dialog function | ========================== //
    const setViewFile = useViewStore((state) => state.setViewFile);
    // ================================= | Mutations | ============================= //
    const [renameFolder] = useRenameFolderMutation();

    const isFocused = React.useMemo(() => {
        return path === focused.id;
    }, [path, focused]);

    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: is_dir ? ItemTypes.Folder : ItemTypes.File,
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: !!monitor.isDragging()
        }),
        item: { path, doc_name, is_dir }
    }));
    const renameFn = (value: string) => {
        if (value && renameTarget && renameTarget.id !== value) {
            try {
                // eslint-disable-next-line no-restricted-globals
                const res = confirm('Rename document ? ');
                if (res === true) {
                    const fldId = renameTarget.id;
                    const newName = value;
                    const newPath = renameTarget.id.split('/');
                    newPath.pop();
                    newPath.push(newName);
                    actions.setFocused(newPath.join('/'), is_dir);
                    renameFolder({ fldId, newName });

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
        if (isDragging && path !== undefined) {
        }
    }, [isDragging]);

    React.useEffect(() => {
        closeContext && setContextMenu(null);
    }, [closeContext]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.nativeEvent.button === 0 && path !== undefined && path !== null) {
            actions.setFocused(path, is_dir);
        } else if (e.nativeEvent.button === 2 && path !== undefined) {
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
            actions.setFocused(path, is_dir);
            handleChangeRoute(path, is_dir);
            !is_dir && setViewFile(true, 'paper');
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
                        addToClipBoard({ id: path, action: type });
                        setContextMenu(null);
                        break;
                    case 'delete':
                        try {
                            // eslint-disable-next-line no-restricted-globals
                            const res = confirm(`You are about to DELETE ${doc_name}. Delete the document?`);
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
    const isRenaming = React.useMemo(() => renameTarget && path !== undefined && renameTarget.id === path && renameTarget.rename, [
        renameTarget
    ]);
    const closeRename = () => {
        setRenameTarget(null);
    };
    React.useEffect(() => {
        isRenaming && renameTarget && actions.setFocused(renameTarget?.id, is_dir);
    }, [isRenaming, renameTarget]);

    return (
        <Grid
            key={path !== undefined ? path : 'key'}
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
            {path !== undefined ? (
                is_dir ? (
                    <Box
                        ref={drop}
                        sx={{
                            cursor: isDragging ? 'grabbing !important' : isOver ? 'move' : 'pointer'
                        }}
                    >
                        <Stack justifyContent="center" alignItems="center" spacing={1} ref={drag} display={isDragging ? 'none' : 'flex'}>
                            <Box
                                borderRadius={2}
                                {...(isFocused || isOver
                                    ? { bgcolor: alpha(grey[300], 0.5) }
                                    : isHovered
                                    ? { bgcolor: alpha(grey[300], 0.2) }
                                    : {})}
                                width="max-content"
                                height="max-content"
                                onClick={handleClick}
                                onContextMenu={handleClick}
                                onDoubleClick={() => handleDoubleClick(is_dir)}
                                onFocus={() => actions.setFocused(path, is_dir)}
                                onBlur={() => focused.id === path && actions.setFocused(null, false)}
                                onMouseOver={() => {
                                    setIsHovered(true);
                                }}
                                onMouseLeave={() => {
                                    setIsHovered(false);
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
                                    (isFocused || isOver) && !isRenaming
                                        ? alpha(theme.palette.primary.main, 0.4)
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
                                    fontFamily: 'inherit'
                                }}
                                component={ButtonBase}
                            >
                                {isRenaming ? (
                                    <RenameDocument
                                        renameFn={renameFn}
                                        renameTarget={renameTarget}
                                        name={
                                            renameTarget !== null && renameTarget !== undefined && renameTarget.id === document.path
                                                ? document.doc_name
                                                : ''
                                        }
                                        disableDoubleClick={disableDoubleClickFn}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            overflow: 'hidden',
                                            color: theme.palette.text.primary,
                                            fontWeight: isFocused || isOver ? 500 : 400,
                                            textOverflow: 'ellipsis',
                                            fontSize: '.84rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: '3',
                                            WebkitBoxOrient: 'vertical',
                                            textAlign: 'center',
                                            lineHeight: 1.1
                                        }}
                                    >
                                        {doc_name}
                                    </Box>
                                )}
                            </Box>
                        </Stack>
                    </Box>
                ) : (
                    <Stack justifyContent="center" alignItems="center" spacing={1} ref={drag} display={isDragging ? 'none' : 'flex'}>
                        <Box
                            borderRadius={2}
                            {...(isFocused ? { bgcolor: alpha(grey[300], 0.5) } : isHovered ? { bgcolor: alpha(grey[300], 0.2) } : {})}
                            width="max-content"
                            height="max-content"
                            pt={browserHeight * 0.0023}
                            pb={0.5}
                            px={0.5}
                            onClick={handleClick}
                            onContextMenu={handleClick}
                            onDoubleClick={() => handleDoubleClick(is_dir)}
                            onFocus={() => actions.setFocused(path, is_dir)}
                            onBlur={() => focused.id === path && actions.setFocused(null, false)}
                            onMouseOver={() => {
                                setIsHovered(true);
                            }}
                            onMouseLeave={() => {
                                setIsHovered(false);
                            }}
                            sx={{
                                '& :hover': {
                                    cursor: 'pointer'
                                }
                            }}
                            component={ButtonBase}
                        >
                            {
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    badgeContent={locked ? <BsLockFill size={browserHeight * 0.025} color={orange[500]} /> : 0}
                                >
                                    {fileIcon(mimeType, browserHeight * 0.1, browserHeight * 0.006)}
                                </Badge>
                            }
                        </Box>
                        <Box
                            borderRadius={1}
                            px={isRenaming ? 0 : 1}
                            py={isRenaming ? 0 : 1}
                            bgcolor={
                                (isFocused || isOver) && !isRenaming
                                    ? alpha(theme.palette.primary.main, 0.3)
                                    : isHovered && !isRenaming
                                    ? alpha(theme.palette.primary.main, 0.1)
                                    : 'transparent'
                            }
                            width={isRenaming ? '100%' : 115}
                            height="max-content"
                            border={isRenaming ? 0 : 0.1}
                            borderColor={(theme) => theme.palette.secondary.light}
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
                                fontFamily: 'inherit'
                            }}
                            component={ButtonBase}
                        >
                            {isRenaming ? (
                                <RenameDocument
                                    renameFn={renameFn}
                                    renameTarget={renameTarget}
                                    name={
                                        renameTarget !== null && renameTarget !== undefined && renameTarget.id === document.path
                                            ? document.doc_name
                                            : ''
                                    }
                                    disableDoubleClick={disableDoubleClickFn}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        overflow: 'hidden',
                                        color: theme.palette.text.primary,
                                        fontWeight: isFocused || isOver ? 500 : 400,
                                        textOverflow: 'ellipsis',
                                        fontSize: '.84rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '3',
                                        WebkitBoxOrient: 'vertical',
                                        textAlign: 'center',
                                        lineHeight: 1.1
                                    }}
                                >
                                    {doc_name}
                                </Box>
                            )}
                        </Box>
                    </Stack>
                )
            ) : (
                <></>
            )}
            <ActionMenu
                is_dir={is_dir}
                locked={locked ?? false}
                contextMenu={contextMenu}
                handleMenuClose={handleMenuClose}
                handleMenuClick={handleMenuClick}
            />
            <FileViewerDialog />
        </Grid>
    );
}

export { GridViewItem };
