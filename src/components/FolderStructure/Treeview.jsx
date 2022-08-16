import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';

import Label from '@mui/icons-material/Label';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import MainCard from '../MainCard';

// hero icons
import { HiOutlineFolderOpen } from "react-icons/hi";
import { HiOutlineFolder } from "react-icons/hi";

// mui icons
import InfoIcon from '@mui/icons-material/Info';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';

// import { FcOpenedFolder } from "react-icons/fc";

// import { FolderViewer } from './FolderViewer';
import { DragFolder } from './DragFolder';
import Loadable from 'components/Loadable';
import { FolderViewerHeader } from './FolderViewerHeader';
const FolderViewer = Loadable(React.lazy(() => import('./FolderViewer')));

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(1),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

function StyledTreeItem(props) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
          {/* <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} /> */}
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

export default function CustomTreeView() {
  const [selected, setSelected] = React.useState([{
    id: '1',
    name: 'Clerks Office'
  }])
  // const [position, setPosition] = React.useState(1)
  const [newSelected, setNewSelected] = React.useState([])
  // const seletedItemId = React.useCallback(() => {
  //   return selected[selected.length - position].id
  // }, [position, selected])
  // const seletedItemName = React.useCallback(() => {
  //   return selected[selected.length - position].name
  // }, [position, selected])
  const backwardNavigation = () => {
    if(selected.length > 1){
      let selectedCopy = selected
      setNewSelected([selectedCopy.splice(selected.length - 1, 1)[0], ...newSelected])
      setSelected(selectedCopy)
    }
  }
  const forwardNavigation = () => {
    if(newSelected.length > 0){
      let selectedCopy = newSelected
      setSelected([...selected, selectedCopy.splice(0, 1)[0],])
      setNewSelected(selectedCopy)
    }
  }
  

  return (
    <ComponentSkeleton>
      {/* <Typography variant="h5" sx={{pb: 2.5}}>Documents</Typography> */}
      <MainCard title={<FolderViewerHeader name={selected[selected.length - 1].name} backwardNavigation={backwardNavigation} forwardNavigation={forwardNavigation} selected={selected.length} newSelected={newSelected.length}/>}>
        <Grid container spacing={1} sx={{ width: '100%', minHeight: '100%', maxHeight: 500, }}>
          <Grid item xs={6} sm={5} md={4} lg={3}
          >
            <TreeView
              aria-label="Speakers Office"
              defaultExpanded={['1']}
              selected={selected[selected.length - 1].id}
              defaultCollapseIcon={<HiOutlineFolderOpen />}
              defaultExpandIcon={< HiOutlineFolder />}
              defaultEndIcon={< HiOutlineFolder />}
              sx={{ minHeight: 500, flexGrow: 1, maxWidth: 250, overflowY: 'auto', pt: 1.2 }}
            >
              <DragFolder>
                <StyledTreeItem
                  nodeId="1"
                  labelText="Clerks Office"
                  color="#e3742f" bgColor="#fcefe3"
                  labelInfo="33 MB"
                  labelIcon={MailIcon}
                  onClick={() => {
                    setSelected([...selected, { id: '1', name: 'Clerks Office' }])
                  }}
                />
              </DragFolder>
              <StyledTreeItem
                nodeId="2"
                labelText="Finance"
                color="#e3742f"
                bgColor="#fcefe3"
                labelInfo="30 MB"
                labelIcon={DeleteIcon}
                onClick={() => {
                  setSelected([...selected, { id: '2', name: 'Finance' }])
                }}
              />
              <StyledTreeItem
                nodeId="3"
                labelText="Procurement"
                color="#e3742f"
                bgColor="#fcefe3"
                labelInfo="3 MB"
                labelIcon={Label}
                onClick={() => {
                  setSelected([...selected, { id: '3', name: 'Procurement' }])
                }}>
                <StyledTreeItem
                  nodeId="4"
                  labelText="Research and Records"
                  labelIcon={SupervisorAccountIcon}
                  labelInfo="90 MB"
                  color="#e3742f"
                  bgColor="#fcefe3"
                  onClick={() => {
                    setSelected([...selected, { id: '4', name: 'Research and Records' }])
                  }}
                />
                <StyledTreeItem
                  nodeId="5"
                  labelText="Hansard"
                  labelIcon={InfoIcon}
                  labelInfo="25 MB"
                  color="#e3742f"
                  bgColor="#fcefe3"
                  onClick={() => setSelected([...selected, { id: '5', name: 'Hansard' }])}
                />
                <StyledTreeItem
                  nodeId="6"
                  labelText="ICT"
                  labelIcon={ForumIcon}
                  labelInfo="36 MB"
                  color="#e3742f"
                  bgColor="#fcefe3"
                  onClick={() => setSelected([...selected, { id: '6', name: 'ICT' }])}
                />
                <StyledTreeItem
                  nodeId="7"
                  labelText="Clerks at the table"
                  labelIcon={LocalOfferIcon}
                  labelInfo="73 MB"
                  color="#e3742f"
                  bgColor="#fcefe3"
                  onClick={() => setSelected([...selected, { id: '7', name: 'Clerks at the table' }])}
                />
              </StyledTreeItem>
              <StyledTreeItem nodeId="8"
                labelText="Research and Records"
                labelIcon={SupervisorAccountIcon}
                labelInfo="9 MB"
                color="#e3742f"
                bgColor="#fcefe3"
                onClick={() => setSelected([...selected, { id: '8', name: 'Research and Records' }])}
              />
              <StyledTreeItem
                nodeId="9"
                labelText="Hansard"
                labelIcon={InfoIcon}
                labelInfo="2.2 MB"
                color="#e3742f"
                bgColor="#fcefe3"
                onClick={() => setSelected([...selected, { id: '9', name: 'Hansard' }])}
              />
              <StyledTreeItem
                nodeId="10"
                labelText="ICT"
                labelIcon={ForumIcon}
                labelInfo="3.5 MB"
                color="#e3742f"
                bgColor="#fcefe3"
                onClick={() => setSelected([...selected, { id: '10', name: 'ICT' }])}
              />
              <StyledTreeItem
                nodeId="11"
                labelText="Clerks at the table"
                labelIcon={LocalOfferIcon}
                labelInfo="33 MB"
                color="#e3742f"
                bgColor="#fcefe3"
                onClick={() => setSelected([...selected, { id: '11', name: 'Clerks at the table' }])}
              />
              <StyledTreeItem
                nodeId="12"
                labelText="Sergent at Arms"
                color="#e3742f" bgColor="#fcefe3"
                labelInfo="0 MB"
                labelIcon={Label}
                onClick={() => {
                  setSelected([...selected, { id: '12', name: 'Sergent at Arms' }])
                }} />
              <StyledTreeItem
                nodeId="13"
                labelText="Reception"
                color="#e3742f"
                bgColor="#fcefe3"
                labelInfo="0.4 MB"
                labelIcon={Label} onClick={() => {
                  setSelected([...selected, { id: '13', name: 'Reception' }])
                }} />
            </TreeView>
          </Grid>
          <FolderViewer />
        </Grid>
      </MainCard>
    </ComponentSkeleton >
  );
}

