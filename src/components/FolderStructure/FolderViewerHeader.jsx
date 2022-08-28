import * as React from 'react';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// import { HiChevronLeft } from "react-icons/hi";
// import { HiChevronRight } from "react-icons/hi";
import { HiOutlineDocumentAdd, HiOutlineDocumentDownload, HiOutlineDocumentSearch } from "react-icons/hi";
import { Box, ButtonBase, TextField, useMediaQuery } from '@mui/material';
import { setModalType } from 'store/reducers/documents';
import { useDispatch } from 'react-redux';
import { setOpenFileView } from 'store/reducers/documents';
import { useSelector } from 'react-redux';
import Dropzone from "react-dropzone";
import FolderBreadCrumbs from './FolderBreadCrumbs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';
import { useAddFolderMutation } from 'store/async/query';
import { isErrorWithMessage, isFetchBaseQueryError } from 'store/async/helpers';
import { ClickAwayListener } from '../../../node_modules/@mui/material/index';
// import { useAddFolderMutation } from 'store/async/query';




export function FolderViewerHeader({ history, setFolders, folders, setHistory }) {
  const dispatch = useDispatch();
  const openModal = (type) => {
    dispatch(setModalType({ modalType: type }))
    dispatch(setOpenFileView({ openFileView: true }))
  }
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const currentFolder = useSelector(state => state.documents.currentFolder)
  const [uploadedFolders, setUploadedFolders] = React.useState([])
  const { enqueueSnackbar } = useSnackbar();
  const [addFolder, response] = useAddFolderMutation()


  const [showForm, setShowForm] = React.useState(false);
  const [value, setValue] = React.useState('');
  React.useEffect(() => {
    setFolders([...folders, ...uploadedFolders])
    return () => {
      setFolders([])
    }
  }, [uploadedFolders])

  // const [] = useAddFolderMutation()


  const changeHandler = (files) => {
    files.forEach(file => {
      folders.push({
        id: Math.ceil((Math.random() * 10000)),
        createdAt: new Date(),
        folder_name: file.name,
        media: '/static/images/products/product_3.png',
        title: 'Slack',
        totalDownloads: '857',
        isFolder: false,
        parent: currentFolder
      })
    })

    setTimeout(() => {
      const message = `${files.length} Files Uploaded Successfully`
      enqueueSnackbar(message, { variant: 'success' })
    }, files.length * 100)

  };
  const createNewFolder = async () => {
    // setTimeout(() => {

    try {
      await addFolder({
        created_by: 'Brilliant',
        folder_name: value,
        no_of_files: 0,
        isFolder: true,
        parent: currentFolder,
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
