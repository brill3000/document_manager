import { CssVarsProvider } from '@mui/joy/styles';
import theme from '../../../../global/Themes/theme';
// import Box from '@mui/joy/Box';
import Tabs from '@mui/joy/Tabs';

import Button from '@mui/joy/Button';
import { Box, Card, CardContent, Grid, Stack, Typography, useTheme } from '@mui/material';
import TextField from '@mui/joy/TextField';
import { Delete, Save } from '@mui/icons-material';
// import DraggableList from './DraggableLists';
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import { Formik } from 'formik';

import Checkbox from '@mui/joy/Checkbox';
import { useCreateWorkflowMutation, useGetSavedWorkflowsQuery } from 'store/async/workflowQuery';
import { ReactFlowProvider, useEdgesState, useNodesState } from 'reactflow';
import { ActionButtons } from '../UI/ActionButtons';
import { useUserAuth } from 'context/authContext';
import { useSnackbar } from 'notistack';
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';
import { FlowTabList } from './FlowTabList';
import TestFlow from './flowTest/TestFlow';
import { IWorkflowPanelProps } from 'global/interfaces';
import { TabPanel } from 'components/documents/views/UI/Tabs';
import { ChangeEventHandler, SyntheticEvent, useCallback, useRef, useState } from 'react';

export function FormsCard({
    title,
    type,
    description,
    width
}: {
    title: string;
    type: string;
    description?: string;
    height?: number | string;
    width?: number | string;
}) {
    return (
        <Card
            sx={{
                minWidth: width ? width : '260px',
                maxWidth: width ? width : 'max-content',
                gap: 2,
                bgcolor: 'background.paper'
            }}
        >
            <CardContent>
                <Typography color="success" mb={0.5}>
                    {title ?? ''}
                </Typography>
                <Typography variant="body2">{description ?? ''}</Typography>
            </CardContent>
            <Box
                color="primary"
                sx={{
                    px: 0.2,
                    writingMode: 'vertical-rl',
                    textAlign: 'center',
                    fontSize: 'xs2',
                    fontWeight: 'xl2',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                }}
            >
                {type ?? ''}
            </Box>
        </Card>
    );
}

const getNodeId = () => `randomnode_${+new Date()}`;

