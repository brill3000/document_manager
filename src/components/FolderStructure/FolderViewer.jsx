import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FcFolder } from "react-icons/fc";
import { FcDocument } from "react-icons/fc";
import Skeleton from '@mui/material/Skeleton';
import { DragFolder } from "./DragFolder";
import { Menu, MenuItem, Stack } from '../../../node_modules/@mui/material/index';
import { styled, alpha } from '@mui/material/styles';
import { HiOutlineTrash, HiOutlineDocumentDuplicate, HiOutlinePencilAlt, HiOutlinePencil, HiOutlineBookOpen } from "react-icons/hi";
import Divider from '@mui/material/Divider';

const StyledMenu = styled((props) => (
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


export default function FolderViewer() {
  const [selected, setSelected] = React.useState([]);
  const [contextMenu, setContextMenu] = React.useState(null);

  const handleClick = (e, i) => {

    e.stopPropagation();

    // In that case, event.ctrlKey does the trick.
    if (e.shiftKey) {
      if (!selected.includes(i) || selected === 0) setSelected([...selected, i]);
      else if (selected.includes(i)) setSelected(selected.filter(select => select !== i ));
    } else {
      if (e.nativeEvent.button === 0) {
        setSelected([i]);
        // clicked.includes(i) ?
        //   setClicked(clicked.filter(clickedItem => clickedItem !== i))
        //   :
        //   setClicked([...clicked, i])
      } else if (e.nativeEvent.button === 2) {
        e.preventDefault()
        setSelected([i]);
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
  }
  const handleClose = () => {
    setContextMenu(null);
  };

  return (
    <Grid item xs={5} sm={7} md={8} lg={9} xl={10}>
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
        {[...Array(100)].map((_, i) => (
          <Grid sx={{ backgroundColor: 'transparent' }} item xs={12} sm={6} md={4} lg={2} xl={1} key={i}>
            <Box
              spacing={0}
              sx={{
                backgroundColor: selected.length < 2 && selected[0] === i ? 'primary.100' : selected.includes(i) ? 'primary.100' : 'transparent',
                maxWidth: 'max-content',
                maxHeight: 'max-content',
                borderRadius: 2,
                p: .2,
                cursor: 'pointer'
              }}
              onClick={(e) => handleClick(e, i)}
              onContextMenu={(e) => handleClick(e, i)}
              direction="column"
            >
              <DragFolder style={{ maxWidth: 80 }}>
                {i > 15 ?
                  <Skeleton>
                    <FcFolder style={{
                      fontSize: '60px',
                    }} />
                  </Skeleton>
                  :
                  (
                    i !== 0 && (i % 3 === 0 || i % 7 === 0) ?
                      <FcDocument
                        style={{
                          fontSize: '50px',
                          marginTop: '5px',
                          marginBottom: '5px',
                        }}
                      />
                      :
                      <FcFolder
                        style={{
                          fontSize: '60px',
                          color: 'blue'
                        }}
                      />

                  )}
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="subtitle2"
                >
                  {i > 15 ?
                    <Skeleton />
                    :
                    <span style={{
                      paddingLeft: '6px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '3',
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.2
                    }}>
                      {
                        i !== 0 && (i % 3 === 0 || i % 7 === 0) ?
                          (i % 2 === 0 || i % 13 === 0) ?
                            "File Name That Happens to be" : "File"
                          : (i % 2 === 0 || i % 13 === 0)
                            ? "Long Folder Name Testing How text wrap"
                            : "Folder "}
                      {i}
                    </span>}
                </Typography>
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
                <MenuItem onClick={handleClose} disableRipple>
                  <Stack direction="row">
                    <Box sx={{ p: .3 }}>
                      <HiOutlineBookOpen style={{ fontSize: '17px' }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">Open</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                  <Stack direction="row">
                    <Box sx={{ p: .3 }}>
                      <HiOutlineDocumentDuplicate style={{ fontSize: '17px' }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">Copy</Typography>
                  </Stack>
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleClose} disableRipple>
                  <Stack direction="row">
                    <Box sx={{ p: .3 }}>
                      <HiOutlinePencil style={{ fontSize: '17px' }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">Rename</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                  <Stack direction="row">
                    <Box sx={{ p: .3 }}>
                      <HiOutlinePencilAlt style={{ fontSize: '17px' }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1 }} color="secondary.600">Edit</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                  <Stack direction="row">
                    <Box sx={{ p: .3 }}>
                      <HiOutlineTrash style={{ fontSize: '17px', color: 'red' }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontSize: 14, pl: 1, color: 'red' }} color="secondary.600">Delete</Typography>
                  </Stack>
                </MenuItem>
              </StyledMenu>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}
