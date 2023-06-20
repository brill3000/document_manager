import { FileIconProps, fileIcon } from 'components/documents/Icons/fileIcon';
import { ItemTypes } from 'components/documents/Interface/Constants';
import { PermissionTypes } from 'components/documents/Interface/FileBrowser';
import { useStore } from 'components/documents/data/global_state';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { FolderInterface, TreeMap } from 'global/interfaces';
import { first, isArray, isEmpty, isNull, isUndefined, lastIndexOf, slice, trimEnd } from 'lodash';
import React, { SetStateAction } from 'react';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useDeleteFileMutation, useExtractFileMutation, useMoveFileMutation, useRenameFileMutation } from 'store/async/dms/files/filesApi';
import {
    foldersApi,
    useCreateFolderMutation,
    useCreateSimpleFolderMutation,
    useDeleteFolderDocMutation,
    useGetFoldersExpandedChildrenQuery,
    useMoveFolderMutation,
    useRenameFolderMutation
} from 'store/async/dms/folders/foldersApi';
import { Permissions } from './constants/Permissions';
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

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
    const { pathname, key } = useLocation();
    const [searchParams] = useSearchParams();

    const handleChangeRoute = (path: string, is_dir: boolean) => {
        if (path !== null || path !== undefined) {
            is_dir && actions.addExpanded(path);
            const encodedPathParam = encodeURIComponent(path);
            const documentPath = pathParam
                ? pathname.replace(`/${encodeURIComponent(pathParam)}`, `/${encodedPathParam}`)
                : `${pathname}/${encodedPathParam}`;
            navigate(documentPath + `?is_dir=${is_dir ? 'true' : 'false'}`);
        }
    };
    const isTrashFolder = React.useMemo(() => {
        const pathArray = pathname.split('/');
        if (isArray(pathArray) && !isEmpty(pathArray)) {
            pathArray.includes('documents');
            pathArray.shift();
            pathArray.shift();
            if (first(pathArray) === 'trash') return true;
            else return false;
        } else {
            return false;
        }
    }, [pathname]);
    const paramArray: string[] | null = React.useMemo(() => {
        let arr = !isNull(pathParam) && !isUndefined(pathParam) ? decodeURIComponent(pathParam).split('/') : null;
        if (isArray(arr)) {
            arr.shift();
            arr = arr.map((x, i) => {
                let pathString = '';
                if (i === 0) {
                    pathString = '/' + first(arr);
                } else {
                    pathString = '/' + slice(arr, 0, i + 1).join('/');
                }
                return pathString;
            });
        }

        return arr;
    }, [pathParam]);
    const currenFolder: string | null | undefined = React.useMemo(() => {
        if (isArray(paramArray)) {
            if (!isNull(searchParams.get('is_dir')) ? (searchParams.get('is_dir') === 'true' ? true : false) : true !== true) {
                return paramArray[paramArray.length - 1] ?? null;
            } else {
                const paramArrayCopy = [...paramArray];
                paramArrayCopy.pop();
                return paramArrayCopy[paramArrayCopy.length - 1] ?? null;
            }
        }
    }, [pathParam]);
    return {
        handleChangeRoute,
        navigate,
        pathParam: !isNull(pathParam) && !isUndefined(pathParam) ? decodeURIComponent(pathParam).split('/') : null,
        pathname,
        paramArray,
        key,
        isTrashFolder,
        is_dir: !isNull(searchParams.get('is_dir')) ? (searchParams.get('is_dir') === 'true' ? true : false) : true,
        currenFolder
    };
};

export const useTreeMap = ({ expanded, setTreeMap }: TreeMap) => {
    const { data } = useGetFoldersExpandedChildrenQuery({ expanded });

    React.useEffect(() => {
        if (!isUndefined(data) && isArray(data.folders)) {
            setTreeMap((oldMap) => {
                const map = new Map(oldMap);
                for (let index = 0; index < data.folders.length; index++) {
                    if (!isUndefined(data.folders[index].status)) {
                        data.folders[index].status === 'fulfilled' &&
                            map.set(data.folders[index].value.path, { id: data.folders[index].value.path, ...data.folders[index].value });
                    } else {
                        map.set(data.folders[index].path, { id: data.folders[index].path, ...data.folders[index] });
                    }
                }
                return map;
            });
        }
    }, [data]);
    return {
        expandedData: data
    };
};

