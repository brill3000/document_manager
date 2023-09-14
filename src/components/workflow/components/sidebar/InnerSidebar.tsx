import React, { Dispatch, SetStateAction, useMemo } from 'react';
import {
    Chip,
    FormControl,
    Grid,
    InputAdornment,
    OutlinedInput,
    Stack,
    Theme,
    Typography,
    alpha,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { CustomButton } from '../UI/CustomButton';
import { SearchOutlined } from '@ant-design/icons';
import { RxCaretDown } from 'react-icons/rx';
import { WorkflowList } from '../main/lists';
import { useAppContext } from 'context/appContext';
import { groupBy, isObject } from 'lodash';
import { IWorkflowInstance } from 'global/interfaces';

export function InnerSidebar({ selected, setSelected }: { selected: string | null; setSelected: Dispatch<SetStateAction<string | null>> }) {
    const theme = useTheme();
    const outerRef = React.useRef(null);
    const innerRef = React.useRef(null);
    const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const { workflowsInstances } = useAppContext();
    const workflows: IWorkflowInstance[] = useMemo(
        () =>
            isObject(workflowsInstances) && workflowsInstances !== null && workflowsInstances !== undefined
                ? Object.values(workflowsInstances)
                : [],
        [workflowsInstances]
    );
    const workflowStatuses = useMemo(() => groupBy(workflows, (item) => item.status), [workflows]);

    console.log(workflowStatuses, 'WORKFLOW STATUSES');
    return (
        <Grid
            item
            md={3.5}
            xs={0}
            height="100%"
            width="100%"
            flexDirection="column"
            borderRight={(theme) => `1px solid ${theme.palette.divider}`}
            justifyContent="start"
            alignItems="start"
            ref={outerRef}
            display={matchDownMD ? 'none' : 'flex'}
        >
            <Stack direction="column" spacing={1} ref={innerRef} py={2} px={3}>
                <Stack direction="column" mb={2}>
                    <Typography variant="body1">
                        <b>Running Workflows</b>
                    </Typography>
                    <Typography fontSize={11} fontWeight={500} color="text.secondary">
                        {workflowStatuses &&
                            Object.entries(workflowStatuses).map(([key, val]) => (
                                <span>
                                    {val.length} {key}
                                </span>
                            ))}
                    </Typography>
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
                        sx={{
                            bgcolor: alpha(theme.palette.secondary.main, 0.2),
                            '& :hover': {
                                bgcolor: alpha(theme.palette.secondary.main, 0.5)
                            }
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" px={2} width="100%">
                            <SearchOutlined />
                        </Stack>
                    </CustomButton>
                </Stack>
                <Chip label="current" deleteIcon={<RxCaretDown />} onDelete={() => console.log('')} sx={{ maxWidth: 'max-content' }} />
            </Stack>
            <WorkflowList innerRef={innerRef} outerRef={outerRef} selected={selected} setSelected={setSelected} workflows={workflows} />
        </Grid>
    );
}
