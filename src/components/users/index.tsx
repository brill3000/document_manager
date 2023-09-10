import * as React from 'react';

// import Box from '@mui/joy/Box';
// import Typography from '@mui/joy/Typography';
// import IconButton from '@mui/joy/IconButton';
import IconButton from '@mui/joy/IconButton';

// custom
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { Box, Button, Stack, useTheme, Card } from '@mui/material';
import UserTable from './components/UserTable.jsx';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { BsHandIndex } from 'react-icons/bs';
import { useGetUsersQuery } from 'store/async/dms/auth/authApi';

const Create: React.FC<any> = () => {
    return (
        <>
            <IconButton variant="outlined">
                <CreateOutlinedIcon />
            </IconButton>
        </>
    );
};

export default function Users({ title }: { title: string }) {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const department = useSelector((state: RootState) => state.departments.currentDepartment);

    // const customers = useSelector(state => state.departments.users);
    const [search, setSearch] = React.useState('');
    const [users, setUsers] = React.useState<Array<any>>([]);
    const theme = useTheme();
    const usersQuery = useGetUsersQuery();

    React.useEffect(() => {
        if (usersQuery.isSuccess) {
            setUsers(usersQuery.data);

            const users = usersQuery.data?.map((user: any) => ({
                address: { country: 'USA OF A', state: 'West Virginia', city: 'Parkersburg', street: '2849 Fulton Street' },
                avatarUrl: '/static/images/avatars/avatar_3.png',
                createdAt: new Date().toDateString(),
                email: `${user.name}@.gmail.com`,
                id: user.id,
                name: user.name,
                position: 'ADMIN',
                phone: '304-428-3097',
                is_admin: 'YES'
            }));
            setUsers(users);
        }
    }, [usersQuery.isSuccess, usersQuery.data]);

    return (
        <Stack spacing={2}>
            <Box maxHeight={50} maxWidth={200}>
                <Button variant="contained" startIcon={<BsHandIndex size={20} />}>
                    Add User
                </Button>
            </Box>

            <Card
                elevation={0}
                sx={{
                    border: '1px solid',
                    borderRadius: 2,
                    borderColor: theme.palette.divider,
                    boxShadow: 'inherit',
                    ':hover': {
                        boxShadow: 'inherit'
                    },
                    '& pre': {
                        m: 0,
                        p: '16px !important',
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '0.75rem'
                    }
                }}
            >
                <UserTable
                    usersIsLoading={usersQuery.isLoading}
                    usersIsError={usersQuery.isError}
                    usersIsFetching={usersQuery.isFetching}
                    // usersIsSuccess={usersQuery.isSuccess}
                    usersError={usersQuery.error}
                    users={
                        search.length === 0 && users.length === 0
                            ? users
                            : [...users].filter((customer) => customer.name.toLowerCase().includes(search.toLowerCase())) ||
                              [...users].filter((customer) => customer.email.toLowerCase().includes(search.toLowerCase()))
                    }
                />
            </Card>
        </Stack>
    );
}
