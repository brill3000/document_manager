import { Box, styled } from '@mui/material';
import { GridItemProps, GridListProps } from 'react-virtuoso';

export const GridVirtuosoContainer = styled(Box)<GridListProps>(({}) => ({
    display: 'flex',
    flexWrap: 'wrap'
}));

export const GridVirtuosoItem = styled(Box)<GridItemProps>(({ theme }) => ({
    display: 'flex',
    flex: 'none',
    alignContent: 'stretch',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
        width: '50%'
    },
    [theme.breakpoints.up('md')]: {
        width: '33%'
    }
}));

export const GridVirtuosoItemWrapper = styled(Box)<GridItemProps & { height?: number }>(({ height }) => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    p: 0,
    display: 'flex',
    minHeight: height ?? '33%'
}));
