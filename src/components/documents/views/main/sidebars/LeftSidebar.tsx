import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// hero icons
import { MemorizedFcFolder, MemorizedFcFolderOpen } from '../../item/GridViewItem';
import { RenderTree } from 'components/documents/Interface/FileBrowser';
import TreeView from '@mui/lab/TreeView/TreeView';
import { ButtonBase, Stack } from '@mui/material';
import { useGetRootFolderQuery } from 'store/async/dms/repository/repositoryApi';
import { Error } from 'ui-component/LoadHandlers';
import { isArray, isEmpty, isNull, isString, isUndefined, last, nth, uniqueId } from 'lodash';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { RxCaretRight } from 'react-icons/rx';
import { FileIconProps, fileIcon } from 'components/documents/Icons/fileIcon';
import { UriHelper } from 'utils/constants/UriHelper';
import { LazyLoader } from '../..';
import { useHandleChangeRoute, useTreeMap } from 'utils/hooks';
import { GenericDocument } from 'global/interfaces';
import { useSelector } from 'react-redux';
import { StyledTreeItem } from 'components/documents/views/UI/TreeView';
export function LeftSidebar() {
    // =========================== | States | ================================//

    const [data, setData] = React.useState<RenderTree | null>(null);
    const { actions, expanded } = useBrowserStore();
    const [rootUrl, setRootUrl] = React.useState<string | null>(UriHelper.REPOSITORY_GET_ROOT_FOLDER);
    const memorizedFileIcon = React.useCallback((args: FileIconProps) => fileIcon({ ...args }), []);
    const [treeMap, setTreeMap] = React.useState<Map<string, GenericDocument & { children: string[]; hasChildren: boolean }>>(new Map());
    const [mouseOverCaret, setMouseOverCaret] = React.useState<boolean>(false);

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
        currentFolder
    } = useHandleChangeRoute();

    React.useEffect(() => {
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

    React.useEffect(() => {
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
     * @returns React.ReactNode;
     */

    const renderTree = (nodes: RenderTree | null) => {
        const uniqueLoaderId = uniqueId('loader');
        return nodes !== null ? (
            <StyledTreeItem
                key={nodes.id}
                nodeId={nodes.id}
                label={nodes.doc_name}
                onClickCapture={() => {
                    nodes.is_dir && !mouseOverCaret && handleDocumentClick(String(nodes.id), nodes.is_dir);
                }}
                icon={
                    nodes.hasChildren ? (
                        <Stack direction="row" alignItems="center">
                            <ButtonBase
                                sx={{
                                    borderRadius: '50%',
                                    color: 'secondary.main',
                                    '& :hover': {
                                        color: 'primary.dark'
                                    }
                                }}
                            >
                                <RxCaretRight
                                    size={14}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleExpandClick(nodes.id);
                                    }}
                                    style={{
                                        transform: expanded.includes(nodes.id) ? 'rotate(90deg)' : 'initial',
                                        transition: '.3s all',
                                        transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
                                    }}
                                    onMouseOver={() => setMouseOverCaret(true)}
                                    onMouseLeave={() => setMouseOverCaret(false)}
                                />
                            </ButtonBase>
                            {expanded.includes(nodes.id) ? <MemorizedFcFolderOpen size={14} /> : <MemorizedFcFolder size={14} />}
                        </Stack>
                    ) : nodes.is_dir ? (
                        <MemorizedFcFolder size={14} />
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
    };
    // ====================== | EVENTS  | ========================== //
    /**
     * A Function expands or retracts the nodes
     * @param path: string
     * @returns void
     */
    const handleExpandClick = React.useCallback(
        (path: string) => {
            expanded.includes(path) ? actions.removeExpand(path) : actions.addExpanded(path);
        },
        [expanded]
    );

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

    React.useEffect(() => {
        if (rootFolderIsSuccess && !rootFolderIsFetching && !rootFolderIsLoading) {
            actions.addExpanded(rootFolder.path);
        }
    }, [rootFolderIsSuccess, rootFolderIsFetching, rootFolderIsLoading, openItem]);

    React.useEffect(() => {
        if (!isUndefined(rootFolder) && !isNull(rootFolder.path) && !isEmpty(rootFolder.path)) {
            isEmpty(paramArray) && handleDocumentClick(rootFolder.path, true);
        }
    }, [rootFolder]);

    const {} = useTreeMap({ expanded, treeMap, setTreeMap });
    /**
     * add children folders to tree
     */
    React.useEffect(() => {
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
                    selected={currentFolder}
                    expanded={expanded}
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