export default function CreateFlow() {
    // ============================ |  | ================================= //

    const [index, setIndex] = useState<string | number | boolean>(0);
    const [newFormTitle, setNewFormTitle] = useState('');
    const [formComponents, setFormComponents] = useState<Array<any>>([]);
    const [openEditIndex, setOpenEditIndex] = useState({
        input: false,
        large_input: false,
        checkbox: false,
        radio: false,
        select: false,
        submit: false
    });
    const [editDetails, setEditDetails] = useState<Array<any>>([]);

    const [savedForms, setSavedForms] = useState<Array<any>>([]);
    const [createFlow] = useCreateWorkflowMutation();
    const { user } = useUserAuth();
    const [openForm, setOpenForm] = useState(false);
    const yPos = useRef(0);
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const { enqueueSnackbar } = useSnackbar();
    const [isSending, setIsSending] = useState<boolean>(false);

    const [tab, setTab] = useState<number>(0);

    const handleChangeTab = (event: SyntheticEvent<Element, Event>, newValue: number) => {
        setTab(newValue);
    };

    // ============================ | THEME | ================================= //
    const theme = useTheme();

    const onAdd = useCallback(
        (title: string, actions?: { type: string; action: string }) => {
            yPos.current += 50;
            let newNode: any = null;
            if (actions) {
                newNode = {
                    id: getNodeId(),
                    type: 'actionNode',
                    data: {
                        type: actions.type,
                        action: actions.action,
                        title: title
                    },
                    position: { x: 350, y: yPos.current },
                    style: {
                        border: '.8px solid #222138',
                        minWidth: 130,
                        size: '10px',
                        maxWidth: 'min-content',
                        borderRadius: '10px'
                    }
                };
            } else {
                newNode = {
                    id: getNodeId(),
                    data: {
                        label: title
                    },
                    position: { x: 350, y: yPos.current },
                    style: {
                        border: '..8px solid #222138',
                        minWidth: 130,
                        size: '10px',
                        maxWidth: 'min-content',
                        borderRadius: '10px'
                    }
                };
            }

            setNodes((nds) => nds.concat(newNode));
            setOpenForm(false);
        },
        [setNodes]
    );

    const handleNewFormTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setNewFormTitle(e.target.value);
    };
    const addFormComponent = (
        type: string,
        label: string,
        uid: string,
        placeholder?: string,
        minRows?: number,
        isRequired?: boolean | string,
        initialValue?: string,
        defaultChecked?: boolean
    ) => {
        switch (type) {
            case 'input':
                const input = {
                    id: uid,
                    label: label,
                    placeholder: placeholder,
                    initialValue: initialValue,
                    element: (
                        <TextField
                            defaultValue={initialValue ?? ''}
                            placeholder={placeholder ?? 'Enter text here...'}
                            size="sm"
                            fullWidth
                        />
                    ),
                    delete: (
                        <Box sx={{ maxHeight: 20, ml: 1 }}>
                            <IconButton
                                variant="outlined"
                                size="sm"
                                color="danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const formComponentsCopy = [...formComponents];

                                    const index = formComponentsCopy.findIndex((x) => {
                                        return x.id === uid;
                                    });
                                    if (index > -1) {
                                        formComponentsCopy.splice(index, 1);
                                    }

                                    setFormComponents([...formComponentsCopy]);
                                }}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Box>
                    )
                };
                Array.isArray(formComponents) && formComponents.length < 1
                    ? setFormComponents([input])
                    : setFormComponents([...formComponents, input]);
                break;
            case 'large_input':
                const large_input = {
                    id: uid,
                    label: label,
                    placeholder: placeholder,
                    initialValue: initialValue,
                    element: (
                        <Textarea
                            defaultValue={initialValue ?? ''}
                            placeholder={placeholder ?? 'Enter text here...'}
                            size="sm"
                            minRows={minRows ?? 3}
                        />
                    ),
                    delete: (
                        <Box sx={{ maxHeight: 20, ml: 1 }}>
                            <IconButton
                                variant="outlined"
                                size="sm"
                                color="danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const formComponentsCopy = [...formComponents];
                                    const index = formComponentsCopy.findIndex((x) => x.id === uid);
                                    if (index > -1) {
                                        formComponentsCopy.splice(index, 1);
                                    }

                                    setFormComponents([...formComponentsCopy]);
                                }}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Box>
                    )
                };
                Array.isArray(formComponents) && formComponents.length < 1
                    ? setFormComponents([large_input])
                    : setFormComponents([...formComponents, large_input]);
                break;
            case 'checkbox':
                const checkbox = {
                    id: uid,
                    label: label,
                    placeholder: placeholder,
                    initialValue: initialValue,
                    element: <Checkbox defaultChecked={defaultChecked} />,
                    delete: (
                        <Box sx={{ maxHeight: 20, ml: 1 }}>
                            <IconButton
                                variant="outlined"
                                size="sm"
                                color="danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const formComponentsCopy = [...formComponents];
                                    const index = formComponentsCopy.findIndex((x) => x.id === uid);
                                    if (index > -1) {
                                        formComponentsCopy.splice(index, 1);
                                    }
                                    setFormComponents([...formComponentsCopy]);
                                }}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Box>
                    )
                };
                Array.isArray(formComponents) && formComponents.length < 1
                    ? setFormComponents([checkbox])
                    : setFormComponents([...formComponents, checkbox]);
                break;
            case 'submit':
                const submit = {
                    id: uid,
                    label: label,
                    placeholder: placeholder,
                    initialValue: initialValue,
                    button: true,
                    element: (
                        <Button variant="solid" size="sm" color="success" startIcon={<Save />}>
                            {label}
                        </Button>
                    ),
                    delete: (
                        <Box sx={{ maxHeight: 20, ml: 1 }}>
                            <IconButton
                                variant="outlined"
                                size="sm"
                                color="danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const formComponentsCopy = [...formComponents];
                                    const index = formComponentsCopy.findIndex((x) => x.id === uid);
                                    if (index > -1) {
                                        formComponentsCopy.splice(index, 1);
                                    }
                                    setFormComponents([...formComponentsCopy]);
                                }}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Box>
                    )
                };
                Array.isArray(formComponents) && formComponents.length < 1
                    ? !formComponents.some((x) => x.button) && setFormComponents([submit])
                    : setFormComponents([...formComponents, submit]);
                break;
            default:
                break;
        }
    };

    return (
        <>
            <FlowTabList tab={tab} handleChangeTab={handleChangeTab} />
            <TabPanel value={tab} index={0}>
                <Typography>tab {tab}</Typography>
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <Typography>tab {tab}</Typography>
            </TabPanel>
            <TabPanel value={tab} index={2}>
                <Typography>tab {tab}</Typography>
            </TabPanel>
        </>

        // <CssVarsProvider disableTransitionOnChange theme={theme}>
        //     <Box
        //         sx={{
        //             bgcolor: 'background.body',
        //             flexGrow: 1,
        //             m: -3,
        //             p: 3,
        //             overflowX: 'hidden',
        //             borderRadius: 'md'
        //         }}
        //     >
        //         <Tabs
        //             aria-label="Pipeline"
        //             // 👇️ ts-ignore ignores any ts errors on the next line
        //             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //             // @ts-ignore
        //             value={index}
        //             onChange={(event, value) => setIndex(value)}
        //         >
        //             <FlowTabList />
        //             <Box
        //                 sx={(theme) => ({
        //                     '--bg': theme.vars.palette.background.level3,
        //                     height: '1px',
        //                     background: 'var(--bg)',
        //                     boxShadow: '0 0 0 100vmax var(--bg)',
        //                     clipPath: 'inset(0 -100vmax)'
        //                 })}
        //             />
        //             <Box
        //                 sx={(theme) => ({
        //                     '--bg': theme.vars.palette.background.level1,
        //                     background: 'var(--bg)',
        //                     boxShadow: '0 0 0 100vmax var(--bg)',
        //                     clipPath: 'inset(0 -100vmax)',
        //                     px: 1.5,
        //                     py: 2
        //                 })}
        //             >
        //                 <FormsPanel
        //                     newFormTitle={newFormTitle}
        //                     handleNewFormTitleChange={handleNewFormTitleChange}
        //                     openEditIndex={openEditIndex}
        //                     setOpenEditIndex={setOpenEditIndex}
        //                     setEditDetails={setEditDetails}
        //                     addFormComponent={addFormComponent}
        //                     formComponents={formComponents}
        //                     savedForms={savedForms}
        //                     setSavedForms={setSavedForms}
        //                     setFormComponents={setFormComponents}
        //                     setNewFormTitle={setNewFormTitle}
        //                     editDetails={editDetails}
        //                 />

        //                 <WorkflowPanel
        //                     isSending={isSending}
        //                     setIsSending={setIsSending}
        //                     createFlow={createFlow}
        //                     user={user}
        //                     nodes={nodes}
        //                     edges={edges}
        //                     enqueueSnackbar={enqueueSnackbar}
        //                     openForm={openForm}
        //                     setOpenForm={setOpenForm}
        //                     onAdd={onAdd}
        //                     setNodes={setNodes}
        //                     setEdges={setEdges}
        //                     workflowQuery
        //                 />
        //                 <TabPanel value={2} sx={{ height: '600px' }}>
        //                     <Box sx={{ height: '600px' }}>
        //                         <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
        //                             <Button variant="soft">Initiate Workflow</Button>
        //                         </Box>
        //                     </Box>
        //                 </TabPanel>
        //             </Box>
        //         </Tabs>
        //     </Box>
        // </CssVarsProvider>
    );
}

