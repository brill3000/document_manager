import * as React from 'react';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

export function DropdownButton(collapse: boolean, setCollapse: React.Dispatch<React.SetStateAction<boolean>>) {
    return <KeyboardArrowDownRoundedIcon
        fontSize="small"
        color="primary"
        sx={{
            transform: collapse ? 'rotate(-180deg)' : 'rotate(0)',
            transition: '0.2s',
        }}
        onClick={() => setCollapse(!collapse)} />;
}
