import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';

// hero icons
import { MemorizedFcFolder } from '../../item/GridViewItem';
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
import { RxCaretRight } from 'react-icons/rx';
import { useGetFolderChildrenFilesQuery } from 'store/async/dms/files/filesApi';
import { fileIcon } from 'components/documents/Icons/fileIcon';
import { BsCaretRight, BsFillCaretRightFill } from 'react-icons/bs';
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
        backgroundColor: 'transparent',
        ...(isLoader && { padding: '0 !important', height: '1.5rem !important' }),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular
        },
        '&.Mui-selected': {
            backgroundColor: `${alpha(theme.palette.primary.main, 0.25)} !important`,
            '&.Mui-focused': {
                backgroundColor: `${alpha(theme.palette.primary.main, 0.3)} !important`
            }
        },
        '&.Mui-focused': {
            backgroundColor: `${alpha(theme.palette.primary.main, 0.1)} !important`
        },
        '&.Mui-hover': {
            backgroundColor: `${alpha(theme.palette.primary.main, 0.1)} !important`
        },
        '& .MuiTreeItem-label': {
            paddingLeft: theme.spacing(1)
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
    const { actions, selected } = useBrowserStore();

    // =========================== | Controlled treeview Function | ================================//
    const [expanded, setExpanded] = React.useState<string[]>([]);
    const [currentExpanded, setCurrentExpanded] = React.useState<string | null>(null);
    const handleExpandClick = React.useCallback((path: string) => {
        setCurrentExpanded(path);
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
                    nodes.is_dir && handleDocumentClick(String(nodes.id), nodes.is_dir);
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
                                />
                            </ButtonBase>
                            <MemorizedFcFolder size={16} />
                        </Stack>
                    ) : nodes.is_dir ? (
                        <MemorizedFcFolder size={16} />
                    ) : (
                        fileIcon(nodes.mimeType, 16, 0)
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
        isLoading: rootFolderIsLoading,
        isSuccess: rootFolderIsSuccess
    } = useGetRootFolderQuery({});

    React.useEffect(() => {
        if (rootFolderIsSuccess && !rootFolderIsFetching && !rootFolderIsLoading) {
            handleExpandClick(rootFolder.path);
            setCurrentExpanded(rootFolder.path);
            actions.setSelected([{ id: rootFolder.path, is_dir: true }]);
            const data: RenderTree = {
                id: rootFolder.path,
                doc_name: rootFolder.doc_name,
                hasChildren: rootFolder.hasChildren,
                index: 0,
                is_dir: true,
                children: [null]
            };
            setData(data);
        }
    }, [rootFolderIsSuccess, rootFolderIsFetching, rootFolderIsLoading]);
    // ================================== | FETCH: CHILDREN  | ================================== //
    /**
     * Fetch children folders
     */
    const {
        data: folderChildren,
        error: folderChildrenError,
        isFetching: folderChildrenIsFetching,
        isFetching: folderChildrenIsLoading,
        isSuccess: folderChildrenIsSuccess
    } = useGetFoldersChildrenQuery(
        { fldId: currentExpanded !== null ? currentExpanded : '' },
        {
            skip:
                currentExpanded === null ||
                currentExpanded === undefined ||
                (typeof currentExpanded === 'string' && currentExpanded.length < 1)
        }
    );

    /**
     * add children files to tree
     */
    const {
        data: childrenFiles,
        error: childrenFilesError,
        isFetching: childrenFilesIsFetching,
        isLoading: childrenFilesIsLoading,
        isSuccess: childrenFilesIsSuccess
    } = useGetFolderChildrenFilesQuery(
        { fldId: currentExpanded !== null ? currentExpanded : '' },
        {
            skip:
                currentExpanded === null ||
                currentExpanded === undefined ||
                (typeof currentExpanded === 'string' && currentExpanded.length < 1)
        }
    );
    /**
     * add children folders to tree
     */
    React.useEffect(() => {
        if (
            folderChildrenIsSuccess &&
            folderChildren &&
            !folderChildrenIsFetching &&
            !folderChildrenIsLoading &&
            Array.isArray(folderChildren.folder) &&
            childrenFilesIsSuccess &&
            folderChildren &&
            !childrenFilesIsFetching &&
            !childrenFilesIsLoading &&
            Array.isArray(childrenFiles.document) &&
            currentExpanded !== null
        ) {
            const newChildren: RenderTree[] = folderChildren.folder.map((child, i: number) => {
                // @ts-expect-error is set below
                const treeItem: RenderTree = {
                    id: child.path,
                    doc_name: child.doc_name,
                    children: child.hasChildren ? [null] : [],
                    is_dir: true,
                    hasChildren: child.hasChildren
                };
                treeItem['index'] = i;
                return treeItem;
            });
            const newFilesChildren: RenderTree[] = childrenFiles.document.map((child, i: number) => {
                // @ts-expect-error is set below
                const treeItem: RenderTree = {
                    id: child.path,
                    doc_name: child.doc_name,
                    children: [],
                    is_dir: false,
                    hasChildren: false,
                    mimeType: child.mimeType
                };
                treeItem['index'] = i;
                return treeItem;
            });
            setData((data) => {
                let dataCopy = data !== null ? { ...data } : null;
                dataCopy = expanded.includes(currentExpanded)
                    ? recursiveUpdate(data, currentExpanded, [...newChildren, ...newFilesChildren])
                    : dataCopy;
                return dataCopy !== null ? { ...dataCopy } : null;
            });
        }
    }, [
        folderChildrenIsSuccess,
        folderChildrenIsFetching,
        folderChildrenIsLoading,
        childrenFilesIsFetching,
        childrenFilesIsSuccess,
        childrenFilesIsLoading,
        currentExpanded
    ]);

    // =========================== | Route Functions | ================================//
    const navigate = useNavigate();
    const { pathParam } = useParams();
    const { pathname } = useLocation();
    // =========================== | Event Handles | ================================//

    /**
     * Function that add the seleted folder path to the route
     * This is critical for reload purposes
     * @param documentId: string
     * @returns void
     */
    const handleDocumentClick = (documentId: string, is_dir: boolean) => {
        if (documentId !== null || documentId !== undefined) {
            actions.setSelected([{ id: documentId, is_dir }]);
            const encodedPathParam = encodeURIComponent(documentId);
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
                    selected={Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1].id : undefined}
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
