import React from 'react';
import { Box, useTheme } from '@mui/material';

function FolderIcon({ size, selected }: { size: number; selected?: boolean }) {
    const resize = 3;
    const theme = useTheme();
    return (
        <Box
            width={size ? (selected ? size + resize : size) : 30}
            display="flex"
            alignItems="center"
            sx={{
                transition: '0.1s all',
                transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path
                    d="M5.5,9.4V8.5h1v0.9c0,0.1,0,0.2,0,0.2l0.4,1.6L6,11.9l-0.9-0.6l0.4-1.6C5.5,9.6,5.5,9.5,5.5,9.4z"
                    fill={selected ? '#231F20' : theme.palette.info.main}
                    style={{ transition: '0.1s all', transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)' }}
                />
                <path
                    d="M9.3,0H4C2.9,0,2,0.9,2,2v12c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V4.7c0-0.3-0.1-0.5-0.3-0.7L10,0.3
	C9.8,0.1,9.6,0,9.3,0z M10.1,3.9v-2l3,3h-2C10.6,4.9,10.1,4.4,10.1,3.9z M4.5,2.1L3.2,2.9L2.7,2L4,1.3L4.5,2.1z M3.6,3.3L5,2.8
	l0.4,0.9L3.9,4.3L3.6,3.3z M4.2,4.8l1.5-0.4l0.2,1L4.5,5.8L4.2,4.8z M6.3,7.1L4.8,7.3l-0.2-1l1.5-0.2L6.3,7.1z M8.6,1.3L9.9,2
	L9.4,2.9L8.1,2.1L8.6,1.3z M8.7,4.3L7.3,3.7l0.4-0.9L9,3.3L8.7,4.3z M8.2,5.8L6.7,5.4l0.2-1l1.5,0.4L8.2,5.8z M6.5,6.1L8,6.3l-0.2,1
	L6.3,7.1L6.5,6.1z M5.5,7.5h1c0.6,0,1,0.4,1,1v0.9L7.9,11c0.1,0.4-0.1,0.8-0.4,1.1l-0.9,0.6c-0.3,0.2-0.8,0.2-1.1,0l-0.9-0.6
	C4.2,11.9,4,11.4,4.1,11l0.4-1.6V8.5C4.5,7.9,4.9,7.5,5.5,7.5z"
                    fill={selected ? '#231F20' : theme.palette.info.main}
                    style={{ transition: '0.1s all', transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)' }}
                />
            </svg>
        </Box>
    );
}

export default FolderIcon;

// import { Box } from '@mui/material';
// import React from 'react';

// function UnzipIcon({ size, selected }: { size: number; selected?: boolean }) {
//     const resize = 3;
//     return (
//         <Box
//             width={size ? (selected ? size + resize : size) : 30}
//             display="flex"
//             alignItems="center"
//             sx={{
//                 transition: '0.1s all',
//                 transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
//             }}
//         >
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
//                 <path
//                     d="M5.5,9.4V8.5h1v0.9c0,0.1,0,0.2,0,0.2l0.4,1.6L6,11.9l-0.9-0.6l0.4-1.6C5.5,9.6,5.5,9.5,5.5,9.4z"
//                     fill={selected ? '#e4b831' : '#231F20'}
//                     style={{ transition: '0.1s all', transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)' }}
//                 />
//                 <path
//                     d="M9.3,0H4C2.9,0,2,0.9,2,2v12c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V4.7c0-0.3-0.1-0.5-0.3-0.7L10,0.3
// 	C9.8,0.1,9.6,0,9.3,0z M10.1,3.9v-2l3,3h-2C10.6,4.9,10.1,4.4,10.1,3.9z M4.5,2.1L3.2,2.9L2.7,2L4,1.3L4.5,2.1z M3.6,3.3L5,2.8
// 	l0.4,0.9L3.9,4.3L3.6,3.3z M4.2,4.8l1.5-0.4l0.2,1L4.5,5.8L4.2,4.8z M6.3,7.1L4.8,7.3l-0.2-1l1.5-0.2L6.3,7.1z M8.6,1.3L9.9,2
// 	L9.4,2.9L8.1,2.1L8.6,1.3z M8.7,4.3L7.3,3.7l0.4-0.9L9,3.3L8.7,4.3z M8.2,5.8L6.7,5.4l0.2-1l1.5,0.4L8.2,5.8z M6.5,6.1L8,6.3l-0.2,1
// 	L6.3,7.1L6.5,6.1z M5.5,7.5h1c0.6,0,1,0.4,1,1v0.9L7.9,11c0.1,0.4-0.1,0.8-0.4,1.1l-0.9,0.6c-0.3,0.2-0.8,0.2-1.1,0l-0.9-0.6
// 	C4.2,11.9,4,11.4,4.1,11l0.4-1.6V8.5C4.5,7.9,4.9,7.5,5.5,7.5z"
//                     fill="none"
//                     stroke={selected ? '#e4b831' : '#231F20'}
//                     strokeWidth={1}
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeMiterlimit={10}
//                     style={{ transition: '0.1s all', transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)' }}
//                 />
//             </svg>
//         </Box>
//     );
// }

// export default UnzipIcon;
