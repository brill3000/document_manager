import * as React from 'react';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import Draggable from 'react-draggable';
import { Box, ClickAwayListener, Grid, Stack, Theme, alpha, useMediaQuery, useTheme } from '@mui/material';
import { GenericDocument } from 'global/interfaces';
import zIndex from '@mui/material/styles/zIndex';
import { ViewFileSideBar } from './ViewFileSideBar';
import { MainContent } from './main';

export function FileViewerDialog({ file }: { file: GenericDocument }) {
    // ================================= | STATE | ============================= //
    const [disableDrag, setDiasableDrag] = React.useState<boolean>(false);
    const [selected, setSelected] = React.useState<string | null>(null);
    const handleClick = React.useCallback((nav: any): void => {
        setSelected(nav);
    }, []);
    // ================================= | THEME | ============================= //
    const theme = useTheme();
    const matchesXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    // ================================= | ZUSTAND | ============================= //
    const { closeFile } = useViewStore();
    // ================================= | EVENTS | ============================= //

    const handleClose = () => {
        closeFile(file);
    };
    const handleClickAway = () => {
        handleClose();
    };
    // ================================= | RTK QUERY | ============================= //
    return (
        <Draggable disabled={disableDrag} bounds="html">
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
                    zIndex: zIndex.modal + 1
                }}
            >
                <Box width="100%" height="100%">
                    <Stack width="100%" height="100%">
                        <Grid container width="100%" height="100%">
                            <ViewFileSideBar selected={selected} handleClick={handleClick} file={file} />
                            <Grid xs={8} item>
                                <MainContent />
                            </Grid>
                        </Grid>
                    </Stack>
                </Box>
            </Box>
        </Draggable>
    );
}
