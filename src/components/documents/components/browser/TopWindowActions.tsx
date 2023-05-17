import * as React from 'react';
import Box from '@mui/material/Box';
import { IoClose, IoExpand } from 'react-icons/io5';
import { IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';

export default function TopWindowActions() {
    const theme = useTheme();
    const md = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <div>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: 'max-content',
                    justifyContent: 'space-between',
                    border: (theme) => `.5px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    color: 'text.secondary',
                    p: 0.2,
                    maxHeight: '100%',
                    '& svg': {
                        m: 0
                    },
                    '& hr': {
                        mx: 0.5
                    }
                }}
            >
                {/**
                 * Destructive actions
                 *
                 */}
                <Tooltip title="Expand Window" arrow>
                    <IconButton
                        color="warning"
                        sx={{
                            maxHeight: '100%',
                            p: 0.5,
                            display: md ? 'none' : 'flex',
                            borderRadius: 1,
                            '&:hover': {
                                color: (theme) => theme.palette.warning.contrastText,
                                bgcolor: (theme) => theme.palette.warning.main
                            }
                        }}
                    >
                        <IoExpand size={17} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Close Window" arrow>
                    <IconButton
                        color="error"
                        sx={{
                            p: 0.5,
                            borderRadius: 1,
                            '&:hover': {
                                color: (theme) => theme.palette.error.contrastText,
                                bgcolor: (theme) => theme.palette.error.main
                            }
                        }}
                    >
                        <IoClose size={18} />
                    </IconButton>
                </Tooltip>
            </Box>
        </div>
    );
}
