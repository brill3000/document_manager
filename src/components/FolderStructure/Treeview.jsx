import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import MainCard from '../MainCard';

// hero icons
import { HiOutlineFolderOpen, HiOutlinePencil, HiOutlineTrash, HiEyeOff } from "react-icons/hi";
import { HiOutlineFolder } from "react-icons/hi";
import { HiOutlineDocumentAdd } from "react-icons/hi";

// mui icons
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


// import { FcOpenedFolder } from "react-icons/fc";

// import { FolderViewer } from './FolderViewer';
import { DragFolder } from './DragFolder';
import Loadable from 'components/Loadable';
import { FolderViewerHeader } from './FolderViewerHeader';
// import { useMediaQuery } from '../../../node_modules/@mui/material/index';

// folder fetch hook
import { useAddFolderMutation, useDeleteFolderMutation, useGetFoldersByParentIdQuery } from 'store/async/query';
import { ButtonBase, CircularProgress, ClickAwayListener, MenuItem, Stack, TextField, useMediaQuery } from '../../../node_modules/@mui/material/index';
import { useDispatch } from 'react-redux';
import { setCurrentFolder } from 'store/reducers/documents';
import { Error } from 'ui-component/FolderLoader';
import { useSnackbar } from 'notistack';
import { isErrorWithMessage, isFetchBaseQueryError } from 'store/async/helpers';
import { useSelector } from 'react-redux';
import { StyledMenu } from './FolderViewer';


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
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
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
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

