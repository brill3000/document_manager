import React from 'react';
import { ButtonBase, ButtonBaseProps } from '@mui/material';

interface CustomButtonProps extends ButtonBaseProps {
    children: React.ReactElement;
    mainColor?: string;
    hoverColor?: string;
}

export function CustomButton({ children, mainColor, hoverColor, ...rest }: CustomButtonProps) {
    return (
        <ButtonBase
            sx={{
                bgcolor: mainColor ?? 'primary.main',
                transition: '.3s all',
                transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                borderRadius: 1,
                '& :hover': {
                    bgcolor: hoverColor ?? 'primary.dark',
                    borderRadius: 1
                }
            }}
            {...rest}
        >
            {children}
        </ButtonBase>
    );
}
