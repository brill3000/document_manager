import * as React from 'react';
import { Box, Divider, Grid, Stack, Typography, lighten, useTheme } from '@mui/material';
import { CustomButton } from 'components/workflow/components/UI/CustomButton';
import {
    BsFileEarmarkDiffFill,
    BsFileEarmarkXFill,
    BsFillFileEarmarkBreakFill,
    BsFillFileLock2Fill,
    BsFillFileLockFill
} from 'react-icons/bs';
import { GenericDocument } from 'global/interfaces';
import { getDateFromObject } from 'utils/constants/UriHelper';
import { HiDocumentDuplicate } from 'react-icons/hi';

export function ViewFileSideBar({
    selected,
    handleClick,
    file
}: {
    selected: string | null;
    handleClick: (nav: any) => void;
    file: GenericDocument;
}) {
    const theme = useTheme();
    const operation = React.useMemo(
        () => [
            { nav: 'Edit', icon: <BsFileEarmarkDiffFill size={15} color={theme.palette.primary.main} />, count: 0 },
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
        <Grid xs={4} item bgcolor={lighten(theme.palette.divider, 0.5)} px={2} py={2.5} maxHeight="100%" overflow="auto">
            <Stack direction="column" spacing={1.2} width="100%">
                <Stack direction="row" mb={2} spacing={1} alignItems="center">
                    <Stack direction="column" spacing={0.5}>
                        <Typography variant="body1">
                            <b>{file.doc_name ?? 'View File'}</b>
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
                        <Typography variant="body2" color={theme.palette.primary.contrastText}>
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
                                variant="body2"
                                color={theme.palette.text.primary}
                                maxWidth="70%"
                                minWidth="70%"
                                textAlign="start"
                                noWrap
                            >
                                {navItem.nav}
                            </Typography>
                            <Typography variant="body2" color={theme.palette.text.primary}>
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
                                variant="body2"
                                color={theme.palette.text.primary}
                                maxWidth="70%"
                                minWidth="70%"
                                textAlign="start"
                                noWrap
                            >
                                {navItem.nav}
                            </Typography>
                            <Typography variant="body2" color={theme.palette.text.primary}>
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
                    {getDateFromObject(file.created).toLocaleString()}
                </Box>
            </Typography>
        </Grid>
    );
}
