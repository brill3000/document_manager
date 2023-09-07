import { useCallback, useState, useEffect } from 'react';
// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { IconButton, Stack, useTheme } from '@mui/material';
//icons
import { BsDatabaseFill, BsDatabaseFillCheck } from 'react-icons/bs';

// LODASH
import { isArray, isEmpty, isNull, isString, isUndefined, last, nth, startsWith, uniqueId } from 'lodash';
// RTK: QUERY
import { RxCaretRight } from 'react-icons/rx';
import { MemorizedFcFolder, MemorizedFcFolderOpen } from '../../item/GridViewItem';
import { FileIconProps, fileIcon } from 'components/documents/Icons/fileIcon';
import { useGetRootFolderQuery } from 'store/async/dms/repository/repositoryApi';

// ZUSTAND
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';

// INTERFACES
import { GenericDocument } from 'global/interfaces';
// REDUX
import { useSelector } from 'react-redux';
import { StyledTreeItem } from 'components/documents/views/UI/TreeView';

// COMPONENTS
import { RenderTree } from 'components/documents/Interface/FileBrowser';
import { Error } from 'ui-component/LoadHandlers';
import { LazyLoader } from '../..';

// HELPERS
import { UriHelper } from 'utils/constants/UriHelper';
import { useHandleChangeRoute, useTreeMap } from 'utils/hooks';

