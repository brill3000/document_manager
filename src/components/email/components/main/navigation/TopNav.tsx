import React from 'react';
import { IconButton, Stack, Typography, useTheme } from '@mui/material';
import { BsArrowLeftShort, BsEnvelopePlus, BsTrashFill } from 'react-icons/bs';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

export function TopNav() {
    const theme = useTheme();
    return (
        <>
            <IconButton sx={{ justifySelf: 'start' }} size="small">
                <BsArrowLeftShort size={25} />
            </IconButton>
            <Stack direction="row" justifySelf="center" alignItems="center" spacing={1}>
                <IconButton size="small">
                    <BiChevronLeft size={16} />
                </IconButton>
                <Typography variant="caption">1/1</Typography>
                <IconButton size="small">
                    <BiChevronRight size={16} />
                </IconButton>
            </Stack>
            <Stack direction="row" justifySelf="end">
                <IconButton size="small">
                    <BsEnvelopePlus size={15} />
                </IconButton>
                <IconButton size="small">
                    <BsTrashFill size={15} color={theme.palette.error.main} />
                </IconButton>
            </Stack>
        </>
    );
}
