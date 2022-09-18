import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Slider from '@mui/joy/Slider';

import ListDivider from '@mui/joy/ListDivider';
import Avatar from '@mui/joy/Avatar';
import ListItem from '@mui/joy/ListItem';
import List from '@mui/joy/List';
import AvatarGroup from '@mui/joy/AvatarGroup';
import { Grid, LinearProgress, Link, Stack } from '@mui/material';
import ListItemDecorator from '@mui/joy/ListItemDecorator';

import { HiOutlineDocumentText } from "react-icons/hi";


export function LinearDeterminate({percentage}: {percentage: number}) {
  const [progress, setProgress] = React.useState(percentage ?? 0);


  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}

export default function RolesContent() {
  return (
    <Sheet
      variant="outlined"
      sx={{
        minHeight: 500,
        borderRadius: 'sm',
        p: 2,
        mb: 3,
        bgcolor: 'background.componentBg',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          mb: 2
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <Typography
            level="body1"
            fontWeight="md"
            textColor="text.primary"
            mt={2}
            mb={1}
          >
            Licencing Agreement
          </Typography>
        </Box>
      </Box>
      <Grid container>
        <Grid item xs={12}
          sx={{
            bgcolor: 'neutral.100',
            borderRadius: 2,
            height: 430,
            overflowY: 'auto',
          }}
        >
          <Stack direction="column" spacing={2} sx={{ pl: 1 }}>
            <Typography
              level="body2"
              fontWeight="md"
              textColor="text.primary"
              mt={1}
            >
              Status: Inprogress
            </Typography>
            <Typography
              level="body2"
              fontWeight="md"
              textColor="text.primary"
              mt={1}
            >
              Date: 21 Oct 2022
            </Typography>
            <Box>
              <Typography
                level="body2"
                fontWeight="md"
                textColor="text.primary"
                mt={1}
              >
                Documents
              </Typography>
              <List
                aria-labelledby="decorated-list-demo"
                sx={{ '--List-decorator-size': '32px' }}
              >
                <ListItem>
                  <ListItemDecorator><HiOutlineDocumentText /></ListItemDecorator> <Link href="#"><Typography level='body3'>Approval Doc 1.pdf</Typography></Link>
                </ListItem>
                <ListItem>
                  <ListItemDecorator><HiOutlineDocumentText /></ListItemDecorator> <Link href="#"><Typography level='body3'>Approval Doc 1.pdf</Typography></Link>
                </ListItem>
                <ListItem>
                  <ListItemDecorator><HiOutlineDocumentText /></ListItemDecorator> <Link href="#"><Typography level='body3'>Approval Doc 1.pdf</Typography></Link>
                </ListItem>
              </List>
            </Box>
            <Typography
              level="body2"
              fontWeight="md"
              textColor="text.primary"
              mt={1}
              ml={1}
            >
              Actions
            </Typography>
          </Stack>

        </Grid>
      </Grid>
    </Sheet >
  );
}
