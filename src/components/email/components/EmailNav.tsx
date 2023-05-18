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
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import OutboxRoundedIcon from '@mui/icons-material/OutboxRounded';
import DraftsRoundedIcon from '@mui/icons-material/DraftsRounded';
import AssistantPhotoRoundedIcon from '@mui/icons-material/AssistantPhotoRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { DropdownButton } from '../../../global/UI/DropdownButton';
import { CircularProgress } from '@mui/material';
import { GoogleLoader } from 'ui-component/LoadHandlers';

const EmailNav: React.FC<any> = ({
    users,
    isLoading,
    isFetching,
    isError,
    selectedIndex,
    setSelectedIndex,
    setSelectedUser
}: {
    users: Array<any>;
    isLoading: Boolean;
    isFetching: Boolean;
    isError: Boolean;
    selectedIndex: string;
    setSelectedIndex: Function;
    selectedUser: any;
    setSelectedUser: Function;
}) => {
    const [collapseTop, setCollapseTop] = React.useState<boolean>(false);
    const [collapseBottom, setCollapseBottom] = React.useState<boolean>(false);
    const handleListItemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, selected: string, user?: any) => {
        setSelectedUser(user);
        setSelectedIndex(selected);
    };

    return (
        <List size="sm" sx={{ '--List-item-radius': '8px' }}>
            {/* <ListItem nested sx={{ p: 0 }}>
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
            Browse
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
                variant={selectedIndex === 'inbox' ? 'soft' : 'plain'}
                color={selectedIndex === 'inbox' ? 'primary' : 'neutral'}
                selected={selectedIndex === 'inbox'}
                onClick={(event) => handleListItemClick(event, 'inbox')}
              >
                <ListItemDecorator sx={{ color: selectedIndex === 'inbox' ? 'inherit' : 'neutral.500' }}>
                  <InboxRoundedIcon fontSize="small" />
                </ListItemDecorator>
                <ListItemContent>Inbox</ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                variant={selectedIndex === 'sent' ? 'soft' : 'plain'}
                color={selectedIndex === 'sent' ? 'primary' : 'neutral'}
                selected={selectedIndex === 'sent'}
                onClick={(event) => handleListItemClick(event, 'sent')}
              >
                <ListItemDecorator sx={{ color: selectedIndex === 'sent' ? 'inherit' : 'neutral.500' }}>
                  <OutboxRoundedIcon fontSize="small" />
                </ListItemDecorator>
                <ListItemContent>Sent</ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                variant={selectedIndex === 'draft' ? 'soft' : 'plain'}
                color={selectedIndex === 'draft' ? 'primary' : 'neutral'}
                selected={selectedIndex === 'draft'}
                onClick={(event) => handleListItemClick(event, 'draft')}
              >
                <ListItemDecorator sx={{ color: selectedIndex === 'draft' ? 'inherit' : 'neutral.500' }}>
                  <DraftsRoundedIcon fontSize="small" />
                </ListItemDecorator>
                <ListItemContent>Draft</ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                variant={selectedIndex === 'flagged' ? 'soft' : 'plain'}
                color={selectedIndex === 'flagged' ? 'primary' : 'neutral'}
                selected={selectedIndex === 'flagged'}
                onClick={(event) => handleListItemClick(event, 'flagged')}
              >
                <ListItemDecorator sx={{ color: selectedIndex === 'flagged' ? 'inherit' : 'neutral.500' }}>
                  <AssistantPhotoRoundedIcon fontSize="small" />
                </ListItemDecorator>
                <ListItemContent>Flagged</ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                variant={selectedIndex === 'trash' ? 'soft' : 'plain'}
                color={selectedIndex === 'trash' ? 'primary' : 'neutral'}
                selected={selectedIndex === 'trash'}
                onClick={(event) => handleListItemClick(event, 'trash')}
              >
                <ListItemDecorator sx={{ color: selectedIndex === 'trash' ? 'inherit' : 'neutral.500' }}>
                  <DeleteRoundedIcon fontSize="small" />
                </ListItemDecorator>
                <ListItemContent>Trash</ListItemContent>
              </ListItemButton>
            </ListItem>
          </List>)
        }
      </ListItem> */}
            <ListItem nested>
                <Box
                    sx={{
                        mt: 2,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Typography
                        id="nav-list-tags"
                        textColor="neutral.500"
                        fontWeight={700}
                        sx={{
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '.1rem'
                        }}
                    >
                        Contacts
                    </Typography>
                    <IconButton size="sm" variant="plain" color="primary" sx={{ '--IconButton-size': '24px' }}>
                        {DropdownButton(collapseBottom, setCollapseBottom)}
                    </IconButton>
                </Box>
                {!collapseBottom &&
                    (isLoading || isFetching ? (
                        <GoogleLoader height={100} width={100} loop={true} />
                    ) : isError ? (
                        <Typography level="body3"></Typography>
                    ) : (
                        users && (
                            <List
                                aria-labelledby="nav-list-tags"
                                size="sm"
                                sx={{
                                    '--List-decorator-width': '32px',
                                    '& .JoyListItemButton-root': { p: '8px' }
                                }}
                            >
                                {users.map((user) => (
                                    <ListItem>
                                        <ListItemButton
                                            variant={selectedIndex === user.id ? 'soft' : 'plain'}
                                            color={selectedIndex === user.id ? 'primary' : 'neutral'}
                                            selected={selectedIndex === user.id}
                                            onClick={(event) => handleListItemClick(event, user.id, user)}
                                        >
                                            <ListItemDecorator>
                                                <Box
                                                    sx={{
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '99px',
                                                        bgcolor: user.color
                                                    }}
                                                />
                                            </ListItemDecorator>
                                            <ListItemContent>{user.name}</ListItemContent>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        )
                    ))}
            </ListItem>
        </List>
    );
};

export default EmailNav;
