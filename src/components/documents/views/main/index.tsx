import React from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { alpha } from '@mui/material';
import { CustomDragDocument } from 'components/documents/views/drag&drop/CustomDragDocument';
import { MainGridProps } from 'components/documents/Interface/FileBrowser';
import FolderActionMenu from 'components/documents/views/UI/Menus/FolderActionMenu';
import { useStore } from 'components/documents/data/global_state';
import { useSnackbar } from 'notistack';
import { ListView } from 'components/documents/views/main/content/ListView';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { useHistory } from 'components/documents/data/History';
import { GridView } from './content/GridView';
import { VirtualizedList } from 'components/documents/experimental';

const MainGrid = ({ gridRef }: MainGridProps) => {
    const [contextMenu, setContextMenu] = React.useState<{ mouseX: number; mouseY: number } | null>(null);
    const [open, setOpen] = React.useState(false);
    const [closeContext, setCloseContext] = React.useState<boolean>(false);
    const { clipboard } = useStore();
    const { view, browserHeight } = useViewStore();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [scrollPosition, setScrollPosition] = React.useState<number>(0);
    const { nav } = useHistory();

    const { actions, splitScreen } = useBrowserStore();

    React.useEffect(() => {
        view === 'grid' ? actions.setSplitScreen(true) : actions.setSplitScreen(false);
    }, [view]);

    // ========================= | Fetch data | =========================== //

    // React.useEffect(() => {
    //     if (Array.isArray(selected) && selected.length > 0) {
    //         const childrenArray = actions.getChildren(selected[selected.length - 1]);
    //         if (childrenArray !== null) {
    //             setChildren(childrenArray);
    //         }
    //     }
    // }, [fileMap]);

    React.useEffect(() => {
        if (open === true)
            enqueueSnackbar('Pasted', {
                // action: WithUndo,
                onClose: () => {
                    setOpen(false);
                },
                variant: 'success'
                // persist: true,
            });
        else closeSnackbar();
    }, [closeSnackbar, enqueueSnackbar, open]);
    React.useEffect(() => {
        contextMenu !== null ? setCloseContext(true) : setCloseContext(false);
    }, [contextMenu]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.nativeEvent.button === 0) return;
        else if (e.nativeEvent.button === 2) {
            setCloseContext(true);
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
    const handleMenuClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, close: () => void) => {
        e.preventDefault();
        close();
        setContextMenu(null);
    };
    const handleMenuClick = (
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        type: 'new_folder' | 'paste' | 'paste_all' | 'edit' | 'delete'
    ) => {
        e.preventDefault();
        switch (type) {
            case 'paste':
                try {
                    const clipboardCopy = new Map(clipboard);
                    const it = clipboardCopy.entries();
                    const clipboardStack = [];
                    let result = it.next();
                    while (!result.done) {
                        clipboardStack.push(result.value[0]);
                        result = it.next();
                    }
                    if (clipboardStack.length > 0 && Array.isArray(nav) && nav.length > 0) {
                        const response = actions.move(clipboardStack[clipboardStack.length - 1], nav[nav.length - 1]);
                        setContextMenu(null);
                        if (response === true) {
                            setOpen(true);
                        } else {
                            throw response;
                        }
                    } else {
                        setContextMenu(null);
                    }
                } catch (e) {
                    if (e instanceof Error) {
                        console.log(e.message);
                    } else {
                        console.log(e);
                    }
                }

                break;
            default:
                setContextMenu(null);
                break;
        }
    };
    return (
        <Grid
            container
            bgcolor={(theme) => alpha(theme.palette.secondary.dark, 0.03)}
            sx={{
                overflow: 'hidden',
                height: '100%',
                width: '100%',
                pb: 5,
                pt: view === 'list' ? 0 : 2,
                m: 0,
                userSelect: 'none',
                transition: '0.3s all',
                transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                backdropFilter: 'blur(5px)'
            }}
            onClick={handleClick}
            onContextMenu={handleClick}
            onScroll={() => gridRef.current !== null && gridRef.current !== undefined && setScrollPosition(gridRef.current.scrollLeft)}
            ref={gridRef}
        >
            {view === 'list' ? (
                // <ListView
                //     setCloseContext={setCloseContext}
                //     closeContext={closeContext}
                //     scrollPosition={scrollPosition}
                //     height={gridRef.current ? gridRef.current.clientHeight : window.innerHeight}
                //     width={gridRef.current ? gridRef.current.clientWidth : window.innerWidth}
                // />
                <VirtualizedList height={gridRef.current ? gridRef.current.clientHeight : window.innerHeight} />
            ) : (
                <GridView setCloseContext={setCloseContext} closeContext={closeContext} splitScreen={splitScreen} />
            )}
            <CustomDragDocument parentRef={gridRef} />
            <FolderActionMenu contextMenu={contextMenu} handleMenuClose={handleMenuClose} handleMenuClick={handleMenuClick} />
        </Grid>
    );
};

export default MainGrid;
