import { Box, styled } from '@mui/material';

// loader style
export const FlowWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',

    '& .react-flow': {
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
        },
        '& .react-flow__edge path': {
            strokeWidth: 2
        }
    }
}));
