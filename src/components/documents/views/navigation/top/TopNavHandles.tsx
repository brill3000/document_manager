import { alpha, Box, Divider, IconButton, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoReturnUpBackOutline } from 'react-icons/io5';
import { IoReturnUpForwardOutline } from 'react-icons/io5';
import { HtmlTooltip } from 'components/documents/views/UI/Poppers/CustomPoppers';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { useGetFoldersPropertiesQuery } from 'store/async/dms/folders/foldersApi';
import { isArray, isEmpty, isNull } from 'lodash';
import { useHandleChangeRoute } from 'utils/hooks';

// NEED TO REFACTOR THE ICON BUTTON USING STYLED COMPONENTS

export default function TopNavHandles() {
    const tooltipDelay = 200;
    const { selected } = useBrowserStore();
    const { navigate, key } = useHandleChangeRoute();
    const handleBack = () => {
        if (Array.isArray(selected) && selected.length > 0) {
            navigate(-1);
        }
    };
    const handleForward = () => {
        if (Array.isArray(selected) && selected.length > 0) {
            navigate(1);
        }
    };
    const {
        data: folderInfo,
        error: folderInfoError,
        isFetching: folderInfoIsFetching,
        isLoading: folderInfoIsLoading,
        isSuccess: folderInfoIsSuccess
    } = useGetFoldersPropertiesQuery(
        {
            fldId:
                isArray(selected) && !isEmpty(selected) && !isEmpty(selected[selected?.length - 1].id)
                    ? selected[selected.length - 1].id
                    : ''
        },
        {
            skip:
                selected === null ||
                selected === undefined ||
                !isArray(selected) ||
                isEmpty(selected) ||
                isEmpty(selected[selected?.length - 1].id) ||
                isNull(selected[selected?.length - 1].id) ||
                !selected[selected?.length - 1].is_dir
        }
    );
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: 'max-content',
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
                    transition: 'all .2s',
                    transitionTimingFunction: 'ease-in-out',
                    pr: 0.4,
                    pl: 0.7,
                    '&:hover': {
                        px: 2,
                        bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                        cursor: 'text'
                    }
                }}
                direction="row"
                rowGap={1}
                alignItems="center"
            >
                <Typography variant="body2" width={250} noWrap>
                    {folderInfoIsLoading && folderInfoIsFetching
                        ? 'Loading...'
                        : folderInfoIsSuccess && folderInfo
                        ? folderInfo.doc_name
                        : 'Current Folder'}
                </Typography>

                <IconButton
                    color="secondary"
                    sx={{
                        p: 0.5,
                        borderRadius: '50%',
                        '&:hover': {
                            color: (theme) => theme.palette.secondary.contrastText,
                            bgcolor: (theme) => theme.palette.secondary.main
                        }
                    }}
                >
                    <CiSearch size={18} />
                </IconButton>
            </Stack>
        </Box>
    );
}
