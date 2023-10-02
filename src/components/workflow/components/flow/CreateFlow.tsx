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
import { useAppContext } from 'context/appContext';
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
    const { user } = useAppContext();
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

    return <FlowTabList tab={tab} handleChangeTab={handleChangeTab} />;
}
