import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';

// hero icons
import { MemorizedFcFolder, MemorizedFcFolderOpen } from '../../item/GridViewItem';
import { RenderTree } from 'components/documents/Interface/FileBrowser';
import TreeView from '@mui/lab/TreeView/TreeView';
import { ButtonBase, Collapse, Skeleton, Stack, alpha } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useSpring, animated } from '@react-spring/web';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useGetRootFolderQuery } from 'store/async/dms/repository/repositoryApi';
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';
import _, { uniqueId } from 'lodash';
import { useGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { RxCaretDown, RxCaretRight } from 'react-icons/rx';
// import { GetFetchedFoldersProps } from 'global/interfaces';
function TransitionComponent(props: TransitionProps) {
    const style = useSpring({
        from: {
            opacity: 0,
            transform: 'translate3d(20px,0,0)'
        },
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(${props.in ? 0 : 20}px,0,0)`
        }
    });
    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
}

const StyledTreeItemRoot = styled(
    (props: TreeItemProps & { isLoader: boolean }) => <TreeItem {...props} TransitionComponent={TransitionComponent} />,
    {
        shouldForwardProp: (props) =>
            props !== 'isLoader' && props !== 'bgColor' && props !== 'labelInfo' && props !== 'labelText' && props !== 'isFocused'
    }
)(({ theme, isLoader }) => ({
    color: theme.palette.text.secondary,
    paddingRight: 0,
    paddingTop: theme.spacing(0.5),
    [`& .${treeItemClasses.content}`]: {
        borderRadius: theme.spacing(0.5),
        paddingLeft: theme.spacing(1.5),
        backgroundColor: isLoader ? 'transparent' : alpha(theme.palette.secondary.light, 0.3),
        ...(isLoader && { padding: '0 !important', height: '1.5rem !important' }),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular
        },
        '.MuiTreeItem-label': {
            paddingLeft: theme.spacing(1)
        },
        '&:hover': {
            backgroundColor: isLoader ? 'transparent' : alpha(theme.palette.secondary.light, 0.35)
        },
        '&.Mui-focused': {
            backgroundColor: isLoader ? 'transparent' : alpha(theme.palette.secondary.light, 0.6)
        },
        '&.Mui-selected': {
            backgroundColor: `var(--tree-view-bg-color, ${alpha(theme.palette.action.selected, 0.4)})`,
            color: 'var(--tree-view-color)',
            borderRight: `3px solid ${alpha(theme.palette.primary.main, 0.4)}`,
            borderLeft: `3px solid ${alpha(theme.palette.primary.main, 0.4)}`
        }
    },
    [`& .${treeItemClasses.iconContainer}`]: {
        display: isLoader ? 'none' : 'inherit'
    }
}));

function StyledTreeItem(props: TreeItemProps) {
    const { label, nodeId, ...other } = props;
    const otherOmitted = _.omit(other, ['label', 'focused']);
    return (
        <StyledTreeItemRoot
            nodeId={nodeId}
            label={
                !nodeId.includes('loader') ? (
                    label
                ) : (
                    <Box width="100%" height="100%">
                        <Skeleton width="100%" height="2.3rem" animation="wave" />
                    </Box>
                )
            }
            sx={{
                '--tree-view-color': (theme) => theme.palette.primary.main,
                '--tree-view-bg-color': (theme) => alpha(theme.palette.primary.light, 0.3)
            }}
            {...otherOmitted}
            isLoader={nodeId.includes('loader')}
        />
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired
};

export default function LeftSidebar() {
    // =========================== | States | ================================//

    const [data, setData] = React.useState<RenderTree | null>(null);
    const { actions, selected, focused } = useBrowserStore();

    // =========================== | Controlled treeview Function | ================================//
    const [expanded, setExpanded] = React.useState<string[]>([]);
    const handleExpandClick = React.useCallback((path: string) => {
        actions.setFocused(path);
        setExpanded((oldExpanded) => {
            return oldExpanded.length > 0
                ? oldExpanded.includes(path)
                    ? [...oldExpanded.filter((x) => x !== path)]
                    : [...oldExpanded, path]
                : [path];
        });
    }, []);
    // =========================== | Render Function | ================================//

    const renderTree = (nodes: RenderTree | null) => {
        const uniqueLoaderId = uniqueId('loader');
        return nodes !== null ? (
            <StyledTreeItem
                key={nodes.id}
                nodeId={nodes.id}
                label={nodes.doc_name}
                onDoubleClickCapture={() => {
                    handleDocumentClick(String(nodes.id));
                }}
                onClick={() => actions.setFocused(nodes.id)}
                icon={
                    nodes.hasChildren ? (
                        <Stack direction="row" alignItems="center">
                            <ButtonBase
                                sx={{
                                    borderRadius: '50%',
                                    '& :hover': {
                                        bgcolor: 'secondary.light'
                                    }
                                }}
                            >
                                <RxCaretRight
                                    size={16}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleExpandClick(nodes.id);
                                    }}
                                    style={{
                                        borderRadius: '50%',
                                        transform: expanded.includes(nodes.id) ? 'rotate(90deg)' : 'initial',
                                        transition: '.3s all',
                                        transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
                                    }}
                                />
                            </ButtonBase>
                            <MemorizedFcFolder size={16} />
                        </Stack>
                    ) : (
                        <MemorizedFcFolder size={16} />
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
    // ====================== | Update Tree: Recursive function  | ========================== //
    function recursiveUpdate(tree: RenderTree | null, pathToCompare: RenderTree['id'], children: RenderTree[]): RenderTree | null {
        if (tree === null) return null;
        // Base case: Check if the current tree path matches the pathToCompare
        if (tree.id === pathToCompare && Array.isArray(children)) {
            // Update the tree or perform desired operations
            // For example, you can set a flag or modify properties within the tree
            tree.children = children;
        }

        // Recursive case: Check if the current child index matches the childIndexToCompare
        // if (tree.index !== undefined) {
        //     const childIndex = tree.index;
        //     if (tree.children && childIndex >= 0 && childIndex < tree.children.length) {
        //         const child = tree.children[childIndex];
        //         tree.children[childIndex] = recursiveUpdate(child, pathToCompare, children);
        //     }
        // } else {
        // If childIndexToCompare is not defined, recursively call for all children
        if (tree.children) {
            tree.children = tree.children.map((child) => recursiveUpdate(child, pathToCompare, children));
        }
        // }

        return tree;
    }
    // =========================== | Data Functions | ================================//
    /**
     * Fetch root folder
     */
    const {
        data: rootFolder,
        error: rootFolderError,
        isFetching: rootFolderIsFetching,
        isSuccess: rootFolderIsSuccess
    } = useGetRootFolderQuery({});

    React.useEffect(() => {
        if (rootFolderIsSuccess && !rootFolderIsFetching) {
            console.log('called root');
            handleExpandClick(rootFolder.path);
            actions.setSelected([rootFolder.path]);
            actions.setFocused(rootFolder.path);
            const data: RenderTree = {
                id: rootFolder.path,
                doc_name: rootFolder.doc_name,
                hasChildren: rootFolder.hasChildren,
                index: 0,
                children: [null]
            };
            setData(data);
        }
    }, [rootFolderIsSuccess, rootFolderIsFetching]);

    /**
     * Fetch children
     */

    const {
        data: folderChildren,
        error: folderChildrenError,
        isFetching: folderChildrenIsFetching,
        isSuccess: folderChildrenIsSuccess
    } = useGetFoldersChildrenQuery(
        { fldId: focused !== null && focused !== undefined && focused.length > 0 ? focused : '' },
        {
            skip: focused === null || focused === undefined || focused.length < 1
        }
    );
    React.useEffect(() => {
        if (
            folderChildrenIsSuccess &&
            folderChildren &&
            !folderChildrenIsFetching &&
            Array.isArray(folderChildren.folder) &&
            focused !== null &&
            focused.length > 1
        ) {
            const newChildren: RenderTree[] = folderChildren.folder.map((child, i: number) => {
                // @ts-expect-error is set below
                const treeItem: RenderTree = {
                    id: child.path,
                    doc_name: child.doc_name,
                    children: child.hasChildren ? [null] : [],
                    hasChildren: child.hasChildren
                };
                treeItem['index'] = i;
                return treeItem;
            });
            setData((data) => {
                let dataCopy = data !== null ? { ...data } : null;
                dataCopy = recursiveUpdate(data, focused, newChildren);
                return dataCopy !== null ? { ...dataCopy } : null;
            });
        }
    }, [folderChildrenIsSuccess, folderChildrenIsFetching]);

    // =========================== | Route Functions | ================================//
    const navigate = useNavigate();
    const { pathParam } = useParams();
    const { pathname } = useLocation();
    // =========================== | Event Handles | ================================//

    /**
     * Function that add the seleted folder path to the route
     * This is critical for reload purposes
     * @param folderId: string
     * @returns void
     */
    const handleDocumentClick = (folderId: string) => {
        if (folderId !== null || folderId !== undefined) {
            actions.setSelected([folderId]);
            const encodedPathParam = encodeURIComponent(folderId);
            const documentPath = pathParam
                ? pathname.replace(`/${encodeURIComponent(pathParam)}`, `/${encodedPathParam}`)
                : `${pathname}/${encodedPathParam}`;
            navigate(documentPath);
        }
    };
    return (
        <>
            {/* Initial Loader */}
            {rootFolderIsFetching ? (
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="100%" minWidth="100%">
                    <GoogleLoader height={100} width={100} loop={true} />
                </Box>
            ) : rootFolderError ? (
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="100%" minWidth="100%">
                    <Error height={50} width={50} />
                </Box>
            ) : data !== null && data !== undefined ? (
                <TreeView
                    aria-label="Folder Sidebar"
                    selected={Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1] : undefined}
                    defaultCollapseIcon={
                        <Stack direction="row" alignContent="center">
                            <RxCaretDown size={14} />
                            <MemorizedFcFolderOpen size={16} />
                        </Stack>
                    }
                    expanded={expanded}
                    sx={{
                        flexGrow: 1,
                        maxWidth: '100vw',
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