export const createPermissionObj = ({ permissionId }: { permissionId: number }): PermissionTypes => {
    const folderPermission: PermissionTypes = {
        read: false,
        write: false,
        delete: false,
        security: false
    };
    if (!isUndefined(permissionId)) {
        switch (permissionId) {
            case Permissions.ALL_GRANTS:
                folderPermission.read = true;
                folderPermission.write = true;
                folderPermission.delete = true;
                folderPermission.security = true;
                break;
            case Permissions.READ:
                folderPermission.read = true;
                folderPermission.write = false;
                folderPermission.delete = false;
                folderPermission.security = false;
                break;
            case Permissions.WRITE:
                folderPermission.read = false;
                folderPermission.write = true;
                folderPermission.delete = false;
                folderPermission.security = false;
                break;
            case Permissions.DELETE:
                folderPermission.read = false;
                folderPermission.write = false;
                folderPermission.delete = true;
                folderPermission.security = false;
                break;
            case Permissions.SECURITY:
                folderPermission.read = false;
                folderPermission.write = false;
                folderPermission.delete = false;
                folderPermission.security = true;
                break;
            case Permissions.READ + Permissions.WRITE:
                folderPermission.read = true;
                folderPermission.write = true;
                folderPermission.delete = false;
                folderPermission.security = false;
                break;
            case Permissions.READ + Permissions.DELETE:
                folderPermission.read = true;
                folderPermission.write = false;
                folderPermission.delete = true;
                folderPermission.security = false;
                break;
            case Permissions.READ + Permissions.SECURITY:
                folderPermission.read = true;
                folderPermission.write = false;
                folderPermission.delete = false;
                folderPermission.security = true;
                break;
            case Permissions.WRITE + Permissions.DELETE:
                folderPermission.read = false;
                folderPermission.write = true;
                folderPermission.delete = true;
                folderPermission.security = false;
                break;
            case Permissions.WRITE + Permissions.SECURITY:
                folderPermission.read = false;
                folderPermission.write = true;
                folderPermission.delete = false;
                folderPermission.security = true;
                break;
            case Permissions.READ + Permissions.WRITE + Permissions.DELETE:
                folderPermission.read = true;
                folderPermission.write = true;
                folderPermission.delete = true;
                folderPermission.security = false;
                break;
            default:
                break;
        }
    }
    return folderPermission;
};

