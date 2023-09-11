import {
    Autocomplete,
    Box,
    Checkbox,
    CircularProgress,
    TextField,
    TextFieldProps,
    createFilterOptions,
    lighten,
    styled
} from '@mui/material';
import { useField } from 'formik';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
// import DatePicker from 'react-datepicker';

import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { isArray, isEmpty, isNull, isObject, isString, isUndefined, omit, uniqueId } from 'lodash';
import { FC, Fragment, ReactNode, forwardRef, memo, useMemo } from 'react';

type FormikDefaults = {
    disabled?: boolean;
    label: string;
    id: string;
    name: string;
    variant: 'outlined' | 'standard' | 'filled' | undefined;
};
type SelectedValueType = {
    id: string | number;
    name?: string | undefined;
    firstLetter: string;
};
export interface FormikAutoCompleteProps extends FormikTextProps {
    options: Array<{ id: number | string; name?: string }>;
    loading?: boolean;
    open?: boolean;
    handleOpen?: () => void;
    handleClose?: () => void;
    addNew?: boolean;
    addNewOptionHandler?: (option: { id: number | string; name: string }) => void;
    multiple?: boolean;
}

export interface FormikTextProps extends FormikDefaults {}
export interface FormikDatePickerProps extends FormikDefaults {
    isStart: boolean;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
    element: any;
}

const icon = <CheckBoxOutlineBlank fontSize="small" sx={{ color: (theme) => theme.palette.primary.contrastText }} />;
const checkedIcon = <CheckBox fontSize="small" sx={{ color: (theme) => theme.palette.primary.contrastText }} />;

const GroupHeader = styled('div')(() => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: '#000',
    backgroundColor: lighten('rgb(117,117,117)', 0.1),
    zIndex: 2
}));

const GroupItems = styled('ul')({
    padding: 0
});

const CustomPaper: FC<{ children?: ReactNode }> = ({ children }) => {
    return (
        <Box
            sx={{
                bgcolor: 'rgb(96, 96, 96)',
                color: '#fff !important',
                fontWeight: 700,
                borderRadius: 1,
                border: (theme) => `0.5px solid ${theme.palette.divider}`,
                '& .MuiAutocomplete-listbox': {
                    "& .MuiAutocomplete-option[aria-selected='true']": {
                        bgcolor: (theme) => theme.palette.primary.light,
                        color: '#fff !important',
                        '&.Mui-focused': {
                            bgcolor: (theme) => theme.palette.primary.light,
                            color: '#fff !important'
                        }
                    }
                },
                '& .MuiAutocomplete-listbox .MuiAutocomplete-option.Mui-focused': {
                    bgcolor: (theme) => theme.palette.primary.light,
                    color: '#fff !important'
                },
                '& .MuiAutocomplete-noOptions, & .MuiPaper-root, & .MuiAutocomplete-loading': {
                    color: '#fff !important'
                }
            }}
        >
            {children}
        </Box>
    );
};

export const FormikText = forwardRef<any, Omit<FormikTextProps & TextFieldProps, 'setFieldValue'>>(({ name, ...otherProps }, ref) => {
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

    return <TextField {...configTextField} color="success" ref={ref} />;
});

// export const FormikDatePicker = memo(
//     ({ name, disabled, label, id, setFieldValue, variant, element, isStart, ...props }: FormikDatePickerProps & TextFieldProps) => {
//         const [field, meta] = useField(name);
//         const handleClearButtonClick = () => {
//             setFieldValue(name, '');
//         };

