import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { Typography, useTheme } from '@mui/material';
export const BorderLinearProgress = (props) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <StyledLinearProgress variant="determinate" {...props} />
            </Box>
            <Box>
                <Typography variant="body2">{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
};

export const StyledLinearProgress = styled(LinearProgress, {
    shouldForwardProp: (prop) => prop !== 'progressHeight' && prop !== 'progressBorderRadius'
})(({ theme, progressHeight, progressBorderRadius }) => ({
    height: progressHeight,
    borderRadius: progressBorderRadius,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: progressBorderRadius,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
    }
}));

// Inspired by the former Facebook spinners.
export function FacebookCircularProgress(props) {
    const theme = useTheme();
    return (
        <Box sx={{ position: 'relative' }}>
            <CircularProgress
                variant="determinate"
                sx={{
                    color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
                }}
                size={35}
                thickness={5}
                {...props}
                value={props.value}
            />
            <CircularProgress
                variant="determinate"
                disableShrink
                sx={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#fffff' : '#308fe8'),
                    animationDuration: '550ms',
                    position: 'absolute',
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round'
                    }
                }}
                size={35}
                thickness={5}
                {...props}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    fontSize={9}
                    fontWeight={800}
                    color={theme.palette.primary.dark}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

export function CircularProgressWithLabel(props) {
    const theme = useTheme();
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                color={!isNaN(props.value) ? (props.value < 50 ? 'info' : 'success') : 'success'}
                size={35}
                thickness={4}
                variant="determinate"
                {...props}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography variant="caption" component="div" fontSize={10} color={theme.palette.text.primary}>{`${Math.round(
                    props.value
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

export default function CircularStatic() {
    const [progress, setProgress] = React.useState(10);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return <CircularProgressWithLabel value={progress} />;
}