export const useHandleActionMenu = ({
    is_dir,
    path,
    doc_name,
    is_new,
    setContextMenu
}: {
    setContextMenu: React.Dispatch<SetStateAction<{ mouseX: number; mouseY: number } | null>>;
    path: string;
    is_dir: boolean;
    doc_name: string;
    is_new: boolean;
}) => {
    // ================================= | ZUSTAND | ============================= //
    const { focused, selected, actions, isCreating, renameTarget } = useBrowserStore();
    const { addToClipBoard } = useStore();
    const { setOpenPermissionDialog } = useViewStore();
    // ================================= | REDUX | ============================= //
    const dispatch = useDispatch();
    // ================================= | HOOKS | ============================= //
    const { handleChangeRoute, currenFolder } = useHandleChangeRoute();
    // ================================= | Mutations | ============================= //
    const [deleteFolder] = useDeleteFolderDocMutation();
    const [deleteFile] = useDeleteFileMutation();
    const [renameFile] = useRenameFileMutation();
    const [extractFile] = useExtractFileMutation();

    const [renameFolder] = useRenameFolderMutation();
    const [createSimpleFolder] = useCreateSimpleFolderMutation();
    // ================================= | EVENT HANDLERS | ============================= //

    const handleMenuClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setContextMenu(null);
    };

    const handleMenuClick = async (
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        type: 'open' | 'copy' | 'cut' | 'rename' | 'edit' | 'extract' | 'delete' | 'permissions'
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
                                const parent = trimEnd(path.substring(0, lastIndexOf(path, '/')), '/');
                                is_dir ? deleteFolder({ fldId: path, parent }) : deleteFile({ docId: path, parent });
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
                    case 'extract':
                        try {
                            // eslint-disable-next-line no-restricted-globals
                            const deleteDoc = confirm(`Extract document?`);
                            setContextMenu(null);
                            if (deleteDoc && !isUndefined(path) && !isNull(path)) {
                                try {
                                    const parent = trimEnd(path.substring(0, lastIndexOf(path, '/')), '/');
                                    !is_dir && (await extractFile({ docId: path, parent }).unwrap());
                                    dispatch(foldersApi.util.invalidateTags(['DMS_FOLDERS']));
                                } catch (e) {
                                    console.log(e);
                                }
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
                        actions.setRenameTarget({ id: path, rename: true, is_new });
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
    const renameFn = async ({
        value,
        renameTarget
    }: {
        value: string;
        renameTarget: { id: string; rename: boolean; is_new?: boolean } | null;
    }) => {
        if (value && renameTarget && renameTarget?.is_new && isCreating) {
            try {
                actions.setIsCreating(false);
                // eslint-disable-next-line no-restricted-globals
                const res = confirm('Create folder ? ');
                if (res === true) {
                    if (is_dir) {
                        const newName = value;
                        const newPath = renameTarget.id.split('/');
                        newPath.pop();
                        newPath.push(newName);
                        await createSimpleFolder({
                            fldPath: newPath.join('/')
                        });
                        actions.setIsCreating(false);
                        actions.removeNewFolder();
                        actions.setFocused(newPath.join('/'), true);
                    }
                    actions.setRenameTarget(null);
                } else {
                    actions.setIsCreating(false);
                    actions.removeNewFolder();
                    actions.setRenameTarget(null);
                }
            } catch (e) {
                actions.setIsCreating(false);
                actions.removeNewFolder();
                if (e instanceof Error) {
                    console.error(e.message);
                } else console.log(e);
            }
        } else if (value && renameTarget && renameTarget.id !== value) {
            try {
                // eslint-disable-next-line no-restricted-globals
                const res = confirm('Rename document ? ');
                if (res === true) {
                    if (!isUndefined(currenFolder) && !isNull(currenFolder)) {
                        if (is_dir) {
                            const fldId = renameTarget.id;
                            const newName = value;
                            const newPath = renameTarget.id.split('/');
                            newPath.pop();
                            newPath.push(newName);
                            renameFolder({
                                fldId,
                                newName,
                                parent: currenFolder,
                                newPath: newPath.join('/'),
                                oldPath: renameTarget.id
                            });
                        } else {
                            const docId = renameTarget.id;
                            const newName = value;
                            const newPath = renameTarget.id.split('/');
                            newPath.pop();
                            newPath.push(newName);
                            renameFile({
                                docId,
                                newName,
                                parent: currenFolder,
                                newPath: newPath.join('/'),
                                oldPath: renameTarget.id
                            });
                        }
                    }

                    actions.setRenameTarget(null);
                } else {
                    actions.setRenameTarget(null);
                }
            } catch (e) {
                if (e instanceof Error) {
                    console.error(e.message);
                } else console.log(e);
            }
        } else {
            actions.setRenameTarget(null);
        }
    };
    const isRenaming = React.useMemo(() => renameTarget && path !== undefined && renameTarget.id === path && renameTarget.rename, [
        renameTarget
    ]);
    return {
        handleMenuClick,
        handleMenuClose,
        renameFn,
        isRenaming
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
    setRowSelected?: React.Dispatch<SetStateAction<{ path: string; locked?: boolean; doc_name: string; is_dir: boolean }>>;
    path: string;
    is_dir: boolean;
    doc_name: string;
    locked?: boolean;
}) => {
    // ================================= | ZUSTAND | ============================= //
    const { actions, isCreating } = useBrowserStore();
    const { setViewFile } = useViewStore();
    // ================================= | HOOKS | ============================= //
    const { handleChangeRoute } = useHandleChangeRoute();
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (isCreating === true) return;
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
        if (isCreating === true) return;
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

// ================================= | Axios Base Query | ============================= //

export const axiosBaseQuery = (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
): BaseQueryFn<
    {
        url: string;
        method: AxiosRequestConfig['method'];
        data?: AxiosRequestConfig['data'];
        params?: AxiosRequestConfig['params'];
        onUploadProgress?: AxiosRequestConfig['onUploadProgress']; // Add onUploadProgress option
    },
    unknown,
    unknown
> => async ({ url, method, data, params, onUploadProgress }) => {
    try {
        const result = await axios({ url: baseUrl + url, method, data, params, onUploadProgress, withCredentials: true });
        return { data: result.data };
    } catch (axiosError) {
        const err = axiosError as AxiosError;
        return {
            error: {
                status: err.response?.status,
                data: err.response?.data || err.message
            }
        };
    }
};
