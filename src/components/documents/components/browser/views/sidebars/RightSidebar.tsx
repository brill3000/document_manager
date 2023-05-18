import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';

// hero icons
import { MemorizedFcFolder, MemorizedFcFolderOpen } from '../../item/GridViewItem';
import { DocumentType } from 'components/documents/Interface/FileBrowser';
import TreeView from '@mui/lab/TreeView/TreeView';
import { sampleFolders } from '../../../FileBrowser';
import { Button, alpha } from '@mui/material';
import { HiOutlineDocumentAdd } from 'react-icons/hi';

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        borderRadius: theme.spacing(0.5),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightRegular,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightLight
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
            borderRight: `3px solid ${theme.palette.primary.main}`,
            borderLeft: `3px solid ${theme.palette.primary.main}`
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit'
        }
    },
    [`& .${treeItemClasses.iconContainer}`]: {
        height: '100%',
        width: '8%'
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2)
        }
    }
}));

function StyledTreeItem(props: { [x: string]: any; bgColor: any; color: any; labelInfo: any; labelText: any }) {
    const { bgColor, color, labelInfo, labelText, nodeId, ...other } = props;

    return (
        <StyledTreeItemRoot
            nodeId={nodeId}
            label={<Box sx={{ display: 'flex', alignItems: 'center', p: 0.35, pr: 0 }}>{labelText}</Box>}
            sx={{
                '--tree-view-color': (theme) => theme.palette.primary.main,
                '--tree-view-bg-color': (theme) => alpha(theme.palette.primary.light, 0.3)
            }}
            {...other}
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
    const [parentFolders, setParentFolders] = React.useState<DocumentType[]>(sampleFolders);
    const [selected, setSelected] = React.useState<[{ id: string; doc_name: string }] | []>([]);
    return (
        <>
            <Button size="small" color="secondary" variant="outlined" startIcon={<HiOutlineDocumentAdd />}>
                New Base folder
            </Button>
            <TreeView
                aria-label="Folder Sidebar"
                selected={Array.isArray(selected) && selected.length > 0 ? selected[selected.length - 1].id : '1'}
                defaultCollapseIcon={<MemorizedFcFolderOpen size={20} />}
                defaultExpandIcon={<MemorizedFcFolder size={20} />}
                defaultEndIcon={<MemorizedFcFolder size={20} />}
                sx={{ flexGrow: 1, width: '100%', overflowY: 'auto', pt: 1.2, pr: 1 }}
            >
                {[...parentFolders]
                    ?.sort((a, b) => a.doc_name.localeCompare(b.doc_name))
                    .map((folder) => (
                        <StyledTreeItem
                            nodeId={folder.id}
                            key={folder.id}
                            labelText={folder.doc_name}
                            color="text.primary"
                            bgColor="#e6f7ff"
                            labelInfo={`${folder.size} MB`}
                            onClick={() => {
                                setSelected([{ id: String(folder.id), doc_name: folder.doc_name }]);
                            }}
                        >
                            <StyledTreeItem
                                nodeId={folder.id + '10'}
                                key={folder.id + '10'}
                                labelText={folder.doc_name}
                                color="text.primary"
                                bgColor="#e6f7ff"
                                labelInfo={`${folder.size} MB`}
                                onClick={() => {
                                    setSelected([{ id: String(folder.id + '10'), doc_name: folder.doc_name }]);
                                }}
                            >
                                <StyledTreeItem
                                    nodeId={folder.id + '20'}
                                    key={folder.id + '20'}
                                    labelText={folder.doc_name}
                                    color="text.primary"
                                    bgColor="#e6f7ff"
                                    labelInfo={`${folder.size} MB`}
                                    onClick={() => {
                                        setSelected([{ id: String(folder.id + '20'), doc_name: folder.doc_name }]);
                                    }}
                                >
                                    <StyledTreeItem
                                        nodeId={folder.id + '30'}
                                        key={folder.id + '30'}
                                        labelText={folder.doc_name}
                                        color="text.primary"
                                        bgColor="#e6f7ff"
                                        labelInfo={`${folder.size} MB`}
                                        onClick={() => {
                                            setSelected([{ id: String(folder.id + '30'), doc_name: folder.doc_name }]);
                                        }}
                                    />
                                </StyledTreeItem>
                            </StyledTreeItem>
                        </StyledTreeItem>
                    ))}
            </TreeView>
        </>
    );
}
