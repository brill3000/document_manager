import { alpha, Box, Divider, IconButton, InputAdornment, InputBase, Typography, useTheme } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { IoClose, IoReturnUpBackOutline } from 'react-icons/io5';
import { IoReturnUpForwardOutline } from 'react-icons/io5';
import { HtmlTooltip } from 'components/documents/views/UI/Poppers/CustomPoppers';
import { useGetFoldersPropertiesQuery } from 'store/async/dms/folders/foldersApi';
import { isEmpty, isNull, isUndefined } from 'lodash';
import { useHandleChangeRoute } from 'utils/hooks';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { GrSearchAdvanced } from 'react-icons/gr';
// NEED TO REFACTOR THE ICON BUTTON USING STYLED COMPONENTS

export default function TopNavHandles() {
    // ======================== | STATES | ==================== //
    const parentContainer = React.useRef<HTMLDivElement | null>(null);
    // ======================== | THEME | ==================== //
    const theme = useTheme();
    // ======================== | CONSTANTS | ==================== //
    const tooltipDelay = 200;
    // ======================== | ZUSTAND | ==================== //
    const { actions, searchDialogIsOpen } = useBrowserStore();
    // ======================== | HOOKS | ==================== //
    const { navigate, key, currentFolder, is_dir: route_is_dir } = useHandleChangeRoute();
    // ======================== | EVENTS | ==================== //
    const handleBack = () => {
        navigate(-1);
    };
    const handleForward = () => {
        navigate(1);
    };
    const {
        data: folderInfo,
        isFetching: folderInfoIsFetching,
        isLoading: folderInfoIsLoading,
        isSuccess: folderInfoIsSuccess
    } = useGetFoldersPropertiesQuery(
        { fldId: !isUndefined(currentFolder) && !isNull(currentFolder) ? currentFolder : '' },
        {
            skip: currentFolder === null || currentFolder === undefined || isEmpty(currentFolder) || !route_is_dir
        }
    );
    const handleClickSearch = () => {
        searchDialogIsOpen === true ? actions.closeSearchDialog() : actions.openSearchDialog();
    };
    const handleQuickSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        actions.setQuickSearchString(event.target.value);
    };
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                bgcolor: 'background.paper',
                color: 'text.primary',
                '& svg': {
                    m: 0
                },
                '& hr': {
                    mx: 0
                }
            }}
            ref={parentContainer}
        >
            <Stack
                direction="row"
                sx={{
                    transition: 'all .2s',
                    transitionTimingFunction: 'ease-in-out',
                    justifyContent: 'space-between',
                    p: 0.3,
                    '&:hover': {
                        px: 1,
                        bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1)
                    }
                }}
            >
                <HtmlTooltip
                    enterNextDelay={tooltipDelay}
                    placement="bottom-end"
                    title={
                        <React.Fragment>
                            <Typography color="inherit" variant="body2">
                                Move Back
                            </Typography>
                            <Typography fontSize={10.5}> to previous folder</Typography>
                        </React.Fragment>
                    }
                    arrow
                >
                    <IconButton
                        color="error"
                        sx={{
                            borderRadius: 1,
                            '&:hover': {
                                color: (theme) => theme.palette.error.contrastText,
                                bgcolor: (theme) => theme.palette.error.main
                            },
                            height: '50%'
                        }}
                        onClick={handleBack}
                        disabled={key === 'default'}
                    >
                        <IoReturnUpBackOutline size={17} />
                    </IconButton>
                </HtmlTooltip>

                <HtmlTooltip
                    enterNextDelay={tooltipDelay}
                    placement="bottom-start"
                    title={
                        <React.Fragment>
                            <Typography color="inherit" variant="body2">
                                Move Forward
                            </Typography>
                            <Typography fontSize={10.5}>Move to next folder</Typography>
                        </React.Fragment>
                    }
                    arrow
                >
                    <IconButton
                        color="primary"
                        sx={{
                            borderRadius: 1,
                            '&:hover': {
                                color: (theme) => theme.palette.primary.contrastText,
                                bgcolor: (theme) => theme.palette.primary.main
                            },
                            height: '60%'
                        }}
                        onClick={handleForward}
                    >
                        <IoReturnUpForwardOutline size={17} />
                    </IconButton>
                </HtmlTooltip>
            </Stack>
            <Divider orientation="vertical" variant="fullWidth" flexItem />
            <Stack
                sx={{
                    transition: 'all .1s',
                    transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                    '&:hover': {
                        px: 0.5,
                        bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                        cursor: 'text'
                    },
                    height:
                        !isUndefined(parentContainer.current) && !isNull(parentContainer.current)
                            ? parentContainer.current.clientHeight
                            : '100%'
                }}
                direction="row"
                rowGap={2}
                alignItems="center"
            >
                <InputBase
                    endAdornment={
                        <InputAdornment position="start">
                            <Divider orientation="vertical" variant="fullWidth" flexItem />
                            <IconButton
                                sx={{
                                    p: 0.5,
                                    overflow: 'hidden',
                                    transition: 'all .1s',
                                    transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                                    borderRadius: 2
                                }}
                                onClick={handleClickSearch}
                                size="small"
                            >
                                {searchDialogIsOpen ? (
                                    <IoClose size={19} color={theme.palette.secondary.main} />
                                ) : (
                                    <GrSearchAdvanced size={16} color={theme.palette.divider} />
                                )}
                            </IconButton>
                        </InputAdornment>
                    }
                    onChange={handleQuickSearch}
                    sx={{ ml: 1, flex: 1, width: 250, height: '100%' }}
                    placeholder={
                        folderInfoIsLoading && folderInfoIsFetching
                            ? 'Loading...'
                            : folderInfoIsSuccess && folderInfo
                            ? folderInfo.doc_name
                            : 'Current Folder'
                    }
                    inputProps={{ 'aria-label': 'quick search' }}
                />
            </Stack>
        </Box>
    );
}