export default function CustomTreeView() {
  const [selected, setSelected] = React.useState(null)
  const [history, setHistory] = React.useState(null)
  const [folders, setFolders] = React.useState([])
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();
  const [addFolder, response] = useAddFolderMutation()
  const [value, setValue] = React.useState('');
  const [contextMenu, setContextMenu] = React.useState(null);



  const [showForm, setShowForm] = React.useState(false);

  const dispatch = useDispatch()

  const addHistory = current => {
    setHistory([...history, current])
  }
  const { data, isLoading, isSuccess, isError } = useGetFoldersByParentIdQuery(null)
  const [deleteFolder, deleteResponse] = useDeleteFolderMutation()


  const handleClick = (e, selectedDoc) => {
    e.stopPropagation();
    // In that case, event.ctrlKey does the trick.
    if(e.nativeEvent.button === 0) return
    if (e.nativeEvent.button === 2 || e.ctrKey) {
      e.preventDefault()
      setSelected([...selected, selectedDoc])
      // if (!clicked.includes(i)) setClicked([...clicked, i])
      setContextMenu(
        contextMenu === null
          ? {
            mouseX: e.clientX + 2,
            mouseY: e.clientY - 6,
          }
          : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null,
      );
    }


  }

  const createNewFolder = async () => {
    // setTimeout(() => {

    try {
      await addFolder({
        created_by: 'Brilliant',
        folder_name: value,
        no_of_files: 0,
        isFolder: true,
        parent: null,
        size: 0,
      }).unwrap();
      if (response) {
        setValue('')
        setShowForm(false)

        setTimeout(() => {
          const message = `New Folder Created Successfully`
          enqueueSnackbar(message, { variant: 'success' })
        }, 400)
      }
    } catch (err) {
      if (isFetchBaseQueryError(err)) {
        if ("message" in err.data) {
          const message = `New Folder Creation Failed`
          enqueueSnackbar(message, { variant: 'error' })
        }
      } else if (isErrorWithMessage(err)) {
        const message = `New Folder Creation Failed`
        enqueueSnackbar(message, { variant: 'error' })
      }
    }
  }

  const handleMenuClick = async (e, type) => {
    e.stopPropagation();

    let selectedDoc = data.find(folder => folder.id === selected[selected.length - 1].id)
    console.log(selectedDoc, "TEST")
       if (type === 'delete') {
        try {
          await deleteFolder(selectedDoc.id).unwrap();
          if (deleteResponse) {
            const message = `Folder Deleted`
            enqueueSnackbar(message, { variant: 'warning' })
          }
        } catch (err) {
          if (isFetchBaseQueryError(err)) {
            if ("message" in err.data) {
              const message = `Folder Delete Failed`
              enqueueSnackbar(message, { variant: 'error' })
            }
          } else if (isErrorWithMessage(err)) {
            const message = `Folder Delted Failed`
            enqueueSnackbar(message, { variant: 'error' })
          }
        }
      }
      // else if (type === 'rename') {
      //   setIsRenaming({ status: true, target: selectedDoc.id })
      // }

      setContextMenu(null);
  }
  const handleClose = () => {
    setContextMenu(null);
  };
  React.useEffect(() => {
    if (isSuccess && data && Array.isArray(data) && data.length > 0) {
      setSelected([{ id: data[0].id, name: data[0]['folder_name'] }])
    }
  }, [isSuccess, data])

  React.useEffect(() => {
    if (Array.isArray(selected) && selected.length > 0) {
      dispatch(setCurrentFolder({ currentFolder: selected[selected.length - 1].id }))
      setHistory([{ id: selected[selected.length - 1].id, label: selected[selected.length - 1].name }])
    }
  }, [selected])

  return (
    <ComponentSkeleton>

      <MainCard title={<FolderViewerHeader name={selected ? selected[selected.length - 1].name : ''} folders={folders} history={history} setHistory={setHistory} setFolders={setFolders} />}>
        <Grid container spacing={1} sx={{ width: '100%', minHeight: '100%', maxHeight: 500, }}>
          <Grid
            item xs={7}
            sm={5} md={4}
            lg={3}
            alignItems="center"
            justifyContent="center"
          >
            {isError ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100%"
                minWidth="100%"
              >
                <Stack direction="column">
                  <Error height={50} width={50} />
                  <Typography variant='subtitle2'>Opps... A Error has occured</Typography>
                </Stack>

              </Box>
            ) : isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100%"
                minWidth="100%"
              >
                <CircularProgress color='primary' />

              </Box>
            ) :
              data && (
                <>
                  {
                    showForm ?
                      <Stack direction="row">
                        <ClickAwayListener onClickAway={() => setShowForm(false)}>
                          <TextField
                            id="new_folder"
                            size="small"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                value.length > 0 && createNewFolder()
                              }
                            }}
                            sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
                            placeholder="Type in folder name..."
                            variant="standard"
                            autoFocus
                          />
                        </ClickAwayListener>
                        <IconButton
                          aria-label="add_folder"
                          color="primary"
                          disabled={value.length < 1}
                          onClick={() => createNewFolder()}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Stack>
                      :
                      <ButtonBase variant="outlined" sx={{
                        p: .5,
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: 'primary.100'
                        },
                      }} onClick={() => setShowForm(true)}>
                        <Stack direction="row">
                          <Box sx={{ p: .3 }}>
                            <HiOutlineDocumentAdd style={{ fontSize: '16px' }} />
                          </Box>
                          {matchDownSM ? <></> : <Typography variant="subtitle2" sx={{ fontSize: 13 }} color="secondary.600">New Base Folder</Typography>}
                        </Stack>
                      </ButtonBase>
                  }
                  <TreeView
                    aria-label="Folder Sidebar"
                    selected={selected ? selected[selected.length - 1].id : '1'}
                    defaultCollapseIcon={<HiOutlineFolderOpen />}
                    defaultExpandIcon={< HiOutlineFolder />}
                    defaultEndIcon={< HiOutlineFolder />}
                    sx={{ minHeight: 500, flexGrow: 1, maxWidth: '90%', overflowY: 'auto', pt: 1.2 }}
                  >
                    {data.map(folder => (
                      <Box
                        onContextMenu={(e) => handleClick(e,  { id: folder.id, name: folder.folder_name })}
                      >
                        <DragFolder>
                          <StyledTreeItem
                            nodeId={folder.id}
                            key={folder.id}
                            labelText={folder.folder_name}
                            color="#e3742f"
                            bgColor="#fcefe3"
                            labelInfo={`${folder.no_of_files} MB`}
                            onClick={() => {
                              setSelected([...selected, { id: folder.id, name: folder.folder_name }])
                            }}
                          />
                        </DragFolder>
                      </Box>
                    )
                    )}
                  </TreeView>
                  <StyledMenu
                              id="demo-customized-menu"
                              MenuListProps={{
                                'aria-labelledby': 'demo-customized-button',
                              }}
                              open={contextMenu !== null}
                              onClose={handleClose}
                              anchorReference="anchorPosition"
                              anchorPosition={
                                contextMenu !== null
                                  ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                                  : undefined
                              }
                            >
                              
                              <MenuItem
                                onClick={(e) => {
                                  handleMenuClick(e, 'rename')
                                }}
                              >
                                <Stack direction="row">
                                  <Box sx={{ p: .3 }}>
                                    <HiOutlinePencil style={{ fontSize: '17px' }} />
                                  </Box>
                                  <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">Rename</Typography>
                                </Stack>
                              </MenuItem>
                              <MenuItem
                                onClick={(e) => {
                                  handleMenuClick(e, 'edit')
                                }}
                              >
                                <Stack direction="row">
                                  <Box sx={{ p: .3 }}>
                                    <HiEyeOff style={{ fontSize: '17px' }} />
                                  </Box>
                                  <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">Edit Access</Typography>
                                </Stack>
                              </MenuItem>
                              <MenuItem
                                onClick={(e) => {
                                  handleMenuClick(e, 'delete')
                                }}
                              >
                                <Stack direction="row">
                                  <Box sx={{ p: .3 }}>
                                    <HiOutlineTrash style={{ fontSize: '17px', color: 'red' }} />
                                  </Box>
                                  <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1, color: 'red' }} color="secondary.600">Delete</Typography>
                                </Stack>
                              </MenuItem>
                            </StyledMenu>
                </>
              )
            }
          </Grid>
          <FolderViewer folders={folders} setFolders={setFolders} addHistory={addHistory} />
        </Grid>
      </MainCard>
    </ComponentSkeleton >
  );
}

