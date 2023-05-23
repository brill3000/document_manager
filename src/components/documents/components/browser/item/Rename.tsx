import React, { ReactElement } from 'react';
import { styled, TextField } from '@mui/material';
import { DocumentType } from 'components/documents/Interface/FileBrowser';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';

interface RenameDocumentProps {
    selected: string[];
    renameFn: (value: string) => void;
    renameTarget: { id: string; rename: boolean } | null;
    disableDoubleClick: (disabled: boolean) => void;
}

const ValidationTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        fontSize: '.84rem !important',
        padding: '.8em'
    },
    '& .MuiInputLabel-root': {
        fontSize: '.84rem !important'
    },
    '& input:valid + fieldset': {
        borderColor: 'green',
        borderWidth: 2
    },
    '& input:invalid + fieldset': {
        borderColor: 'red',
        borderWidth: 2
    },
    '& input:valid:focus + fieldset': {
        borderLeftWidth: 6,
        padding: '0px !important' // override inline-style
    }
});

export const RenameDocument = ({ renameFn, renameTarget, disableDoubleClick }: RenameDocumentProps): ReactElement => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [value, setValue] = React.useState<string>('');
    const [error, setError] = React.useState<Error | null>(null);
    const { selected } = useBrowserStore();
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
