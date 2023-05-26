import React from 'react';
import { Box, Chip, FormControl, Grid, InputAdornment, OutlinedInput, Stack, Typography, alpha, useTheme } from '@mui/material';
import { CustomButton } from '../UI/CustomButton';
import { SearchOutlined } from '@ant-design/icons';
import { RxCaretDown } from 'react-icons/rx';
import MailsList from './lists/MailsList';

export function InnerRightSidebar() {
    const theme = useTheme();
    const outerRef = React.useRef(null);
    const innerRef = React.useRef(null);

    return (
        <Grid
            item
            md={3.5}
            height="100%"
            width="100%"
            flexDirection="column"
            borderRight={(theme) => `1px solid ${theme.palette.divider}`}
            justifyContent="start"
            alignItems="start"
            ref={outerRef}
        >
            <Stack direction="column" spacing={1} ref={innerRef} py={2} px={3}>
                <Stack direction="row" mb={1} spacing={2} alignItems="center">
                    <Stack direction="column">
                        <Typography variant="body1">Inbox</Typography>
                        <Typography fontSize={11} fontWeight={500} color="text.secondary">
                            0 messages: 120 Unread
                        </Typography>
                    </Stack>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <FormControl sx={{ width: { xs: '100%' } }}>
                        <OutlinedInput
                            size="small"
                            id="email-search"
                            startAdornment={
                                <InputAdornment position="start" sx={{ mr: -0.5 }}>
                                    <SearchOutlined />
                                </InputAdornment>
                            }
                            aria-describedby="email-search-text"
                            inputProps={{
                                'aria-label': 'weight'
                            }}
                            placeholder="Ctrl + Alt + E"
                        />
                    </FormControl>
                    <CustomButton
                        mainColor={alpha(theme.palette.secondary.main, 0.2)}
                        hoverColor={alpha(theme.palette.secondary.main, 0.5)}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" px={2} width="100%">
                            <SearchOutlined />
                        </Stack>
                    </CustomButton>
                </Stack>
                <Chip label="current" deleteIcon={<RxCaretDown />} onDelete={() => console.log('')} sx={{ maxWidth: 'max-content' }} />
            </Stack>
            <MailsList innerRef={innerRef} outerRef={outerRef} />
            <Typography
                fontSize={10}
                color="text.secondary"
                position="absolute"
                bottom={10}
                sx={{
                    '& .test': {
                        color: 'primary.dark'
                    }
                }}
                py={2}
                px={3}
            >
                Emails:{' '}
                <Box component="span" className="test">
                    {new Date().toDateString()}
                </Box>
            </Typography>
        </Grid>
    );
}
