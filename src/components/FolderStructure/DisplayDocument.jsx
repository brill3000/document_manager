import * as React from 'react';
import Typography from '@mui/material/Typography';
import { FcFolder } from "react-icons/fc";
import { DragFolder } from "./DragFolder";
import { Box, TextField } from '../../../node_modules/@mui/material/index';
import { StyledLinearProgress } from 'ui-component/CustomProgressBars';
import { fileIcon } from '../../ui-component/fileIcon';
import { GoogleLoader } from 'ui-component/LoadHandlers';




export const DisplayDocument = ({ isRenaming, document, selected, isRenameLoading, setRenameValue, setIsRenaming, setIsRenameLoading, renameFolderHandler, renameFileHandler }) => {

  return <DragFolder style={{ maxWidth: 80 }} draggable={!isRenaming.status}>
    {document.isFolder
      ?
      <>
        <FcFolder
          style={{
            fontSize: '60px',
          }} />
        {isRenaming.status && isRenaming.target === document.id ?
          isRenameLoading ?
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <GoogleLoader height={20} width={150} loop={true} />
            </Box>
            :
            <TextField
              id="new_folder"
              size="small"
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Escape') {
                  setIsRenaming({ status: false, target: null });
                }
                if (e.key === "Enter") {
                  setIsRenameLoading(true);
                  renameFolderHandler(document.id);
                }
              }}
              defaultValue={document.folder_name}
              multiline
              sx={{ '& .MuiInputBase-input': { fontSize: '.75rem' } }}
              variant="outlined"
              inputProps={{ autoFocus: true }}
              onFocus={event => {
                event.target.select();
              }} />
          :
          <Typography
            color="textSecondary"
            gutterBottom
          >
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '.84rem',
              display: '-webkit-box',
              WebkitLineClamp: '3',
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.2
            }}>
              {document.folder_name}
            </span>
          </Typography>}
      </>

      :
      <>
        {fileIcon(document.file_type)}
        {
          (document.status && (document.status === 'failed' || document.status === 'uploading'))
            ?
            <StyledLinearProgress variant="determinate" value={document.progress} />
            :
            <>

              {isRenaming.status && isRenaming.target === document.id ?
                isRenameLoading ?
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <GoogleLoader height={20} width={150} loop={true} />
                  </Box>
                  :
                  <TextField
                    id="new_folder"
                    size="small"
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Escape') {
                        setIsRenaming({ status: false, target: null });
                      }
                      if (e.key === "Enter") {
                        setIsRenameLoading(true);
                        renameFileHandler(document.id);
                      }
                    }}
                    defaultValue={document.file_name}
                    multiline
                    sx={{ '& .MuiInputBase-input': { fontSize: '.75rem' } }}
                    variant="outlined"
                    inputProps={{ autoFocus: true }}
                    onFocus={event => {
                      event.target.select();
                    }} />
                :
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  <span style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '.84rem',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.2
                  }}>
                    {document.file_name}
                  </span>
                </Typography>
              }
            </>
        }
      </>
    }

  </DragFolder>;
}

