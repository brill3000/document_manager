import { Box, useTheme } from '@mui/material';
import React from 'react';
import { UriHelper } from 'utils/constants/UriHelper';

function EmptyTrash({ size, selected }: { size: number; selected?: boolean }) {
    const resize = 3;
    const theme = useTheme();
    return (
        <Box
            width={size ? (selected ? size + resize : size) : 30}
            display="flex"
            alignItems="center"
            sx={{
                transition: `${UriHelper.TRANSITION} all`,
                transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path
                    d="M13.3,1.5L13.1,1c-0.2-0.5-0.7-0.7-1.2-0.5L9.1,1.6C9,1.2,8.4,0.9,8,1.1L6.3,1.7C5.9,1.9,5.7,2.4,5.9,2.8L3,3.9
                    C2.5,4,2.3,4.6,2.5,5l0.2,0.5L13.3,1.5z M12.7,6.2V5.6H3.3v0.6h0.2v7.7c0,1,0.8,1.7,1.8,1.7h5.4c1,0,1.8-0.8,1.8-1.7V6.2H12.7z
                     M5.7,7c0.2,0,0.5,0.2,0.5,0.4v6.1c0,0.2-0.2,0.4-0.5,0.4s-0.4-0.1-0.4-0.4V7.4C5.3,7.2,5.5,7,5.7,7z M8,7c0.2,0,0.5,0.2,0.5,0.4
                    v6.1c0,0.2-0.2,0.4-0.5,0.4c-0.2,0-0.5-0.2-0.5-0.4V7.4C7.5,7.2,7.7,7,8,7z M10.7,7.4v6.1c0,0.2-0.2,0.4-0.5,0.4
                    c-0.2,0-0.5-0.2-0.5-0.4V7.4C9.7,7.2,9.9,7,10.2,7C10.5,7,10.7,7.2,10.7,7.4z"
                    transform="translate(0 0)"
                    fill={selected ? theme.palette.error.dark : theme.palette.error.main}
                    style={{ transition: `${UriHelper.TRANSITION} all`, transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)' }}
                />
            </svg>
        </Box>
    );
}

export default EmptyTrash;