// const WorkflowPanel = ({
//     isSending,
//     setIsSending,
//     createFlow,
//     user,
//     nodes,
//     edges,
//     enqueueSnackbar,
//     openForm,
//     setOpenForm,
//     onAdd,
//     setNodes,
//     setEdges,
//     workflowQuery
// }: IWorkflowPanelProps) => {
//     return (
//         <TabPanel value={1} sx={{ height: '600px' }}>
//             <Grid container direction="row" sx={{ height: '600px' }}>
//                 <Grid item xs={3} sx={{ bgcolor: 'neutral.100', borderRadius: 5, p: 3 }}>
//                     <Stack direction="column" spacing={2}>
//                         {isSending ? (
//                             <GoogleLoader height={80} width={80} loop={true} />
//                         ) : (
//                             <Formik
//                                 initialValues={{ title: '' }}
//                                 validate={(values) => {
//                                     const errors: any = {};
//                                     if (!values.title) {
//                                         errors['title'] = 'Required';
//                                     }
//                                     return errors;
//                                 }}
//                                 onSubmit={(values) => {
//                                     setIsSending(true);
//                                     createFlow({
//                                         title: values.title,
//                                         created_by: user.uid,
//                                         nodes: nodes,
//                                         edges: edges,
//                                         viewport: null
//                                     })
//                                         .unwrap()
//                                         .then(() => {
//                                             setIsSending(false);
//                                             setTimeout(() => {
//                                                 const message = `Workflow Saved Succesfully`;
//                                                 enqueueSnackbar(message, { variant: 'success' });
//                                             }, 300);
//                                         })
//                                         .catch(() => {
//                                             setIsSending(false);
//                                             setTimeout(() => {
//                                                 const message = `Failed to send`;
//                                                 enqueueSnackbar(message, { variant: 'error' });
//                                             }, 300);
//                                         });
//                                 }}
//                             >
//                                 {({ values, handleChange, handleBlur, handleSubmit }) => (
//                                     <form onSubmit={handleSubmit}>
//                                         <Grid container direction="row" spacing={1}>
//                                             <Grid item xs={10}>
//                                                 <FormikTextMultiline
//                                                     name="title"
//                                                     placeholder="Enter Workflow title"
//                                                     onChange={handleChange}
//                                                     onBlur={handleBlur}
//                                                     value={values.title}
//                                                     disabled={nodes.length < 1}
//                                                     onKeyPress={(e: any) => {
//                                                         e.key === 'Enter' && e.preventDefault();
//                                                     }}
//                                                 />
//                                             </Grid>
//                                             <Grid item xs={2}>
//                                                 {isSending ? (
//                                                     <Box
//                                                         display="flex"
//                                                         justifyContent="center"
//                                                         alignItems="center"
//                                                         minHeight="100%"
//                                                         minWidth="100%"
//                                                     >
//                                                         <GoogleLoader height={50} width={50} loop={true} />
//                                                     </Box>
//                                                 ) : (
//                                                     <IconButton
//                                                         variant="solid"
//                                                         type="submit"
//                                                         disabled={nodes.length < 1}
//                                                         onKeyPress={(e) => {
//                                                             e.key === 'Enter' && e.preventDefault();
//                                                         }}
//                                                     >
//                                                         <Save />
//                                                     </IconButton>
//                                                 )}
//                                             </Grid>
//                                         </Grid>
//                                     </form>
//                                 )}
//                             </Formik>
//                         )}
//                         <ReactFlowProvider>
//                             <ActionButtons openForm={openForm} setOpenForm={setOpenForm} onAdd={onAdd} />
//                         </ReactFlowProvider>
//                     </Stack>
//                 </Grid>
//                 <Grid item xs={6} sx={{ borderRadius: 5, pr: 5, maxWidth: 200 }}>
//                     <TestFlow />
//                 </Grid>
//                 <Grid item xs={3} sx={{ bgcolor: 'neutral.100', borderRadius: 5, p: 3 }}>
//                     {workflowQuery.isLoading || workflowQuery.isFetching ? (
//                         <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
//                             <GoogleLoader height={150} width={150} loop={true} />
//                         </Box>
//                     ) : workflowQuery.isError ? (
//                         <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
//                             <Error height={100} width={100} />
//                             <Typography level="body3">Error Occured..</Typography>
//                         </Box>
//                     ) : (
//                         <Stack direction="column" spacing={1}>
//                             <Typography level="h1" component="div" fontSize="xl2" mb={2} textColor="text.secondary">
//                                 Templates Workflows
//                             </Typography>

//                             {workflowQuery.data &&
//                                 Array.isArray(workflowQuery.data) &&
//                                 workflowQuery.data.map((workflow: any, index: number) => {
//                                     return (
//                                         <div
//                                             onClick={() => {
//                                                 setNodes(workflow.nodes);
//                                                 setEdges(workflow.edge);
//                                             }}
//                                             key={index}
//                                         >
//                                             <FormsCard
//                                                 key={workflow.id}
//                                                 title={workflow.title}
//                                                 description={workflow.title}
//                                                 type="workflow"
//                                             />
//                                         </div>
//                                     );
//                                 })}
//                         </Stack>
//                     )}
//                 </Grid>
//             </Grid>
//         </TabPanel>
//     );
// };
