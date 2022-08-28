import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FcFolder } from "react-icons/fc";
import { FcDocument } from "react-icons/fc";
// import Skeleton from '@mui/material/Skeleton';
import { DragFolder } from "./DragFolder";
import { ButtonBase, Menu, MenuItem, Stack, useMediaQuery, Badge } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { HiOutlineTrash, HiOutlineDocumentDuplicate, HiEyeOff, HiOutlinePencil, HiOutlineBookOpen } from "react-icons/hi";
import Divider from '@mui/material/Divider';
import { setOpenFileView } from 'store/reducers/documents';
import { setCurrentFolder } from 'store/reducers/documents';
import { setModalType } from 'store/reducers/documents';
import { useDispatch } from 'react-redux';
import ViewFile from './ViewFile';
import { useSelector } from 'react-redux';
import EditDocuments from './EditDocument';
import { useSnackbar } from 'notistack';
import { FolderLoader, FolderEmpty, Error } from 'ui-component/FolderLoader';
import { useDeleteFolderMutation, useGetFoldersByParentIdQuery, useRenameFolderMutation } from 'store/async/query';
import { useEffect } from 'react';
import { isErrorWithMessage, isFetchBaseQueryError } from 'store/async/helpers';
import { CircularProgress, TextField } from '../../../node_modules/@mui/material/index';



// import useLongPress from 'custom-hooks/useLongPress';

const modalContent = (type, content) => {
  switch (type) {
    case 'view':
      return content ?? <Typography>View File</Typography>
    case 'edit':
      return content ?? <EditDocuments />
    case 'delete':
      return content ?? <Typography>View Delete</Typography>
    case 'add':
      return
    case 'download':
      return content ?? <Typography>View Download</Typography>
    default:
      return content ?? <Typography>View File</Typography>
  }
}

export const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 140,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      '10px 10px 10px rgba(0,0,0,0.002)',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));


