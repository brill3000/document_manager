import * as React from 'react'
import { CssVarsProvider } from '@mui/joy/styles';
import theme from '../../../../global/Themes/theme';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Typography from '@mui/joy/Typography';

import Button from '@mui/joy/Button';
import { FormControl, FormHelperText, FormLabel, Grid, Stack } from '@mui/material';
import TextField from '@mui/joy/TextField';
import { Add, CheckBox, Delete, Save } from '@mui/icons-material';
// import DraggableList from './DraggableLists';
import IconButton from '@mui/joy/IconButton';
import uuid from 'react-uuid';
import Textarea from '@mui/joy/Textarea';
import Collapse from '@mui/material/Collapse';
import { Formik } from 'formik';
import UserCustomFlow from './UserCustomFlow';
import OverviewFlow from './Flow';
import { FormikCheckbox, FormikSwitch, FormikText } from 'global/UI/FormMUI/Components';
import { uuidv4 } from '@firebase/util';
import Checkbox from '@mui/joy/Checkbox';


import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import GenerateFlow from './GenerateFlow';

export function FormsCard({ title, type, description }: { title: string, type: string, description?: string }) {
    return (
        <Card
            row
            variant="outlined"
            sx={{
                minWidth: '260px',
                gap: 2,
                bgcolor: 'background.body',
            }}
        >

            <CardContent>
                <Typography fontWeight="md" textColor="success.plainColor" mb={0.5}>
                    {title ?? ''}
                </Typography>
                <Typography level="body2">{description ?? ''}</Typography>
            </CardContent>
            <CardOverflow
                variant="soft"
                color="primary"
                sx={{
                    px: 0.2,
                    writingMode: 'vertical-rl',
                    textAlign: 'center',
                    fontSize: 'xs2',
                    fontWeight: 'xl2',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                }}
            >
                {type ?? ''}
            </CardOverflow>
        </Card>
    );
}




