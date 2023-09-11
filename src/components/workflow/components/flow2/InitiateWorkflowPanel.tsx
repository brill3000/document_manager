import { Box, Button, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography, alpha } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useAppContext } from 'context/appContext';
import { useState } from 'react';
import { BsGear, BsPlay } from 'react-icons/bs';
import { IWorkflow } from '../flow/flowTest/store';
import { Formik } from 'formik';
import { FormikAutoCompleteNew, FormikText } from 'global/UI/FormMUI/Components';
import { useGetUsersQuery } from 'store/async/dms/auth/authApi';

function InitiateWorkflowPanel() {
    const { workflows } = useAppContext();
    const [selectedWorkflow, setSelectedWorkflow] = useState<IWorkflow | null>(null);
    const { data: users } = useGetUsersQuery();
    return (
        <Grid2 container direction="row" width="100%" height="100%">
            <Grid2
                xs={3}
                height="100%"
                sx={{
                    borderRight: 1,
                    borderColor: (theme) => theme.palette.divider,
                    bgColor: (theme) => theme.palette.background.default,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: 2
                }}
            >
                <Typography variant="h5">Workflow</Typography>
                <Divider textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                        Select workflow
                    </Typography>
                </Divider>
                <List sx={{ height: '100%' }}>
                    {workflows &&
                        Object.values(workflows).map((workflow: any, i) => {
                            const test: IWorkflow = { ...workflow };
                            return (
                                <WorkflowItem
                                    key={i}
                                    workflow={workflow}
                                    handleClickTaskItem={(workflow: IWorkflow) => setSelectedWorkflow(workflow)}
                                />
                            );
                        })}
                </List>
            </Grid2>
            <Grid2
                xs={9}
                sx={{
                    p: 1,
                    position: 'relative',
                    overflow: 'auto',
                    backgroundColor: (theme) => theme.palette.grey[50]
                }}
                height="100%"
            >
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h4">Fill in the required actions to initiate</Typography>
                    <Button variant="contained" startIcon={<BsPlay />}>
                        Initiate workflow
                    </Button>
                </Stack>
                <Formik
                    initialValues={{ title: '' }}
                    validate={(values: { title: string }) => {
                        const errors: any = {};
                        if (!values.title) {
                            errors['title'] = 'Required';
                        }
                        return errors;
                    }}
                    onSubmit={(values) => {}}
                >
                    <List>
                        {selectedWorkflow !== null &&
                            selectedWorkflow.nodes
                                .filter((node) => Array.isArray(node.data.action) && node.data.action.length > 0)
                                .map((node, i) => (
                                    <ListItem key={node.id}>
                                        <ListItemText disableTypography>
                                            <Typography>
                                                <Box component="span" sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}>
                                                    Process {i + 1}:{' '}
                                                </Box>{' '}
                                                {node.data.label}
                                            </Typography>

                                            <List dense sx={{ border: 1, borderColor: (theme) => theme.palette.divider, borderRadius: 1 }}>
                                                {Array.isArray(node.data.action) &&
                                                    node.data.action.map((act, i) => (
                                                        <>
                                                            {i !== 0 && (
                                                                <Divider variant="middle">
                                                                    <Typography> {act.label}</Typography>
                                                                </Divider>
                                                            )}
                                                            <ListItem>
                                                                <ListItemText disableTypography>
                                                                    <Typography fontWeight={(theme) => theme.typography.fontWeightBold}>
                                                                        {act.label}
                                                                    </Typography>
                                                                    <FormikAutoCompleteNew
                                                                        variant="standard"
                                                                        name={`${node.id}_${act.type}_assignee`}
                                                                        sx={{ width: '100%' }}
                                                                        multiple={false}
                                                                        options={Array.isArray(users) ? users : []}
                                                                        label="Assignee"
                                                                        id={`${act.type} assignee`}
                                                                    />
                                                                </ListItemText>
                                                            </ListItem>
                                                            {act.type === 'upload' && (
                                                                <>
                                                                    <ListItem>
                                                                        <ListItemText disableTypography>
                                                                            <FormikText
                                                                                variant="standard"
                                                                                name={`${node.id}_${act.type}_filename`}
                                                                                sx={{ width: '100%' }}
                                                                                label="File name"
                                                                                id={`${act.type} filename`}
                                                                            />
                                                                        </ListItemText>
                                                                    </ListItem>
                                                                    <ListItem>
                                                                        <ListItemText disableTypography>
                                                                            <FormikText
                                                                                variant="standard"
                                                                                name={`${node.id}_${act.type}_filelocation`}
                                                                                sx={{ width: '100%' }}
                                                                                label="File location"
                                                                                id={`${act.type} filelocation`}
                                                                            />
                                                                        </ListItemText>
                                                                    </ListItem>
                                                                </>
                                                            )}
                                                        </>
                                                    ))}
                                            </List>
                                        </ListItemText>
                                    </ListItem>
                                ))}
                    </List>
                </Formik>
            </Grid2>
        </Grid2>
    );
}

const WorkflowItem = ({ workflow, handleClickTaskItem }: { workflow: any; handleClickTaskItem: (workflow: any) => void }) => {
    return (
        <ListItemButton
            sx={{
                borderRadius: 1.5,
                border: 0.5,
                px: 1,
                py: 0.2,
                mb: 3,
                borderColor: (theme) => theme.palette.common.black,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                opacity: 1
            }}
            onClick={() => {
                handleClickTaskItem(workflow);
            }}
        >
            <ListItemIcon>
                <BsGear size={20} />
            </ListItemIcon>
            <ListItemText primary={workflow.title} />
        </ListItemButton>
    );
};

export default InitiateWorkflowPanel;
