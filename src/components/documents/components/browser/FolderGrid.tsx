import React from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { alpha } from '@mui/material';
import { Document } from './Document';
import { CustomDragDocument } from './Drag&Drop/CustomDragDocument';
import { FolderGridProps } from '../../Interface/FileBrowser';
import FolderActionMenu from './UI/Menus/FolderActionMenu';
import { useStore } from '../../data/global_state';
import { useSnackbar } from 'notistack';
import { DocumentList } from './DocumentList';
import { useBrowserStore } from '../../data/global_state/slices/BrowserMock';
import { useViewStore } from '../../data/global_state/slices/view';
import { brown } from '@mui/material/colors';

const FolderGrid = ({ documents, selected, setSelected, select, nav, gridRef }: FolderGridProps) => {
    const [contextMenu, setContextMenu] = React.useState<{ mouseX: number; mouseY: number } | null>(null);
    const [isOverDoc, setIsOverDoc] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState(false);
    const [closeContext, setCloseContext] = React.useState<boolean>(false);
    const { clipboard } = useStore();
    const { view } = useViewStore();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [scrollPosition, setScrollPosition] = React.useState<number>(0);

    const { actions } = useBrowserStore();

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
        setSelected([]);
        if (e.nativeEvent.button === 0) return;
        else if (e.nativeEvent.button === 2) {
            setIsOverDoc(false);
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
        setIsOverDoc(false);
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
                        setIsOverDoc(false);
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
            sm={12}
            md={8}
            bgcolor={alpha(brown[100], 0.2)}
            sx={{
                overflowY: 'auto',
                height: '100%',
                width: '100%',
                pb: 5,
                pt: view === 'list' ? 0 : 2,
                m: 0,
                userSelect: 'none'
            }}
            rowSpacing={1}
            onClick={handleClick}
            onContextMenu={handleClick}
            onScroll={() => gridRef.current !== null && gridRef.current !== undefined && setScrollPosition(gridRef.current.scrollLeft)}
            ref={gridRef}
        >
            {view === 'list' ? (
                <DocumentList
                    documents={documents}
                    setCloseContext={setCloseContext}
                    closeContext={closeContext}
                    selected={selected}
                    setSelected={setSelected}
                    select={select}
                    actions={actions}
                    isOverDoc={isOverDoc}
                    setIsOverDoc={setIsOverDoc}
                    scrollPosition={scrollPosition}
                    height={gridRef.current ? gridRef.current.clientHeight : '100vh'}
                    width={gridRef.current ? gridRef.current.clientWidth : '100vw'}
                />
            ) : (
                documents.map((document, i: number) => (
                    <Document
                        setCloseContext={setCloseContext}
                        closeContext={closeContext}
                        key={document !== undefined ? document.id : i}
                        document={document}
                        selected={selected}
                        setSelected={setSelected}
                        select={select}
                        actions={actions}
                        isOverDoc={isOverDoc}
                        setIsOverDoc={setIsOverDoc}
                    />
                ))
            )}
            <CustomDragDocument />
            <FolderActionMenu contextMenu={contextMenu} handleMenuClose={handleMenuClose} handleMenuClick={handleMenuClick} />
        </Grid>
    );
};

export default FolderGrid;
