import React from 'react'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Box, Stack, useMediaQuery } from '@mui/material'
import { FileBrowserContentProps } from '../../Interface/FileBrowser'
import { theme } from '../../Themes/theme'
import { fileIcon } from '../../Icons/fileIcon'
import DocumentDetails from './DocumentDetails'
// import { useDragStore } from '../../data/persistent/Persistent'
import FolderGrid from './FolderGrid'
import { useViewStore } from '../../data/global_state/slices/view'
import { MemorizedFcFolder } from './Document'
// import { useStore } from '../../data/global_state'


const FileBrowserContent = ({ selected, setSelected, documents, select, nav }: FileBrowserContentProps): JSX.Element => {
  const md = useMediaQuery(theme.breakpoints.down('md'))
  const ref = React.useRef<HTMLInputElement>(null);
  const {view, browserHeight} = useViewStore()

  return (
    <Grid container
      width='100%'
      height='100%' ref={ref}
    >
      <FolderGrid documents={documents} selected={selected} setSelected={setSelected} select={select} nav={nav} />
      <Grid
        {...(md || view === 'list' ? { display: 'none' } : {})}
        md={4}
        height={'100%'}
        borderLeft='1px solid lightgrey'>
        {
          Array.isArray(selected) && selected.length > 0 &&
          <Stack spacing={2} height='100%'>
            {
              selected[0].is_dir
                ?
                <>
                  <Box display='flex' justifyContent='center'>
                    <MemorizedFcFolder
                      size={browserHeight !== 0 && browserHeight !== undefined ?  browserHeight * .7 * .2 : '30%'}
                    />
                  </Box>
                  <DocumentDetails
                    selected={selected}
                  />
                </>
                :
                <>
                  <Box display='flex' justifyContent='center' pt={1}>
                    {fileIcon(selected[0].type, browserHeight * .1, 0)}
                  </Box>
                  <DocumentDetails
                    selected={selected}
                  />
                </>

            }

          </Stack>
        }
      </Grid>
    </Grid>
  )
}

export default FileBrowserContent



