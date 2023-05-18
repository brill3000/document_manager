import { Handle, Position } from 'react-flow-renderer';
import { Edit, Save } from '@mui/icons-material';
import { Box, Divider, Experimental_CssVarsProvider, Grid } from '@mui/material';
import { Stack } from '@mui/material';
import { Formik } from 'formik';
import { FormikTextMultiline } from 'global/UI/FormMUI/Components';
import React from 'react';
import ActionSelect from './ActionSelect';
import ActionDial from './Actiondial';
import ThemeCustomization from 'themes';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import useStore from './store';

export default function TextUpdaterNode({ id, data }) {
    const [selectedAction, setSelectedAction] = React.useState(null);
    const updateNodeLabel = useStore((state) => state.updateNodeLabel);
    const [update, setUpdate] = React.useState(true);
    console.log(data);
    return (
        <>
            <Handle type="target" position={Position.Top} />
            <Box spacing={1} sx={{ bgcolor: 'white', borderRadius: 0.8, p: 1, border: '2px solid black', minWidth: 200, maxWidth: 350 }}>
                {update ? (
                    <Formik
                        initialValues={{ title: data ? data.label : '' }}
                        validate={(values) => {
                            const errors = {};
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
                                updateNodeLabel(id, values.title, action);
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
                                        <FormikTextMultiline
                                            label="Title"
                                            name="title"
                                            placeholder="Enter Process title"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            onKeyPress={(e) => {
                                                e.key === 'Enter' && e.preventDefault();
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                maxHeight: 30
                                            }}
                                        >
                                            <IconButton
                                                variant="solid"
                                                type="submit"
                                                color="success"
                                                disabled={isSubmitting}
                                                onKeyPress={(e) => {
                                                    e.key === 'Enter' && e.preventDefault();
                                                }}
                                            >
                                                <Save />
                                            </IconButton>
                                        </Box>
                                    </Stack>

                                    <Divider />
                                    <Typography level="body4">Add Action Taken</Typography>
                                    <Experimental_CssVarsProvider>
                                        <ThemeCustomization>
                                            <Grid container justifyContent={'flex-start'}>
                                                <Grid item>
                                                    <ActionDial setSelectedAction={(val) => setSelectedAction(val)} />
                                                </Grid>
                                            </Grid>
                                        </ThemeCustomization>
                                    </Experimental_CssVarsProvider>
                                    {selectedAction && <ActionSelect name="action" selectedAction={selectedAction} />}
                                </Stack>
                            </form>
                        )}
                    </Formik>
                ) : (
                    <Grid container direction="row">
                        <Grid item xs={10}>
                            <Typography level="body2">{data.label}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton
                                variant="solid"
                                color="danger"
                                size="sm"
                                onKeyPress={(e) => {
                                    e.key === 'Enter' && e.preventDefault();
                                }}
                                onClick={() => setUpdate(true)}
                            >
                                <Edit />
                            </IconButton>
                        </Grid>
                    </Grid>
                )}
            </Box>
            <Handle type="source" position={Position.Bottom} id="a" />
        </>
    );
}
