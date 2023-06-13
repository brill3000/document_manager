import { FileIconProps, fileIcon } from 'components/documents/Icons/fileIcon';
import { ItemTypes } from 'components/documents/Interface/Constants';
import { useStore } from 'components/documents/data/global_state';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { FolderInterface } from 'global/interfaces';
import { isNull, isUndefined } from 'lodash';
import React, { SetStateAction } from 'react';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useDeleteFileMutation, useMoveFileMutation, useRenameFileMutation } from 'store/async/dms/files/filesApi';
import { useDeleteFolderDocMutation, useMoveFolderMutation, useRenameFolderMutation } from 'store/async/dms/folders/foldersApi';

export const useForwardRef = <T>(ref: React.ForwardedRef<T>) => {
    // @ts-expect-error expect the error
    const innerRef = React.useRef<T | null>(ref);

    React.useEffect(() => {
        if (!ref) return;
        if (typeof ref === 'function') ref(innerRef.current);
        else ref.current = innerRef.current;
    });
    return innerRef;
};

/**
 * Function that add the seleted folder path to the route
 * This is critical for reload purposes
 * @param folderId: string
 * @param folderName: string
 * @returns void
 */
export const useHandleChangeRoute = () => {
    // ================================= | ZUSTAND | ============================= //
    const { actions } = useBrowserStore();
    // ================================= | ROUTES | ============================= //
    const navigate = useNavigate();
    const { pathParam } = useParams();
    const { pathname } = useLocation();

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

    return {
        handleChangeRoute,
        navigate,
        pathParam,
        pathname
    };
};

