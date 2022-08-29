import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// import Skeleton from '@mui/material/Skeleton';
import { ButtonBase, Menu, Stack, useMediaQuery, Badge } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { setOpenFileView } from 'store/reducers/documents';
import { setCurrentFolder } from 'store/reducers/documents';
import { setModalType } from 'store/reducers/documents';
import { useDispatch } from 'react-redux';
import ViewFile from './ViewFile';
import { useSelector } from 'react-redux';
import EditDocuments from './EditDocument';
import { useSnackbar } from 'notistack';
import { FolderLoader, FolderEmpty, Error } from 'ui-component/FolderLoader';
import { useDeleteFolderMutation, useGetFoldersByParentIdQuery, useRenameFolderMutation } from 'store/async/folderQuery';
import { isErrorWithMessage, isFetchBaseQueryError } from 'store/async/helpers';
import { useGetFilesByParentIdQuery, useRenameFilesMutation } from 'store/async/filesQuery';
import { DisplayDocument } from './DisplayDocument';
import { ActionMenu } from './ActionMenus/ActionMenuMain';
import { Button } from '../../../node_modules/@mui/material/index';



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


export default function FolderViewer({ documents, setDocuments, addHistory, uploadedFiles }) {
  const [selected, setSelected] = React.useState([]);
  const [contextMenu, setContextMenu] = React.useState(null);
  const [isFolder, setIsFolder] = React.useState(false);
  const [isRenaming, setIsRenaming] = React.useState({ status: false, target: null })
  const [renameValue, setRenameValue] = React.useState('');
  const [isRenameLoading, setIsRenameLoading] = React.useState(false);

  const openFolder = useSelector(state => state.documents.currentFolder)
  const modalType = useSelector(state => state.documents.modalType)

  // Firebase Folder Queries
  const fetched_folders = useGetFoldersByParentIdQuery(openFolder).data
  const foldersIsLoading = useGetFoldersByParentIdQuery(openFolder).isLoading
  const foldersIsFetching = useGetFoldersByParentIdQuery(openFolder).isFetching
  const foldersIsSuccess = useGetFoldersByParentIdQuery(openFolder).isSuccess
  const foldersIsError = useGetFoldersByParentIdQuery(openFolder).isError

  // Firebase File Queries
  const fetched_files = useGetFilesByParentIdQuery(openFolder).data
  const filesIsLoading = useGetFilesByParentIdQuery(openFolder).isLoading
  const filesIsFetching = useGetFilesByParentIdQuery(openFolder).isFetching
  const filesIsSuccess = useGetFilesByParentIdQuery(openFolder).isSuccess
  const filesIsError = useGetFilesByParentIdQuery(openFolder).isError


  const [deleteFolder, deleteResponse] = useDeleteFolderMutation()
  const [renameFolder, renameResponse] = useRenameFolderMutation()
  const [renameFile, renameFileResponse] = useRenameFilesMutation()



  const [content, setContent] = React.useState(null)

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();


  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const matchUpMD = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const matchUpLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));


  React.useEffect(() => {
    let documents = []
    if (foldersIsSuccess && fetched_folders && Array.isArray(fetched_folders) && fetched_folders.length > 0) {
      documents = [...documents, ...fetched_folders]
    }
    if (filesIsSuccess && fetched_files && Array.isArray(fetched_files) && fetched_files.length > 0) {
      documents = [...documents, ...fetched_files]
    }
    if (documents.length > 0) {
      documents = documents.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.id === value.id
        ))
      )
      setDocuments(documents)
    } else {
      setDocuments([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foldersIsSuccess, fetched_folders, fetched_files, filesIsSuccess])


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
  const renameFileHandler = async (fileId) => {
    try {
      await renameFile({ id: fileId, file_name: renameValue }).unwrap();
      if (renameFileResponse) {
        setTimeout(() => {
          setIsRenameLoading(false)
          renameValue.length > 0 && setIsRenaming({ status: false, target: null })
          const message = `File Renamed`
          enqueueSnackbar(message, { variant: 'success' })
        }, 400)

      }
    } catch (err) {
      if (isFetchBaseQueryError(err)) {
        if ("message" in err.data) {
          const message = `File Rename Failed`
          enqueueSnackbar(message, { variant: 'error' })
        }
      } else if (isErrorWithMessage(err)) {
        const message = `File Rename Failed`
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

    let selectedDoc = documents.find(folder => folder.id === selected[selected.length - 1])
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
          setDocuments([...documents.filter(x => x.id !== selected[selected.length - 1])])
        }, 200)
        setTimeout(() => {
          const message = `File Send to Trash`
          enqueueSnackbar(message, { variant: 'warning' })
        }, 400)
      }
      else if (type === 'rename') {
        setIsRenaming({ status: true, target: selectedDoc.id })
      }
      else {
        if (selectedDoc.file_ref && selectedDoc.file_type) {
          if (
            !(selectedDoc.file_type.includes('doc')
              || selectedDoc.file_type.includes('docx')
              || selectedDoc.file_type.includes('application/msword')
              || selectedDoc.file_type.includes('application/msword')
              || selectedDoc.file_type.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
              || selectedDoc.file_type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
              || selectedDoc.file_type.includes('application/vnd.ms-powerpoint')
              || selectedDoc.file_type.includes('application/vnd.openxmlformats-officedocument.presentationml.presentation')
            )
          ) {

            setContent(
              <object type={selectedDoc.file_type}
                data={selectedDoc.file_ref}
                width={matchDownSM ? "450px" : matchUpMD ? "520px" : matchUpLG ? "800px" : "600px"}
                height={matchDownSM ? "480px" : matchUpMD ? "500px" : matchUpLG ? "700px" : "500px"}
              >
                {matchDownSM ? <Button variant="contained" color="primary"><a href={selectedDoc.file_ref}>View Link</a></Button> : <a href={selectedDoc.file_ref}>Download File</a>}
              </object>
            )
            dispatch(setOpenFileView({ openFileView: true }))
          } else {
            setContent(
              <Button variant="contained" color="primary"><a href={selectedDoc.file_ref}>download pdf</a></Button>
            )
            const message = `You cannot currently view this file type, Download the file to view`
            enqueueSnackbar(message, { variant: 'warning' })
          }
        } else {
          const message = `You cannot currently view this file`
          enqueueSnackbar(message, { variant: 'error' })
        }
      }
      setContextMenu(null);
    }
  }
  const handleDoubleClick = (e, folder) => {
    e.stopPropagation();
    if (isRenaming.status && isRenaming.target !== folder.id) setIsRenaming({ status: false, target: null })
    if (isRenaming.status) return;
    let selectedDoc = documents.find(folder => folder.id === selected[selected.length - 1])
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
      <Grid
        item xs={5} sm={7} md={8} lg={9} xl={10}
        sx={{
          padding: 1,
          height: 500,
          overflowY: 'auto',
          background: '#fafafb',
          borderRadius: 2,
        }}
      >
        <Grid
          container
          sx={{
            height: 'min-content',
            overflowY: 'auto',
          }}
        >
          {
            foldersIsError || filesIsError ?
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={450}
                minWidth="100%"
              >
                <Stack direction="column">
                  <Error height={100} width={100} />
                  <Typography variant='h5'>Opps... An Error  has occured</Typography>
                </Stack>
              </Box>
              :
              foldersIsLoading || filesIsLoading || foldersIsFetching || filesIsFetching ?
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight="100%"
                  minWidth="100%"
                >
                  <FolderLoader height={300} width={300} />
                </Box> :
                documents && Array.isArray(documents) ?
                  documents.length > 0 ?
                    [...documents, ...uploadedFiles].map((document) => (
                      document.parent === openFolder &&
                      <Grid item xs={12} sm={6} md={3} lg={2} xl={1} key={document.id} sx={{ backgroundColor: 'transparent' }} >
                        <Badge color="primary" overlap="circular" badgeContent={document.noOfChildren}>
                          <ButtonBase
                            spacing={0}
                            sx={{
                              backgroundColor: isRenaming.status && isRenaming.target === document.id ? 'transparent' : selected.length < 2 && selected[0] === document.id ? 'primary.100' : selected.includes(document.id) ? 'primary.100' : 'transparent',
                              maxWidth: 'max-content',
                              maxHeight: 'max-content',
                              borderRadius: 2,
                              p: .2,
                              pr: .7,
                              cursor: 'pointer'
                            }}
                            onClick={(e) => handleClick(e, document)}
                            onContextMenu={(e) => handleClick(e, document)}
                            onDoubleClick={(e) => handleDoubleClick(e, document)}
                            // onTouchStart = {e => start(e)}
                            // onTouchEnd = {e => clear(e, true, folder)}
                            disableRipple={isRenaming.status && isRenaming.target === document.id}
                          >
                            <DisplayDocument
                              isRenaming={isRenaming}
                              document={document}
                              selected={selected}
                              isRenameLoading={isRenameLoading}
                              setRenameValue={setRenameValue}
                              setIsRenaming={setIsRenaming}
                              setIsRenameLoading={setIsRenameLoading}
                              renameFolderHandler={renameFolderHandler}
                              renameFileHandler={renameFileHandler}
                            />
                            <ActionMenu contextMenu={contextMenu} handleClose={handleClose} handleMenuClick={handleMenuClick} isFolder={isFolder} />
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
                      <Stack direction="column" spacing={1} justifyContent="center" alignItems="center" minHeight={450} minWidth="100%">
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


