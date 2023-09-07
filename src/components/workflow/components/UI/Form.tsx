import { Box, Card, CardContent, Typography } from '@mui/material';

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
        <Card
            sx={{
                minWidth: width ? width : '260px',
                maxWidth: width ? width : 'max-content',
                gap: 2,
                bgcolor: 'background.paper'
            }}
        >
            <CardContent>
                <Typography color="success" mb={0.5}>
                    {title ?? ''}
                </Typography>
                <Typography variant="body2">{description ?? ''}</Typography>
            </CardContent>
            <Box
                color="primary"
                sx={{
                    px: 0.2,
                    writingMode: 'vertical-rl',
                    textAlign: 'center',
                    fontSize: 'xs2',
                    fontWeight: 'xl2',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                }}
            >
                {type ?? ''}
            </Box>
        </Card>
    );
}