export const useHandleActionMenu = ({
    is_dir,
    path,
    doc_name,
    setContextMenu,
    setRenameTarget
}: {
    setContextMenu: React.Dispatch<SetStateAction<{ mouseX: number; mouseY: number } | null>>;
    setRenameTarget: React.Dispatch<SetStateAction<{ id: string; rename: boolean } | null>>;
    path: string;
    is_dir: boolean;
    doc_name: string;
}) => {
    // ================================= | ZUSTAND | ============================= //
    const { actions, focused } = useBrowserStore();
    const { addToClipBoard } = useStore();
    const { setOpenPermissionDialog } = useViewStore();
    // ================================= | HOOKS | ============================= //
    const { handleChangeRoute } = useHandleChangeRoute();
    // ================================= | Mutations | ============================= //
    const [deleteFolder] = useDeleteFolderDocMutation();
    const [deleteFile] = useDeleteFileMutation();
    const [renameFile] = useRenameFileMutation();
    const [renameFolder] = useRenameFolderMutation();
    // ================================= | EVENT HANDLERS | ============================= //

    const handleMenuClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setContextMenu(null);
    };

    const handleMenuClick = (
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        type: 'open' | 'copy' | 'cut' | 'rename' | 'edit' | 'delete' | 'permissions'
    ) => {
        e.preventDefault();
        try {
            if (!isUndefined(focused.id) && !isNull(focused.id)) {
                switch (type) {
                    case 'open':
                        if (path !== undefined) {
                            if (is_dir) {
                                if (path !== null || path !== undefined) {
                                    handleChangeRoute(path, is_dir);
                                    setContextMenu(null);
                                }
                            }
                        }
                        break;
                    case 'copy':
                    case 'cut':
                        addToClipBoard({ id: path, action: type, is_dir });
                        setContextMenu(null);
                        break;
                    case 'permissions':
                        setOpenPermissionDialog(true, 'paper');
                        setContextMenu(null);
                        break;
                    case 'delete':
                        try {
                            // eslint-disable-next-line no-restricted-globals
                            const deleteDoc = confirm(`You are about to DELETE ${doc_name}. Delete the document?`);
                            if (deleteDoc && !isUndefined(path) && !isNull(path)) {
                                is_dir ? deleteFolder({ fldId: path }) : deleteFile({ docId: path });
                                setContextMenu(null);
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
    const renameFn = ({ value, renameTarget }: { value: string; renameTarget: { id: string; rename: boolean } | null }) => {
        if (value && renameTarget && renameTarget.id !== value) {
            try {
                // eslint-disable-next-line no-restricted-globals
                const res = confirm('Rename document ? ');
                if (res === true) {
                    if (is_dir) {
                        const fldId = renameTarget.id;
                        const newName = value;
                        const newPath = renameTarget.id.split('/');
                        newPath.pop();
                        newPath.push(newName);
                        actions.setFocused(newPath.join('/'), is_dir);
                        renameFolder({ fldId, newName });
                    } else {
                        const docId = renameTarget.id;
                        const newName = value;
                        const newPath = renameTarget.id.split('/');
                        newPath.pop();
                        newPath.push(newName);
                        actions.setFocused(newPath.join('/'), is_dir);
                        renameFile({ docId, newName });
                    }

                    setRenameTarget(null);
                } else {
                    setRenameTarget(null);
                }
            } catch (e) {
                if (e instanceof Error) {
                    console.error(e.message);
                } else console.log(e);
            }
        } else {
            setRenameTarget(null);
        }
    };
    return {
        handleMenuClick,
        handleMenuClose,
        renameFn
    };
};
export const useHandleClickEvents = ({
    path,
    is_dir,
    doc_name,
    locked,
    setContextMenu,
    contextMenu,
    setRowSelected
}: {
    setContextMenu: React.Dispatch<SetStateAction<{ mouseX: number; mouseY: number } | null>>;
    contextMenu: { mouseX: number; mouseY: number } | null;
    setRenameTarget: React.Dispatch<SetStateAction<{ id: string; rename: boolean } | null>>;
    setRowSelected?: React.Dispatch<SetStateAction<{ path: string; locked?: boolean; doc_name: string; is_dir: boolean }>>;
    path: string;
    is_dir: boolean;
    doc_name: string;
    locked?: boolean;
}) => {
    // ================================= | ZUSTAND | ============================= //
    const { actions } = useBrowserStore();
    const { setViewFile } = useViewStore();
    // ================================= | HOOKS | ============================= //
    const { handleChangeRoute } = useHandleChangeRoute();
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        !isUndefined(setRowSelected) && setRowSelected({ path, is_dir, doc_name, locked });
        e.stopPropagation();
        e.preventDefault();
        if (e.nativeEvent.button === 0 && path !== undefined && path !== null) {
            actions.setFocused(path, is_dir);
        } else if (e.nativeEvent.button === 2 && path !== undefined) {
            actions.setFocused(path, is_dir);
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
    const handleDoubleClick = (disableDoubleClick: boolean) => {
        console.log(path, 'PATH');
        if (disableDoubleClick) return true;
        if (path !== undefined && path !== null) {
            actions.setFocused(path, is_dir);
            handleChangeRoute(path, is_dir);
            !is_dir && setViewFile(true, 'paper');
        }
    };
    return {
        handleClick,
        handleDoubleClick
    };
};

export const useDragAndDropHandlers = ({ is_dir, path, doc_name }: { is_dir: boolean; path: string; doc_name: string }) => {
    // ================================= | Mutations | ============================= //
    const [moveFolder] = useMoveFolderMutation();
    const [moveFile] = useMoveFileMutation();

    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: is_dir ? ItemTypes.Folder : ItemTypes.File,
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: !!monitor.isDragging()
        }),
        item: { path, doc_name, is_dir }
    }));

    const [{ isOver }, drop] = useDrop(() => ({
        accept: [ItemTypes.Folder, ItemTypes.File],
        drop: (item: FolderInterface) => {
            try {
                // eslint-disable-next-line no-restricted-globals
                const moveDoc = confirm(`You are about to move ${item.doc_name} to ${doc_name}`);
                if (moveDoc === true && !isUndefined(item.path) && !isNull(item.path) && path !== undefined && path !== null) {
                    item.is_dir ? moveFolder({ fldId: item.path, dstId: path }) : moveFile({ docId: item.path, dstId: path });
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
    return {
        preview,
        isDragging,
        drag,
        drop,
        isOver
    };
};

export const useMemorizedDocumemtIcon = () => {
    const memorizedFileIcon = React.useCallback((args: FileIconProps) => fileIcon({ ...args }), []);
    return { memorizedFileIcon };
};
