import { Box } from '@mui/material';
import React from 'react';

function FolderOpenIcon({ size, selected }: { size: number; selected?: boolean }) {
    const resize = 3;
    return (
        <Box
            width={size ? (selected ? size + resize : size) : 30}
            display="flex"
            alignItems="center"
            sx={{
                transition: '0.2s all',
                transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.18 32">
                <path
                    d="M34,4H18L14,0H4A4,4,0,0,0,0,4V28a4,4,0,0,0,4,4H35a3,3,0,0,0,3-3V8A4,4,0,0,0,34,4Z"
                    transform="translate(0 0)"
                    fill={selected ? '#f89e02' : '#ffa000'}
                    style={{ transition: '0.1s all', transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)' }}
                />
                <path
                    d="M38.2,10H11.3a4,4,0,0,0-3.9,3.3L4,32H35.7a4,4,0,0,0,3.9-3.3l2.5-14A4,4,0,0,0,38.2,10Z"
                    transform="translate(0 0)"
                    fill={selected ? '#e4b831' : '#ffca28'}
                    style={{ transition: '0.1s all', transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)' }}
                />
            </svg>
        </Box>
    );
}

export default FolderOpenIcon;
