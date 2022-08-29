import * as React from 'react';
import Typography from '@mui/material/Typography';
import { FcFolder } from "react-icons/fc";
import { DragFolder } from "./DragFolder";
import { CircularProgress, Stack, TextField } from '../../../node_modules/@mui/material/index';
import { StyledLinearProgress } from 'ui-component/CustomProgressBars';
import { fileIcon } from '../../ui-component/fileIcon';




export const DisplayDocument = ({ isRenaming, document, selected, isRenameLoading, setRenameValue, setIsRenaming, setIsRenameLoading, renameFolderHandler, renameFileHandler }) => {
  return <DragFolder style={{ maxWidth: 80 }} draggable={!isRenaming.status}>
    {document.isFolder
      ?
      <>
        <FcFolder
          style={{
            fontSize: '60px',
          }} />
        {isRenaming.status && selected.length > 0 && selected[selected.length - 1] === document.id ?
          isRenameLoading ?
            <CircularProgress color="primary" />
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
              sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem' } }}
              variant="outlined"
              inputProps={{ autoFocus: true }}
              onFocus={event => {
                event.target.select();
              }} />
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
              {document.folder_name}
            </span>
          </Typography>}
      </>

      :
      <Stack direction="column" justifyContent="center" alignItems="center">
        {fileIcon(document.file_type)}
        {
          (document.status && (document.status === 'failed'  || document.status === 'uploading'))
          ?
          <StyledLinearProgress variant="determinate" value={document.progress}/>
          :
          <>
            {
              isRenaming.status && selected.length > 0 && selected[selected.length - 1] === document.id ?
                isRenameLoading ?
                  <CircularProgress color="primary" />
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
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem' } }}
                    variant="outlined"
                    inputProps={{ autoFocus: true }}
                    onFocus={event => {
                      event.target.select();
                    }} />
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
                    {document.file_name}
                  </span>
                </Typography>
            }
          </>
        }
      </Stack>
    }

  </DragFolder>;
}
