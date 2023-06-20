import { Box, useTheme } from '@mui/material';
import React from 'react';
import { UriHelper } from 'utils/constants/UriHelper';

function EmptyFolder({ size, selected }: { size: number; selected?: boolean }) {
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.18 32">
                <path
                    d="M3.2,5.3l0.1,2.1c-0.6,0.9-0.9,2-0.8,3.1L4,27.2c0.2,2.5,2.3,4.3,4.7,4.3h14.7v-2.4H8.8c-1.2,0-2.3-0.9-2.4-2.2L4.9,10.3
                    C4.7,8.9,5.7,7.8,7,7.7c0.1,0,0.1,0,0.2,0h27.7c1.3,0,2.4,1.1,2.4,2.4c0,0.1,0,0.1,0,0.2l-0.6,6.9h2.4l0.6-6.7
                    c0.2-2.6-1.7-4.9-4.3-5.2c-0.1,0-0.3,0-0.4,0h-9.5c-1.3,0-2.5-0.5-3.4-1.4l-2-2C19.2,1,18,0.5,16.7,0.5H8C5.3,0.5,3.2,2.6,3.2,5.3
                    z M16.7,2.9c0.6,0,1.2,0.3,1.7,0.7l1.7,1.7H7.2c-0.6,0-1.1,0.1-1.6,0.3l0-0.3c0-1.3,1.1-2.3,2.4-2.3H16.7z"
                    transform="translate(0 0)"
                    fill={selected ? theme.palette.error.dark : theme.palette.error.main}
                    style={{ transition: `${UriHelper.TRANSITION} all`, transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)' }}
                />
                <path
                    d="M37.3,19.8l-0.2-0.4c-0.2-0.4-0.6-0.6-1-0.4l-2.3,0.9c-0.1-0.3-0.6-0.6-0.9-0.4L31.5,20c-0.3,0.2-0.5,0.6-0.3,0.9l-2.4,0.9
                    c-0.4,0.1-0.6,0.6-0.4,0.9l0.2,0.4L37.3,19.8z M36.8,23.7v-0.5h-7.8v0.5h0.2v6.4c0,0.8,0.7,1.4,1.5,1.4h4.5c0.8,0,1.5-0.7,1.5-1.4
                    v-6.4H36.8z M31.1,24.4c0.2,0,0.4,0.2,0.4,0.3v5.1c0,0.2-0.2,0.3-0.4,0.3s-0.3-0.1-0.3-0.3v-5.1C30.7,24.5,30.9,24.4,31.1,24.4z
                     M33,24.4c0.2,0,0.4,0.2,0.4,0.3v5.1c0,0.2-0.2,0.3-0.4,0.3c-0.2,0-0.4-0.2-0.4-0.3v-5.1C32.5,24.5,32.7,24.4,33,24.4z M35.2,24.7
                    v5.1c0,0.2-0.2,0.3-0.4,0.3c-0.2,0-0.4-0.2-0.4-0.3v-5.1c0-0.2,0.2-0.3,0.4-0.3C35,24.4,35.2,24.5,35.2,24.7z"
                    transform="translate(0 0)"
                    fill={selected ? theme.palette.error.dark : theme.palette.error.main}
                    style={{ transition: `${UriHelper.TRANSITION} all`, transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)' }}
                />
            </svg>
        </Box>
    );
}

export default EmptyFolder;
