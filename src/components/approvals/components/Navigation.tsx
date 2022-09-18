import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';

// Icons import

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import DoNotDisturbAltRoundedIcon from '@mui/icons-material/DoNotDisturbAltRounded';
import RotateRightRoundedIcon from '@mui/icons-material/RotateRightRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { DropdownButton } from '../../../global/UI/DropdownButton';

export default function EmailNav() {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(1);
  const [collapseTop, setCollapseTop] = React.useState<boolean>(false);
  const [collapseBottom, setCollapseBottom] = React.useState<boolean>(false);


  const handleListItemClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  return (
    <List size="sm" sx={{ '--List-item-radius': '8px' }}>
      <ListItem nested sx={{ p: 0 }}>
        <Box
          sx={{
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            id="nav-list-browse"
            textColor="neutral.500"
            fontWeight={700}
            sx={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '.1rem',
            }}
          >
            Status
          </Typography>
          <IconButton
            size="sm"
            variant="plain"
            color="primary"
            sx={{ '--IconButton-size': '24px' }}
          >
            {DropdownButton(collapseTop, setCollapseTop)}
          </IconButton>
        </Box>
        {

          !collapseTop &&
          (<List
            aria-labelledby="nav-list-browse"
            sx={{
              '& .JoyListItemButton-root': { p: '8px' },
            }}
          >
            <ListItem>
              <ListItemButton
                variant={selectedIndex === 2 ? 'soft' : 'plain'}
                color={selectedIndex === 2 ? 'primary' : 'neutral'}
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemDecorator sx={{ color: selectedIndex === 2 ? 'inherit' : 'neutral.500' }}>
                  <PersonOutlineRoundedIcon fontSize="small" />
                </ListItemDecorator>
                <ListItemContent>My Approvals</ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                variant={selectedIndex === 1 ? 'soft' : 'plain'}
                color={selectedIndex === 1 ? 'primary' : 'neutral'}
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
              >
                <ListItemDecorator sx={{ color: selectedIndex === 1 ? 'inherit' : 'neutral.500' }}>
                  <RotateRightRoundedIcon fontSize="small" />
                </ListItemDecorator>
                <ListItemContent>Pending Approvals</ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                variant={selectedIndex === 3 ? 'soft' : 'plain'}
                color={selectedIndex === 3 ? 'primary' : 'neutral'}
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
              >
                <ListItemDecorator sx={{ color: selectedIndex === 3 ? 'inherit' : 'neutral.500' }}>
                  <CheckCircleOutlineRoundedIcon fontSize="small" />
                </ListItemDecorator>
                <ListItemContent>Completed Approvals</ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                variant={selectedIndex === 4 ? 'soft' : 'plain'}
                color={selectedIndex === 4 ? 'primary' : 'neutral'}
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}
              >
                <ListItemDecorator sx={{ color: selectedIndex === 4 ? 'inherit' : 'neutral.500' }}>
                  <DoNotDisturbAltRoundedIcon fontSize="small" />
                </ListItemDecorator>
                <ListItemContent>Rejected Approvals</ListItemContent>
              </ListItemButton>
            </ListItem>
          </List>)
        }
      </ListItem>
      <ListItem nested>
        <Box
          sx={{
            mt: 2,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            id="nav-list-tags"
            textColor="neutral.500"
            fontWeight={700}
            sx={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '.1rem',
            }}
          >
            Custom states
          </Typography>
          <IconButton
            size="sm"
            variant="plain"
            color="primary"
            sx={{ '--IconButton-size': '24px' }}
          >
            {DropdownButton(collapseBottom, setCollapseBottom)}
          </IconButton>
        </Box>
        {
          !collapseBottom && (<List
            aria-labelledby="nav-list-tags"
            size="sm"
            sx={{
              '--List-decorator-width': '32px',
              '& .JoyListItemButton-root': { p: '8px' },
            }}
          >
            <ListItem>
              <ListItemButton
                variant={selectedIndex === 5 ? 'soft' : 'plain'}
                color={selectedIndex === 5 ? 'primary' : 'neutral'}
                selected={selectedIndex === 5}
                onClick={(event) => handleListItemClick(event, 5)}
              >
                <ListItemDecorator>
                  <Box
                    sx={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '99px',
                      bgcolor: 'primary.300',
                    }}
                  />
                </ListItemDecorator>
                <ListItemContent>Waiting Supeior's Approval</ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                variant={selectedIndex === 6 ? 'soft' : 'plain'}
                color={selectedIndex === 6 ? 'primary' : 'neutral'}
                selected={selectedIndex === 6}
                onClick={(event) => handleListItemClick(event, 6)}
              >
                <ListItemDecorator>
                  <Box
                    sx={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '99px',
                      bgcolor: 'danger.300',
                    }}
                  />
                </ListItemDecorator>
                <ListItemContent>Pending Approval</ListItemContent>
              </ListItemButton>
            </ListItem>
          </List>)
        }
      </ListItem>
    </List>
  );
}
