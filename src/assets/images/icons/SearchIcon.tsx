import { Box, useTheme } from '@mui/material';
import { isNull, isUndefined } from 'lodash';
import React from 'react';
import { UriHelper } from 'utils/constants/UriHelper';

function SearchIcon({ size, stroke, color }: { size: number; stroke?: number; color: string }) {
    const theme = useTheme();
    return (
        <Box
            width={!isUndefined(size) && !isNull(size) ? size : 30}
            display="flex"
            alignItems="center"
            sx={{
                transition: `${UriHelper.TRANSITION} all`,
                transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                    d="M15,15 L22,22 L15,15 Z M9.5,17 C13.6421356,17 17,13.6421356 17,9.5 C17,5.35786438 13.6421356,2 9.5,2 C5.35786438,2 2,5.35786438 2,9.5 C2,13.6421356 5.35786438,17 9.5,17 Z"
                    fill="none"
                    stroke={color ?? theme.palette.common.black}
                    strokeWidth={stroke ?? 2}
                    style={{ transition: `${UriHelper.TRANSITION} all`, transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)' }}
                />
            </svg>
        </Box>
    );
}
export default SearchIcon;
