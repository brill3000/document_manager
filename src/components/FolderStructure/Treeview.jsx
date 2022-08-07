import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';
import Label from '@mui/icons-material/Label';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import InfoIcon from '@mui/icons-material/Info';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import MainCard from '../MainCard';
import { HiOutlineFolderOpen } from "react-icons/hi";
import { HiOutlineFolder } from "react-icons/hi";
import { FcFolder } from "react-icons/fc";
// import { FcOpenedFolder } from "react-icons/fc";
import { useDrag } from 'react-dnd'
import Skeleton from '@mui/material/Skeleton';




const DragFolder = React.forwardRef(({ index, children }, ref) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    // "type" is required. It is used by the "accept" specification of drop targets.
    type: 'Folder',
    // The collect function utilizes a "monitor" instance (see the Overview for what this is)
    // to pull important pieces of state from the DnD system.
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))
  return (
    <Grid ref={drag} sx={{ backgroundColor: 'transparent' }} item xs={6} md={4} lg={2}>
      <Stack spacing={0} sx={{ backgroundColor: 'transparent', maxWidth: 'max-content', maxHeight: 'max-content' }} direction="column">
        {
          index > 10 ?
            <Skeleton>
              <FcFolder style={{
                fontSize: '60px',
              }} />
            </Skeleton>
            :
            <FcFolder style={{
              fontSize: '60px',
            }} />
        }

        {children}
      </Stack>
    </Grid>
  )
});
DragFolder.propTypes = {
  children: PropTypes.node.isRequired,
}


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
  return (
    <ComponentSkeleton>
      <MainCard title="Folder View">
        <Grid container spacing={1} sx={{ width: '100%', minHeight: '100%', maxHeight: 500, }}>
          <Grid item xs={3}>
            <TreeView
              aria-label="Speakers Office"
              defaultExpanded={['3']}
              defaultCollapseIcon={<HiOutlineFolderOpen />}
              defaultExpandIcon={< HiOutlineFolder />}
              defaultEndIcon={< HiOutlineFolder />}
              sx={{ minHeight: 500, flexGrow: 1, maxWidth: 250, overflowY: 'auto' }}
            >
              <StyledTreeItem nodeId="1" labelText="Clerks Office" color="#e3742f" bgColor="#fcefe3" labelInfo="33 MB" labelIcon={MailIcon} />
              <StyledTreeItem nodeId="2" labelText="Finance" color="#e3742f" bgColor="#fcefe3" labelInfo="30 MB" labelIcon={DeleteIcon} />
              <StyledTreeItem nodeId="3" labelText="Procurement" color="#e3742f" bgColor="#fcefe3" labelInfo="3 MB" labelIcon={Label}>
                <StyledTreeItem
                  nodeId="4"
                  labelText="Research and Records"
                  labelIcon={SupervisorAccountIcon}
                  labelInfo="90 MB"
                  color="#e3742f"
                  bgColor="#fcefe3"
                />
                <StyledTreeItem
                  nodeId="5"
                  labelText="Hansard"
                  labelIcon={InfoIcon}
                  labelInfo="25 MB"
                  color="#e3742f"
                  bgColor="#fcefe3"
                />
                <StyledTreeItem
                  nodeId="6"
                  labelText="ICT"
                  labelIcon={ForumIcon}
                  labelInfo="36 MB"
                  color="#e3742f"
                  bgColor="#fcefe3"
                />
                <StyledTreeItem
                  nodeId="7"
                  labelText="Clerks at the table"
                  labelIcon={LocalOfferIcon}
                  labelInfo="73 MB"
                  color="#e3742f"
                  bgColor="#fcefe3"
                />
              </StyledTreeItem>
              <StyledTreeItem nodeId="8"
                labelText="Research and Records"
                labelIcon={SupervisorAccountIcon}
                labelInfo="9 MB"
                color="#e3742f"
                bgColor="#fcefe3"
              />
              <StyledTreeItem
                nodeId="9"
                labelText="Hansard"
                labelIcon={InfoIcon}
                labelInfo="2.2 MB"
                color="#e3742f"
                bgColor="#fcefe3"
              />
              <StyledTreeItem
                nodeId="10"
                labelText="ICT"
                labelIcon={ForumIcon}
                labelInfo="3.5 MB"
                color="#e3742f"
                bgColor="#fcefe3"
              />
              <StyledTreeItem
                nodeId="11"
                labelText="Clerks at the table"
                labelIcon={LocalOfferIcon}
                labelInfo="33 MB"
                color="#e3742f"
                bgColor="#fcefe3"
              />
              <StyledTreeItem nodeId="12" labelText="Sergent at Arms" color="#e3742f" bgColor="#fcefe3" labelInfo="0 MB" labelIcon={Label} />
              <StyledTreeItem nodeId="13" labelText="Reception" color="#e3742f" bgColor="#fcefe3" labelInfo="0.4 MB" labelIcon={Label} />
            </TreeView>
          </Grid>
          <Grid item xs={9}
          >
            <Grid
              container
              spacing={1}
              sx={{
                padding: 1,
                maxHeight: 500,
                overflowY: 'auto',
                background: '#fafafb',
                borderRadius: 2,
              }}
            >
              {
                [...Array(100)].map((_, i) =>
                (
                  <DragFolder index={i} key={i}>
                    <Typography color="textSecondary" gutterBottom variant="subtitle2">
                      {i > 10 ? <Skeleton /> : `Folder ${i}`}
                    </Typography>
                  </DragFolder>
                ))
              }
            </Grid>
          </Grid>
        </Grid>
      </MainCard>
    </ComponentSkeleton>
  );
}
