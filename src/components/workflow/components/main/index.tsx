import React from 'react';
import { Grid, Stack } from '@mui/material';
import { TopNav } from './navigation';
import { Content } from './content';

export function MainContent({ selected }: { selected: number | null }) {
    const ref = React.useRef<HTMLInputElement | null>(null);
    return (
        <Grid
            item
            xs={9}
            md={6}
            height="100%"
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="start"
            alignItems="start"
            px={3}
            py={2}
            ref={ref}
        >
            <Stack direction="column" height="100%" width="100%">
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    height="7%"
                    position="relative"
                    borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
                    alignItems="center"
                >
                    <TopNav />
                </Stack>
                <Stack
                    height={ref.current !== null ? ref.current.clientWidth * 0.93 : '93%'}
                    spacing={3}
                    minWidth={ref.current?.clientWidth ?? '90%'}
                    maxWidth={ref.current?.clientWidth ?? '100%'}
                    bgcolor="background.paper"
                >
                    <Content selected={selected} />
                </Stack>
            </Stack>
        </Grid>
    );
}
