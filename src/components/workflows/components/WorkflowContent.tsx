import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Slider from '@mui/joy/Slider';

import ListDivider from '@mui/joy/ListDivider';
import Avatar from '@mui/joy/Avatar';
import ListItem from '@mui/joy/ListItem';
import List from '@mui/joy/List';
import AvatarGroup from '@mui/joy/AvatarGroup';
import { Grid, LinearProgress, Link, Stack } from '@mui/material';
import ListItemDecorator from '@mui/joy/ListItemDecorator';

import { HiOutlineDocumentText } from 'react-icons/hi';
import OverviewFlow from './flow/Flow';

export function LinearDeterminate({ percentage }: { percentage: number }) {
    const [progress, setProgress] = React.useState(percentage ?? 0);

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgress variant="determinate" value={progress} />
        </Box>
    );
}

export default function EmailContent() {
    return (
        <Sheet
            variant="outlined"
            sx={{
                height: 550,
                minWidth: 570,
                maxWidth: '100%',
                borderRadius: 'sm',
                p: 2,
                mb: 3,
                bgcolor: 'background.componentBg'
            }}
        >
            <OverviewFlow />
        </Sheet>
    );
}
