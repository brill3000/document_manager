import { createTheme } from '@mui/material';
import { brown } from '@mui/material/colors';

export const theme = createTheme({
    typography: {
        fontFamily: 'quicksand,  sans-serif'
    },
    palette: {
        secondary: brown
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 400,
            md: 900,
            lg: 1200,
            xl: 1440
        }
    }
});
