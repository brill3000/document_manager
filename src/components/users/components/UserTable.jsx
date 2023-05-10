
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
// import { format } from 'date-fns';
import { getInitials } from './utils/get-initials';
import { CircularProgress } from '@mui/material';
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';
import CustomDataGrid from './CustomDataGrid';




const columns = [
    { id: 'id', label: 'ID', minWidth: 30 },
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'email', label: 'Email', minWidth: 100 },
    {
        id: 'position',
        label: 'Position',
        minWidth: 50,
        format: (value) => value.toLocaleString(),
    },
    {
        id: 'is_admin',
        label: 'Is Admin',
        minWidth: 50,
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'createdAt',
        label: 'Registration Date',
        minWidth: 50,
        format: (value) => value.toLocaleString('en-US'),
    },
    // {
    //     id: 'phone',
    //     label: 'Phone',
    //     minWidth: 50,
    //     align: 'right',
    //     format: (value) => value.toLocaleString('en-US'),
    // },

];


export default function UserTable({ users, usersIsLoading, usersIsError, usersError, usersIsFetching, ...rest }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [selectedUserIds, setSelecteduserIds] = React.useState([]);
    const [limit, setLimit] = React.useState(10);

    const handleSelectAll = (event) => {
        let newSelecteduserIds;

        if (event.target.checked) {
            newSelecteduserIds = users.map((user) => user.id);
        } else {
            newSelecteduserIds = [];
        }

        setSelecteduserIds(newSelecteduserIds);
    };

    const handleSelectOne = (event, id) => {
        const selectedIndex = selectedUserIds.indexOf(id);
        let newSelecteduserIds = [];

        if (selectedIndex === -1) {
            newSelecteduserIds = newSelecteduserIds.concat(selectedUserIds, id);
        } else if (selectedIndex === 0) {
            newSelecteduserIds = newSelecteduserIds.concat(selectedUserIds.slice(1));
        } else if (selectedIndex === selectedUserIds.length - 1) {
            newSelecteduserIds = newSelecteduserIds.concat(selectedUserIds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelecteduserIds = newSelecteduserIds.concat(
                selectedUserIds.slice(0, selectedIndex),
                selectedUserIds.slice(selectedIndex + 1)
            );
        }

        setSelecteduserIds(newSelecteduserIds);
    };

    // const handleLimitChange = (event) => {
    //     setLimit(event.target.value);
    // };

    // const handlePageChange = (event, newPage) => {
    //     setPage(newPage);
    // };

    return (
        usersIsLoading || usersIsFetching ?
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100%"
                minWidth="100%"
                sx={{
                    mt: 25
                }}
            >
                <GoogleLoader height={150} width={150} loop={true} />
            </Box>
            :
            usersIsError ?
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100%"
                    minWidth="100%"
                    sx={{
                        mt: 25
                    }}
                >
                    <Stack direction="column">
                        <Error height={70} width={70} />
                        <Typography variant='subtitle1'>{usersError ?? "Opps... A Error has occured"}</Typography>
                    </Stack>

                </Box>
                :
                <CustomDataGrid columns={columns} users={users} />


    );
}
