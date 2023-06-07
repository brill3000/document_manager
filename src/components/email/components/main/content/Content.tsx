import React from 'react';
import { Avatar, IconButton, List, ListItem, ListItemAvatar, Stack, Typography, useTheme } from '@mui/material';
import Dot from 'components/@extended/Dot';
import { FileIconProps, fileIcon } from 'components/documents/Icons/fileIcon';
import ListItemContent from '@mui/joy/ListItemContent/ListItemContent';

export function Content() {
    const theme = useTheme();
    const memorizedFileIcon = React.useCallback((args: FileIconProps) => fileIcon({ ...args }), []);
    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                height="10%"
                position="relative"
                borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
                alignItems="center"
            >
                <Stack direction="row" justifySelf="center" alignItems="center" spacing={2}>
                    <IconButton sx={{ justifySelf: 'start' }} size="small">
                        <Avatar alt="Brilliant Kaboi" src="/static/images/avatar/1.jpg" sx={{ bgcolor: theme.palette.primary.main }} />
                    </IconButton>
                    <Stack direction="column">
                        <Typography variant="body1">
                            <b>Brilliant Kaboi</b>
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography fontSize={11} fontWeight={500} color="text.secondary">
                                From: <b>brilliant.kaboi@icloud.com</b>
                            </Typography>
                            <Dot size={4} color={theme.palette.secondary.main} />
                            <Typography fontSize={11} fontWeight={500} color="text.secondary">
                                To: <b>Me</b>
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <Stack direction="column" spacing={1} borderBottom={(theme) => `1px solid ${theme.palette.divider}`} pb={1}>
                <Typography variant="h4">Brunch this weekend</Typography>
                <Typography variant="body2">Hello Remy,</Typography> <br />
                <Typography variant="body2">
                    I'll be in your neighborhood doing errands this errand, I would like you to house sit <br /> <br />
                    Regars, <br />
                    Brilliant Kaboi
                </Typography>
            </Stack>
            <Stack direction="column" spacing={1} borderBottom={(theme) => `1px solid ${theme.palette.divider}`} pb={1}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body1">
                        <b>ATTACHMENTS</b>
                    </Typography>
                    <Typography variant="body1" color="primary">
                        Download All
                    </Typography>{' '}
                    <br />
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <ListItem alignItems="flex-start" sx={{ flexDirection: 'row' }}>
                            <ListItemAvatar>
                                {memorizedFileIcon({ mimeType: 'application/pdf', size: 30, file_icon_margin: 0 })}
                            </ListItemAvatar>
                            <ListItemContent>
                                <Stack direction="column">
                                    <Typography variant="body2" fontWeight={800} color="text.primary">
                                        Inquiry.pdf
                                    </Typography>
                                    <Typography variant="body2" color="text.primary">
                                        3.5 MB
                                    </Typography>
                                </Stack>
                            </ListItemContent>
                        </ListItem>
                    </List>
                </Stack>
            </Stack>
        </>
    );
}
