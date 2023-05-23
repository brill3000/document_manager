import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';

// hero icons
import { MemorizedFcFolder, MemorizedFcFolderOpen } from '../../item/GridViewItem';
import { DocumentType, RenderTree, Units } from 'components/documents/Interface/FileBrowser';
import TreeView from '@mui/lab/TreeView/TreeView';
import { Collapse, Skeleton, alpha } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useSpring, animated } from '@react-spring/web';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useGetRootFolderQuery } from 'store/async/dms/repository/repositoryApi';
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';
import _, { uniqueId } from 'lodash';
import { useGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
// import { GetChildrenFoldersProps } from 'global/interfaces';
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
    (props: TreeItemProps & { isLoader: boolean; isFocused: boolean }) => <TreeItem {...props} TransitionComponent={TransitionComponent} />,
    {
        shouldForwardProp: (props) =>
            props !== 'isLoader' && props !== 'bgColor' && props !== 'labelInfo' && props !== 'labelText' && props !== 'isFocused'
    }
)(({ theme, isLoader, isFocused }) => ({
    color: theme.palette.text.secondary,
    paddingRight: isLoader ? 0 : theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    [`& .${treeItemClasses.content}`]: {
        borderRadius: theme.spacing(0.5),
        backgroundColor: isLoader
            ? 'transparent'
            : isFocused
            ? `var(--tree-view-bg-color, ${theme.palette.action.selected})`
            : alpha(theme.palette.secondary.light, 0.5),
        ...(isLoader && { paddingLeft: '0 !important' }),
        ...(isFocused && {
            color: 'var(--tree-view-color)',
            borderRight: `3px solid ${theme.palette.primary.main}`,
            borderLeft: `3px solid ${theme.palette.primary.main}`
        }),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular
        },
        '&:hover': {
            backgroundColor: isLoader ? 'transparent' : alpha(theme.palette.secondary.light, 0.9)
        },
        '&.Mui-selected': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
            borderRight: `3px solid ${theme.palette.primary.main}`,
            borderLeft: `3px solid ${theme.palette.primary.main}`
        },
        '&.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
            borderRight: `3px solid ${theme.palette.primary.main}`,
            borderLeft: `3px solid ${theme.palette.primary.main}`
        }
    },
    [`& .${treeItemClasses.iconContainer}`]: {
        height: '100%',
        width: '15%',
        display: isLoader ? 'none' : 'inherit'
    }
}));

