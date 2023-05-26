import { styled } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import React from 'react';

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} disableInteractive />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        // backgroundColor: theme.palette.secondary.light,
        // color: theme.palette.getContrastText(theme.palette.secondary.light),
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: `1px solid ${theme.palette.divider}`
        // display: 'none'
    },
    [`& .${tooltipClasses.arrow}`]: {
        '&:before ': {
            // backgroundColor: theme.palette.secondary.light,
        }
    }
}));
