import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    alpha
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useAppContext } from 'context/appContext';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BsGear, BsPlay } from 'react-icons/bs';
import { FieldArray, Form, Formik, FormikProps } from 'formik';
import { FormikAutoCompleteNew, FormikText } from 'global/UI/FormMUI/Components';
import { useGetUsersQuery } from 'store/async/dms/auth/authApi';
import * as Yup from 'yup';
import { ExtendedNodeData, ITask, IWorkflow, IWorkflowActionTypes, IWorkflowInstance } from 'global/interfaces';
import uuid from 'react-uuid';
import { groupBy, isObject } from 'lodash';
import { LeftSidebar } from 'components/documents/views/main/sidebars';
import { UriHelper } from 'utils/constants/UriHelper';
import { Node } from 'reactflow';
import { enqueueSnackbar } from 'notistack';

const INITIAL_FORM_STATE: Record<string, any> = {
    workflow_title: ''
};

const FORM_VALIDATION = Yup.object().shape({
    workflow_title: Yup.string().required('Workflow title required')
});

function InitiateWorkflowPanel() {
    const { workflows, addTask, addWorkflowInstance, user } = useAppContext();
    const [selectedWorkflow, setSelectedWorkflow] = useState<IWorkflow | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const { data: users } = useGetUsersQuery();
    const [selectedFolders, setSelectedFolders] = useState<string[] | null>(null);
    const [isSending, setIsSending] = useState<boolean>(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const [process, setProcess] = useState<string | null>(null);
    const ref = useRef<FormikProps<Record<string, any>>>(null);
    const handleNodeFocus = (processId: string) => {
        setProcess(processId);
        setOpen(true);
    };
    const handleSelectedFolder = useCallback(
        (nodeId: string) => {
            console.log(ref.current, 'CURRENT');
            console.log(process, 'PROCESS');
            console.log(nodeId, 'NODE ID');
            ref.current && process && ref.current?.setFieldValue(process, nodeId);
        },
        [process]
    );
    const filteredProcess = useMemo(
        () =>
            selectedWorkflow
                ? selectedWorkflow.nodes.filter((node) => Array.isArray(node.data.action) && node.data.action.length > 0)
                : null,
        [selectedWorkflow]
    );

    useEffect(() => {
        return () => {
            timeout.current !== null && clearTimeout(timeout.current);
        };
    }, []);
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
                    backgroundColor: (theme) => theme.palette.grey[50],
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: 1
                }}
                height="100%"
            >
                <Formik
                    innerRef={ref}
                    initialValues={{ ...INITIAL_FORM_STATE }}
                    validationSchema={FORM_VALIDATION}
                    onSubmit={(values) => {
                        const workflowInstanceId = uuid();
                        const workflowTitle = values.workflow_title;
                        const tasks: ITask[] = [];
                        Array.isArray(values.actions) &&
                            values.actions.map((action) => {
                                Array.isArray(action) &&
                                    action.map((act, i) => {
                                        if (act !== undefined) {
                                            Object.entries(act).map(([key, values]) => {
                                                const taskId = uuid();
                                                const type: IWorkflowActionTypes = key as IWorkflowActionTypes;
                                                if (isObject(values) && values !== undefined && values !== null) {
                                                    const task: ITask = {
                                                        id: taskId,
                                                        status: 'pending',
                                                        // @ts-expect-error expected,
                                                        assignee: values.assignee,
                                                        workflowInstanceId,
                                                        taskType: type,
                                                        processId: String(i),
                                                        info: { ...values }
                                                    };
                                                    tasks.push(task);
                                                }
                                            });
                                        }
                                    });
                            });
                        if (selectedWorkflow !== null) {
                            setIsSending(true);
                            const nodes: Node<ExtendedNodeData>[] = selectedWorkflow.nodes.map((node) => {
                                const nodeTasks = tasks.filter((x) => x.processId === node.id).map(({ id, status }) => ({ id, status }));
                                return { ...node, data: { ...node.data, tasks: nodeTasks, status: 'pending' } };
                            });
                            const workflowInstance: IWorkflowInstance = {
                                title: workflowTitle,
                                id: workflowInstanceId,
                                nodes,
                                edges: selectedWorkflow.edges,
                                createdBy: user ?? '',
                                status: 'pending'
                            };
                            const work: Record<string, IWorkflowInstance> = {};
                            work[workflowInstanceId] = workflowInstance;
                            addWorkflowInstance(work);
                            tasks.map((task) => {
                                const id = task.id;
                                const t: Record<string, ITask> = {};
                                t[id] = task;
                                addTask(t);
                            });
                            timeout.current = setTimeout(() => {
                                enqueueSnackbar('Workflow created', { variant: 'success' });
                                setIsSending(false);
                            }, 500);
                        }
                    }}
                >
                    {({ initialValues, setFieldValue, errors, values, isSubmitting }) => (
                        <Form>
                            <Stack direction="row" justifyContent="space-between">
                                {selectedWorkflow !== null && (
                                    <FormikText
                                        variant="outlined"
                                        name="workflow_title"
                                        sx={{ width: '60%' }}
                                        label="Workflow title"
                                        id={`workflow_title`}
                                    />
                                )}
                                <Button
                                    variant="contained"
                                    sx={{ height: 'max-content' }}
                                    startIcon={isSending ? <CircularProgress size={15} /> : <BsPlay />}
                                    disabled={selectedWorkflow === null}
                                    onClick={() => {
                                        ref.current && ref.current.handleSubmit();
                                    }}
                                >
                                    Initiate workflow
                                </Button>
                            </Stack>
                            <Typography variant="h4">Fill in the required actions to initiate</Typography>

                            <FieldArray name="tasks">
                                {({ insert, remove, push }) => (
                                    <List>
                                        {filteredProcess !== null &&
                                            filteredProcess.map((node, i) => (
                                                <ListItem key={node.id}>
                                                    <ListItemText disableTypography>
                                                        <Typography>
                                                            <Box
                                                                component="span"
                                                                sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
                                                            >
                                                                Process {i + 1}:{' '}
                                                            </Box>{' '}
                                                            {node.data.label}
                                                        </Typography>

                                                        <List
                                                            dense
                                                            sx={{
                                                                border: 1,
                                                                borderColor: (theme) => theme.palette.divider,
                                                                borderRadius: 1
                                                            }}
                                                        >
                                                            {Array.isArray(node.data.action) &&
                                                                node.data.action.map((act, i) => (
                                                                    <Fragment key={act.id}>
                                                                        {i !== 0 && (
                                                                            <Divider variant="middle">
                                                                                <Typography> {act.label}</Typography>
                                                                            </Divider>
                                                                        )}
                                                                        <ListItem>
                                                                            <ListItemText
                                                                                disableTypography
                                                                                sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}
                                                                            >
                                                                                <Typography
                                                                                    fontWeight={(theme) => theme.typography.fontWeightBold}
                                                                                >
                                                                                    {act.label}
                                                                                </Typography>
                                                                                <FormikAutoCompleteNew
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    name={`actions.${i}.${node.id}.${act.type}.assignee`}
                                                                                    sx={{ width: '100%' }}
                                                                                    multiple={false}
                                                                                    required
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
                                                                                            variant="outlined"
                                                                                            sx={{ width: '100%' }}
                                                                                            name={`actions.${i}.${node.id}.${act.type}.filename`}
                                                                                            label="File name"
                                                                                            required
                                                                                            id={`${act.type} filename`}
                                                                                        />
                                                                                    </ListItemText>
                                                                                </ListItem>
                                                                                <ListItem>
                                                                                    <ListItemText disableTypography>
                                                                                        <FormikText
                                                                                            variant="outlined"
                                                                                            name={`actions.${i}.${node.id}.${act.type}.filelocation`}
                                                                                            sx={{ width: '100%' }}
                                                                                            // label="File location"
                                                                                            placeholder="Pick file location"
                                                                                            onFocus={() =>
                                                                                                handleNodeFocus(
                                                                                                    `actions.${i}.${node.id}.${act.type}.filelocation`
                                                                                                )
                                                                                            }
                                                                                            required
                                                                                            id={`${act.type} filelocation`}
                                                                                        />
                                                                                    </ListItemText>
                                                                                </ListItem>
                                                                            </>
                                                                        )}
                                                                    </Fragment>
                                                                ))}
                                                        </List>
                                                    </ListItemText>
                                                </ListItem>
                                            ))}
                                    </List>
                                )}
                            </FieldArray>
                        </Form>
                    )}
                </Formik>
            </Grid2>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <Box width={500} height="50vh" overflow="scroll">
                    <LeftSidebar
                        standAlone
                        root={UriHelper.REPOSITORY_GET_ROOT_FOLDER}
                        customHandleClick={handleSelectedFolder}
                        selectedList={selectedFolders}
                    />
                </Box>
            </Dialog>
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
