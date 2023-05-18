import React from 'react';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { Box } from '@mui/material';
import { Stack, Typography, Button } from '@mui/material';
import { Formik } from 'formik';
import { FormikAutoComplete, FormikTextMaterialMultiline } from 'global/UI/FormMUI/Components';
import { useGetSystemUsersQuery } from 'store/async/usersQuery';
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';
import { useCreateApprovalWorkflowMutation } from 'store/async/workflowQuery';
import { useUserAuth } from 'context/authContext';
import { useSnackbar } from 'notistack';

export default function DocumentApprovalWorkflow({ name, id }) {
    const usersQuery = useGetSystemUsersQuery();
    const [title, setTitle] = React.useState('');
    const { user } = useUserAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [isSending, setIsSending] = React.useState(false);

    React.useEffect(() => {
        let title = name.split('.');
        title.splice(title.length - 1, 1);
        setTitle(title.join('') + ' approval workflow');
    }, [name]);

    const [createApprovalWorkflow] = useCreateApprovalWorkflowMutation();

    return usersQuery.isLoading || usersQuery.isFetching ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300} minWidth={500}>
            <GoogleLoader height={150} width={150} loop={true} />
        </Box>
    ) : usersQuery.isError ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300} minWidth={500}>
            <Error height={100} width={100} />
            <Typography variant="body1">Error Occured..</Typography>
        </Box>
    ) : (
        Array.isArray(usersQuery.data) && (
            <Box
                spacing={1}
                sx={{
                    bgcolor: 'white',
                    minHeight: 300,
                    minWidth: 500,
                    maxWidth: 500,
                    p: 1
                }}
            >
                <Formik
                    initialValues={{ title: title ?? '' }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.title) {
                            errors['title'] = 'Required';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        // const nodes = [

                        //     {
                        //         id: '2',
                        //         data: {
                        //             label: (
                        //                 <>
                        //                     <strong>Stake holder consultation</strong>
                        //                 </>
                        //             ),
                        //         },
                        //         position: { x: 100, y: 100 },
                        //     },
                        //     {
                        //         id: '3',
                        //         data: {
                        //             label: (
                        //                 <>
                        //                     <strong>Document Assembly</strong>
                        //                 </>
                        //             ),
                        //         },
                        //         position: { x: 400, y: 100 },
                        //         style: {
                        //             background: '#D6D5E6',
                        //             color: '#333',
                        //             border: '1px solid #222138',
                        //             width: 180,
                        //         },
                        //     },
                        //     {
                        //         id: '4',
                        //         position: { x: 250, y: 200 },
                        //         data: {
                        //             label: 'Assignment of Approval Document',
                        //         },
                        //     },
                        //     {
                        //         id: '5',
                        //         data: {
                        //             label: 'Signing and approval of document',
                        //         },
                        //         position: { x: 250, y: 325 },
                        //     },
                        //     {
                        //         id: '6',
                        //         type: 'output',
                        //         data: {
                        //             label: (
                        //                 <>
                        //                     <strong>Complete and filing of Licencing Agreement</strong>
                        //                 </>
                        //             ),
                        //         },
                        //         position: { x: 100, y: 480 },
                        //     },
                        //     {
                        //         id: '7',
                        //         type: 'output',
                        //         data: { label: 'Report Generation and Feedback' },
                        //         position: { x: 400, y: 450 },
                        //     },
                        // ];

                        // const edges = [
                        //     { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
                        //     { id: 'e1-3', source: '1', target: '3' },
                        //     {
                        //         id: 'e3-4',
                        //         source: '3',
                        //         target: '4',
                        //         animated: true,
                        //         label: 'animated edge',
                        //     },
                        //     {
                        //         id: 'e4-5',
                        //         source: '4',
                        //         target: '5',
                        //         label: 'edge with arrow head',
                        //         markerEnd: {
                        //             type: MarkerType.ArrowClosed,
                        //         },
                        //     },
                        //     {
                        //         id: 'e5-6',
                        //         source: '5',
                        //         target: '6',
                        //         type: 'smoothstep',
                        //         label: 'smooth step edge',
                        //     },
                        //     {
                        //         id: 'e5-7',
                        //         source: '5',
                        //         target: '7',
                        //         type: 'step',
                        //         style: { stroke: '#f6ab6c' },
                        //         label: 'a step edge',
                        //         animated: true,
                        //         labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
                        //     },
                        // ];
                        // const nodes = [
                        //     {
                        //         data: {
                        //             label: `Approval Start: ${values.title}`
                        //         },
                        //         id: 'start',
                        //         postion: { x: 0, y: 0 },
                        //         type: 'input',
                        //         selected: true,
                        //         style: {
                        //             background: '#D6D5E6',
                        //             color: '#333',
                        //             border: '1px solid #222138',
                        //         },
                        //     },
                        //     {
                        //         data: {
                        //             label: `Approval End: ${values.title}`
                        //         },
                        //         id: 'end',
                        //         position: { x: 0, y: 400 },
                        //         type: 'output',
                        //         selected: false,
                        //     }
                        // ]
                        // const edges = [
                        //     {
                        //         id: 'e1-2',
                        //         source: 'start',
                        //         target: 'end',
                        //         label: 'this is an edge label',
                        //         type: 'smoothstep',
                        //     },
                        // ]

                        const nodes = [];
                        const edges = [];
                        if (Array.isArray(values.approvers)) {
                            values.approvers.forEach((approver, index) => {
                                nodes.push({
                                    data: {
                                        label: `${approver.name}`
                                    },
                                    id: approver.user_id,
                                    position: { x: index * 300, y: 200 },
                                    type: 'input',
                                    selected: false
                                });
                                edges.push({
                                    id: approver.user_id + ':::start',
                                    source: 'start',
                                    target: approver.user_id,
                                    type: 'smoothstep'
                                });
                                edges.push({
                                    id: approver.user_id + ':::end',
                                    source: approver.user_id,
                                    target: 'end',
                                    type: 'smoothstep'
                                });
                            });
                        }
                        createApprovalWorkflow({
                            title: values.title,
                            created_by: user.uid,
                            nodes: nodes,
                            edges: edges,
                            approvers: values.approvers ?? [],
                            viewport: null,
                            file_id: id ?? null
                        })
                            .unwrap()
                            .then(() => {
                                setIsSending(false);
                                setSubmitting(false);
                                setTimeout(() => {
                                    const message = `Workflow Saved Succesfully`;
                                    enqueueSnackbar(message, { variant: 'success' });
                                }, 300);
                            })
                            .catch(() => {
                                setIsSending(false);
                                setTimeout(() => {
                                    const message = `Failed to send`;
                                    enqueueSnackbar(message, { variant: 'error' });
                                }, 300);
                            });
                    }}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue
                        /* and other goodies */
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Stack direction={'column'} spacing={2}>
                                <FormikTextMaterialMultiline
                                    label="Title"
                                    name="title"
                                    multiline={true}
                                    placeholder="Enter Workflow Title"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onKeyPress={(e) => {
                                        e.key === 'Enter' && e.preventDefault();
                                    }}
                                />
                                <FormikAutoComplete
                                    variant="outlined"
                                    multiple={true}
                                    name="approvers"
                                    sx={{ width: '100%' }}
                                    options={
                                        usersQuery.data.map((user) => ({
                                            ...user,
                                            name: `${user.name.first_name} ${user.name.last_name}`
                                        })) ?? []
                                    }
                                    placeholder="Approval"
                                    setFieldValue={setFieldValue}
                                />
                                <Box
                                    sx={{
                                        maxHeight: 30
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitting}
                                        startIcon={<PlayArrowRoundedIcon />}
                                        onKeyPress={(e) => {
                                            e.key === 'Enter' && e.preventDefault();
                                        }}
                                    >
                                        Start Workflow
                                    </Button>
                                </Box>
                            </Stack>
                        </form>
                    )}
                </Formik>
            </Box>
        )
    );
}