export function LeftSidebar({
    root,
    customHandleClick,
    selectedList,
    standAlone
}: {
    root?: string | null;
    customHandleClick?: (node: string) => void;
    selectedList?: string[] | null;
    standAlone?: boolean;
}) {
    // =========================== | Theme | ================================//
    const theme = useTheme();
    // =========================== | States | ================================//

    const [data, setData] = useState<RenderTree | null>(null);
    const { actions, expanded } = useBrowserStore();
    const [rootUrl, setRootUrl] = useState<string | null>(UriHelper.REPOSITORY_GET_ROOT_FOLDER);
    const memorizedFileIcon = useCallback((args: FileIconProps) => fileIcon({ ...args }), []);
    const [treeMap, setTreeMap] = useState<Map<string, GenericDocument & { children: string[]; hasChildren: boolean }>>(new Map());
    const [mouseOverCaret, setMouseOverCaret] = useState<boolean>(false);

    // ============================== | STORE | =========================== //
    // @ts-expect-error expected
    const menu = useSelector((state) => state.menu);
    const { openItem } = menu;
    // =========================== | CUSTOM HOOKS | ================================//
    const {
        paramArray,
        pathParam,
        pathname,
        handleChangeRoute: handleDocumentClick,
        is_dir: route_is_dir,
        currentFolder,
        rootPath
    } = useHandleChangeRoute();

    useEffect(() => {
        if (isArray(paramArray)) {
            if (route_is_dir !== true) {
                const paramArrayCopy = [...paramArray];
                paramArrayCopy.pop();
                paramArrayCopy.forEach((x) => actions.addExpanded(x));
            } else {
                paramArray.forEach((x) => actions.addExpanded(x));
            }
        }
    }, []);

    useEffect(() => {
        if (standAlone === true && typeof root === 'string') return setRootUrl(root);
        if (isString(pathname) && !isEmpty(pathname)) {
            const pathArray = pathname.split('/');
            if (nth(pathArray, 1) === 'documents') {
                const base = nth(pathArray, 2);
                if (!isEmpty(base)) {
                    switch (base) {
                        case 'system-documents':
                            setRootUrl(UriHelper.REPOSITORY_GET_ROOT_FOLDER);
                            break;
                        case 'categories':
                            setRootUrl(UriHelper.REPOSITORY_GET_ROOT_CATEGORIES);
                            break;
                        case 'my-documents':
                            setRootUrl(UriHelper.REPOSITORY_GET_ROOT_PERSONAL);
                            break;
                        case 'templates':
                            setRootUrl(UriHelper.REPOSITORY_GET_ROOT_TEMPLATES);
                            break;
                        case 'email-attachments':
                            setRootUrl(UriHelper.REPOSITORY_GET_ROOT_MAIL_FOLDER);
                            break;
                        case 'trash':
                            setRootUrl(UriHelper.REPOSITORY_GET_TRASH_ROOT_FOLDER);
                            break;
                        default:
                            setRootUrl(UriHelper.REPOSITORY_GET_ROOT_FOLDER);
                            break;
                    }
                }
            }
            // }
        }
    }, [pathParam, pathname]);

    // =========================== | Render Function | ================================//
    /**
     * A Function which recursively renders the tree elemenst with all the nesting
     * @param nodes: RenderTree | null
     * @returns ReactNode;
     */

    const renderTree = useCallback(
        (nodes: RenderTree | null) => {
            const uniqueLoaderId = uniqueId('loader');
            return nodes !== null ? (
                <StyledTreeItem
                    key={nodes.id}
                    nodeId={nodes.id}
                    label={nodes.doc_name}
                    // onClickCapture={() => {

                    // }}
                    icon={
                        nodes.hasChildren ? (
                            <Stack direction="row" alignItems="center">
                                <IconButton
                                    sx={{
                                        p: 0,
                                        width: 15,
                                        height: 15
                                    }}
                                    onMouseOver={() => {
                                        return setMouseOverCaret(true);
                                    }}
                                    onMouseLeave={() => {
                                        return setMouseOverCaret(false);
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        mouseOverCaret === true && handleExpandClick(nodes.id);
                                    }}
                                    size="small"
                                    color="secondary"
                                >
                                    <RxCaretRight
                                        size={14}
                                        style={{
                                            transform: expanded.includes(nodes.id) ? 'rotate(90deg)' : 'initial',
                                            transition: '.3s all',
                                            transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
                                        }}
                                    />
                                </IconButton>
                                {(rootPath === 'categories' || startsWith(nodes.id, '/okm:categories')) &&
                                    (Array.isArray(selectedList) && selectedList.some((selected) => selected === nodes.id) ? (
                                        <BsDatabaseFillCheck size={14} color={theme.palette.success.main} />
                                    ) : (
                                        <BsDatabaseFill size={14} color={theme.palette.warning.main} />
                                    ))}
                                {rootPath !== 'categories' &&
                                    !startsWith(nodes.id, '/okm:categories') &&
                                    (expanded.includes(nodes.id) ? <MemorizedFcFolderOpen size={14} /> : <MemorizedFcFolder size={14} />)}
                            </Stack>
                        ) : nodes.is_dir ? (
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                {rootPath === 'categories' || startsWith(nodes.id, '/okm:categories') ? (
                                    Array.isArray(selectedList) && selectedList.some((selected) => selected === nodes.id) ? (
                                        <BsDatabaseFillCheck size={14} color={theme.palette.success.main} />
                                    ) : (
                                        <BsDatabaseFill size={14} color={theme.palette.warning.main} />
                                    )
                                ) : (
                                    <MemorizedFcFolder size={14} />
                                )}
                            </Stack>
                        ) : (
                            memorizedFileIcon({ mimeType: nodes.mimeType, size: 16, file_icon_margin: 0 })
                        )
                    }
                    bgColor={undefined}
                    color={undefined}
                    labelText={''}
                >
                    {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
                </StyledTreeItem>
            ) : (
                <StyledTreeItem
                    key={uniqueLoaderId}
                    nodeId={uniqueLoaderId}
                    label={uniqueLoaderId}
                    disabled
                    onClick={() => {
                        return;
                    }}
                    sx={{
                        '& .Mui-disabled': {
                            opacity: 1
                        },
                        '& .MuiTreeItem-label': {
                            p: 0
                        }
                    }}
                    bgColor={undefined}
                    color={undefined}
                    labelText={''}
                />
            );
        },
        [selectedList, mouseOverCaret, expanded, data]
    );
    // ====================== | EVENTS  | ========================== //
    /**
     * A Function expands or retracts the nodes
     * @param path: string
     * @returns void
     */
    const handleExpandClick = useCallback(
        (path: string) => {
            expanded.includes(path) ? actions.removeExpand(path) : actions.addExpanded(path);
        },
        [expanded]
    );

    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    };

    const handleSelect = (event: React.SyntheticEvent, nodeIds: string[] | string) => {
        standAlone !== true && handleDocumentClick(String(nodeIds), true);
        standAlone === true && typeof customHandleClick === 'function' && customHandleClick(String(nodeIds));
    };

    /**
     * A Function which populates and updated the tree data
     * @param obj GenericDocument & { children: Array<string | null> | null; hasChildren: boolean },
     * @param pathToCompare: string
     * @returns GenericDocument & { children: Array<GenericDocument | null> | null }) | null;
     */

    const recursiveMapUpdate = (
        obj: GenericDocument & { children: Array<string | null> | null; hasChildren: boolean },
        pathToCompare: string
    ): (GenericDocument & { children: Array<GenericDocument | null> | null }) | null => {
        const objCopy = { ...obj };
        if (expanded.includes(pathToCompare) && treeMap.has(pathToCompare)) {
            const doc = treeMap.get(pathToCompare);
            if (!isUndefined(doc)) {
                const children = doc.children.map((child) => {
                    if (treeMap.has(child)) {
                        if (!isUndefined(treeMap.get(child)) && expanded.includes(child)) {
                            // @ts-expect-error expected
                            return recursiveMapUpdate(treeMap.get(child), child);
                        }
                        return treeMap.get(child) ?? null;
                    } else return null;
                });
                // @ts-expect-error expected
                objCopy.children = children;
            }
        }
        return { ...objCopy } as GenericDocument & { children: Array<GenericDocument | null> | null };
    };
    // =========================== | Data Functions | ================================//
    /**
     * Fetch root folder
     */
    const {
        data: rootFolder,
        error: rootFolderError,
        isFetching: rootFolderIsFetching,
        isLoading: rootFolderIsLoading,
        isSuccess: rootFolderIsSuccess
    } = useGetRootFolderQuery(
        { url: rootUrl },
        {
            skip: rootUrl === null
        }
    );

    useEffect(() => {
        if (rootFolderIsSuccess && !rootFolderIsFetching && !rootFolderIsLoading) {
            actions.addExpanded(rootFolder.path);
        }
    }, [rootFolderIsSuccess, rootFolderIsFetching, rootFolderIsLoading, openItem]);

    useEffect(() => {
        if (!isUndefined(rootFolder) && !isNull(rootFolder.path) && !isEmpty(rootFolder.path)) {
            isEmpty(paramArray) && handleDocumentClick(rootFolder.path, true);
        }
    }, [rootFolder]);

    const {} = useTreeMap({ expanded, treeMap, setTreeMap });
    /**
     * add children folders to tree
     */
    useEffect(() => {
        if (
            !isNull(rootFolder) &&
            !isUndefined(rootFolder) &&
            expanded.includes(rootFolder.path) &&
            !isUndefined(treeMap.get(rootFolder.path))
        ) {
            setData(null);
            // @ts-expect-error exp
            const obj: GenericDocument & { children: Array<string | null> | null; hasChildren: boolean } = treeMap.get(rootFolder.path);
            if (!isUndefined(rootFolder) && !isNull(rootFolder)) {
                const treeData = recursiveMapUpdate(obj, rootFolder.path);

                if (isArray(paramArray)) {
                    if (route_is_dir !== true) {
                        const paramArrayCopy = [...paramArray];
                        const file = paramArrayCopy.pop();
                        !isUndefined(file) && actions.setFocused(file, false);
                        actions.setSelected([{ id: last(paramArrayCopy) ?? '', is_dir: true }]);
                    } else {
                        actions.setSelected([{ id: last(paramArray) ?? '', is_dir: true }]);
                    }
                }

                // @ts-expect-error expected
                setData(treeData);
            }
        }
    }, [treeMap, expanded, openItem]);
    return (
        <>
            {/* Initial Loader */}
            {rootFolderIsFetching || isNull(data) || (!isUndefined(rootFolder) && data.id !== rootFolder.path) ? (
                <LazyLoader align="center" width="80%" justify="center" height={20} />
            ) : rootFolderError ? (
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="100%" minWidth="100%">
                    <Error height={50} width={50} />
                </Box>
            ) : data !== null && data !== undefined ? (
                <TreeView
                    aria-label="Folder Sidebar"
                    selected={[currentFolder ?? '']}
                    expanded={expanded}
                    onNodeToggle={handleToggle}
                    onNodeSelect={handleSelect}
                    sx={{
                        flexGrow: 1,
                        maxWidth: '100%',
                        minWidth: '100%',
                        overflowY: 'auto',
                        pt: 1.2,
                        pr: 1
                    }}
                >
                    {renderTree(data)}
                </TreeView>
            ) : (
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="100%" minWidth="100%">
                    <Typography>No base folders available</Typography>
                </Box>
            )}
        </>
    );
}
