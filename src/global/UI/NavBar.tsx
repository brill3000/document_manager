import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import TextField from '@mui/joy/TextField';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import MenuIcon from '@mui/icons-material/Menu';

// custom
import Layout from './Layout';
import { Location, useLocation, useNavigate } from 'react-router-dom';

interface NavBarProps {
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    icon: React.ReactComponentElement<any>;
    actions?: React.ReactComponentElement<any>[];
}

export const NavBar: React.FC<NavBarProps> = ({ setDrawerOpen, title, icon, actions }) => {
    const navigate = useNavigate();
    const location: Location = useLocation();
    const path: string = location.pathname;

    return (
        <Layout.Header>
            <>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1.5
                    }}
                >
                    <IconButton variant="outlined" size="sm" onClick={() => setDrawerOpen(true)} sx={{ display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <IconButton size="sm" variant="soft" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                        {icon}
                    </IconButton>
                    <Typography component="h1" fontWeight="xl">
                        {title}
                    </Typography>
                </Box>
                <TextField
                    size="sm"
                    placeholder="Search anything…"
                    startDecorator={<SearchRoundedIcon color="primary" />}
                    endDecorator={
                        <IconButton variant="outlined" size="sm" color="neutral">
                            <Typography fontWeight="lg" fontSize="sm" textColor="text.tertiary">
                                /
                            </Typography>
                        </IconButton>
                    }
                    sx={{
                        flexBasis: '500px',
                        display: {
                            xs: 'none',
                            sm: 'flex'
                        }
                    }}
                />
                {actions && actions.map((action) => action)}
            </>
        </Layout.Header>
    );
};
