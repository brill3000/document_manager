import { Save } from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    List,
    ListItemBaseProps,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    alpha
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Form, Formik } from 'formik';
import { IAction, IWorkflowActionTypes, IWorkflowPanelProps } from 'global/interfaces';
import { FormikText } from 'global/UI/FormMUI/Components';
import TestFlow from '../flow/flowTest/TestFlow';
import { Content } from '../main/content';
import { BsGear } from 'react-icons/bs';
import { useDrag } from 'react-dnd';
import { ItemTypes } from 'components/documents/Interface/Constants';
import { CSSProperties, useCallback, useEffect, useRef } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import useStore from '../flow/flowTest/store';
import { uniqueId } from 'lodash';
import { useAppContext } from 'context/appContext';
import uuid from 'react-uuid';
import { enqueueSnackbar } from 'notistack';
const actions: IAction[] = [
    { id: 1, type: 'upload', title: 'Upload file' },
    { id: 2, type: 'form', title: 'Fill form' },
    { id: 3, type: 'vote', title: 'Vote' }
];

export const WorkflowPanel = ({ isSending, setIsSending }: IWorkflowPanelProps) => {
    const { nodes, edges } = useStore();
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const { user, addWorkflow } = useAppContext();
    // ZUSTAND
    const { selected: selectedNode, addAction } = useStore();
    // ======================== | EVENTS | ============================//

    const handleAddAction = useCallback(
        (actionType: IWorkflowActionTypes) => {
            if (selectedNode === null) return enqueueSnackbar('Select a process first', { variant: 'info' });
            switch (actionType) {
                case 'upload':
                    addAction(selectedNode.id, { id: uuid(), type: 'upload', label: 'Upload file', values: null });
                    break;
                case 'form':
                    addAction(selectedNode.id, { id: uuid(), type: 'form', label: 'Fill form', values: null });
                    break;
                case 'vote':
                    addAction(selectedNode.id, { id: uuid(), type: 'vote', label: 'Vote', values: null });
                    break;
                default:
                    enqueueSnackbar('Invalid action', { variant: 'info' });
                    break;
            }
        },
        [selectedNode]
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
                <Typography variant="h5">ACTIONS</Typography>
                <Divider textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                        Select task while editing
                    </Typography>
                </Divider>
                <List sx={{ height: '100%' }}>
                    {actions.map((task) => (
                        <TaskItem key={task.id} task={task} handleClickTaskItem={handleAddAction} />
                    ))}
                </List>
            </Grid2>
            <Grid2
                xs={9}
                sx={{
                    pb: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: (theme) => theme.palette.grey[50]
                }}
                height="100%"
            >
                <Stack direction="column" spacing={2} bgcolor="background.paper">
                    <Box bgcolor="background.paper" p={1} borderBottom={1} borderColor={(theme) => theme.palette.divider}>
                        {/* {isSending ? (
                            <GoogleLoader height={80} width={80} loop={true} />
                        ) : ( */}
                        <Formik
                            initialValues={{ title: '' }}
                            validate={(values: { title: string }) => {
                                const errors: any = {};
                                if (!values.title) {
                                    errors['title'] = 'Required';
                                }
                                return errors;
                            }}
                            onSubmit={(values) => {
                                setIsSending(true);
                                const id = uuid();
                                const val = {
                                    title: values.title,
                                    nodes,
                                    edges,
                                    createdBy: user ?? ''
                                };
                                const workflow: Record<string, { title: string; nodes: any; edges: any; createdBy: string }> = {};
                                workflow[id] = val;
                                addWorkflow(workflow);
                                timeout.current = setTimeout(() => {
                                    enqueueSnackbar('Workflow created', { variant: 'success' });
                                    setIsSending(false);
                                }, 500);

                                // createFlow({
                                //     title: values.title,
                                //     created_by: user.uid,
                                //     nodes: nodes,
                                //     edges: edges,
                                //     viewport: null
                                // })
                                //     .unwrap()
                                //     .then(() => {
                                //         setIsSending(false);
                                //         setTimeout(() => {
                                //             const message = `Workflow Saved Succesfully`;
                                //             enqueueSnackbar(message, { variant: 'success' });
                                //         }, 300);
                                //     })
                                //     .catch(() => {
                                //         setIsSending(false);
                                //         setTimeout(() => {
                                //             const message = `Failed to send`;
                                //             enqueueSnackbar(message, { variant: 'error' });
                                //         }, 300);
                                //     });
                            }}
                        >
                            {({ values, handleChange, handleBlur, handleSubmit }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Grid2 container direction="row" spacing={1}>
                                        <Grid2 xs={9}>
                                            <FormikText
                                                multiline
                                                fullWidth
                                                maxRows={5}
                                                size="small"
                                                minRows={1}
                                                id="title"
                                                variant="outlined"
                                                placeholder="Enter Workflow title"
                                                name="title"
                                                label="Workflow title"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                onKeyDown={(e: any) => {
                                                    e.key === 'Enter' && e.preventDefault();
                                                }}
                                            />
                                        </Grid2>
                                        <Grid2 xs={3} display="flex" justifyContent="end">
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                sx={{ height: 'max-content' }}
                                                disabled={nodes.length < 1 || isSending}
                                                onKeyDown={(e) => {
                                                    e.key === 'Enter' && e.preventDefault();
                                                }}
                                                startIcon={isSending ? <CircularProgress size={15} /> : <Save />}
                                            >
                                                Save Workflow
                                            </Button>
                                        </Grid2>
                                    </Grid2>
                                </Form>
                            )}
                        </Formik>
                        {/* )} */}
                    </Box>
                </Stack>
                <TestFlow />
                {/* <Content /> */}
            </Grid2>
        </Grid2>
    );
};

function getStyles(left: number, top: number, isDragging: boolean): CSSProperties {
    const transform = `translate3d(${left}px, ${top}px, 0)`;
    return {
        position: 'absolute',
        transform,
        WebkitTransform: transform,
        // IE fallback: hide the real node using CSS when dragging
        // because IE will ignore our custom "empty image" drag preview.
        opacity: isDragging ? 0 : 1,
        height: isDragging ? 0 : ''
    };
}

export interface DraggableBoxProps {
    id: string;
    title: string;
    left: number;
    top: number;
}

const TaskItem = ({ task, handleClickTaskItem }: { task: IAction; handleClickTaskItem: (node: IWorkflowActionTypes) => void }) => {
    const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
        // "type" is required. It is used by the "accept" specification of drop targets.
        type: ItemTypes.Task,
        item: { title: task.title },
        // The collect function utilizes a "monitor" instance (see the Overview for what this is)
        // to pull important pieces of state from the DnD system.
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }));
    useEffect(() => {
        dragPreview(getEmptyImage(), { captureDraggingState: true });
    }, [dragPreview]);
    return (
        <ListItemButton
            ref={drag}
            sx={{
                borderRadius: 1.5,
                border: 0.5,
                px: 1,
                py: 0.2,
                mb: 3,
                borderColor: (theme) => theme.palette.common.black,
                bgcolor: (theme) => (isDragging ? alpha(theme.palette.primary.main, 0.7) : alpha(theme.palette.primary.main, 0.1)),
                opacity: isDragging ? 0 : 1
            }}
            onClick={() => {
                handleClickTaskItem(task.type);
            }}
        >
            <ListItemIcon>
                <BsGear size={20} />
            </ListItemIcon>
            <ListItemText primary={task.title} />
        </ListItemButton>
    );
};
