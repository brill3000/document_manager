import * as React from 'react';
import Draggable from 'react-draggable';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { Box, alpha, useTheme, InputBase, Stack, InputAdornment, ButtonBase, ClickAwayListener } from '@mui/material';
import { useHandleChangeRoute } from 'utils/hooks';
import { debounce, isArray, isEmpty, isNull, isString, isUndefined, last } from 'lodash';
import { MemorizedSearchIcon } from 'components/documents/Icons/fileIcon';
import zIndex from '@mui/material/styles/zIndex';
import { StyledTab, StyledTabs, TabPanel, a11yProps } from '../Tabs';
import { TbBackspace, TbSettingsSearch } from 'react-icons/tb';
import SwipeableViews from 'react-swipeable-views';
import SearchList from '../../lists/SearchList';
import { useLazyFindByContentQuery, useLazyFindByKeywordQuery, useLazyFindByNameQuery } from 'store/async/dms/search/searchApi';
import { FacebookCircularProgress } from 'ui-component/CustomProgressBars';

export function SearchDialog() {
    // ========================= | STATES | =========================== //
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [disableDrag, setDisableDrag] = React.useState<boolean>(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [value, setValue] = React.useState<string>('');
    const [tabValue, setTabValue] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    // ========================= | THEME | =========================== //
    const theme = useTheme();
    // ========================= | HOOKS | =========================== //
    const { currentFolder } = useHandleChangeRoute();
    // ========================= | ZUSTAND | =========================== //
    const { searchDialogIsOpen, actions } = useBrowserStore();
    // ========================= | RTK QUERY | =========================== //
    const [
        findByContent,
        { isFetching: findByContentIsFetching, data: findByContentData, error: findByContentError }
    ] = useLazyFindByContentQuery();
    const [findByName, { isFetching: findByNameIsFetching, data: findByNameData, error: findByNameError }] = useLazyFindByNameQuery();
    const [
        findByKeywords,
        { isFetching: findByKeywordsIsFetching, data: findByKeywordsData, error: findByKeywordsError }
    ] = useLazyFindByKeywordQuery();

    // ========================= | EVENTS | =========================== //
    const handleClickAway = () => {
        actions.closeSearchDialog();
    };
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    const handleDebouncedChange = React.useCallback(
        debounce((value) => {
            // Do something with the debounced value
            if (isString(value) && !isEmpty(value)) {
                switch (tabValue) {
                    case 0:
                        findByContent({ content: value });
                        break;
                    case 1:
                        findByName({ name: value });
                        break;
                    case 2:
                        findByKeywords({ keywords: [value] });
                        break;
                    default:
                        break;
                }
            }
        }, 1000), // Specify the debounce delay (in milliseconds)
        [tabValue]
    );
    // ========================= | EFFECTS | =========================== //
    React.useEffect(() => {
        switch (tabValue) {
            case 0:
                console.log(findByContentIsFetching, 'DATA 2');
                findByContentIsFetching === true && isString(value) && !isEmpty(value) && setIsLoading(true);
                findByContentIsFetching === false && setIsLoading(false);

                break;
            case 1:
                findByNameIsFetching === true && isString(value) && !isEmpty(value) && setIsLoading(true);
                findByNameIsFetching === false && setIsLoading(false);

                break;
            case 2:
                findByKeywordsIsFetching === true && isString(value) && !isEmpty(value) && setIsLoading(true);
                findByKeywordsIsFetching === false && setIsLoading(false);
                break;
            default:
                break;
        }
    }, [findByContentIsFetching, findByNameIsFetching, findByKeywordsIsFetching]);
    // React.useEffect(() => {
    //     switch (tabValue) {
    //         case 0:
    //             (!isUndefined(findByContentData?.queryResults) || !isUndefined(findByContentError)) && setIsLoading(false);
    //             break;
    //         case 1:
    //             (!isUndefined(findByNameData?.queryResults) || !isUndefined(findByNameError)) && setIsLoading(false);
    //             break;
    //         case 2:
    //             (!isUndefined(findByKeywordsData?.queryResults) || !isUndefined(findByKeywordsError)) && setIsLoading(false);
    //             break;
    //         default:
    //             break;
    //     }
    // }, [
    //     findByContentData,
    //     findByContentError,
    //     findByNameData,
    //     findByNameError,
    //     findByKeywordsError,
    //     findByKeywordsError,
    //     findByContentIsFetching,
    //     findByNameIsFetching,
    //     findByKeywordsIsFetching
    // ]);
    React.useEffect(() => {
        if (isString(value) && !isEmpty(value)) {
            switch (tabValue) {
                case 0:
                    findByContent({ content: value });
                    break;
                case 1:
                    findByName({ name: value });
                    break;
                case 2:
                    findByKeywords({ keywords: [value] });
                    break;
                default:
                    break;
            }
        }
    }, [tabValue]);

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
                    zIndex: zIndex.modal + (isHovered ? 2 : 1)
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Box>
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <Stack width="100%" height="100%" p={1} spacing={1}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <InputBase
                                    startAdornment={
                                        <InputAdornment position="start">
                                            {isLoading ? (
                                                <FacebookCircularProgress size={20} />
                                            ) : (
                                                <MemorizedSearchIcon size={17} color={theme.palette.common.white} stroke={1} />
                                            )}
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
                                    {isArray(findByContentData?.queryResults) && (
                                        <SearchList height="45vh" searchList={findByContentData ?? null} />
                                    )}
                                </TabPanel>
                                <TabPanel value={tabValue} index={1}>
                                    {isArray(findByNameData?.queryResults) && (
                                        <SearchList height="45vh" searchList={findByNameData ?? null} />
                                    )}
                                </TabPanel>
                                <TabPanel value={tabValue} index={2}>
                                    {isArray(findByKeywordsData?.queryResults) && (
                                        <SearchList height="45vh" searchList={findByKeywordsData ?? null} />
                                    )}
                                </TabPanel>
                            </SwipeableViews>
                        </Stack>
                    </ClickAwayListener>
                </Box>
            </Box>
        </Draggable>
    );
}
