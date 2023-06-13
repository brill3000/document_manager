import { Box } from '@mui/material';
import React from 'react';

function FolderOpenIcon({ size }: { size: number }) {
    return (
        <Box width={size ?? 30}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.18 32">
                <path
                    d="M34,4H18L14,0H4A4,4,0,0,0,0,4V28a4,4,0,0,0,4,4H35a3,3,0,0,0,3-3V8A4,4,0,0,0,34,4Z"
                    transform="translate(0 0)"
                    fill="#ffa000"
                />
                <path
                    d="M38.2,10H11.3a4,4,0,0,0-3.9,3.3L4,32H35.7a4,4,0,0,0,3.9-3.3l2.5-14A4,4,0,0,0,38.2,10Z"
                    transform="translate(0 0)"
                    fill="#ffca28"
                />
            </svg>
        </Box>
    );
}

export default FolderOpenIcon;
