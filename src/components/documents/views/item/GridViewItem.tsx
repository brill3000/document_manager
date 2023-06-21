import React from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { alpha, Badge, Box, Stack } from '@mui/material';
import { orange } from '@mui/material/colors';
import { theme } from '../../Themes/theme';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ActionMenu from '../UI/Menus/DocumentActionMenu';
import { RenameDocument } from './Rename';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { useStore } from 'components/documents/data/global_state';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { GenericDocument } from 'global/interfaces';
import { BsLockFill } from 'react-icons/bs';
import { isUndefined } from 'lodash';
import { FacebookCircularProgress } from 'ui-component/CustomProgressBars';
import { useDragAndDropHandlers, useHandleActionMenu, useHandleClickEvents, useMemorizedDocumemtIcon } from 'utils/hooks';
import FolderIcon from 'assets/images/icons/FolderIcon';
import FolderOpenIcon from 'assets/images/icons/FolderOpenIcon';
import { UriHelper } from 'utils/constants/UriHelper';
import { VirtuosoGridHandle } from 'react-virtuoso';

export const MemorizedFcFolder = React.memo(FolderIcon);
export const MemorizedFcFolderOpen = React.memo(FolderOpenIcon);

function GridViewItem({
    document,
    closeContext
}: {
    document: GenericDocument;
    closeContext: boolean;
    splitScreen: boolean;
    isScrolling?: boolean;
    virtuoso: React.MutableRefObject<VirtuosoGridHandle | null>;
    index: number;
}): JSX.Element {
    const { doc_name, path, is_dir, mimeType, locked, isLoading, progress, newDoc, isExtracting } = document;
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [contextMenu, setContextMenu] = React.useState<{ mouseX: number; mouseY: number } | null>(null);
    const [disableDoubleClick, setDisableDoubleClick] = React.useState<boolean>(false);
    const { memorizedFileIcon } = useMemorizedDocumemtIcon();
    const disableDoubleClickFn = (disabled: boolean) => {
        setDisableDoubleClick(disabled);
    };
    // ================================= | Zustand | ============================= //
    const { actions, focused, isCreating, renameTarget } = useBrowserStore();
    const { setDragging } = useStore((state) => state);
    const { browserHeight } = useViewStore();

    // ================================= | Action Menu | ============================= //
    const { handleMenuClick, handleMenuClose, renameFn, isRenaming } = useHandleActionMenu({
        is_dir,
        path,
        doc_name,
        setContextMenu,
        is_new: newDoc ?? false
    });
    // ================================= | Drag & Drop | ============================= //
    const { preview, isDragging, drag, drop, isOver } = useDragAndDropHandlers({ is_dir, doc_name, path });
    // ================================= | Click Events Hook | ========================== //
    const { handleClick, handleDoubleClick } = useHandleClickEvents({
        path,
        is_dir,
        locked,
        setContextMenu,
        contextMenu,
        doc_name
    });

    const isFocused = React.useMemo(() => {
        return path === focused.id;
    }, [path, focused]);

    // ================================ | EFFECTS | ================================ //
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

    React.useEffect(() => {
        isRenaming && renameTarget && newDoc !== true && actions.setFocused(renameTarget?.id, is_dir);
    }, [isRenaming, renameTarget, newDoc]);

    React.useEffect(() => {
        if (isCreating && newDoc === true) {
            actions.setRenameTarget({ id: path, rename: is_dir, is_new: newDoc ?? false });
        }
    }, [newDoc, isCreating]);

    return (
        <Grid key={path !== undefined ? path : 'key'} height="max-content" justifyContent="center" alignItems="center" width="100%">
            {path !== undefined ? (
                is_dir ? (
                    <Box
                        ref={drop}
                        sx={{
                            cursor: isDragging ? 'grabbing !important' : isOver ? 'move' : 'pointer'
                        }}
                    >
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}
                            ref={drag}
                            display={isDragging ? 'none' : 'flex'}
                            width="100%"
                        >
                            <Box
                                borderRadius={2}
                                width="max-content"
                                height="max-content"
                                onClick={handleClick}
                                onContextMenu={handleClick}
                                onDoubleClick={() => handleDoubleClick(disableDoubleClick)}
                                onFocus={() => actions.setFocused(path, is_dir)}
                                // onBlur={() => focused.id === path && actions.setFocused(null, false)}
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
                                component={Box}
                                p={0}
                                m={0}
                            >
                                <MemorizedFcFolder
                                    size={browserHeight * (isRenaming ? 0.07 : 0.095)}
                                    selected={isFocused || isOver || isHovered}
                                />
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
                                width={isRenaming ? '100%' : 120}
                                height="max-content"
                                border={isRenaming ? 0 : 0.3}
                                borderColor={(theme) => theme.palette.secondary.light}
                                onClick={handleClick}
                                onContextMenu={handleClick}
                                onDoubleClick={() => handleDoubleClick(disableDoubleClick)}
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
                                    transition: `${UriHelper.TRANSITION} all`,
                                    transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                                    fontFamily: 'inherit',
                                    display: 'flex',
                                    alignContent: 'center',
                                    justifyContent: 'center'
                                }}
                                component={Box}
                            >
                                {isRenaming ? (
                                    <RenameDocument
                                        renameFn={(val) => renameFn({ value: val, renameTarget })}
                                        renameTarget={renameTarget}
                                        is_new={newDoc ?? false}
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
                                            fontSize: theme.typography.caption,
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
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                        ref={drag}
                        display={isDragging ? 'none' : 'flex'}
                        width="100%"
                    >
                        <Box
                            borderRadius={2}
                            width="max-content"
                            minWidth="33%"
                            height="max-content"
                            px={0.5}
                            onClick={handleClick}
                            onContextMenu={handleClick}
                            onDoubleClick={() => handleDoubleClick(disableDoubleClick)}
                            onFocus={() => actions.setFocused(path, is_dir)}
                            // onBlur={() => focused.id === path && actions.setFocused(null, false)}
                            onMouseOver={() => {
                                setIsHovered(true);
                            }}
                            onMouseLeave={() => {
                                setIsHovered(false);
                            }}
                            sx={{
                                '& :hover': {
                                    cursor: 'pointer'
                                },
                                display: 'flex',
                                alignContent: 'center',
                                justifyContent: 'center'
                            }}
                            component={Box}
                            position="relative"
                        >
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={locked ? <BsLockFill size={browserHeight * 0.025} color={orange[500]} /> : 0}
                            >
                                {memorizedFileIcon({
                                    mimeType,
                                    size: browserHeight * (isRenaming ? 0.06 : 0.075),
                                    file_icon_margin: browserHeight * 0.006,
                                    dark: isFocused || isOver || isHovered,
                                    contrast:
                                        !isUndefined(isLoading) && !isUndefined(progress) && !isNaN(progress)
                                            ? theme.palette.divider
                                            : undefined
                                })}
                            </Badge>
                            {!isUndefined(isLoading) && !isUndefined(progress) && !isNaN(progress) && (
                                <>
                                    <Box
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        height="100%"
                                        width="100%"
                                        bgcolor={alpha('rgb(0,0,0,1)', 0.01)}
                                        sx={{
                                            backdropFilter: 'blur(0.8px)',
                                            borderRadius: 2,
                                            zIndex: 10
                                        }}
                                    ></Box>
                                    <Box
                                        sx={{
                                            top: 10,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        zIndex={20}
                                    >
                                        <FacebookCircularProgress value={progress} />
                                    </Box>
                                </>
                            )}
                            {!isUndefined(isExtracting) && isExtracting === true && (
                                <>
                                    <Box
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        height="100%"
                                        width="100%"
                                        bgcolor={alpha('rgb(0,0,0,1)', 0.01)}
                                        sx={{
                                            backdropFilter: 'blur(0.8px)',
                                            borderRadius: 2,
                                            zIndex: 10
                                        }}
                                    ></Box>
                                    <Box
                                        sx={{
                                            top: 10,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        zIndex={20}
                                    >
                                        <FacebookCircularProgress />
                                    </Box>
                                </>
                            )}
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
                                    : '#f9f7f6'
                            }
                            width={isRenaming ? '100%' : 120}
                            height="max-content"
                            border={isRenaming ? 0 : 0.1}
                            borderColor={(theme) => theme.palette.secondary.light}
                            onClick={handleClick}
                            onContextMenu={handleClick}
                            onDoubleClick={() => handleDoubleClick(disableDoubleClick)}
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
                                transition: `${UriHelper.TRANSITION} all`,
                                transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                                fontFamily: 'inherit',
                                display: 'flex',
                                alignContent: 'center',
                                justifyContent: 'center'
                            }}
                            component={Box}
                        >
                            {isRenaming ? (
                                <RenameDocument
                                    renameFn={(val) => renameFn({ value: val, renameTarget })}
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
                                        fontSize: theme.typography.caption,
                                        display: '-webkit-box',
                                        WebkitLineClamp: '3',
                                        WebkitBoxOrient: 'vertical',
                                        textAlign: 'center',
                                        lineHeight: 1.2
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
        </Grid>
    );
}

export { GridViewItem };
