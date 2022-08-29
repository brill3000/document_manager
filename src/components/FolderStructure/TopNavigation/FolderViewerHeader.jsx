import * as React from 'react';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// import { HiChevronLeft } from "react-icons/hi";
// import { HiChevronRight } from "react-icons/hi";
import { HiOutlineDocumentAdd, HiOutlineDocumentDownload, HiOutlineDocumentSearch } from "react-icons/hi";
import { Box, ButtonBase, TextField, useMediaQuery, ClickAwayListener } from '@mui/material';
import { setModalType } from 'store/reducers/documents';
import { useDispatch } from 'react-redux';
import { setOpenFileView } from 'store/reducers/documents';
import { useSelector } from 'react-redux';
import Dropzone from "react-dropzone";
import FolderBreadCrumbs from './FolderBreadCrumbs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';
import { useAddFolderMutation } from 'store/async/folderQuery';
// import { isErrorWithMessage, isFetchBaseQueryError } from 'store/async/helpers';
import { useUploadFileMutation } from 'store/async/filesQuery';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { v4 } from 'uuid'
import { storage } from "../../../firebase-config"


// import { useAddFolderMutation } from 'store/async/query';




export function FolderViewerHeader({ history, setUploadedFiles, uploadedFiles, setHistory }) {
  const dispatch = useDispatch();
  const openModal = (type) => {
    dispatch(setModalType({ modalType: type }))
    dispatch(setOpenFileView({ openFileView: true }))
  }
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const currentFolder = useSelector(state => state.documents.currentFolder)
  const { enqueueSnackbar } = useSnackbar();
  const [addFolder] = useAddFolderMutation()
  const [uploadFile] = useUploadFileMutation()


  const [showForm, setShowForm] = React.useState(false);
  const [value, setValue] = React.useState('');
  // React.useEffect(() => {
  //   setDocuments([...documents, ...uploadedFiles])
  //   return () => {
  //     setDocuments([])
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [uploadedFiles])

  React.useEffect(() => {
    console.log(uploadedFiles, "UPLOADED FILES")
  }, [uploadedFiles])

  const changeHandler = (files) => {
    let filesArray = []
    files?.forEach(file => {
      const reference = {
        id: Math.ceil((Math.random() * 10000)),
        archived: false,
        uploaded_by: 'Admin',
        date_created: new Date().toDateString(),
        date_modified: file.lastModifiedDate.toDateString(),
        file_name: file.name,
        file_type: file.type,
        trashed: false,
        locked: false,
        media: file.path,
        totalDownloads: '857',
        isFolder: false,
        size: file.size,
        parent: currentFolder,
        isLoading: true,
        progress: 0,
        status: 'uploading',
        file_ref: null
      }
      filesArray.push(reference)
      setUploadedFiles(filesArray)
      const fileRef = ref(storage, `my_documents/${file.name + v4()}`)
      const uploadTask = uploadBytesResumable(fileRef, file)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          console.log(filesArray.map(document => {
            if (document.id === reference.id && progress < 100) {
              document.progress = progress
            }
            return document
          }), "TEST")
          setUploadedFiles([...filesArray.map(document => {
            if (document.id === reference.id) {
              document.progress = progress
            }
            return document
          })])
        },
        (error) => {
          setUploadedFiles([...filesArray.map(document => {
            if (document.id === reference.id) {
              document.status = 'failed'
            }
            return document
          })])
          const shortenedName = file.name.replace(/^(.{8}[^\s]*).*/, "$1");
          const message = `${shortenedName}${file.name.length > 8 && '...'} Upload Failed`
          enqueueSnackbar(message, { variant: 'error' })
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
            reference.file_ref = downloadUrl
            uploadFile(reference)
              .unwrap()
              .then(() => {
                setUploadedFiles([...filesArray.map(document => {
                  if (document.id === reference.id) {
                    document.status = 'success'
                  }
                  return document
                })])
                const shortenedName = file.name.replace(/^(.{8}[^\s]*).*/, "$1");
                const message = `${shortenedName}${file.name.length > 8 && '...'} Upload Successfully`
                enqueueSnackbar(message, { variant: 'success' })
              })
          })
        }
      )
    })

  };
  const createNewFolder = async () => {
    addFolder({
      created_by: 'Brilliant',
      folder_name: value,
      no_of_files: 0,
      isFolder: true,
      parent: currentFolder,
      size: 0,
    })
      .unwrap()
      .then((res) => {
        if (res) {
          setValue('')
          setShowForm(false)

          setTimeout(() => {
            const shortenedName = value.replace(/^(.{8}[^\s]*).*/, "$1");
            const message = `${shortenedName}${value.length > 8 && '...'} Created Successfully`
            enqueueSnackbar(message, { variant: 'success' })
          }, 400)
        }
      })
      .catch(() => {
        const shortenedName = value.replace(/^(.{8}[^\s]*).*/, "$1");
        const message = `${shortenedName}${value.length > 8 && '...'} Creation Failed`
        enqueueSnackbar(message, { variant: 'error' })
      })

  }
  return (
    <Grid container direction="row">
      <Grid item xs={12} >
        <FolderBreadCrumbs history={history} setHistory={setHistory} />
      </Grid>

      <Grid item xs={12}>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          justifyContent='flex-end'
        >
          <ButtonBase variant="outlined" sx={{
            p: .5,
            borderRadius: 1,
            "&:hover": {
              backgroundColor: 'primary.100'
            },
          }}>
            <Stack direction="row">
              <Box sx={{ p: .3 }}>
                <HiOutlineDocumentSearch style={{ fontSize: '16px' }} />
              </Box>
              {matchDownSM ? <></> : <Typography variant="subtitle2" sx={{ fontSize: 13 }} color="secondary.600">Search</Typography>}
            </Stack>
          </ButtonBase>
          <ButtonBase variant="outlined" sx={{
            p: .5,
            borderRadius: 1,
            border: '1 solid blue',
            "&:hover": {
              backgroundColor: 'primary.100'
            },
          }} onClick={() => openModal()}>
            <Stack direction="row">
              <Box sx={{ p: .3 }}>
                <HiOutlineDocumentDownload style={{ fontSize: '16px' }} />
              </Box>
              {matchDownSM ? <></> : <Typography variant="subtitle2" sx={{ fontSize: 13 }} color="secondary.600">Download</Typography>}
            </Stack>
          </ButtonBase>

          <Dropzone onDrop={changeHandler}>
            {({ getRootProps, getInputProps }) => (
              <ButtonBase variant="outlined" sx={{
                p: .5,
                borderRadius: 1,
                border: '1 solid blue',
                "&:hover": {
                  backgroundColor: 'primary.100'
                },
              }}
                {...getRootProps({ className: "dropzone" })}
              >
                <input {...getInputProps()} />
                <Stack direction="row">
                  <Box sx={{ p: .3 }}>
                    <HiOutlineDocumentDownload style={{ fontSize: '16px' }} />
                  </Box>
                  {matchDownSM ? <></> : <Typography variant="subtitle2" sx={{ fontSize: 13 }} color="secondary.600">Upload</Typography>}
                </Stack>
              </ButtonBase>
            )}
          </Dropzone>

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
                  {matchDownSM ? <></> : <Typography variant="subtitle2" sx={{ fontSize: 13 }} color="secondary.600">Create Folder</Typography>}
                </Stack>
              </ButtonBase>
          }
        </Stack>
      </Grid>
    </Grid>
  );
}
