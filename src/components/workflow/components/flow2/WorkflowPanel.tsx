import { Save } from '@mui/icons-material';
import {
    Box,
    Button,
    ButtonBase,
    Divider,
    IconButton,
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
import { Form, Formik } from 'formik';
import { ITask, IWorkflowPanelProps } from 'global/interfaces';
import { ReactFlowProvider } from 'reactflow';
import { GoogleLoader } from 'ui-component/LoadHandlers';
import { ActionButtons } from '../UI/ActionButtons';
import { FormikText } from 'global/UI/FormMUI/Components';
import TestFlow from '../flow/flowTest/TestFlow';
import { Content } from '../main/content';
import { BsGear } from 'react-icons/bs';
import { useDrag } from 'react-dnd';
import { ItemTypes } from 'components/documents/Interface/Constants';
import { CSSProperties, useEffect } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
const tasks: ITask[] = [
    { id: 1, title: 'Upload file' },
    { id: 2, title: 'Fill form' },
    { id: 3, title: 'Vote' }
];

export const WorkflowPanel = ({ isSending, setIsSending, nodes, openForm, setOpenForm, onAdd }: IWorkflowPanelProps) => {
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
                <Typography variant="h5">TASKS</Typography>
                <Divider textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                        Drag task
                    </Typography>
                </Divider>
                <List sx={{ height: '100%' }}>
                    {tasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
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
                {/* <Stack direction="column" spacing={2} bgcolor="background.paper"> */}
                {/* <Box bgcolor="background.paper" p={1} borderBottom={1} borderColor={(theme) => theme.palette.divider}>
                    {isSending ? (
                        <GoogleLoader height={80} width={80} loop={true} />
                    ) : (
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
                                            {isSending ? (
                                                <Box
                                                    display="flex"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    minHeight="100%"
                                                    minWidth="100%"
                                                >
                                                    <GoogleLoader height={50} width={50} loop={true} />
                                                </Box>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    sx={{ height: 'max-content' }}
                                                    disabled={nodes.length < 1}
                                                    onKeyDown={(e) => {
                                                        e.key === 'Enter' && e.preventDefault();
                                                    }}
                                                    startIcon={<Save />}
                                                >
                                                    Save Workflow
                                                </Button>
                                            )}
                                        </Grid2>
                                    </Grid2>
                                </Form>
                            )}
                        </Formik>
                    )}
                </Box> */}
                {/* <ReactFlowProvider>
                        <ActionButtons openForm={openForm} setOpenForm={setOpenForm} onAdd={onAdd} />
                    </ReactFlowProvider> */}
                {/* </Stack> */}
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

const TaskItem = ({ task }: { task: ITask }) => {
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
        >
            <ListItemIcon>
                <BsGear size={20} />
            </ListItemIcon>
            <ListItemText primary={task.title} />
        </ListItemButton>
    );
};
