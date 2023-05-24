import * as React from 'react';
import { GlobalStyles } from '@mui/system';
import { CssVarsProvider } from '@mui/joy/styles';
import type { Theme } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';

// custom
import Layout from '../../global/UI/Layout';
import Navigation from './components/Navigation';
import WorkFlowsList from './components/WorkFlowsList';
import WorkflowContent from './components/WorkflowContent';
import { NavBar } from '../../global/UI/NavBar';
import { DropdownButton } from '../../global/UI/DropdownButton';
import Sheet from '@mui/joy/Sheet';
import { TiFlowChildren } from 'react-icons/ti';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
// import CustomTreeView from 'components/FolderStructure/Treeview';
import ViewFile from './components/ViewFile';
import ThemeCustomization from 'themes';
import { Experimental_CssVarsProvider } from '@mui/material';
import CreateFlow from './components/flow/CreateFlow';
import theme from '../../global/Themes/theme';

const Create: React.FC<any> = ({ setOpenView }: { setOpenView: (open: boolean) => void }) => {
    return (
        <>
            <IconButton variant="outlined" onClick={() => setOpenView(true)}>
                <CreateOutlinedIcon />
            </IconButton>
        </>
    );
};

export default function Workflow() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [collapseOthers, setCollapseOthers] = React.useState<boolean>(false);
    const [openView, setOpenView] = React.useState<boolean>(false);

    const title = 'Workflow';
    return (
        <CssVarsProvider disableTransitionOnChange theme={theme}>
            <Sheet variant="outlined" color="neutral" sx={{ borderRadius: 10, maxHeight: 650, overflowY: 'hidden' }}>
                <GlobalStyles<Theme>
                    styles={(theme) => ({
                        body: {
                            margin: 0
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
                        icon={<TiFlowChildren size={17} />}
                        actions={[<Create setOpenView={setOpenView} />]}
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
                                Assigned to me
                            </Typography>
                            <IconButton size="sm" variant="plain" color="primary" sx={{ '--IconButton-size': '24px' }}>
                                {DropdownButton(collapseOthers, setCollapseOthers)}
                            </IconButton>
                        </Box>
                        {!collapseOthers && <WorkFlowsList />}
                    </Layout.SidePane>
                    <Layout.Main sx={{ pb: 5 }}>
                        <WorkflowContent />
                    </Layout.Main>
                </Layout.Mail>
                <Experimental_CssVarsProvider>
                    <ThemeCustomization>
                        <ViewFile modalType="WORKFLOW" viewUrl={null} isFullScreen={true} openView={openView} setOpenView={setOpenView}>
                            <CreateFlow />
                        </ViewFile>
                    </ThemeCustomization>
                </Experimental_CssVarsProvider>
            </Sheet>
        </CssVarsProvider>
    );
}
