import React from 'react';
import { Avatar, Box, Divider, Grid, Stack, Theme, Typography, alpha, hexToRgb, useMediaQuery, useTheme } from '@mui/material';
import { MdEmail, MdOutbox, MdOutgoingMail } from 'react-icons/md';
import { CustomButton } from 'components/workflow/components/UI/CustomButton';

export function OuterSidebar() {
    const theme = useTheme();
    const [selected, setSelected] = React.useState<string | null>('Inbox');
    const handleClick = (nav: any): void => {
        setSelected(nav);
    };
    const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    return (
        <Grid
            item
            md={2.5}
            xs={0}
            height="100%"
            width="100%"
            flexDirection="column"
            position="relative"
            bgcolor={(theme) => alpha(theme.palette.secondary.dark, 0.03)}
            justifyContent="start"
            alignItems="start"
            py={2}
            px={2.5}
            sx={{
                display: matchDownMD ? 'none' : 'flex',
                backdropFilter: 'blur(5px)'
            }}
        >
            <Stack direction="column" spacing={1.5} width="100%">
                <Stack direction="row" mb={2} spacing={1} alignItems="center">
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ bgcolor: theme.palette.primary.main }} />
                    <Stack direction="column">
                        <Typography variant="body2">Remy Sharp</Typography>
                        <Typography fontSize={10} color="text.secondary">
                            remysharp@gmail.com
                        </Typography>
                    </Stack>
                </Stack>
                <CustomButton
                    sx={{
                        borderRadius: 1,
                        bgcolor: theme.palette.primary.main,
                        '& :hover': {
                            bgcolor: theme.palette.primary.dark
                        }
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" py={1} px={2} width="100%">
                        <MdEmail size={17} color={theme.palette.primary.contrastText} />
                        <Typography variant="body2" color={theme.palette.primary.contrastText}>
                            New Message
                        </Typography>
                    </Stack>
                </CustomButton>
                <Divider variant="middle">
                    <Typography fontSize={10} color={theme.palette.text.secondary}>
                        States
                    </Typography>{' '}
                </Divider>
                {[
                    { nav: 'Inbox', icon: <MdEmail size={17} color={theme.palette.text.primary} />, count: 0 },
                    { nav: 'Sent mails', icon: <MdOutgoingMail size={17} color={theme.palette.text.primary} />, count: 0 },
                    { nav: 'All mails', icon: <MdOutbox size={17} color={theme.palette.text.primary} />, count: 0 }
                ].map((navItem) => (
                    <CustomButton
                        key={navItem.nav}
                        sx={{
                            bgcolor: navItem.nav === selected ? 'white' : alpha(hexToRgb('#ffffff'), 0.2),
                            '& :hover': {
                                bgcolor: 'white'
                            }
                        }}
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
