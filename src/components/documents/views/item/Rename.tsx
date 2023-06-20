import React, { ReactElement } from 'react';
import { Box, ButtonBase, styled, TextField, useTheme } from '@mui/material';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { isString, isUndefined } from 'lodash';
import { Close } from '@mui/icons-material';
import { IoCloseCircle } from 'react-icons/io5';

interface RenameDocumentProps {
    renameFn: (value: string) => void;
    renameTarget: { id: string; rename: boolean } | null;
    name: string;
    disableDoubleClick: (disabled: boolean) => void;
    is_new?: boolean;
    rows?: number;
    topCloseIcon?: number;
    leftCloseIcon?: number;
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

export const RenameDocument = ({
    renameFn,
    disableDoubleClick,
    name,
    is_new,
    rows,
    topCloseIcon,
    leftCloseIcon
}: RenameDocumentProps): ReactElement => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [value, setValue] = React.useState<string>('');
    const [error, setError] = React.useState<Error | null>(null);
    const [extentsion, setExtension] = React.useState<string>('');
    const { focused, isCreating, actions } = useBrowserStore();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const theme = useTheme();
    const handleBlur = () => {
        isCreating === true && renameFn(value);
    };

    React.useEffect(() => {
        if (inputRef.current !== null) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, []);

    React.useEffect(() => {
        if (focused.is_dir || is_new) {
            setValue(name);
        } else {
            if (isString(name)) {
                const nameStringArray = name.split('.');
                const ext = nameStringArray.pop();
                !isUndefined(ext) && setExtension('.' + ext);
                const joinedString = nameStringArray.join('.');
                setValue(joinedString);
            }
        }
    }, [focused]);

    return (
        <Box position="relative" width="100%">
            <ButtonBase
                sx={{
                    position: 'absolute',
                    top: topCloseIcon ?? -15,
                    right: leftCloseIcon ?? -15,
                    borderRadius: '50%',
                    '& :hover': {
                        cursor: 'pointer'
                    }
                }}
                onClick={() => {
                    actions.setIsCreating(false);
                    actions.setRenameTarget(null);
                    actions.removeNewFolder();
                }}
            >
                <IoCloseCircle color={theme.palette.error.main} size={20} />{' '}
            </ButtonBase>
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
                rows={rows ?? 3}
                fullWidth
                // onBlur={handleBlur}
                onKeyDown={(e) => e.key === 'Enter' && renameFn(value + extentsion)}
                onMouseOver={() => disableDoubleClick(true)}
                onMouseLeave={() => disableDoubleClick(false)}
            />
        </Box>
    );
};
