import { Box, styled } from '@mui/material';

// loader style
export const FlowWrapper = styled(Box)(({ theme }) => ({
    '& .zoompanflow': {
        flexDirection: 'column',
        display: 'flex',
        flexGrow: 1,
        height: '100%'
    },
    '& .zoompanflow aside': {
        borderLeft: '1px',
        borderColor: theme.palette.divider,
        padding: '15px 10px',
        fontSize: '12px',
        background: theme.palette.background.paper
    },
    '& .react-flow': {
        minHeight: '100%',
        '& .react-flow__node': {
            minHeight: '40px',
            maxHeight: 'min-content',
            minWidth: '150px',
            maxWidth: 'min-content',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            borderWidth: '2px',
            fontWeight: theme.typography.fontWeightMedium
        }
    },

    '& .wrapper': {
        height: '100%'
    },
    '& .react-flow & .react-flow__edge path, & .react-flow__connectionline path': {
        strokeWidth: 2
    }
}));
