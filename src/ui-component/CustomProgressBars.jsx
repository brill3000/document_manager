import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { Typography } from '@mui/material';
export const BorderLinearProgress = (props)  => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <StyledLinearProgress variant="determinate" {...props} />
      </Box>
      <Box>
        <Typography variant="body2">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export const StyledLinearProgress = styled(LinearProgress, { shouldForwardProp: (prop) => prop !== 'progressHeight' && prop !== 'progressBorderRadius'})(({ theme, progressHeight,progressBorderRadius }) => ({
  height: progressHeight,
  borderRadius: progressBorderRadius,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: progressBorderRadius,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

// Inspired by the former Facebook spinners.
export function FacebookCircularProgress(props) {
  return (
    <Box sx={{ position: 'relative' }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        }}
        size={20}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) => (theme.palette.mode === 'light' ? '#fffff' : '#308fe8'),
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={20}
        thickness={4}
        {...props}
      />
    </Box>
  );
}