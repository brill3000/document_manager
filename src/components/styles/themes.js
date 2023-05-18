import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#ffffff'
        },
        secondary: {
            light: '#ff6659',
            main: '#d32f2f',
            dark: '#9a0007',
            contrastText: '#ffffff'
        },
        info: {
            main: '#7e57c2',
            contrastText: '#ffffff'
        }
    },
    typography: {
        fontFamily: `"quicksand,"Roboto", "Helvetica", "Arial", sans-serif`,
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500
    }
});
