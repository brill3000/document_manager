import { styled } from '@mui/material/styles';
import { Menu, MenuProps } from '@mui/material';
import React from 'react';
import { alpha } from '@mui/material/styles';
interface CustomMenuProps extends MenuProps {
    verticalPosition?: 'top' | 'bottom'
    horizontalPosition?: 'left' | 'right' | 'center'
    verticalOrigin?: 'top' | 'bottom'
    horizontalOrigin?: 'left' | 'right' | 'center'

}


export const StyledMenu = styled(({ verticalPosition, horizontalPosition, verticalOrigin, horizontalOrigin, ...rest }: CustomMenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: verticalPosition ?? 'bottom',
            horizontal: horizontalPosition ?? 'center',
        }}
        transformOrigin={{
            vertical: verticalOrigin ?? 'top',
            horizontal: horizontalOrigin ?? 'center',
        }}
        {...rest} />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        maxWidth: 200,
        oveflowY: 'auto',
        color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                ),
            },
        },
    },
}));
