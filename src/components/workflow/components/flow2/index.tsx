import { ChangeEventHandler, SyntheticEvent, useCallback, useRef, useState } from 'react';
import { FlowTabList } from '../flow/FlowTabList';
import { TabPanel } from 'components/documents/views/UI/Tabs';
import { Box, Button, Checkbox, Dialog, IconButton, TextField, Typography, alpha } from '@mui/material';
import { FormsPanel } from './FormsPanel';
import { useAppContext } from 'context/appContext';
import { useEdgesState, useNodesState } from 'reactflow';
import { Delete, Save } from '@mui/icons-material';
import { WorkflowPanel } from './WorkflowPanel';
import InitiateWorkflowPanel from './InitiateWorkflowPanel';

const getNodeId = () => `randomnode_${+new Date()}`;

const CreateFlowStepper = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    // ============================ | THEME | ================================= //
    // ============================ | STATES | ================================= //
    const [tab, setTab] = useState<number>(0);
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
    const { user } = useAppContext();
    const [openForm, setOpenForm] = useState(false);
    const yPos = useRef(0);
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const [isSending, setIsSending] = useState<boolean>(false);

    // =============================== | EVENTS | =============================== //
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
                            size="small"
                            fullWidth
                        />
                    ),
                    delete: (
                        <Box sx={{ maxHeight: 20, ml: 1 }}>
                            <IconButton
                                size="small"
                                color="error"
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
                        <TextField
                            multiline
                            defaultValue={initialValue ?? ''}
                            placeholder={placeholder ?? 'Enter text here...'}
                            size="small"
                            minRows={minRows ?? 3}
                        />
                    ),
                    delete: (
                        <Box sx={{ maxHeight: 20, ml: 1 }}>
                            <IconButton
                                size="small"
                                color="error"
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
                                size="small"
                                color="error"
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
                        <Button variant="contained" size="small" color="success" startIcon={<Save />}>
                            {label}
                        </Button>
                    ),
                    delete: (
                        <Box sx={{ maxHeight: 20, ml: 1 }}>
                            <IconButton
                                size="small"
                                color="error"
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
    const handleChangeTab = (event: SyntheticEvent<Element, Event>, newValue: number) => {
        setTab(newValue);
    };
    return (
        <Dialog
            fullScreen
            sx={{
                '& .MuiPaper-root': {
                    boxShadow: (theme) =>
                        `inset 0 0 4px ${alpha(theme.palette.common.black, 0.09)}, 0 0 20px ${alpha(theme.palette.common.black, 0.15)} `,
                    borderRadius: 2
                }
            }}
            open={open}
            onClose={() => handleClose()}
        >
            <Typography component={Box} variant="h5" p={1}>
                WORKFLOW WIZARD
            </Typography>
            <FlowTabList tab={tab} handleChangeTab={handleChangeTab} />
            <TabPanel value={tab} index={0}>
                <FormsPanel
                    newFormTitle={newFormTitle}
                    handleNewFormTitleChange={handleNewFormTitleChange}
                    openEditIndex={openEditIndex}
                    setOpenEditIndex={setOpenEditIndex}
                    setEditDetails={setEditDetails}
                    addFormComponent={addFormComponent}
                    formComponents={formComponents}
                    savedForms={savedForms}
                    setSavedForms={setSavedForms}
                    setFormComponents={setFormComponents}
                    setNewFormTitle={setNewFormTitle}
                    editDetails={editDetails}
                />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <WorkflowPanel
                    isSending={isSending}
                    setIsSending={setIsSending}
                    user={user}
                    nodes={nodes}
                    edges={edges}
                    openForm={openForm}
                    setOpenForm={setOpenForm}
                    onAdd={onAdd}
                    setEdges={setEdges}
                    setNodes={setNodes}
                />
            </TabPanel>
            <TabPanel value={tab} index={2}>
                <InitiateWorkflowPanel />
            </TabPanel>
        </Dialog>
    );
};

export default CreateFlowStepper;
