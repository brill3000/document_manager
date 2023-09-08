import { Box, Typography, alpha } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

export function FormsCard({
    title,
    type,
    description,
    width
}: {
    title: string;
    type: string;
    description?: string;
    height?: number | string;
    width?: number | string;
}) {
    return (
        <Grid2
            container
            sx={{
                minWidth: width ? width : '200px',
                maxWidth: width ? width : 'max-content',
                gap: 2,
                border: 0.5,
                p: 0.5,
                borderColor: (theme) => theme.palette.divider,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: (theme) =>
                    `inset 0 0 4px ${alpha(theme.palette.common.black, 0.09)}, 0 0 10px ${alpha(theme.palette.common.black, 0.03)} `
            }}
        >
            <Grid2 xs={9}>
                <Typography color="success" mb={0.5}>
                    {title ?? ''}
                </Typography>
                <Typography variant="body2">{description ?? ''}</Typography>
            </Grid2>
            <Grid2
                xs={3}
                color="primary"
                sx={{
                    px: 0.2,
                    writingMode: 'vertical-rl',
                    textAlign: 'center',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                }}
            >
                {type ?? ''}
            </Grid2>
        </Grid2>
    );
}
