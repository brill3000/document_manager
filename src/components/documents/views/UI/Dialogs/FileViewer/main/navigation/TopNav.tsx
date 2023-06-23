import React from 'react';
import { IconButton, Stack, Typography, useTheme } from '@mui/material';
import { BsArrowLeftShort, BsEnvelopePlus, BsTrashFill, BsWindowSplit } from 'react-icons/bs';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { GenericDocument } from 'global/interfaces';
import { IoClose } from 'react-icons/io5';

export function TopNav({ file }: { file: GenericDocument }) {
    const theme = useTheme();
    // =========================== | ZUSTAND | ========================== //
    const { closeFile } = useViewStore();

    return (
        <>
            <IconButton sx={{ justifySelf: 'start' }} size="small">
                <BsArrowLeftShort size={25} />
            </IconButton>
            <Stack direction="row" justifySelf="center" alignItems="center" spacing={1}>
                <IconButton size="small">
                    <BiChevronLeft size={16} />
                </IconButton>
                <Typography variant="caption">1/25</Typography>
                <IconButton size="small">
                    <BiChevronRight size={16} />
                </IconButton>
            </Stack>
            <Stack direction="row" justifySelf="end">
                <IconButton size="small">
                    <BsWindowSplit size={14} />
                </IconButton>
                <IconButton size="small" onClick={() => closeFile(file)}>
                    <IoClose size={15} color={theme.palette.error.main} />
                </IconButton>
            </Stack>
        </>
    );
}
