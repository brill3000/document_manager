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
import { Collapse, Skeleton, alpha } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useSpring, animated } from '@react-spring/web';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useGetRootFolderQuery } from 'store/async/dms/repository/repositoryApi';
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';
import _, { uniqueId } from 'lodash';
import { useGetFoldersChildrenQuery } from 'store/async/dms/folders/foldersApi';
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
    { shouldForwardProp: (props) => props !== 'isLoader' && props !== 'bgColor' && props !== 'labelInfo' && props !== 'labelText' }
)(({ theme, isLoader }) => ({
    color: theme.palette.text.secondary,
    paddingRight: isLoader ? 0 : theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    [`& .${treeItemClasses.content}`]: {
        borderRadius: theme.spacing(0.5),
        backgroundColor: isLoader ? 'transparent' : alpha(theme.palette.secondary.light, 0.2),
        ...(isLoader && { paddingLeft: '0 !important' }),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular
        },
        '&:hover': {
            backgroundColor: isLoader ? 'transparent' : theme.palette.action.hover
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
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

function StyledTreeItem(props: TreeItemProps) {
    const { label, nodeId, ...other } = props;
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
    const [selected, setSelected] = React.useState<[{ id: string; doc_name: string }] | []>([]);
    // =========================== | Render Function | ================================//

    const renderTree = (nodes: RenderTree | null) => {
        const uniqueLoaderId = uniqueId('loader');
        return nodes !== null ? (
            <StyledTreeItem
                key={nodes.id}
                nodeId={nodes.id}
                label={nodes.doc_name}
                onClick={() => {
                    handleDocumentClick(String(nodes.id), nodes.doc_name);
                }}
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
            const data: RenderTree = {
                id: rootFolder.path,
                doc_name: 'home',
                hasChildren: rootFolder.hasChildren,
                children: [
                    {
                        id: rootFolder.path + '/test',
                        doc_name: 'test',
                        children: rootFolder.hasChildren ? [null] : [],
                        hasChildren: true
                    },
                    null
                ]
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
        isLoading: folderChildrenIsLoading,
        isSuccess: folderChildrenIsSuccess
    } = useGetFoldersChildrenQuery({ fldId: Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1].id : '' });

    React.useEffect(() => {
        if (folderChildrenIsSuccess) {
            console.log(folderChildren, 'CHILDREN');
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
            // setData(data);
        }
    }, [folderChildrenIsSuccess, data]);
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
    const handleDocumentClick = (folderId: string, folderName: string) => {
        setSelected([{ id: String(folderId), doc_name: folderName }]);
        const encodedPathParam = encodeURIComponent(folderId);
        const documentPath = pathParam
            ? pathname.replace(`/${encodeURIComponent(pathParam)}`, `/${encodedPathParam}`)
            : `${pathname}/${encodedPathParam}`;
        navigate(documentPath);
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
                    selected={Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1].id : '1'}
                    defaultCollapseIcon={<MemorizedFcFolderOpen size={25} />}
                    defaultExpandIcon={<MemorizedFcFolder size={25} />}
                    defaultEndIcon={<MemorizedFcFolder size={25} />}
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
