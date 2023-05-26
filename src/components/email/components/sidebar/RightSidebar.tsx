import React from 'react';
import { Avatar, Box, Grid, Stack, Typography, alpha, hexToRgb, useTheme } from '@mui/material';
import { CustomButton } from '../UI/CustomButton';
import { MdEmail, MdOutbox, MdOutgoingMail } from 'react-icons/md';

export function RightSidebar() {
    const theme = useTheme();
    const [selected, setSelected] = React.useState<string | null>('Inbox');
    const handleClick = (nav: any): void => {
        setSelected(nav);
    };

    return (
        <Grid
            item
            xs={2.5}
            height="100%"
            width="100%"
            flexDirection="column"
            position="relative"
            bgcolor={(theme) => alpha(theme.palette.secondary.dark, 0.04)}
            justifyContent="start"
            alignItems="start"
            py={2}
            px={3}
            sx={{
                backdropFilter: 'blur(5px)'
            }}
        >
            <Stack direction="column" spacing={1}>
                <Stack direction="row" mb={2} spacing={1} alignItems="center">
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ bgcolor: theme.palette.primary.main }} />
                    <Stack direction="column">
                        <Typography variant="body2">Remy Sharp</Typography>
                        <Typography fontSize={10} color="text.secondary">
                            remysharp@gmail.com
                        </Typography>
                    </Stack>
                </Stack>
                <CustomButton mainColor="primary.main" hoverColor="primary.dark">
                    <Stack direction="row" spacing={1} alignItems="center" py={1} px={2} width="100%">
                        <MdEmail size={17} color={theme.palette.primary.contrastText} />
                        <Typography variant="body2" color={theme.palette.primary.contrastText}>
                            New Message
                        </Typography>
                    </Stack>
                </CustomButton>
                {[
                    { nav: 'Inbox', icon: <MdEmail size={17} color={theme.palette.text.primary} />, count: 0 },
                    { nav: 'Sent mails', icon: <MdOutgoingMail size={17} color={theme.palette.text.primary} />, count: 0 },
                    { nav: 'All mails', icon: <MdOutbox size={17} color={theme.palette.text.primary} />, count: 0 }
                ].map((navItem) => (
                    <CustomButton
                        key={navItem.nav}
                        mainColor={navItem.nav === selected ? 'white' : alpha(hexToRgb('#ffffff'), 0.2)}
                        hoverColor="white"
                        onClick={() => handleClick(navItem.nav)}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" py={1} px={2} width="100%">
                            {navItem.icon}
                            <Typography
                                variant="body2"
                                color={theme.palette.text.primary}
                                maxWidth="70%"
                                minWidth="70%"
                                textAlign="start"
                                noWrap
                            >
                                {navItem.nav}
                            </Typography>
                            <Typography variant="body2" color={theme.palette.text.primary}>
                                {navItem.count}
                            </Typography>
                        </Stack>
                    </CustomButton>
                ))}
            </Stack>
            <Typography
                fontSize={10}
                color="text.secondary"
                position="absolute"
                bottom={10}
                sx={{
                    '& .date': {
                        color: 'primary.dark'
                    }
                }}
            >
                Emails:{' '}
                <Box component="span" className="date">
                    {new Date().toDateString()}
                </Box>
            </Typography>
        </Grid>
    );
}
