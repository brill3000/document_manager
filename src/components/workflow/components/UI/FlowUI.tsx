import { Box, styled } from '@mui/material';
import { purple } from '@mui/material/colors';

// loader style
export const FlowWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    position: 'relative',
    '& .react-flow': {
        '& .react-flow__node': {
            minHeight: '40px',
            maxHeight: 'min-content',
            minWidth: '150px',
            maxWidth: 'min-content',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex'
        },
        '& .react-flow__edge path': {
            strokeWidth: 1
        },
        '& .react-flow__handle': {
            width: '10px',
            height: '10px',
            borderRadius: '100%',
            backgroundColor: purple[300]
        }
    }
}));