function StyledTreeItem(props: TreeItemProps & { focused: string | null }) {
    const { label, nodeId, focused, ...other } = props;
    const otherOmitted = _.omit(other, ['label']);
    return (
        <StyledTreeItemRoot
            nodeId={nodeId}
            label={
                !nodeId.includes('loader') ? (
                    label
                ) : (
                    <Box sx={{ p: 0 }}>
                        <Skeleton width="100%" height="2.2rem" animation="wave" />
                    </Box>
                )
            }
            sx={{
                '--tree-view-color': (theme) => theme.palette.primary.main,
                '--tree-view-bg-color': (theme) => alpha(theme.palette.primary.light, 0.3)
            }}
            {...otherOmitted}
            isLoader={nodeId.includes('loader')}
            isFocused={focused === nodeId}
        />
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired
};

export default function RightSidebar() {
    const [data, setData] = React.useState<RenderTree | null>(null);
    const { actions, initiateFileBrowser, selected, focused } = useBrowserStore();
    // =========================== | Controlled treeview Function | ================================//
    const [expanded, setExpanded] = React.useState<string[]>([]);
    const handleExpandClick = React.useCallback(
        (path: string) => {
            setExpanded((oldExpanded) => (oldExpanded.length === 0 ? [...oldExpanded, path] : [path]));
        },
        [selected]
    );
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
                onClick={() => handleExpandClick(nodes.id)}
                bgColor={undefined}
                color={undefined}
                labelText={''}
                focused={focused}
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
                focused={focused}
            />
        );
    };
    // =========================== | Data Functions | ================================//
    /**
     * Fetch root folder
     */
    const {
        data: rootFolder,
        error: rootFolderError,
        isLoading: rootFolderIsLoading,
        isSuccess: rootFolderIsSuccess
    } = useGetRootFolderQuery({});
    React.useEffect(() => {
        if (rootFolderIsSuccess) {
            // set root folder
            actions.setRoot(rootFolder.path);
            const folders: DocumentType[] = [
                {
                    id: rootFolder.path,
                    doc_name: rootFolder.doc_name,
                    is_dir: true,
                    size_units: Units.Mb,
                    size: 100,
                    is_archived: false,
                    parent: null,
                    children: null,
                    type: 'folder'
                }
            ];
            initiateFileBrowser(folders);
            handleExpandClick(rootFolder.path);
            actions.setSelected([rootFolder.path]);
            const data: RenderTree = {
                id: rootFolder.path,
                doc_name: rootFolder.doc_name,
                hasChildren: rootFolder.hasChildren,
                index: 0,
                children: [null]
            };
            setData(data);
        }
    }, [rootFolderIsSuccess]);
    /**
     * Fetch children
     */

    const {
        data: folderChildren,
        error: folderChildrenError,
        isFetching: folderChildrenIsFetching,
        isSuccess: folderChildrenIsSuccess
    } = useGetFoldersChildrenQuery(
        { fldId: Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1] : '' },
        {
            skip: !(Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1] : '')
        }
    );

    React.useEffect(() => {
        if (
            folderChildrenIsSuccess &&
            folderChildren &&
            !folderChildrenIsFetching &&
            Array.isArray(folderChildren.folder) &&
            Array.isArray(selected) &&
            selected.length > 0
        ) {
            const newChildren: string[] = folderChildren.folder.map((child, i: number) => {
                const newFolder: DocumentType = {
                    id: child.path,
                    doc_name: child.doc_name,
                    is_dir: true,
                    size_units: Units.Mb,
                    size: 100,
                    is_archived: false,
                    parent: selected[selected.length - 1],
                    children: [],
                    type: 'folder'
                };
                // const treeItem: RenderTree = {
                //     id: child.path,
                //     index: i,
                //     doc_name: child.path,
                //     children: child.hasChildren ? [null] : [],
                //     hasChildren: child.hasChildren
                // };
                actions.createDocument(child.path, newFolder);
                return child.path;
            });
            actions.changeDetails(selected[selected.length - 1], { children: newChildren });
            // const data: RenderTree = {
            //     id: rootFolder.path,
            //     doc_name: 'home',
            //     hasChildren: rootFolder.hasChildren,
            //     children: [
            //         {
            //             id: rootFolder.path + '/test',
            //             doc_name: 'test',
            //             children: rootFolder.hasChildren ? [null] : [],
            //             hasChildren: true
            //         },
            //         null
            //     ]
            // };
        }
    }, [folderChildrenIsSuccess, folderChildrenIsFetching]);

    // const setChild = (data: RenderTree) => {
    //     const dataCopy = { ...data };
    //     return dataCopy;
    // };
    // function fibonacci(n: number): number {
    //     if (n <= 1) {
    //         return n;
    //     }

    //     return fibonacci(n - 1) + fibonacci(n - 2);
    // }

    // =========================== | Route Functions | ================================//
    const navigate = useNavigate();
    const { pathParam } = useParams();
    const { pathname } = useLocation();

    /**
     * Function that add the seleted folder path to the route
     * This is critical for reload purposes
     * @param folderId: string
     * @param folderName: string
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
            {rootFolderIsLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="100%" minWidth="100%">
                    <GoogleLoader height={100} width={100} loop={true} />
                </Box>
            ) : rootFolderError ? (
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="100%" minWidth="100%">
                    <Error height={100} width={100} />
                </Box>
            ) : data !== null && data !== undefined ? (
                <TreeView
                    aria-label="Folder Sidebar"
                    selected={Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1] : '1'}
                    defaultCollapseIcon={<MemorizedFcFolderOpen size={25} />}
                    defaultExpandIcon={<MemorizedFcFolder size={25} />}
                    defaultEndIcon={<MemorizedFcFolder size={25} />}
                    expanded={expanded}
                    sx={{ flexGrow: 1, maxWidth: '100vw', minWidth: '100%', overflowY: 'auto', pt: 1.2, pr: 1 }}
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
