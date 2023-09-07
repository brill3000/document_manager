import { Handle, Position } from 'reactflow';
import { Edit, Save } from '@mui/icons-material';
import { Box, Divider, Grid, IconButton, Typography } from '@mui/material';
import { Stack } from '@mui/material';
import { Formik } from 'formik';
import { useState } from 'react';
import useStore from './store';
import ActionDial from './Actiondial';
import { ActionSelect } from '../../UI';
import { FormikText } from 'global/UI/FormMUI/Components';

export default function TextUpdaterNode({ id, data }: { id: string; data: any }) {
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const updateNodeLabel = useStore((state) => state.updateNodeLabel);
    const [update, setUpdate] = useState(true);
    console.log(data);
    return (
        <>
            <Handle type="target" position={Position.Top} />
            <Stack sx={{ bgcolor: 'white', borderRadius: 0.8, p: 1, border: '2px solid black', minWidth: 200, maxWidth: 350 }}>
                {update ? (
                    <Formik
                        initialValues={{ title: data ? data.label : '', action: '' }}
                        validate={(values) => {
                            const errors: any = {};
                            if (!values.title) {
                                errors['title'] = 'Required';
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            let actionArray = null;
                            let action = null;
                            if (values.action && typeof values.action === 'string') {
                                actionArray = values.action.split(':::');
                                action = {
                                    type: actionArray[0],
                                    action: actionArray[1]
                                };
                            }
                            if (action) {
                                updateNodeLabel(id, values.title);
                            } else {
                                updateNodeLabel(id, values.title);
                            }
                            setSubmitting(false);
                            setUpdate(false);
                        }}
                    >
                        {({
                            values,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting
                            /* and other goodies */
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Stack direction={'column'} spacing={2}>
                                    <Stack direction="row" spacing={1} minWidth="100%">
                                        <FormikText
                                            id="title"
                                            variant="outlined"
                                            label="Title"
                                            name="title"
                                            placeholder="Enter Process title"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            onKeyDown={(e) => {
                                                e.key === 'Enter' && e.preventDefault();
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                maxHeight: 30
                                            }}
                                        >
                                            <IconButton
                                                type="submit"
                                                color="success"
                                                disabled={isSubmitting}
                                                onKeyDown={(e) => {
                                                    e.key === 'Enter' && e.preventDefault();
                                                }}
                                            >
                                                <Save />
                                            </IconButton>
                                        </Box>
                                    </Stack>

                                    <Divider />
                                    <Typography variant="body1">Add Action Taken</Typography>
                                    <Grid container justifyContent={'flex-start'}>
                                        <Grid item>
                                            <ActionDial setSelectedAction={(val: string) => setSelectedAction(val)} />
                                        </Grid>
                                    </Grid>
                                    {selectedAction && <ActionSelect name="action" selectedAction={selectedAction} />}
                                </Stack>
                            </form>
                        )}
                    </Formik>
                ) : (
                    <Grid container direction="row">
                        <Grid item xs={10}>
                            <Typography variant="body1">{data.label}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton
                                color="error"
                                size="small"
                                onKeyDown={(e) => {
                                    e.key === 'Enter' && e.preventDefault();
                                }}
                                onClick={() => setUpdate(true)}
                            >
                                <Edit />
                            </IconButton>
                        </Grid>
                    </Grid>
                )}
            </Stack>
            <Handle type="source" position={Position.Bottom} id="a" />
        </>
    );
}
