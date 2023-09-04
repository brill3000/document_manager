import { Typography, TypographyProps, styled } from '@mui/material';

export const GrowingTypography = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'maxRows'
})<TypographyProps & { maxRows?: number }>(({ maxRows }) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: maxRows ?? '3',
    WebkitBoxOrient: 'vertical'
}));