export default function FolderViewer({ folders, setFolders, addHistory }) {
  const [selected, setSelected] = React.useState([]);
  const [contextMenu, setContextMenu] = React.useState(null);
  const [isFolder, setIsFolder] = React.useState(false);
  const [isRenaming, setIsRenaming] = React.useState({ status: false, target: null })
  const [renameValue, setRenameValue] = React.useState('');
  const [isRenameLoading, setIsRenameLoading] = React.useState(false);

  const openFolder = useSelector(state => state.documents.currentFolder)
  const modalType = useSelector(state => state.documents.modalType)

  // Firebase Queries
  const { data, isLoading, isSuccess, isError } = useGetFoldersByParentIdQuery(openFolder)
  const [deleteFolder, deleteResponse] = useDeleteFolderMutation()
  const [renameFolder, renameResponse] = useRenameFolderMutation()



  const [content, setContent] = React.useState(null)

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();


  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const matchUpMD = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const matchUpLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));


  useEffect(() => {
    if (isSuccess && data && Array.isArray(data) && data.length > 0) {
      setFolders([...data])
    } else {
      setFolders([])
    }
  }, [isSuccess, data])

  const renameFolderHandler = async (folderId) => {
    try {
      await renameFolder({ id: folderId, folder_name: renameValue }).unwrap();
      if (renameResponse) {
        setTimeout(() => {
          setIsRenameLoading(false)
          renameValue.length > 0 && setIsRenaming({ status: false, target: null })
          const message = `Folder Renamed`
          enqueueSnackbar(message, { variant: 'success' })
        }, 400)

      }
    } catch (err) {
      if (isFetchBaseQueryError(err)) {
        if ("message" in err.data) {
          const message = `Folder Rename Failed`
          enqueueSnackbar(message, { variant: 'error' })
        }
      } else if (isErrorWithMessage(err)) {
        const message = `Folder Rename Failed`
        enqueueSnackbar(message, { variant: 'error' })
      }
    }

  }



  const handleClick = (e, folder) => {
    e.stopPropagation();
    setSelected([folder.id]);
    if (isRenaming.status && isRenaming.target !== folder.id) setIsRenaming({ status: false, target: null })
    if (isRenaming.status) return;
    // In that case, event.ctrlKey does the trick.
    if (e.shiftKey || e.ctrlKey) {
      if (!selected.includes(folder.id) || selected === 0) setSelected([...selected, folder.id]);
      else if (selected.includes(folder.id)) setSelected(selected.filter(select => select !== folder.id));
    } else {
      if (e.nativeEvent.button === 0) {
      } else if (e.nativeEvent.button === 2) {
        e.preventDefault()
        // if (!clicked.includes(i)) setClicked([...clicked, i])
        setIsFolder(folder.isFolder)
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

  }

  // CUSTOM ALERT
  // enqueueSnackbar('Your report is ready', {
  //   variant: 'reportComplete',
  //   persist: true,
  //   allowDownload: true, // <-- pass any additional options
  // })

  const handleMenuClick = async (e, type) => {
    e.stopPropagation();
    dispatch(setModalType({ modalType: type }))

    let selectedDoc = folders.find(folder => folder.id === selected[selected.length - 1])
    if (selectedDoc.isFolder) {
      if (type === 'view') {
        setTimeout(() => {
          dispatch(setCurrentFolder({ currentFolder: selected[selected.length - 1] }))
        }, 100);
      }
      else if (type === 'delete') {
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
      else if (type === 'rename') {
        setIsRenaming({ status: true, target: selectedDoc.id })
      }
      else {
        dispatch(setOpenFileView({ openFileView: true }))
      }
      setContextMenu(null);
    } else {
      if (type === 'delete') {
        setTimeout(() => {
          setFolders([...folders.filter(x => x.id !== selected[selected.length - 1])])
        }, 200)
        setTimeout(() => {
          const message = `File Send to Trash`
          enqueueSnackbar(message, { variant: 'warning' })
        }, 400)
      } else {
        setContent(
          <object type="application/pdf"
            data="http://www.africau.edu/images/default/sample.pdf"
            width={matchDownSM ? "450px" : matchUpMD ? "520px" : matchUpLG ? "800px" : "600px"}
            height={matchDownSM ? "480px" : matchUpMD ? "500px" : matchUpLG ? "700px" : "500px"}
          >
            <a href="http://www.africau.edu/images/default/sample.pdf">download pdf</a>
          </object>
        )
        dispatch(setOpenFileView({ openFileView: true }))
      }
      setContextMenu(null);
    }
  }
  const handleDoubleClick = (e, folder) => {
    e.stopPropagation();
    if (isRenaming.status && isRenaming.target !== folder.id) setIsRenaming({ status: false, target: null })
    if (isRenaming.status) return;
    let selectedDoc = folders.find(folder => folder.id === selected[selected.length - 1])
    if (selectedDoc.isFolder) {
      if (folder.parent === openFolder) {
        addHistory({
          id: selected[selected.length - 1],
          label: folder.folder_name
        })
      }
      setSelected([folder.id]);
      setTimeout(() => {
        dispatch(setCurrentFolder({ currentFolder: selected[selected.length - 1] }))
      }, 150);

      setContextMenu(null);
    } else {
      setContent(
        <object type="application/pdf"
          data="http://www.africau.edu/images/default/sample.pdf"
          width={matchDownSM ? "450px" : matchUpMD ? "520px" : matchUpLG ? "800px" : "600px"}
          height={matchDownSM ? "480px" : matchUpMD ? "500px" : matchUpLG ? "700px" : "500px"}
        >
          <a href="http://www.africau.edu/images/default/sample.pdf">download pdf</a>
        </object>
      )
      dispatch(setOpenFileView({ openFileView: true }))
      setContextMenu(null);
    }
  }
  const handleClose = () => {
    setContextMenu(null);
  };




  return (
    <>
      <Grid item xs={5} sm={7} md={8} lg={9} xl={10}>
        <Grid
          container
          spacing={1}
          sx={{
            padding: 1,
            height: 500,
            overflowY: 'auto',
            background: '#fafafb',
            borderRadius: 2,
          }}
        >

          {
            isError ?
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100%"
                minWidth="100%"
              >
                <Stack direction="column">
                  <Error height={100} width={100} />
                  <Typography variant='h5'>Opps... An Error  has occured</Typography>
                </Stack>
              </Box>
              :
              isLoading ?
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight="100%"
                  minWidth="100%"
                >
                  <FolderLoader height={300} width={300} />
                </Box> :
                folders && Array.isArray(folders) ?
                  folders.length > 0 ?
                    folders.map((folder) => (
                      folder.parent === openFolder &&
                      <Grid item xs={12} sm={6} md={3} lg={2} xl={1} key={folder.id} sx={{ backgroundColor: 'transparent' }} >
                        <Badge color="primary" overlap="circular" badgeContent={folder.noOfChildren}>
                          <ButtonBase
                            spacing={0}
                            sx={{
                              backgroundColor: isRenaming.status && isRenaming.target === folder.id ? 'transparent' : selected.length < 2 && selected[0] === folder.id ? 'primary.100' : selected.includes(folder.id) ? 'primary.100' : 'transparent',
                              maxWidth: 'max-content',
                              maxHeight: 'max-content',
                              borderRadius: 2,
                              p: .2,
                              pr: .7,
                              cursor: 'pointer'
                            }}
                            onClick={(e) => handleClick(e, folder)}
                            onContextMenu={(e) => handleClick(e, folder)}
                            onDoubleClick={(e) => handleDoubleClick(e, folder)}
                            // onTouchStart = {e => start(e)}
                            // onTouchEnd = {e => clear(e, true, folder)}
                            disableRipple={isRenaming.status && isRenaming.target === folder.id}
                          >
                            <DragFolder style={{ maxWidth: 80 }} draggable={!isRenaming.status}>
                              {
                                folder.isFolder
                                  ?
                                  <FcFolder
                                    style={{
                                      fontSize: '60px',
                                    }}
                                  />
                                  :
                                  <FcDocument
                                    style={{
                                      fontSize: '50px',
                                      color: 'blue',
                                      marginTop: '5px',
                                      marginBottom: '5px',
                                    }}
                                  />

                              }
                              {
                                isRenaming.status && selected.length > 0 && selected[selected.length - 1] === folder.id ?
                                  isRenameLoading ? 
                                  <CircularProgress color="primary"/>
                                  :
                                  <TextField
                                    id="new_folder"
                                    size="small"
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Escape') {
                                        setIsRenaming({ status: false, target: null })
                                      }
                                      if (e.key === "Enter") {
                                        setIsRenameLoading(true)
                                        renameFolderHandler(folder.id)
                                      }
                                    }}
                                    defaultValue={folder.folder_name}
                                    multiline
                                    sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem' } }}
                                    variant="outlined"
                                    inputProps={{ autoFocus: true }}
                                    onFocus={event => {
                                      event.target.select();
                                    }}
                                  />
                                  :
                                  <Typography
                                    color="textSecondary"
                                    gutterBottom
                                    variant="subtitle2"
                                  >
                                    <span style={{
                                      paddingLeft: '6px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: '3',
                                      WebkitBoxOrient: 'vertical',
                                      lineHeight: 1.2
                                    }}>
                                      {folder.folder_name}
                                    </span>
                                  </Typography>

                              }
                            </DragFolder>
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
                                  handleMenuClick(e, 'view')
                                }}
                              >
                                <Stack direction="row">
                                  <Box sx={{ p: .3 }}>
                                    <HiOutlineBookOpen style={{ fontSize: '17px' }} />
                                  </Box>
                                  <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">{isFolder ? 'Open' : 'View'}</Typography>
                                </Stack>
                              </MenuItem>
                              <MenuItem onClick={
                                (e) => {
                                  handleMenuClick(e, 'copy')
                                }
                              }
                              >
                                <Stack direction="row">
                                  <Box sx={{ p: .3 }}>
                                    <HiOutlineDocumentDuplicate style={{ fontSize: '17px' }} />
                                  </Box>
                                  <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">Copy</Typography>
                                </Stack>
                              </MenuItem>
                              <Divider sx={{ my: 0.5 }} />
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
                          </ButtonBase>
                        </Badge>
                      </Grid>

                    ))
                    :
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      minHeight="100%"
                      minWidth="100%"
                    >
                      <Stack direction="column" spacing={1} justifyContent="center" alignItems="center">
                        <FolderEmpty height={150} width={150} />
                        <Typography variant="h5">Folder Is Empty</Typography>
                      </Stack>
                    </Box> :
                  <Typography>No Files</Typography>
          }
        </Grid>
      </Grid>
      <ViewFile modalType={modalType}>
        {modalContent(modalType, content)}
      </ViewFile>
    </>
  )
}