export default function CreateFlow() {
    const [index, setIndex] = React.useState<string | number | boolean>(0);
    const [newFormTitle, setNewFormTitle] = React.useState('')
    const [formComponents, setFormComponents] = React.useState<Array<any>>([])
    const [openEditIndex, setOpenEditIndex] = React.useState({
        input: false,
        large_input: false,
        checkbox: false,
        radio: false,
        select: false,
        submit: false
    })
    const [editDetails, setEditDetails] = React.useState<Object | null>(null)
    const [savedForms, setSavedForms] = React.useState<Array<any>>([]);

    console.log(formComponents, "COMPONENTS")

    const handleNewFormTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setNewFormTitle(e.target.value)
    }
    const addFormComponet = (type: string, label: string, uid: string, placeholder?: string, minRows?: number, isRequired?: boolean | string, initialValue?: string, defaultChecked?: boolean) => {
        switch (type) {
            case 'input':
                const input = {
                    id: uid,
                    label: label,
                    placeholder: placeholder,
                    initialValue: initialValue,
                    element:
                        <TextField
                            defaultValue={initialValue ?? ''}
                            placeholder={placeholder ?? "Enter text here..."}
                            size="sm"
                            fullWidth
                        />
                    ,
                    delete:
                        <Box sx={{ maxHeight: 20, ml: 1 }}>
                            <IconButton variant="outlined" size="sm" color="danger" onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                let formComponentsCopy = [...formComponents]
                                const index = formComponentsCopy.findIndex(x => x.id === uid)
                                if (index > -1) {
                                    formComponentsCopy.splice(index, 1)
                                }
                                setFormComponents([...formComponentsCopy])
                            }}>
                                <Delete fontSize='small' />
                            </IconButton>
                        </Box>
                }
                Array.isArray(formComponents) && formComponents.length < 1 ? setFormComponents([input]) : setFormComponents([...formComponents, input])
                break;
            case 'large_input':
                const large_input = {
                    id: uid,
                    label: label,
                    placeholder: placeholder,
                    initialValue: initialValue,
                    element:
                        <Textarea
                            defaultValue={initialValue ?? ''}
                            placeholder={placeholder ?? "Enter text here..."}
                            size="sm"
                            minRows={minRows ?? 3}
                        />,
                    delete:
                        <Box sx={{ maxHeight: 20, ml: 1 }}>
                            <IconButton variant="outlined" size="sm" color="danger" onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                let formComponentsCopy = [...formComponents]
                                const index = formComponentsCopy.findIndex(x => x.id === uid)
                                if (index > -1) {
                                    formComponentsCopy.splice(index, 1)
                                }

                                setFormComponents([...formComponentsCopy])
                            }}>
                                <Delete fontSize='small' />
                            </IconButton>
                        </Box>
                }
                Array.isArray(formComponents) && formComponents.length < 1 ? setFormComponents([large_input]) : setFormComponents([...formComponents, large_input])
                break;
            case 'checkbox':
                const checkbox = {
                    id: uid,
                    label: label,
                    placeholder: placeholder,
                    initialValue: initialValue,
                    element:
                        <Checkbox defaultChecked={defaultChecked} />
                    ,
                    delete:
                        <Box sx={{ maxHeight: 20, ml: 1 }}>
                            <IconButton variant="outlined" size="sm" color="danger" onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                let formComponentsCopy = [...formComponents]
                                const index = formComponentsCopy.findIndex(x => x.id === uid)
                                if (index > -1) {
                                    formComponentsCopy.splice(index, 1)
                                }
                                setFormComponents([...formComponentsCopy])
                            }}>
                                <Delete fontSize='small' />
                            </IconButton>
                        </Box>
                }
                Array.isArray(formComponents) && formComponents.length < 1 ? setFormComponents([checkbox]) : setFormComponents([...formComponents, checkbox])
                break;
            case 'submit':
                const submit = {
                    id: uid,
                    label: label,
                    placeholder: placeholder,
                    initialValue: initialValue,
                    button: true,
                    element:
                        <Button variant='solid' size="sm" color="success" startIcon={<Save />}>{label}</Button>
                    ,
                    delete:
                        <Box sx={{ maxHeight: 20, ml: 1 }}>
                            <IconButton variant="outlined" size="sm" color="danger" onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                let formComponentsCopy = [...formComponents]
                                const index = formComponentsCopy.findIndex(x => x.id === uid)
                                if (index > -1) {
                                    formComponentsCopy.splice(index, 1)
                                }
                                setFormComponents([...formComponentsCopy])
                            }}>
                                <Delete fontSize='small' />
                            </IconButton>
                        </Box>
                }
                Array.isArray(formComponents) && formComponents.length < 1 ? !formComponents.some(x => x.button) && setFormComponents([submit]) : setFormComponents([...formComponents, submit])
                break;
            default:
                break;
        }
    }


    return (
        <CssVarsProvider disableTransitionOnChange theme={theme}>
            <Box
                sx={{
                    bgcolor: 'background.body',
                    flexGrow: 1,
                    m: -3,
                    p: 3,
                    overflowX: 'hidden',
                    borderRadius: 'md',
                }}
            >
                <Tabs
                    aria-label="Pipeline"
                    // 👇️ ts-ignore ignores any ts errors on the next line
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore 
                    value={index}
                    onChange={(event, value) => setIndex(value)}
                >
                    <TabList
                        variant="plain"
                        sx={{
                            alignSelf: 'flex-start',
                            [`& .${tabClasses.root}`]: {
                                bgcolor: 'transparent',
                                boxShadow: 'none',
                                '&:hover': {
                                    bgcolor: 'transparent',
                                },
                                [`&.${tabClasses.selected}`]: {
                                    color: 'primary.plainColor',
                                    fontWeight: 'lg',
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        zIndex: 1,
                                        bottom: '-1px',
                                        left: 'var(--List-item-paddingLeft)',
                                        right: 'var(--List-item-paddingRight)',
                                        height: '3px',
                                        borderTopLeftRadius: '3px',
                                        borderTopRightRadius: '3px',
                                        bgcolor: 'primary.500',
                                    },
                                },
                            },
                        }}
                    >
                        <Tab>
                            Design Forms
                        </Tab>
                        <Tab>
                            Design Workflow
                        </Tab>
                        <Tab>
                            Change Permission
                        </Tab>
                        <Tab>
                            Publish Workflow
                        </Tab>
                    </TabList>
                    <Box
                        sx={(theme) => ({
                            '--bg': theme.vars.palette.background.level3,
                            height: '1px',
                            background: 'var(--bg)',
                            boxShadow: '0 0 0 100vmax var(--bg)',
                            clipPath: 'inset(0 -100vmax)',
                        })}
                    />
                    <Box
                        sx={(theme) => ({
                            '--bg': theme.vars.palette.background.level1,
                            background: 'var(--bg)',
                            boxShadow: '0 0 0 100vmax var(--bg)',
                            clipPath: 'inset(0 -100vmax)',
                            px: 1.5,
                            py: 2,
                        })}
                    >
                        <TabPanel value={0}>
                            <Grid container direction="row" sx={{ height: '600px' }}>
                                <Grid item xs={3}
                                    sx={{
                                        bgcolor: 'neutral.100',
                                        borderRadius: 5,
                                        p: 2,
                                        maxHeight: '600px',
                                        overflowY: 'auto'
                                    }}>
                                    <Box
                                        sx={{
                                            py: 2,
                                            display: 'grid',
                                            gap: 2,
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <TextField
                                            placeholder="Form title"
                                            variant="outlined"
                                            value={newFormTitle}
                                            onChange={handleNewFormTitleChange}
                                        />
                                        <Typography level="body4">Add Form components</Typography>
                                        {
                                            ['input', 'large_input', 'checkbox', 'radio', 'select', 'submit'].map((type) =>
                                            (<Box maxWidth={300} key={type}>
                                                <Button variant="solid" color={type === 'submit' ? 'success' : 'primary'} onClick={() => {
                                                    let openEditIndexCopy: {
                                                        input: boolean,
                                                        checkbox: boolean,
                                                        radio: boolean,
                                                        large_input: boolean,
                                                        select: boolean,
                                                        submit: boolean
                                                    } = { ...openEditIndex }
                                                    for (let key in openEditIndexCopy) {
                                                        if (key === type) {
                                                            // 👇️ ts-ignore ignores any ts errors on the next line
                                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                            // @ts-ignore 
                                                            openEditIndexCopy[key] = true
                                                        } else {
                                                            // 👇️ ts-ignore ignores any ts errors on the next line
                                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                            // @ts-ignore 
                                                            openEditIndexCopy[key] = false
                                                        }
                                                    }
                                                    setOpenEditIndex({ ...openEditIndexCopy })
                                                    setEditDetails(null)
                                                }} startIcon={<Add />}>{type === 'large_input' ? 'Large Input' : type === 'submit' ? 'Submit Button' : type[0].toUpperCase() + type.substring(1, type.length)} Field</Button>
                                                {
                                                    // 👇️ ts-ignore ignores any ts errors on the next line
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-ignore 
                                                    <Collapse in={openEditIndex[type]} timeout="auto" unmountOnExit>
                                                        <Formik
                                                            initialValues={{ label: '', placeholder: '', minRows: 1, isRequired: '', initialValue: '', defaultChecked: false }}
                                                            validate={values => {
                                                                const errors: any = {};
                                                                if (!values.label) {
                                                                    errors['label'] = 'Required';
                                                                }
                                                                return errors;
                                                            }}
                                                            onSubmit={(values, { setSubmitting }) => {
                                                                addFormComponet(type, values.label, uuidv4(), values.placeholder, values.minRows, values.isRequired, values.initialValue, values.defaultChecked)
                                                                let openEditIndexCopy = { ...openEditIndex }
                                                                for (let key in openEditIndexCopy) {
                                                                    // 👇️ ts-ignore ignores any ts errors on the next line
                                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                    // @ts-ignore 
                                                                    openEditIndexCopy[key] = false
                                                                }
                                                                setOpenEditIndex({ ...openEditIndexCopy })
                                                                setEditDetails(null)
                                                            }}>
                                                            {({
                                                                values,
                                                                errors,
                                                                touched,
                                                                handleChange,
                                                                handleBlur,
                                                                handleSubmit,
                                                                isSubmitting,
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
                                                                    {
                                                                        (type === 'input' || type === 'large_input') &&
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
                                                                    }
                                                                    {
                                                                        type === 'large_input' &&
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
                                                                    }
                                                                    <FormikCheckbox
                                                                        label="Is input required"
                                                                        name="isRequired"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.isRequired}
                                                                        sx={{ py: 1.5 }}
                                                                    />
                                                                    {
                                                                        type === 'checkbox' &&
                                                                        <FormikCheckbox
                                                                            label="Checked By Default"
                                                                            name="defaultChecked"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.defaultChecked}
                                                                            sx={{ py: 1.5 }}
                                                                        />
                                                                    }
                                                                    {
                                                                        (type === 'input' || type === 'large_input') &&
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
                                                                    }
                                                                    <Button
                                                                        variant='solid'
                                                                        type="submit"
                                                                        color="danger"
                                                                        sx={{ mt: 2 }}
                                                                        disabled={isSubmitting}
                                                                        onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
                                                                    >
                                                                        Add {type === 'large_input' ? 'Large Input' : type === 'submit' ? 'Submit Button' : type[0].toUpperCase() + type.substring(1, type.length)} Field
                                                                    </Button>
                                                                </form>
                                                            )}
                                                        </Formik>

                                                    </Collapse>
                                                    // addFormComponet('input') 
                                                }
                                            </Box>)
                                            )

                                        }
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sx={{ px: 4, py: 2 }}>
                                    <Stack direction="column" spacing={3} sx={{ minWidth: 400 }}>
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            spacing={2}
                                        >
                                            <Box sx={{ maxWidth: 350 }}>
                                                <Typography
                                                    level="h1"
                                                    component="div"
                                                    fontSize="xl2"
                                                    mb={2}
                                                    textColor="text.secondary"
                                                >
                                                    {newFormTitle.length > 0 ? newFormTitle : 'New Forms'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ maxHeight: 10 }}>
                                                <Button variant='solid' color="info" startIcon={<Save />} onClick={() => {
                                                    if (formComponents && Array.isArray(formComponents) && formComponents.length) {
                                                        savedForms.length > 0 ? setSavedForms([...savedForms, { title: newFormTitle.length > 0 ? newFormTitle : 'Form' + savedForms.length }]) : setSavedForms([{ title: newFormTitle.length > 0 ? newFormTitle : 'Form' + savedForms.length }])
                                                        setFormComponents([])
                                                        setNewFormTitle('')
                                                    }
                                                }}>Save Form</Button>
                                            </Box>
                                        </Stack>

                                        {

                                            formComponents.length > 0 && formComponents.map((formComponent) => (
                                                <Grid container direction='row' key={formComponent.id}>

                                                    {
                                                        !formComponent.button &&
                                                        <Grid item xs={2.5}>
                                                            <Typography level="body2" >{formComponent.label}</Typography>
                                                        </Grid>
                                                    }

                                                    <Grid item xs={8.5} key={formComponent.id}>
                                                        {formComponent.element}
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        {formComponent.delete}
                                                    </Grid>
                                                </Grid>


                                            )


                                            )
                                        }

                                        {/* <DraggableList /> */}
                                    </Stack>

                                </Grid>
                                <Grid item xs={3}
                                    sx={{
                                        bgcolor: 'neutral.100',
                                        borderRadius: 5,
                                        p: 2,
                                        maxHeight: '600px',
                                        overflowY: 'auto'
                                    }}
                                >
                                    <Stack direction="column" spacing={3}>
                                        <Typography
                                            level="h1"
                                            component="div"
                                            fontSize="xl2"
                                            mb={2}
                                            textColor="text.secondary"
                                        >
                                            Saved Forms
                                        </Typography>
                                        {
                                            savedForms.length > 0 && savedForms?.map((form: { title: string, description?: string, type?: string }) => (
                                                <FormsCard title={form.title} description={'Form for loan application'} type='loan' />
                                            ))
                                        }
                                    </Stack>
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={1} sx={{ height: '600px' }}>
                            <Grid container direction="row" sx={{ height: '600px' }}>
                                <Grid item xs={9} sx={{ borderRadius: 5, pr:5}}>
                                    <Typography
                                        level="h1"
                                        component="div"
                                        fontSize="xl2"
                                        mb={2}
                                        textColor="text.secondary"
                                    >
                                    </Typography>
                                    <GenerateFlow />
                                </Grid>
                                <Grid item xs={3} sx={{ bgcolor: 'neutral.100', borderRadius: 5 }}>

                                </Grid>
                            </Grid>

                        </TabPanel>
                        <TabPanel value={2} sx={{ height: '600px' }}>
                            <Grid container direction="row" sx={{ height: '600px' }}>
                                <Grid item xs={3} sx={{ bgcolor: 'neutral.100', borderRadius: 5 }}>

                                </Grid>
                                <Grid item xs={9}>
                                    <Typography
                                        level="h1"
                                        component="div"
                                        fontSize="xl2"
                                        mb={2}
                                        textColor="text.secondary"
                                    >
                                        Forms
                                    </Typography>
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={3} sx={{ height: '600px' }}>
                            <Box sx={{ height: '600px' }}>
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    minHeight="100%"
                                    minWidth="100%"
                                >
                                    <Button variant='soft'>Publish Workflow</Button>
                                </Box>
                            </Box>
                        </TabPanel>
                    </Box>
                </Tabs>
            </Box>
        </CssVarsProvider>
    )
}



