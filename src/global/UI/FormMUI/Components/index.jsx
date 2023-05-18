import React from 'react';
import TextField from '@mui/joy/TextField';
import { Experimental_CssVarsProvider, TextField as MateralTextField } from '@mui/material';
import { useField } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/joy/Switch';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { array } from 'prop-types';
import Textarea from '@mui/joy/Textarea';
import { Stack } from '@mui/material';
import Typography from '@mui/joy/Typography';
// import Checkbox from '@mui/joy/Checkbox';
import ThemeCustomization from 'themes';
import { styled } from '@mui/material/styles';

// const ValidationTextField = styled(MateralTextField)({
//     borderRadius: 3,
//     '& input:valid + fieldset': {
//       borderColor: 'green',
//       borderWidth: 2,
//     },
//     '& input:invalid + fieldset': {
//       borderColor: 'red',
//       borderWidth: 2,
//     },
//     '& input:valid:focus + fieldset': {
//       borderLeftWidth: 6,
//       padding: '4px !important', // override inline-style
//     },
//   });

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const FormikText = React.forwardRef(({ name, ...otherProps }, ref) => {
    const [field, meta] = useField(name);
    const configTextField = {
        ...field,
        ...otherProps,
        fullwidth: 'true'
    };
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    return <TextField {...configTextField} ref={ref} />;
});

export const FormikTextMaterialMultiline = React.forwardRef(({ name, ...otherProps }, ref) => {
    const [field, meta] = useField(name);
    const configTextField = {
        ...field,
        ...otherProps,
        fullwidth: 'true'
    };
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    return <MateralTextField multiple {...configTextField} ref={ref} />;
});

export const FormikTextMultiline = ({ name, ...otherProps }) => {
    const [field, meta] = useField(name);

    const configTextField = {
        ...field,
        ...otherProps,
        fullwidth: 'true'
    };
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    return (
        <Stack direction={'column'} spacing={1}>
            <Textarea rows={1} maxRows={Infinity} {...configTextField} />
            <Typography level="body2" color="danger">
                {configTextField.helperText}
            </Typography>
        </Stack>
    );
};

export const FormikCheckbox = ({ name, ...otherProps }) => {
    const [field, meta] = useField(name);

    const configTextField = {
        ...field,
        ...otherProps
    };
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    return <Checkbox {...configTextField} />;
};

export const FormikSwitch = ({ name, ...otherProps }) => {
    const [field, meta] = useField(name);

    const configTextField = {
        ...field,
        ...otherProps
    };
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    return <Switch size="small" {...configTextField} />;
};
export const FormikSelect = ({ name, children, ...otherProps }) => {
    const [field, meta] = useField(name);
    const configTextField = {
        ...field,
        ...otherProps
    };
    const { values } = otherProps;

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
        <TextField {...configTextField} select>
            {Array.isArray(array) &&
                values.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
        </TextField>
    );
};

export const FormikAutoComplete = ({ name, ...otherProps }) => {
    const [field, meta] = useField(name);
    const { setFieldValue, label, multiple, placeholder, variant, defaultValue, options } = otherProps;
    const configAutoCompleteField = {
        ...field
    };
    if (meta && meta.touched && meta.error) {
        configAutoCompleteField.error = true;
        configAutoCompleteField.helperText = meta.error;
    }

    return (
        <Autocomplete
            multiple={multiple}
            limitTags={2}
            id={name}
            options={Array.isArray(options) ? options : []}
            disableCloseOnSelect={multiple}
            autoHighlight
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, { selected, inputValue }) => {
                const matches = match(option.name, inputValue);
                const parts = parse(option.name, matches);
                return (
                    <li {...props} key={option.user_id}>
                        {multiple && <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />}
                        {parts.map((part, index) => (
                            <span
                                key={index}
                                style={{
                                    fontWeight: part.highlight ? 700 : 400
                                }}
                            >
                                {part.text}
                            </span>
                        ))}
                    </li>
                );
            }}
            onChange={(_, value) => {
                setFieldValue(
                    name,
                    value !== null ? (Array.isArray(value) && name !== 'meetingPack' ? value : value.id ? value.id : defaultValue) : ''
                );
            }}
            style={{ width: '100%' }}
            renderInput={(params) => (
                <MateralTextField
                    {...params}
                    variant={variant}
                    name={name}
                    label={label}
                    {...configAutoCompleteField}
                    placeholder={placeholder}
                />
            )}
        />
    );
};
