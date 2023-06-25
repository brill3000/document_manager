import * as React from 'react';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { CustomButton } from 'components/workflow/components/UI/CustomButton';
import {
    BsFileEarmarkDiffFill,
    BsFileEarmarkXFill,
    BsFillFileEarmarkBreakFill,
    BsFillFileLock2Fill,
    BsFillFileLockFill
} from 'react-icons/bs';
import { FileInterface } from 'global/interfaces';
import { getDateFromObject } from 'utils/constants/UriHelper';
import { HiDocumentDuplicate } from 'react-icons/hi';
import { isEmpty, isNull, isString, isUndefined, last } from 'lodash';

export function ViewFileSideBar({
    selected,
    handleClick,
    file,
    filePath
}: {
    selected: string | null;
    handleClick: (nav: any) => void;
    file: FileInterface | undefined | null;
    filePath: string;
}) {
    const theme = useTheme();
    const operation = React.useMemo(
        () => [
            { nav: 'Add Note', icon: <BsFileEarmarkDiffFill size={15} color={theme.palette.primary.main} />, count: 0 },
            {
                nav: 'Compare Versions',
                icon: <BsFillFileEarmarkBreakFill size={15} color={theme.palette.info.main} />,
                count: 0
            },
            { nav: 'Lock', icon: <BsFillFileLock2Fill size={15} color={theme.palette.warning.main} />, count: 0 },
            { nav: 'UnLock', icon: <BsFillFileLockFill size={15} color={theme.palette.success.main} />, count: 0 }
        ],
        []
    );
    const damagingOperations = React.useMemo(
        () => [
            { nav: 'Move to trash', icon: <BsFileEarmarkXFill size={15} color={theme.palette.error.main} />, count: 0 },
            { nav: 'Delete Versions', icon: <BsFileEarmarkXFill size={15} color={theme.palette.error.main} />, count: 0 }
        ],
        []
    );
    return (
        <>
            <Stack direction="column" spacing={1.2} width="100%">
                <Stack direction="row" mb={2} spacing={1} alignItems="center">
                    <Stack direction="column" spacing={0.5}>
                        <Typography fontSize={12}>
                            <b>{isString(filePath) && !isEmpty(filePath) ? last(filePath.split('/')) ?? 'Opened File' : 'Opened File'}</b>
                        </Typography>
                        <Typography fontSize={10} color="text.secondary">
                            Version: 1.0
                        </Typography>
                    </Stack>
                </Stack>
                <CustomButton
                    sx={{
                        bgcolor: 'primary.main',
                        '& :hover': {
                            bgcolor: 'primary.dark'
                        }
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" py={1} px={2} width="100%">
                        <HiDocumentDuplicate size={17} color={theme.palette.primary.contrastText} />
                        <Typography variant="caption" color={theme.palette.primary.contrastText}>
                            Create New Version
                        </Typography>
                    </Stack>
                </CustomButton>
                <Divider variant="middle">
                    <Typography fontSize={10} color={theme.palette.text.secondary}>
                        Operations
                    </Typography>{' '}
                </Divider>
                {operation.map((navItem) => (
                    <CustomButton
                        key={navItem.nav}
                        sx={{
                            border: navItem.nav === selected ? `1px solid ${theme.palette.secondary.light}` : 0
                        }}
                        onClick={() => handleClick(navItem.nav)}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" py={1} px={2} width="100%">
                            {navItem.icon}
                            <Typography
                                variant="caption"
                                color={theme.palette.text.primary}
                                maxWidth="70%"
                                minWidth="70%"
                                textAlign="start"
                                noWrap
                            >
                                {navItem.nav}
                            </Typography>
                            <Typography variant="caption" color={theme.palette.text.primary}>
                                {navItem.count}
                            </Typography>
                        </Stack>
                    </CustomButton>
                ))}
                <Divider variant="middle">
                    <Typography fontSize={10} color={theme.palette.text.secondary}>
                        Dangerous Operations
                    </Typography>{' '}
                </Divider>
                {damagingOperations.map((navItem) => (
                    <CustomButton
                        key={navItem.nav}
                        sx={{
                            border: navItem.nav === selected ? `1px solid ${theme.palette.secondary.light}` : 0
                        }}
                        onClick={() => handleClick(navItem.nav)}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" py={1} px={2} width="100%">
                            {navItem.icon}
                            <Typography
                                variant="caption"
                                color={theme.palette.text.primary}
                                maxWidth="70%"
                                minWidth="70%"
                                textAlign="start"
                                noWrap
                            >
                                {navItem.nav}
                            </Typography>
                            <Typography variant="caption" color={theme.palette.text.primary}>
                                {navItem.count}
                            </Typography>
                        </Stack>
                    </CustomButton>
                ))}
            </Stack>
            <Typography
                fontSize={10}
                color="text.secondary"
                position="absolute"
                bottom={10}
                sx={{
                    '& .date': {
                        color: 'primary.dark'
                    }
                }}
            >
                Date Created:{' '}
                <Box component="span" className="date">
                    {!isUndefined(file) && !isNull(file) && getDateFromObject(file.created).toLocaleString()}
                </Box>
            </Typography>
        </>
    );
}
