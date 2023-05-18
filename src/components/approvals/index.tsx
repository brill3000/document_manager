import * as React from 'react';
import { GlobalStyles } from '@mui/system';
import { CssVarsProvider } from '@mui/joy/styles';
import type { Theme } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';

// custom
import emailTheme from '../../global/Themes/theme';
import Layout from '../../global/UI/Layout';
import Navigation from './components/Navigation';
import ApprovalsList from './components/ApprovalsList';
import RolesContent from './components/RolesContent';
import { NavBar } from '../../global/UI/NavBar';
import { DropdownButton } from '../../global/UI/DropdownButton';
import Sheet from '@mui/joy/Sheet';
import ApprovalOutlinedIcon from '@mui/icons-material/ApprovalOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';

const Create: React.FC<any> = () => {
    return (
        <>
            <IconButton variant="outlined">
                <CreateOutlinedIcon />
            </IconButton>
        </>
    );
};

export default function Roles() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [collapseUnread, setCollapseUnread] = React.useState<boolean>(false);
    const [collapseOthers, setCollapseOthers] = React.useState<boolean>(false);

    const title: string = 'Approvals';
    return (
        <CssVarsProvider disableTransitionOnChange theme={emailTheme}>
            <Sheet variant="outlined" color="neutral" sx={{ borderRadius: 10, maxHeight: 650, overflowY: 'hidden' }}>
                <GlobalStyles<Theme>
                    styles={(theme) => ({
                        body: {
                            margin: 0,
                            fontFamily: theme.vars.fontFamily.body
                        }
                    })}
                />
                {drawerOpen && (
                    <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
                        <Navigation />
                    </Layout.SideDrawer>
                )}
                <Layout.Mail
                    sx={{
                        ...(drawerOpen && {
                            height: '100vh',
                            overflow: 'hidden'
                        })
                    }}
                >
                    <NavBar
                        setDrawerOpen={setDrawerOpen}
                        title={title}
                        icon={<ApprovalOutlinedIcon sx={{ fontSize: '16px' }} />}
                        actions={[<Create />]}
                    />
                    <Layout.SideNav>
                        <Navigation />
                    </Layout.SideNav>
                    <Layout.SidePane sx={{ maxHeight: 600, overflowY: 'auto', pb: 10 }}>
                        <Box
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography
                                textColor="neutral.500"
                                fontWeight={700}
                                sx={{
                                    fontSize: '10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '.1rem'
                                }}
                            >
                                Pending Approvals
                            </Typography>
                            <IconButton size="sm" variant="plain" color="primary" sx={{ '--IconButton-size': '24px' }}>
                                {DropdownButton(collapseOthers, setCollapseOthers)}
                            </IconButton>
                        </Box>
                        {!collapseOthers && <ApprovalsList />}
                    </Layout.SidePane>
                    <Layout.Main sx={{ pb: 5 }}>
                        <RolesContent />
                    </Layout.Main>
                </Layout.Mail>
            </Sheet>
        </CssVarsProvider>
    );
}
