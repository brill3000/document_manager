import * as React from 'react';
import Draggable from 'react-draggable';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { Box, alpha, useTheme, InputBase, Stack, InputAdornment, ButtonBase, ClickAwayListener } from '@mui/material';
import { useHandleChangeRoute } from 'utils/hooks';
import { debounce, isEmpty, isNull, isUndefined, last } from 'lodash';
import { MemorizedSearchIcon } from 'components/documents/Icons/fileIcon';
import zIndex from '@mui/material/styles/zIndex';
import { StyledTab, StyledTabs, TabPanel, a11yProps } from '../Tabs';
import { TbBackspace, TbSettingsSearch } from 'react-icons/tb';
import SwipeableViews from 'react-swipeable-views';
import SearchList from '../../lists/SearchList';

export function SearchDialog() {
    // ========================= | STATES | =========================== //
    const [disableDrag, setDisableDrag] = React.useState<boolean>(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [value, setValue] = React.useState<string>('');
    const [tabValue, setTabValue] = React.useState(0);

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
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    // ========================= | EFFECTS | =========================== //

    const handleDebouncedChange = React.useCallback(
        debounce((value) => {
            // Do something with the debounced value
            console.log(value, 'VALUE');
        }, 1000), // Specify the debounce delay (in milliseconds)
        []
    );
    return (
        <Draggable disabled={disableDrag} bounds="html">
            <Box
                bgcolor={alpha(theme.palette.common.black, 0.6)}
                width={searchDialogIsOpen ? '40vw' : 0}
                height={searchDialogIsOpen ? (!isEmpty(value) ? '60vh' : '5vh') : 0}
                minWidth={searchDialogIsOpen ? 50 : 0}
                minHeight={searchDialogIsOpen ? 50 : 0}
                borderRadius={2}
                color={theme.palette.primary.contrastText}
                sx={{
                    transition: `width 0.3s, height 0.3s`,
                    transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                    position: 'fixed',
                    backdropFilter: 'blur(3px)', // This be the blur
                    top: 100,
                    left: '33%',
                    overflow: 'hidden',
                    borderColor: theme.palette.grey[500],
                    borderWidth: searchDialogIsOpen ? 1 : 0,
                    borderStyle: 'solid',
                    boxShadow: `inset 0 0 10px ${alpha(theme.palette.common.black, 0.2)}, 0 0 1px ${alpha(
                        theme.palette.common.black,
                        0.9
                    )} `,
                    zIndex: zIndex.modal + 1
                }}
            >
                <Box>
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <Stack width="100%" height="100%" p={1} spacing={1}>
                            <Stack direction="row" alignItems="center" spacing={1}>
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
                                        handleDebouncedChange(event.target.value);
                                    }}
                                />
                                <ButtonBase
                                    sx={{
                                        color: theme.palette.warning.light,
                                        textDecoration: 'underline',
                                        fontFamily: 'inherit',
                                        height: 'max-content',
                                        p: 0.5,
                                        borderRadius: '50%'
                                    }}
                                    onClick={() => {
                                        handleDebouncedChange('');
                                        setValue('');
                                    }}
                                >
                                    <TbBackspace size={21} />
                                </ButtonBase>
                                <ButtonBase
                                    sx={{
                                        color: theme.palette.info.light,
                                        fontFamily: 'inherit',
                                        height: 'max-content',
                                        p: 0.5,
                                        borderRadius: '50%'
                                    }}
                                    onClick={() => setValue('')}
                                >
                                    <TbSettingsSearch size={18} />
                                </ButtonBase>
                            </Stack>
                            <StyledTabs value={tabValue} onChange={handleChange} aria-label="search tabs">
                                <StyledTab label="Full-Text" {...a11yProps(0)} />
                                <StyledTab label="Document Names" {...a11yProps(0)} />
                                <StyledTab label="Keywords" {...a11yProps(0)} />
                            </StyledTabs>
                            <SwipeableViews
                                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                index={tabValue}
                                style={{ height: '100%', width: '100%', overflowY: 'hidden' }}
                            >
                                <TabPanel value={tabValue} index={0}>
                                    <SearchList height="50vh" />
                                </TabPanel>
                                <TabPanel value={tabValue} index={1}>
                                    Item Two
                                </TabPanel>
                                <TabPanel value={tabValue} index={2}>
                                    Item Three
                                </TabPanel>
                            </SwipeableViews>
                        </Stack>
                    </ClickAwayListener>
                </Box>
            </Box>
        </Draggable>
    );
}
