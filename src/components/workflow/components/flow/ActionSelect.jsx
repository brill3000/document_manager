import * as React from 'react';
import Select, { selectClasses } from '@mui/joy/Select';
import Option, { optionClasses } from '@mui/joy/Option';
import Chip from '@mui/joy/Chip';
import List from '@mui/joy/List';
import ListItemDecorator, { listItemDecoratorClasses } from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';
import Check from '@mui/icons-material/Check';
import { useField } from 'formik';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { Stack } from '@mui/system';
import { FaWpforms } from 'react-icons/fa';

export default function ActionSelect({ name, selectedAction }) {
    const [selected, setSelected] = React.useState(null);

    const group =
        selectedAction === 'form'
            ? {
                  Fill_Forms: ['Loan Applications Form', 'Tender Application Form']
              }
            : {
                  Approval: ['Loan Application', 'Tender Application']
              };
    const colors = {
        Land: 'neutral',
        Water: 'primary',
        Fill_Forms: 'success'
    };
    const [field, meta, helpers] = useField(name);
    const configTextField = {
        ...field
    };
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    const { setValue } = helpers;
    const action = React.useRef(null);
    return (
        <Stack direction={'column'}>
            <Select
                placeholder="Choose form..."
                startDecorator={<FaWpforms size={15} />}
                endDecorator={
                    <Chip size="sm" color="primary" variant="soft" sx={{ mr: -1 }}>
                        +5
                    </Chip>
                }
                componentsProps={{
                    listbox: {
                        component: 'div',
                        sx: {
                            maxHeight: 240,
                            overflow: 'auto',
                            '--List-padding': '0px'
                        }
                    }
                }}
                indicator={<KeyboardArrowDown />}
                sx={{
                    width: 280,
                    [`& .${selectClasses.indicator}`]: {
                        transition: '0.2s',
                        [`&.${selectClasses.expanded}`]: {
                            transform: 'rotate(-180deg)'
                        }
                    }
                }}
                action={action}
                value={selected}
                onChange={(value) => {
                    setSelected(value);
                    setValue(value);
                }}
            >
                {Object.entries(group).map(([name, types], index) => (
                    <React.Fragment key={name}>
                        {index !== 0 && <ListDivider role="none" />}
                        <List aria-labelledby={`select-group-${name}`} sx={{ '--List-decorator-size': '28px' }}>
                            <ListItem id={`select-group-${name}`} sticky>
                                <Typography level="body3" textTransform="uppercase" letterSpacing="md">
                                    {name} ({types.length})
                                </Typography>
                            </ListItem>
                            {types.map((type) => (
                                <Option
                                    key={type}
                                    value={`${name}:::${type}`}
                                    label={
                                        <React.Fragment>
                                            <Chip size="sm" color={colors[name]} sx={{ borderRadius: 'xs', mr: 1, ml: -0.5 }}>
                                                {name}
                                            </Chip>{' '}
                                            {type}
                                        </React.Fragment>
                                    }
                                    sx={{
                                        [`&.${optionClasses.selected} .${listItemDecoratorClasses.root}`]: {
                                            opacity: 1
                                        }
                                    }}
                                >
                                    <ListItemDecorator sx={{ opacity: 0 }}>
                                        <Check />
                                    </ListItemDecorator>
                                    {type}
                                </Option>
                            ))}
                        </List>
                    </React.Fragment>
                ))}
            </Select>
            {configTextField.error && <Typography color="danger">Required</Typography>}
        </Stack>
    );
}
