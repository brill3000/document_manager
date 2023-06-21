import * as React from 'react';
import Draggable from 'react-draggable';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { Box, alpha, useTheme, InputBase, Stack, InputAdornment, ButtonBase, ClickAwayListener } from '@mui/material';
import { useHandleChangeRoute } from 'utils/hooks';
import { isNull, isUndefined, last } from 'lodash';
import { MemorizedSearchIcon } from 'components/documents/Icons/fileIcon';
import zIndex from '@mui/material/styles/zIndex';

export function SearchDialog() {
    // ========================= | STATES | =========================== //
    const [disableDrag, setDisableDrag] = React.useState<boolean>(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [value, setValue] = React.useState<string>('');
    // ========================= | THEME | =========================== //
    const theme = useTheme();
    // ========================= | HOOKS | =========================== //
    const { currentFolder } = useHandleChangeRoute();
    // ========================= | ZUSTAND | =========================== //

    const { searchDialogIsOpen, actions } = useBrowserStore();

    // ========================= | EVENTS | =========================== //
    const handleClickAway = () => {
        actions.closeSearchDialog();
    };
    return (
        <Draggable disabled={disableDrag} bounds="html">
            <Box
                bgcolor={alpha(theme.palette.common.black, 0.45)}
                width={searchDialogIsOpen ? '30vw' : 0}
                height={searchDialogIsOpen ? '5vh' : 0}
                minWidth={searchDialogIsOpen ? 50 : 0}
                minHeight={searchDialogIsOpen ? 50 : 0}
                borderRadius={2}
                color={theme.palette.primary.contrastText}
                sx={{
                    transition: `width 0.3s, height 0.5s`,
                    transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                    position: 'fixed',
                    backdropFilter: 'blur(2.5px)', // This be the blur
                    top: 100,
                    left: '40%',
                    overflow: 'hidden',
                    border: searchDialogIsOpen ? `1px solid ${alpha(theme.palette.common.black, 0.2)}` : 0,
                    boxShadow: `inset 0 0 10px ${alpha(theme.palette.common.black, 0.1)}`,
                    zIndex: zIndex.modal + 1
                }}
            >
                <Box>
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <Stack width="100%" height="100%" p={1}>
                            <Stack direction="row" alignItems="center">
                                <InputBase
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <MemorizedSearchIcon size={17} color={theme.palette.common.white} stroke={1} />
                                        </InputAdornment>
                                    }
                                    autoFocus
                                    ref={inputRef}
                                    sx={{
                                        ml: 1,
                                        flex: 1,
                                        width: '80%',
                                        color: theme.palette.secondary.contrastText
                                    }}
                                    value={value}
                                    placeholder={
                                        !isUndefined(currentFolder) && !isNull(currentFolder) ? last(currentFolder.split('/')) : 'Search'
                                    }
                                    inputProps={{ 'aria-label': 'quick search' }}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setValue(event.target.value);
                                    }}
                                />
                                <ButtonBase
                                    sx={{
                                        color: theme.palette.secondary.contrastText,
                                        textDecoration: 'underline',
                                        fontFamily: 'inherit',
                                        height: 'max-content',
                                        px: 0.5
                                    }}
                                    onClick={() => setValue('')}
                                >
                                    clear
                                </ButtonBase>
                            </Stack>
                        </Stack>
                    </ClickAwayListener>
                </Box>
            </Box>
        </Draggable>
    );
}
