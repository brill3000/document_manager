import React, { memo } from 'react';
import Typography from '@mui/joy/Typography';
import { Box, Stack } from '@mui/material';
import { Handle, Position } from 'react-flow-renderer';
import { FormsCard } from './CreateFlow';

export default memo(({ data }) => {
    return (
        <>
            <Stack direction="column" spacing={1} sx={{ bgcolor: 'white', borderRadius: 3, p: 1 }}>
                <Box maxWidth={250}>
                    <Typography
                        level="h5"
                        sx={{
                            wordBreak: 'break-word'
                        }}
                        textColor="neutral.500"
                    >
                        {data.title}
                    </Typography>
                </Box>
                <FormsCard title={data.type} description={data.action} type={data.type} />
            </Stack>
            <Handle type={'target'} id={'input'} position={Position.Top} />
            <Handle type={'target'} id={'output'} position={Position.Bottom} />
        </>
    );
});
