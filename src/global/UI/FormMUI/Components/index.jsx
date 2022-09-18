import React from 'react'
import TextField from '@mui/joy/TextField';
import { useField } from 'formik'
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBox from '@mui/joy/Checkbox';
import Switch from '@mui/joy/Switch';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';





const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const FormikText = React.forwardRef(({ name, ...otherProps }, ref) => {
    const [field, meta] = useField(name);
    const configTextField = {
        ...field,
        ...otherProps,
        fullwidth: "true",
    }
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    return (
        <TextField {...configTextField} ref={ref} />
    )
})
export const FormikTextMultiline = ({ name, ...otherProps }) => {
    const [field, meta] = useField(name);

    const configTextField = {
        ...field,
        ...otherProps,
        fullwidth: "true",
    }
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    return (
        <TextField multiline minRows={5} maxRows={7} {...configTextField} />
    )
}

export const FormikCheckbox = ({ name, ...otherProps }) => {
    const [field, meta] = useField(name);

    const configTextField = {
        ...field,
        ...otherProps,

    }
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    return (
        <CheckBox {...configTextField} />
    )
}

export const FormikSwitch = ({ name, ...otherProps }) => {
    const [field, meta] = useField(name);

    const configTextField = {
        ...field,
        ...otherProps,
    }
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    return (
        <Switch size='small'{...configTextField} />
    )
}
export const FormikSelect = ({ name, children, ...otherProps }) => {
    const [field, meta] = useField(name);
    const configTextField = {
        ...field,
        ...otherProps,
    }
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    // const childrenWithProps = React.Children.map(children, child => {
    //     // Checking isValidElement is the safe way and avoids a typescript
    //     // error too.
    //     return React.cloneElement(child, { ...otherProps });

    // });
    return (
        <TextField
            {...configTextField}
            select
        >
            {children}
        </TextField>
    )
}


export const FormikAutoComplete = ({ name, ...otherProps }) => {
    const [field, meta] = useField(name);
    const { setFieldValue, initialValues, label, groups, invitees } = otherProps

    const configAutoCompleteField = {
        ...field,
        ...otherProps,
    }
    if (meta && meta.touched && meta.error) {
        configAutoCompleteField.error = true;
        configAutoCompleteField.helperText = meta.error;
    }
    return (

        <Autocomplete
            multiple
            limitTags={2}
            id={typeof groups !== 'undefined' ? "groups" : typeof invitees !== 'undefined' ? "invitees" : ""}
            disablePortal
            options={typeof groups !== 'undefined' ? groups : typeof invitees !== 'undefined' ? invitees : ["None"]}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, { selected, inputValue }) => {
                const matches = match(option.name, inputValue);
                const parts = parse(option.name, matches);
                return (<li {...props}>
                    <CheckBox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {parts.map((part, index) => (
                        <span
                            key={index}
                            style={{
                                fontWeight: part.highlight ? 700 : 400,
                            }}
                        >
                            {part.text}
                        </span>
                    ))}
                </li>)
            }}
            onChange={(e, value) => {
                setFieldValue(
                    typeof groups !== 'undefined' ? "groups" : typeof invitees !== 'undefined' ? "invitees" : "",
                    value !== null && Array.isArray(value) ? value : initialValues.groups
                );
            }}
            style={{ width: '100%' }}
            renderInput={(params) => (
                <TextField {...params} name={typeof groups !== 'undefined' ? "groups" : typeof invitees !== 'undefined' ? "invitees" : ""} label={label} {...configAutoCompleteField} placeholder={groups ? "groups" : invitees ? "invitees" : ""} />
            )}
        />
    )
}
