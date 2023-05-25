import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import { useGetSystemUsersQuery } from 'store/async/usersQuery';
import { CircularProgress } from '@mui/material';
import { PersonOutlineRounded } from '@mui/icons-material';
import { useUserAuth } from 'context/authContext';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

export default function UsersSelect({ setSelectedUser, selectedUser, users, isError, isLoading, isFetching }) {
    const colors = {
        Guest: 'success',
        Admin: 'warning'
    };

    const { user } = useUserAuth();

    const handleChange = (value) => {
        setSelectedUser({ ...value });
    };

    return (
        <Select
            placeholder="Select a user"
            startDecorator={<PersonOutlineRounded />}
            onChange={handleChange}
            indicator={<KeyboardArrowDown />}
            sx={{
                width: 240,
                [`& .${selectClasses.indicator}`]: {
                    transition: '0.2s',
                    [`&.${selectClasses.expanded}`]: {
                        transform: 'rotate(-180deg)'
                    }
                }
            }}
            componentsProps={{
                listbox: {
                    sx: {
                        '--List-decorator-size': '48px'
                    }
                }
            }}
        >
            {isLoading || isFetching ? (
                <CircularProgress size="2rem" />
            ) : isError ? (
                <Typography level="body3" color="error">
                    Error Occured...
                </Typography>
            ) : (
                users &&
                users.map((data, index) => (
                    <Option
                        key={data.name}
                        value={data}
                        label={data.name} // The appearance of the selected value will be a string
                    >
                        <ListItemDecorator>
                            <Avatar src={`/static/images/avatar/${index + 1}.jpg`} size="sm" />
                        </ListItemDecorator>
                        <Box component="span" sx={{ display: 'block' }}>
                            <Typography level="body3">{data.name}</Typography>
                            <Typography level="body3">{data.status}</Typography>
                        </Box>
                        <Chip
                            size="sm"
                            variant="outlined"
                            color={colors[data.role]}
                            sx={{
                                ml: 'auto',
                                borderRadius: '2px',
                                minHeight: '20px',
                                paddingInline: '4px',
                                fontSize: 'xs',
                                bgcolor: `${colors[data.role]}.softBg`
                            }}
                        >
                            {data.role}
                        </Chip>
                    </Option>
                ))
            )}
        </Select>
    );
}
