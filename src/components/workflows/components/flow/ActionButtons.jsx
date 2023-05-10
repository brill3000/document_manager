import { Add, Save } from '@mui/icons-material';
import Button from '@mui/joy/Button';
import { Collapse } from '@mui/material';
import { Stack } from '@mui/system';
import { Formik } from 'formik';
import { FormikTextMultiline } from 'global/UI/FormMUI/Components';
import React from 'react';
import ActionSelect from '../flowTest/ActionSelect';

export function ActionButtons({ openForm, setOpenForm, onAdd }) {
  const [addAction, setAddAction] = React.useState(false)
  return <>
    {!openForm && <Button variant='solid' startIcon={<Add />} onClick={() => setOpenForm(true)}>Add Process</Button>}
    <Collapse in={openForm} timeout="auto" unmountOnExit>
      <Stack>
        <Formik
          initialValues={{ title: '', placeholder: '', minRows: 1, isRequired: '', initialValue: '', defaultChecked: false }}
          validate={values => {
            const errors = {};
            if (!values.title) {
              errors['title'] = 'Required';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            let actionArray = null
            let action = null
            if (values.action && typeof values.action === 'string') {
              actionArray = values.action.split(':::')
              action = {
                type: actionArray[0],
                action: actionArray[1]
              }
            }
            if (action) {
              onAdd(values.title, action);
            } else {
              onAdd(values.title);
            }

          }}>
          {({
            values, handleChange, handleBlur, handleSubmit, isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Stack direction={"column"} spacing={2}>

                <Button
                  variant='solid'
                  type="submit"
                  sx={{ mt: 2 }}
                  color="success"
                  disabled={isSubmitting}
                  startIcon={<Save />}
                  onKeyPress={e => { e.key === 'Enter' && e.preventDefault(); }}
                >
                  Save process
                </Button>
                <FormikTextMultiline
                  label="Title"
                  name="title"
                  placeholder="Enter Process title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyPress={e => { e.key === 'Enter' && e.preventDefault(); }}
                  value={values.label}
                  sx={{ py: 1 }} />
                {
                  !addAction ?
                    <Button
                      variant='outlined'
                      sx={{ mt: 2 }}
                      startIcon={<Add />}
                      onClick={() => setAddAction(true)}
                      onKeyPress={e => { e.key === 'Enter' && e.preventDefault(); }}
                    >
                      Add Action
                    </Button>
                    :
                    <Button
                      variant='outlined'
                      color='success'
                      sx={{ mt: 2 }}
                      startIcon={<Save />}
                      onClick={() => setAddAction(false)}
                      onKeyPress={e => { e.key === 'Enter' && e.preventDefault(); }}
                    >
                      Save Action
                    </Button>
                }
                {
                  addAction && (
                    <ActionSelect name="action" />
                  )
                }
              </Stack>
            </form>
          )}
        </Formik>
      </Stack>
    </Collapse>
  </>;
}
