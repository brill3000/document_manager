import * as React from 'react';
// import { useViewStore } from 'components/documents/data/global_state/slices/view';
import Draggable from 'react-draggable';
import { Box, Grid, Stack, Theme, alpha, lighten, useMediaQuery, useTheme } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';
import { ViewFileSideBar } from './ViewFileSideBar';
import { MainContent } from './main';
import { isEmpty, isNull, isUndefined } from 'lodash';
import { useGetFilePropertiesQuery } from 'store/async/dms/files/filesApi';

export function FileViewerDialog({ filePath }: { filePath: string }) {
    // ================================= | STATE | ============================= //
    // const [disableDrag, setDiasableDrag] = React.useState<boolean>(false);
    const [selected, setSelected] = React.useState<string | null>(null);
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const handleClick = React.useCallback((nav: any): void => {
        setSelected(nav);
    }, []);
    // ================================= | THEME | ============================= //
    const theme = useTheme();
    const matchesXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    // ================================= | ZUSTAND | ============================= //
    // const { closeFile } = useViewStore();
    // ================================= | EVENTS | ============================= //

    // const handleClose = () => {
    //     closeFile(file);
    // };
    // const handleClickAway = () => {
    //     handleClose();
    // };
    // ================================= | RTK QUERY | ============================= //
    const { data: fileInfo } = useGetFilePropertiesQuery(
        { docId: !isNull(filePath) && !isUndefined(filePath) ? filePath : '' },
        {
            skip: isNull(filePath) || isUndefined(filePath) || isEmpty(filePath)
        }
    );
    return (
        <Draggable bounds="html">
            <Box
                bgcolor="background.paper"
                width={matchesXs ? '100vw' : '60vw'}
                height={matchesXs ? '100vh' : '80vh'}
                borderRadius={2}
                color={theme.palette.text.secondary}
                sx={{
                    transition: `width 0.3s, height 0.3s`,
                    transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                    position: 'fixed',
                    backdropFilter: 'blur(3px)', // This be the blur
                    top: 100,
                    left: '33%',
                    overflow: 'hidden',
                    borderColor: theme.palette.common.white,
                    borderWidth: 1.5,
                    borderStyle: 'solid',
                    boxShadow: `inset 0 0 4px ${alpha(theme.palette.common.black, 0.05)}, 0 0 20px ${alpha(
                        theme.palette.common.black,
                        0.11
                    )} `,
                    zIndex: zIndex.modal + (isHovered ? 2 : 1)
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Box width="100%" height="100%">
                    <Stack width="100%" height="100%">
                        <Grid container width="100%" height="100%">
                            <Grid
                                xs={3.5}
                                item
                                bgcolor={lighten(theme.palette.divider, 0.5)}
                                px={2}
                                py={3}
                                maxHeight="100%"
                                overflow="auto"
                            >
                                <ViewFileSideBar selected={selected} handleClick={handleClick} file={fileInfo} filePath={filePath} />
                            </Grid>
                            <Grid xs={8.5} item p={2}>
                                <MainContent filePath={filePath} />
                            </Grid>
                        </Grid>
                    </Stack>
                </Box>
            </Box>
        </Draggable>
    );
}
