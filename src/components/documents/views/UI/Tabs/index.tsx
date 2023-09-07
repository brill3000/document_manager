import { Box, Tab, Tabs, styled } from '@mui/material';

interface StyledTabsProps {
    children?: React.ReactNode;
    value: number;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const StyledTabs = styled((props: StyledTabsProps) => (
    <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))(({ theme }) => ({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: theme.palette.info.light,
        borderRadius: 10
    }
}));

interface StyledTabProps {
    label: string;
}

export const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(13),
    marginRight: theme.spacing(1),
    color: 'rgba(255, 255, 255, 0.95)',
    '&.Mui-selected': {
        color: theme.palette.info.light,
        fontWeight: 600
    },
    '&.Mui-focusVisible': {
        backgroundColor: 'rgba(100, 95, 228, 0.32)'
    }
}));

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            width="100%"
            height="100%"
            hidden={value !== index}
            id={`search-tabpanel-${index}`}
            aria-labelledby={`search-tab-${index}`}
            {...other}
        >
            {value === index && <>{children}</>}
        </Box>
    );
}

export function a11yProps(index: number) {
    return {
        id: `search-tab-${index}`,
        'aria-controls': `search-tabpanel-${index}`
    };
}
