import { Save } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Form, Formik } from 'formik';
import { IWorkflowPanelProps } from 'global/interfaces';
import { ReactFlowProvider } from 'reactflow';
import { GoogleLoader } from 'ui-component/LoadHandlers';
import { ActionButtons } from '../UI/ActionButtons';
import { FormikText } from 'global/UI/FormMUI/Components';
import TestFlow from '../flow/flowTest/TestFlow';
import { Content } from '../main/content';

export const WorkflowPanel = ({ isSending, setIsSending, nodes, openForm, setOpenForm, onAdd }: IWorkflowPanelProps) => {
    return (
        <Grid2 container direction="row" width="100%" height="100%">
            <Grid2
                xs={3}
                height="100%"
                sx={{
                    borderRight: 1,
                    borderColor: (theme) => theme.palette.divider,
                    bgColor: (theme) => theme.palette.grey[100],
                    p: 2
                }}
            >
                <Stack direction="column" spacing={2}>
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
                                        <Grid2 xs={10}>
                                            <FormikText
                                                multiline
                                                maxRows={5}
                                                size="small"
                                                minRows={1}
                                                id="title"
                                                variant="outlined"
                                                placeholder="Enter Workflow title"
                                                name="title"
                                                label="Title"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                onKeyDown={(e: any) => {
                                                    e.key === 'Enter' && e.preventDefault();
                                                }}
                                                value={values.title}
                                            />
                                        </Grid2>
                                        <Grid2 xs={2}>
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
                                                <IconButton
                                                    type="submit"
                                                    disabled={nodes.length < 1}
                                                    onKeyDown={(e) => {
                                                        e.key === 'Enter' && e.preventDefault();
                                                    }}
                                                >
                                                    <Save />
                                                </IconButton>
                                            )}
                                        </Grid2>
                                    </Grid2>
                                </Form>
                            )}
                        </Formik>
                    )}
                    <ReactFlowProvider>
                        <ActionButtons openForm={openForm} setOpenForm={setOpenForm} onAdd={onAdd} />
                    </ReactFlowProvider>
                </Stack>
            </Grid2>
            <Grid2 xs={6} sx={{ px: 4, py: 2, position: 'relative', overflow: 'hidden' }} height="100%">
                {/* <TestFlow /> */}
                <Content />
            </Grid2>
            <Grid2 xs={3} height="100%" sx={{ px: 4, py: 2, borderLeft: 1, borderColor: (theme) => theme.palette.divider }}>
                {/* {workflowQuery.isLoading || workflowQuery.isFetching ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                            <GoogleLoader height={150} width={150} loop={true} />
                        </Box>
                    ) : workflowQuery.isError ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                            <Error height={100} width={100} />
                            <Typography variant="body2">Error Occured..</Typography>
                        </Box>
                    ) : ( */}
                <Stack direction="column" spacing={1}>
                    <Typography variant="h4" component={Box} mb={2} color="text.secondary">
                        Templates Workflows
                    </Typography>

                    {/* {workflowQuery.data &&
                        Array.isArray(workflowQuery.data) &&
                        workflowQuery.data.map((workflow: any, index: number) => {
                            return (
                                <div
                                    onClick={() => {
                                        setNodes(workflow.nodes);
                                        setEdges(workflow.edge);
                                    }}
                                    key={index}
                                >
                                    <FormsCard key={workflow.id} title={workflow.title} description={workflow.title} type="workflow" />
                                </div>
                            );
                        })} */}
                </Stack>
                {/* )} */}
            </Grid2>
        </Grid2>
    );
};
