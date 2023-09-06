import React from 'react';
import {
    Box,
    Divider,
    Experimental_CssVarsProvider,
    Grid,
    Stack,
    Theme,
    Typography,
    alpha,
    hexToRgb,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { CustomButton } from '../UI/CustomButton';
import { BsCheck, BsPlayFill, BsStopFill } from 'react-icons/bs';
import ThemeCustomization from 'themes';
import ViewFile from 'components/workflow/components/flow/ViewFile';
import CreateFlow from 'components/workflow/components/flow/CreateFlow';
import { TbSettingsAutomation } from 'react-icons/tb';
export function OuterSidebar() {
    const theme = useTheme();
    const [selected, setSelected] = React.useState<string | null>('Inbox');
    const handleClick = (nav: any): void => {
        setSelected(nav);
    };
    const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const [openView, setOpenView] = React.useState<boolean>(false);

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
            borderRight={(theme) => `1px solid ${theme.palette.divider}`}
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
                    <Stack direction="column">
                        <Typography variant="body1">
                            <b>Workflows</b>
                        </Typography>
                        <Typography fontSize={10} color="text.secondary">
                            Automated and scheduled tasks
                        </Typography>
                    </Stack>
                </Stack>
                <CustomButton
                    sx={{
                        bgcolor: theme.palette.primary.main,
                        '& :hover': {
                            bgcolor: theme.palette.primary.dark
                        }
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" py={1} px={2} width="100%">
                        <TbSettingsAutomation size={17} color={theme.palette.primary.contrastText} />
                        <Typography variant="body2" color={theme.palette.primary.contrastText}>
                            Create Workflow
                        </Typography>
                    </Stack>
                </CustomButton>
                <Divider variant="middle">
                    <Typography fontSize={10} color={theme.palette.text.secondary}>
                        States
                    </Typography>{' '}
                </Divider>
                {[
                    { nav: 'Inprogress', icon: <BsPlayFill size={17} color={theme.palette.warning.main} />, count: 0 },
                    { nav: 'Completed', icon: <BsCheck size={17} color={theme.palette.success.main} />, count: 1 },
                    { nav: 'Rejected', icon: <BsStopFill size={17} color={theme.palette.error.main} />, count: 0 }
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
                Workflows:{' '}
                <Box component="span" className="date">
                    {new Date().toDateString()}
                </Box>
            </Typography>
            <Experimental_CssVarsProvider>
                <ThemeCustomization>
                    <ViewFile modalType="WORKFLOW" viewUrl={null} isFullScreen={true} openView={openView} setOpenView={setOpenView}>
                        <CreateFlow />
                    </ViewFile>
                </ThemeCustomization>
            </Experimental_CssVarsProvider>
        </Grid>
    );
}
