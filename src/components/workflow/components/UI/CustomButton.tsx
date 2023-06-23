import { ButtonBase, ButtonBaseProps, styled } from '@mui/material';

export const CustomButton = styled(ButtonBase)<ButtonBaseProps>({
    transition: '.1s background',
    transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
    borderRadius: 5,
    '& :hover': {
        borderRadius: 5
    }
});
