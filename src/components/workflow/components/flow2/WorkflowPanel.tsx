import { Save } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Form, Formik } from 'formik';
import { FormikTextMultiline } from 'global/UI/FormMUI/Components';
import { IWorkflowPanelProps } from 'global/interfaces';
import { ReactFlowProvider } from 'react-flow-renderer';
import { GoogleLoader } from 'ui-component/LoadHandlers';
import { ActionButtons } from '../UI/ActionButtons';
// import TestFlow from '../flow/flowTest/testFlow';

export const WorkflowPanel = ({ isSending, setIsSending, nodes, openForm, setOpenForm, onAdd }: IWorkflowPanelProps) => {
    return (
        <Grid2 container direction="row" sx={{ height: '600px' }}>
            <Grid2 xs={3} sx={{ bgcolor: (theme) => theme.palette.grey[100], borderRadius: 5, p: 3 }}>
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
                                console.log(values, values);
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
                                            <FormikTextMultiline
                                                name="title"
                                                placeholder="Enter Workflow title"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.title}
                                                disabled={nodes.length < 1}
                                                onKeyPress={(e: any) => {
                                                    e.key === 'Enter' && e.preventDefault();
                                                }}
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
            {/* <Grid2 xs={6} sx={{ borderRadius: 5, pr: 5, maxWidth: 200 }}>
                <TestFlow />
            </Grid2> */}
            <Grid2 xs={3} sx={{ bgcolor: 'neutral.100', borderRadius: 5, p: 3 }}>
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
                    <Typography variant="h3" component={Box} mb={2} color="text.secondary">
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
