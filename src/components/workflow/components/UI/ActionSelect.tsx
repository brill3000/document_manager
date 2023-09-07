import { Divider, List, ListItem, Select, Stack, TextFieldProps, Typography } from '@mui/material';
import { FieldInputProps, useField } from 'formik';
import { Fragment, useRef, useState } from 'react';

export function ActionSelect({ name, selectedAction }: { name: string; selectedAction: any }) {
    const [selected, setSelected] = useState(null);

    const group =
        selectedAction === 'form'
            ? {
                  Fill_Forms: ['Loan Applications Form', 'Tender Application Form']
              }
            : {
                  Approval: ['Motion tabling', 'Create order paper']
              };

    const [field, meta, helpers] = useField(name);
    const configTextField: FieldInputProps<any> & TextFieldProps = {
        ...field
    };
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    const { setValue } = helpers;
    return (
        <Stack direction={'column'}>
            <Select
                placeholder="Choose form..."
                value={selected}
                onChange={(value) => {
                    setValue(value);
                }}
            >
                {Object.entries(group).map(([name, types], index) => (
                    <Fragment key={name}>
                        {index !== 0 && <Divider />}
                        <List aria-labelledby={`select-group-${name}`} sx={{ '--List-decorator-size': '28px' }}>
                            <ListItem id={`select-group-${name}`}>
                                <Typography variant="body1" textTransform="uppercase" letterSpacing="md">
                                    {name} ({types.length})
                                </Typography>
                            </ListItem>
                            {types.map((type: string) => (
                                <Typography>{type}</Typography>
                            ))}
                        </List>
                    </Fragment>
                ))}
            </Select>
            {configTextField.error && <Typography color="danger">Required</Typography>}
        </Stack>
    );
}