//         const clearButton = (
//             <IconButton onClick={handleClearButtonClick} size="small">
//                 <Clear sx={{ fontSize: '1.25rem' }} />
//             </IconButton>
//         );
//         const configTextField = {
//             ...field,
//             ...props,
//             fullwidth: 'true'
//         };
//         if (meta && meta.touched && meta.error) {
//             configTextField.error = true;
//             configTextField.helperText = meta.error;
//         }
//         return (
//             <DatePicker
//                 selected={field.value}
//                 value={field.value}
//                 onChange={(date) => {
//                     setFieldValue(name, date);
//                 }}
//                 minDate={new Date()}
//                 selectsStart
//                 dateFormat="MMMM d, yyyy h:mm aa"
//                 showTimeSelect
//                 showTimeSelectOnly={!isStart}
//                 // isClearable={field.value ?? false}
//                 disabled={disabled ?? false}
//                 name={name}
//                 label={label}
//                 customInput={
//                     <FormikText
//                         sx={{ width: '100%' }}
//                         {...configTextField}
//                         name={name}
//                         InputProps={{
//                             endAdornment: (
//                                 <InputAdornment position="end" sx={{ display: field.value ? 'flex' : 'none' }}>
//                                     {clearButton}
//                                 </InputAdornment>
//                             )
//                         }}
//                         variant={variant ?? 'standard'}
//                         setFieldValue={setFieldValue}
//                         id={id}
//                         label={label}
//                     />
//                 }
//                 showPopperArrow={false}
//                 popperPlacement="bottom-start"
//                 popperModifiers={[
//                     {
//                         name: 'preventOverflow',
//                         options: {
//                             rootBoundary: { element },
//                             tether: false,
//                             altAxis: true
//                         }
//                     }
//                 ]}
//             />
//         );
//     }
// );
const filter = createFilterOptions<{
    id: string | number;
    name?: string | undefined;
    firstLetter: string;
}>();

