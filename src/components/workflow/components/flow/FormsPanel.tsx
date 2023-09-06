import * as React from 'react';
import Box from '@mui/joy/Box';
import TabPanel from '@mui/joy/TabPanel';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { Grid, Stack } from '@mui/material';
import TextField from '@mui/joy/TextField';
import { Add, Save } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import { Formik } from 'formik';
import { FormikText } from 'global/UI/FormMUI/Components';
import { uuidv4 } from '@firebase/util';
import { FormsCard } from './CreateFlow';
import { INewFormTitle } from 'global/interfaces';

export function FormsPanel({
    newFormTitle,
    handleNewFormTitleChange,
    openEditIndex,
    setOpenEditIndex,
    setEditDetails,
    addFormComponent,
    formComponents,
    savedForms,
    setSavedForms,
    setFormComponents,
    setNewFormTitle,
    editDetails
}: INewFormTitle) {
    return (
        <TabPanel value={0}>
            <Grid container direction="row" sx={{ height: '600px' }}>
                <Grid
                    item
                    xs={3}
                    sx={{
                        bgcolor: 'neutral.100',
                        borderRadius: 5,
                        p: 2,
                        maxHeight: '600px',
                        overflowY: 'auto'
                    }}
                >
                    <Box
                        sx={{
                            py: 2,
                            display: 'grid',
                            gap: 2,
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}
                    >
                        <TextField placeholder="Form title" variant="outlined" value={newFormTitle} onChange={handleNewFormTitleChange} />
                        <Typography level="body4">Add Form components</Typography>
                        {['input', 'large_input', 'checkbox', 'radio', 'select', 'submit'].map((type) => (
                            <Box maxWidth={300} key={type}>
                                <Button
                                    variant="solid"
                                    color={type === 'submit' ? 'success' : 'primary'}
                                    onClick={() => {
                                        const openEditIndexCopy: {
                                            input: boolean;
                                            checkbox: boolean;
                                            radio: boolean;
                                            large_input: boolean;
                                            select: boolean;
                                            submit: boolean;
                                        } = { ...openEditIndex };
                                        for (const key in openEditIndexCopy) {
                                            if (key === type) {
                                                // 👇️ ts-ignore ignores any ts errors on the next line
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                openEditIndexCopy[key] = true;
                                            } else {
                                                // 👇️ ts-ignore ignores any ts errors on the next line
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                openEditIndexCopy[key] = false;
                                            }
                                        }
                                        setOpenEditIndex({ ...openEditIndexCopy });
                                    }}
                                    startIcon={<Add />}
                                >
                                    {type === 'large_input'
                                        ? 'Large Input'
                                        : type === 'submit'
                                        ? 'Submit Button'
                                        : type[0].toUpperCase() + type.substring(1, type.length)}{' '}
                                    Field
                                </Button>
                                {
                                    // 👇️ ts-ignore ignores any ts errors on the next line
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    <Collapse in={openEditIndex[type]} timeout="auto" unmountOnExit>
                                        <Formik
                                            initialValues={{
                                                label: '',
                                                placeholder: '',
                                                minRows: 1,
                                                isRequired: '',
                                                initialValue: '',
                                                defaultChecked: false
                                            }}
                                            validate={(values) => {
                                                const errors: any = {};
                                                if (!values.label) {
                                                    errors['label'] = 'Required';
                                                }
                                                return errors;
                                            }}
                                            onSubmit={(values) => {
                                                addFormComponent(
                                                    type,
                                                    values.label,
                                                    uuidv4(),
                                                    values.placeholder,
                                                    values.minRows,
                                                    values.isRequired,
                                                    values.initialValue,
                                                    values.defaultChecked
                                                );
                                                setEditDetails([
                                                    ...editDetails,
                                                    {
                                                        type: type,
                                                        label: values.label,
                                                        placeholder: values.placeholder,
                                                        minRows: values.minRows,
                                                        isRequired: values.isRequired,
                                                        initialValues: values.initialValue,
                                                        defaultChecked: values.defaultChecked
                                                    }
                                                ]);

                                                const openEditIndexCopy = { ...openEditIndex };
                                                for (const key in openEditIndexCopy) {
                                                    // 👇️ ts-ignore ignores any ts errors on the next line
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-ignore
                                                    openEditIndexCopy[key] = false;
                                                }
                                                setOpenEditIndex({ ...openEditIndexCopy });
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
                                                    <FormikText
                                                        // 👇️ ts-ignore ignores any ts errors on the next line
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-ignore
                                                        label="Label"
                                                        name="label"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.label}
                                                        sx={{ py: 1 }}
                                                    />
                                                    {(type === 'input' || type === 'large_input') && (
                                                        <FormikText
                                                            // 👇️ ts-ignore ignores any ts errors on the next line
                                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                            // @ts-ignore
                                                            label="Placeholder"
                                                            name="placeholder"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.placeholder}
                                                            sx={{ py: 1 }}
                                                        />
                                                    )}
                                                    {type === 'large_input' && (
                                                        <FormikText
                                                            // 👇️ ts-ignore ignores any ts errors on the next line
                                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                            // @ts-ignore
                                                            label="Minimum Rows"
                                                            name="minRows"
                                                            type="number"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.minRows}
                                                        />
                                                    )}
                                                    {/* <FormikCheckbox
                                                        label="Is input required"
                                                        name="isRequired"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.isRequired}
                                                        sx={{ py: 1.5 }}
                                                    />
                                                    {type === 'checkbox' && (
                                                        <FormikCheckbox
                                                            label="Checked By Default"
                                                            name="defaultChecked"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.defaultChecked}
                                                            sx={{ py: 1.5 }}
                                                        />
                                                    )} */}
                                                    {(type === 'input' || type === 'large_input') && (
                                                        <FormikText
                                                            // 👇️ ts-ignore ignores any ts errors on the next line
                                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                            // @ts-ignore
                                                            label="Initial Value"
                                                            name="initialValue"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.initialValue}
                                                            sx={{ py: 1 }}
                                                        />
                                                    )}
                                                    <Button
                                                        variant="solid"
                                                        type="submit"
                                                        color="danger"
                                                        sx={{ mt: 2 }}
                                                        disabled={isSubmitting}
                                                        onKeyPress={(e) => {
                                                            e.key === 'Enter' && e.preventDefault();
                                                        }}
                                                    >
                                                        Add{' '}
                                                        {type === 'large_input'
                                                            ? 'Large Input'
                                                            : type === 'submit'
                                                            ? 'Submit Button'
                                                            : type[0].toUpperCase() + type.substring(1, type.length)}{' '}
                                                        Field
                                                    </Button>
                                                </form>
                                            )}
                                        </Formik>
                                    </Collapse>
                                    // addFormComponent('input')
                                }
                            </Box>
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={6} sx={{ px: 4, py: 2 }}>
                    <Stack direction="column" spacing={3} sx={{ minWidth: 400 }}>
                        <Stack direction="row" justifyContent="space-between" spacing={2}>
                            <Box sx={{ maxWidth: 350 }}>
                                <Typography level="h1" component="div" fontSize="xl2" mb={2} textColor="text.secondary">
                                    {newFormTitle.length > 0 ? newFormTitle : 'New Forms'}
                                </Typography>
                            </Box>
                            <Box sx={{ maxHeight: 10 }}>
                                <Button
                                    variant="solid"
                                    color="info"
                                    startIcon={<Save />}
                                    onClick={() => {
                                        if (formComponents && Array.isArray(formComponents) && formComponents.length) {
                                            savedForms.length > 0
                                                ? setSavedForms([
                                                      ...savedForms,
                                                      { title: newFormTitle.length > 0 ? newFormTitle : 'Form' + savedForms.length }
                                                  ])
                                                : setSavedForms([
                                                      { title: newFormTitle.length > 0 ? newFormTitle : 'Form' + savedForms.length }
                                                  ]);
                                            setFormComponents([]);
                                            setNewFormTitle('');
                                        }
                                    }}
                                    disabled={newFormTitle.length < 1}
                                >
                                    Save Form
                                </Button>
                            </Box>
                        </Stack>

                        {formComponents.length > 0 &&
                            formComponents.map((formComponent) => (
                                <Grid container direction="row" key={formComponent.id}>
                                    {!formComponent.button && (
                                        <Grid item xs={2.5}>
                                            <Typography level="body2">{formComponent.label}</Typography>
                                        </Grid>
                                    )}

                                    <Grid item xs={8.5} key={formComponent.id}>
                                        {formComponent.element}
                                    </Grid>
                                    <Grid item xs={1}>
                                        {formComponent.delete}
                                    </Grid>
                                </Grid>
                            ))}
                        {/* <DraggableList /> */}
                    </Stack>
                </Grid>
                <Grid
                    item
                    xs={3}
                    sx={{
                        bgcolor: 'neutral.100',
                        borderRadius: 5,
                        p: 2,
                        maxHeight: '600px',
                        overflowY: 'auto'
                    }}
                >
                    <Stack direction="column">
                        <Typography level="h1" component="div" fontSize="xl2" mb={2} textColor="text.secondary">
                            Saved Forms
                        </Typography>
                        {savedForms.length > 0 &&
                            savedForms?.map((form: { title: string; description?: string; type?: string }) => (
                                <FormsCard title={form.title} description={'Form for loan application'} type="loan" />
                            ))}
                    </Stack>
                </Grid>
            </Grid>
        </TabPanel>
    );
}
