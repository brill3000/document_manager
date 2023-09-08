import { Add, Save } from '@mui/icons-material';
import { Box, Button, Collapse, Stack, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Form, Formik } from 'formik';
import { FormikText } from 'global/UI/FormMUI/Components';
import { INewFormTitle, TFormCreation } from 'global/interfaces';
import uuid from 'react-uuid';
import { FormsCard } from '../UI';
import { FormCreationTypes } from 'utils/constants/UriHelper';

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
        <Grid2 container height="100%" direction="row">
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
                <Box
                    height="max-content"
                    sx={{
                        py: 2,
                        display: 'grid',
                        gap: 2,
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}
                >
                    <TextField placeholder="Form title" variant="outlined" value={newFormTitle} onChange={handleNewFormTitleChange} />
                    <Typography variant="body1">Add Form components</Typography>
                    {FormCreationTypes.map((type) => (
                        <Box display="flex" flexDirection="column" rowGap={1} key={type}>
                            <Button
                                variant="contained"
                                sx={{ width: 'max-content' }}
                                color={type === 'submit' ? 'success' : 'primary'}
                                onClick={() => {
                                    const openEditIndexCopy: Record<TFormCreation, boolean> = { ...openEditIndex };
                                    for (const key in openEditIndexCopy) {
                                        if (key === type) {
                                            openEditIndexCopy[key] = true;
                                        } else {
                                            // @ts-expect-error expected
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
                                                uuid(),
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
                                            <Form onSubmit={handleSubmit}>
                                                <Stack rowGap={1}>
                                                    <FormikText
                                                        id="label"
                                                        variant="outlined"
                                                        name="label"
                                                        label="label"
                                                        placeholder="Enter label"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    {(type === 'input' || type === 'large_input') && (
                                                        <FormikText
                                                            id="Placeholder"
                                                            variant="outlined"
                                                            name="placeholder"
                                                            label="placeholder"
                                                            placeholder="Enter placeholder"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                    )}
                                                    {type === 'large_input' && (
                                                        <FormikText
                                                            id="label"
                                                            variant="outlined"
                                                            name="minRows"
                                                            label="Minimum Rows"
                                                            placeholder="Enter label"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            type="number"
                                                            InputProps={{ inputProps: { min: 0, max: 5, step: 1 } }}
                                                        />

                                                        // <FormikText
                                                        //     label="Minimum Rows"
                                                        //     name="minRows"
                                                        //     type="number"
                                                        //     onChange={handleChange}
                                                        //     onBlur={handleBlur}
                                                        //     value={values.minRows}
                                                        // />
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
                                                            id="initialValue"
                                                            variant="outlined"
                                                            label="Initial Value"
                                                            name="initialValue"
                                                            placeholder="Enter intial value"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                    )}
                                                    <Button
                                                        variant="contained"
                                                        type="submit"
                                                        color="success"
                                                        sx={{ mt: 2 }}
                                                        disabled={isSubmitting}
                                                        onKeyDown={(e) => {
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
                                                </Stack>
                                            </Form>
                                        )}
                                    </Formik>
                                </Collapse>
                                // addFormComponent('input')
                            }
                        </Box>
                    ))}
                </Box>
            </Grid2>
            <Grid2 xs={6} height="100%" sx={{ px: 4, py: 2 }}>
                <Stack direction="column" spacing={3} height="100%">
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                        <Box sx={{ maxWidth: 350 }}>
                            <Typography variant="h4" component={Box} mb={2} color="text.secondary">
                                {newFormTitle.length > 0 ? newFormTitle : 'New Form'}
                            </Typography>
                        </Box>
                        <Box sx={{ maxHeight: 10 }}>
                            <Button
                                variant="contained"
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
                            <Grid2 container direction="row" key={formComponent.id}>
                                {!formComponent.button && (
                                    <Grid2 xs={2.5}>
                                        <Typography variant="body2">{formComponent.label}</Typography>
                                    </Grid2>
                                )}

                                <Grid2 xs={8.5} key={formComponent.id}>
                                    {formComponent.element}
                                </Grid2>
                                <Grid2 xs={1}>{formComponent.delete}</Grid2>
                            </Grid2>
                        ))}
                    {/* <DraggableList /> */}
                </Stack>
            </Grid2>
            <Grid2
                xs={3}
                height="100%"
                sx={{
                    p: 2,
                    borderLeft: 1,
                    borderColor: (theme) => theme.palette.divider,
                    overflowY: 'auto'
                }}
            >
                <Stack direction="column" height="100%">
                    <Typography variant="h4" component={Box} mb={2} color="text.secondary">
                        Saved Forms
                    </Typography>
                    {savedForms.length > 0 &&
                        savedForms?.map((form: { title: string; description?: string; type?: string }, i) => (
                            <FormsCard key={form.title + i} title={form.title} description={'Form for loan application'} type="loan" />
                        ))}
                </Stack>
            </Grid2>
        </Grid2>
    );
}
