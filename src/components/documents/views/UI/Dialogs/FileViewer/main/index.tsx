import React from 'react';
import { Stack } from '@mui/material';
import { TopNav } from './navigation';
import { Content } from './content';

export function MainContent({ filePath }: { filePath: string }) {
    return (
        <Stack direction="column" height="100%" width="100%">
            <Stack
                direction="row"
                justifyContent="space-between"
                height="7%"
                position="relative"
                borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
                alignItems="center"
            >
                <TopNav filePath={filePath} />
            </Stack>
            <Stack height="93%" spacing={3}>
                <Content />
            </Stack>
        </Stack>
    );
}
