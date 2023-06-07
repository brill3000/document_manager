import React, { ReactElement } from 'react';
import { styled, TextField } from '@mui/material';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';

interface RenameDocumentProps {
    renameFn: (value: string) => void;
    renameTarget: { id: string; rename: boolean } | null;
    name: string;
    disableDoubleClick: (disabled: boolean) => void;
}

const ValidationTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        fontSize: theme.typography.caption.fontSize,
        padding: theme.spacing(0.5) // override inline-style
    },
    '& .MuiInputLabel-root': {
        fontSize: theme.typography.caption.fontSize
    },
    '& input:valid + fieldset': {
        borderColor: 'green',
        borderWidth: 1
    },
    '& input:invalid + fieldset': {
        borderColor: 'red',
        borderWidth: 1
    },
    '& input:valid:focus + fieldset': {
        borderLeftWidth: 6,
        padding: '0px !important' // override inline-style
    }
}));

export const RenameDocument = ({ renameFn, disableDoubleClick, name }: RenameDocumentProps): ReactElement => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [value, setValue] = React.useState<string>('');
    const [error, setError] = React.useState<Error | null>(null);
    const { focused } = useBrowserStore();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleBlur = () => {
        renameFn(value);
    };

    React.useEffect(() => {
        if (inputRef.current !== null) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, []);

    React.useEffect(() => {
        setValue(name);
    }, [focused]);

    return (
        <ValidationTextField
            inputRef={inputRef}
            value={value}
            error={error !== null}
            label={`Rename folder`}
            required
            variant="outlined"
            helperText={error && error.message ? error.message : ''}
            onChange={handleChange}
            multiline
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && renameFn(value)}
            onMouseOver={() => disableDoubleClick(true)}
            onMouseLeave={() => disableDoubleClick(false)}
        />
    );
};
