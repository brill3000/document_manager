import { Box } from '@mui/material';
import React from 'react';

function FolderIcon({ size }: { size: number }) {
    return (
        <Box width={size ?? 30}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 83.34 66.66">
                <path
                    d="M75,8.33H37.5L29.17,0H8.34A8.36,8.36,0,0,0,0,8.33V25H83.34V16.66A8.36,8.36,0,0,0,75,8.33Z"
                    transform="translate(0 0)"
                    fill="#ffa000"
                />
                <path
                    d="M75,8.33H8.34A8.36,8.36,0,0,0,0,16.66V58.33a8.36,8.36,0,0,0,8.34,8.33H75a8.36,8.36,0,0,0,8.34-8.33V16.66A8.36,8.36,0,0,0,75,8.33Z"
                    transform="translate(0 0)"
                    fill="#ffca28"
                />
            </svg>
        </Box>
    );
}

export default FolderIcon;
