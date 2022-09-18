import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import { Stack } from '@mui/material';
import RotateRightRoundedIcon from '@mui/icons-material/RotateRightRounded';

const data = [
  {
    name: 'John Doe',
    date: '21 Oct 2022',
    title: 'Licencing Agreement',
    body: 'The Progress on the Project has been fast tracked through use of Streamlined Code ...',
  },
  {
    name: 'Steve Mooy',
    date: '06 Jul 2022',
    title: 'Tickets for our upcoming trip',
    body: 'Good day, mate! It seems that our tickets just arrived…',
  },
  {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  },
  {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  }, {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  }, {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  }, {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  }, {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  }, {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  }, {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  }, {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  }, {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  }, {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  }, {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  }, {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  }, {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  }, {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  }, {
    name: 'Kate Gates',
    date: '16 May 2022',
    title: 'Brunch this Saturday?',
    body: "Hey! I'll be around the city this weekend, how about a…",
  },
];

export default function WorkFlowsList() {
  return (
    <List sx={{ '--List-decorator-size': '30px' }}>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <ListItemButton
              {...(index === 0 && { variant: 'soft', color: 'primary' })}
              sx={{ p: 2 }}
            >
              <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                <RotateRightRoundedIcon sx={{ fontSize: 30 }} />
              </ListItemDecorator>
              <Box sx={{ pl: 2, width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 0.5,
                  }}
                >
                  <Typography level="body3">{item.name}</Typography>
                  <Typography level="body3" textColor="text.tertiary">
                    Due date: {item.date}
                  </Typography>
                </Box>
                <Box>
                <Typography level="body2"  sx={{ mb: 0.5 }}>{item.title}</Typography>
                  <Stack direction="row" alignContent="center">
                    <Box
                      sx={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        bgcolor: 'primary.300',
                        mt: .5
                      }}
                    />
                    <Typography level="body4" sx={{ pl: 1 }}>Inprogress</Typography>
                  </Stack>

                </Box>
              </Box>
            </ListItemButton>
          </ListItem>
          <ListDivider sx={{ m: 0 }} />
        </React.Fragment>
      ))}
    </List>
  );
}