export const FormikAutoCompleteNew = memo(
    ({
        name,
        options,
        disabled,
        label,
        id,
        variant,
        loading,
        open,
        handleOpen,
        handleClose,
        addNew,
        addNewOptionHandler,
        multiple,
        ...rest
    }: FormikAutoCompleteProps & TextFieldProps) => {
        // // ==================================== | STATE | ================================= //
        // const [value, setValue] = useState<
        //   SelectedValueType | SelectedValueType[] | null
        // >(multiple ? [] : null);
        // ==================================== | FORMIK | ================================= //
        const [field, meta, helpers] = useField(name);

        // ==================================== | VALIDATION | ================================= //
        const validateName = (name: string, value: null | undefined | string | number) => {
            if (
                value === null ||
                value === undefined ||
                (multiple ? !isArray(value) || isEmpty(value) : typeof value === 'string' && value.length < 1)
            ) {
                return `${name} is required`;
            }
        };

        // ==================================== | MEMO: OPTIONS | ================================= //

        const optionsWithGroup: SelectedValueType[] = useMemo(
            () =>
                options.map((option) => {
                    const firstLetter: string = option && typeof option.name === 'string' ? option.name[0].toUpperCase() : '0';
                    return {
                        firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                        ...option
                    };
                }),
            [options]
        );

        // ==================================== | MEMO: VALUE | ================================= //
        const val: SelectedValueType | SelectedValueType[] | null | undefined = useMemo(() => {
            if (multiple === true) {
                if (!isEmpty(field.value) && Array.isArray(optionsWithGroup)) {
                    const val = optionsWithGroup.filter((option) => isArray(field.value) && field.value.some((x) => option.id === x));
                    if (!isEmpty(val)) {
                        return val;
                    } else {
                        return [];
                    }
                }
                return [];
            } else {
                if (!isNull(field.value) && !isUndefined(field.value) && Array.isArray(optionsWithGroup)) {
                    const val = optionsWithGroup.find((option) => option.id === field.value);
                    return val !== undefined ? val : null;
                } else if (isNull(field.value)) {
                    return null;
                }
            }
        }, [field.value, optionsWithGroup]);
        return (
            <Autocomplete
                value={val}
                multiple={multiple ?? false}
                disableCloseOnSelect={multiple ?? false}
                size="small"
                {...(!isUndefined(open) &&
                    !isUndefined(handleOpen) &&
                    !isUndefined(handleClose) && {
                        open: open,
                        onClose: handleClose,
                        onOpen: handleOpen
                    })}
                onChange={(_, newValue) => {
                    if (newValue === null || newValue === undefined) {
                        helpers.setValue(multiple ? [] : null);
                        return;
                    }
                    if (isArray(newValue)) {
                        helpers.setValue(
                            // @ts-expect-error expected
                            newValue.map((val) => val.id)
                        );
                        return;
                    }
                    if (isObject(newValue) && 'id' in newValue) {
                        if (newValue.id === 'new' && isString(newValue.name)) {
                            const updatedArray = newValue.name.split(':');
                            updatedArray.shift();
                            const updatedName = updatedArray.join('').replace(' "', '').replace('"', '');
                            const obj = { id: uniqueId(), name: updatedName ?? '' };
                            !isUndefined(addNewOptionHandler) && addNewOptionHandler(obj);
                            helpers.setValue(obj.id);
                        } else {
                            helpers.setValue(newValue.id);
                        }
                    }
                }}
                filterOptions={(options, params) => {
                    // @ts-expect-error expected
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    // @ts-expect-error expected
                    const isExisting = options.some((option) => inputValue === option.name);
                    if (inputValue !== '' && !isExisting && addNew) {
                        filtered.push({
                            id: 'new',
                            name: `Add: "${inputValue}"`,
                            firstLetter: isString(inputValue) ? inputValue[0].toUpperCase() : '0'
                        });
                    }
                    return filtered;
                }}
                disabled={disabled}
                loading={loading}
                // @ts-expect-error expected
                groupBy={(option) => option.firstLetter}
                disablePortal
                forcePopupIcon={false}
                // @ts-expect-error expected
                getOptionLabel={(option) => option.name ?? ''}
                isOptionEqualToValue={(option, value) => {
                    // @ts-expect-error expected
                    return option?.id === value?.id;
                }}
                renderOption={(props, option, { selected, inputValue }) => {
                    // @ts-expect-error expected
                    const matches = match(option.name, inputValue, { insideWords: true });
                    // @ts-expect-error expected
                    const parts: [{ highlight: boolean; text: string }] = parse(option.name, matches);
                    return (
                        <li {...props}>
                            <div>
                                {multiple && (
                                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                                )}
                                {parts.map((part, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            fontWeight: part.highlight ? 700 : 400,
                                            color: part.highlight ? '#E1C699' : 'inherit'
                                        }}
                                    >
                                        {part.text}
                                    </span>
                                ))}
                            </div>
                        </li>
                    );
                }}
                id={id}
                options={
                    Array.isArray(optionsWithGroup) ? optionsWithGroup.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter)) : []
                }
                renderGroup={(params) => (
                    <li key={params.key}>
                        <GroupHeader>{params.group}</GroupHeader>
                        <GroupItems>{params.children}</GroupItems>
                    </li>
                )}
                PaperComponent={CustomPaper}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            fullWidth
                            error={meta.error && meta.touched ? true : false}
                            label={label}
                            size="medium"
                            color="success"
                            onFocus={() => {
                                helpers.setTouched(true);
                            }}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : params.InputProps.endAdornment}
                                    </Fragment>
                                )
                            }}
                            onBlur={() => {
                                if (
                                    val === null ||
                                    val === undefined ||
                                    (isArray(val) ? multiple && isEmpty(val) : isObject(val) && isString(val.id) && isEmpty(val.id))
                                ) {
                                    const error = validateName(id, null);
                                    helpers.setError(error);
                                }
                            }}
                            {...(meta.error && meta.touched ? { helperText: meta.error } : {})}
                            variant={variant ?? 'standard'}
                            {...rest}
                        />
                    );
                }}
                sx={{
                    minWidth: '100%'
                }}
            />
        );
    }
);
