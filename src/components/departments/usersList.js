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
import { Error } from 'ui-component/LoadHandlers';
import { LazyLoader } from 'components/documents/views';

const columns = [
    { id: 'id', label: 'ID', minWidth: 30 },
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'email', label: 'Email', minWidth: 100 },
    {
        id: 'position',
        label: 'Position',
        minWidth: 50
    },
    {
        id: 'is_admin',
        label: 'Is Admin',
        minWidth: 50
    },
    {
        id: 'registration_date',
        label: 'Registration Date',
        minWidth: 50,
        format: (value) => value.toDateString()
    }
    // {
    //     id: 'phone',
    //     label: 'Phone',
    //     minWidth: 50,
    //     align: 'right',
    //     format: (value) => value.toLocaleString('en-US'),
    // },
];

function createData(name, email, phone, access) {
    return { name, email, phone, access };
}

const rows = [
    createData('Bell Farrell', '1-980-306-5495', 'ornare.placerat@protonmail.edu', 'admin'),
    createData('Roanna Curry', '(227) 461-6443', 'et.eros@google.edu', 'admin'),
    createData('Mollie Bishop', '1-751-742-3328', 'libero.proin.mi@protonmail.net', 'admin'),
    createData('United States', '1-418-621-8367', 'quisque.tincidunt@icloud.org', 'admin'),
    createData('Meredith Cunningham', '1-418-621-8367', 'quisque.tincidunt@icloud.org', 'admin'),
    createData('Claire Mayo', '(348) 515-4184', 'eu.turpis@aol.org', 'admin')
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
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ minHeight: 440, maxHeight: 440 }}>
                {usersIsLoading || usersIsFetching ? (
                    <LazyLoader />
                ) : usersIsError ? (
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
                            <Typography variant="subtitle1">{usersError ?? 'Opps... A Error has occured'}</Typography>
                        </Stack>
                    </Box>
                ) : (
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column, index) =>
                                    index === 0 ? (
                                        <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                            <Checkbox
                                                checked={users.length > 0 && selectedUserIds.length === users.length}
                                                color="primary"
                                                indeterminate={
                                                    users.length > 0 && selectedUserIds.length > 0 && selectedUserIds.length < users.length
                                                }
                                                onChange={handleSelectAll}
                                            />
                                        </TableCell>
                                    ) : (
                                        <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                            {column.label}
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.slice(0, limit).map((user) => {
                                return (
                                    <TableRow hover key={user.id} selected={selectedUserIds.indexOf(user.id) !== -1}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedUserIds.indexOf(user.id) !== -1}
                                                onChange={(event) => handleSelectOne(event, user.id)}
                                                value="true"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    alignItems: 'center',
                                                    display: 'flex'
                                                }}
                                            >
                                                <Avatar src={user.avatarUrl} sx={{ mr: 2, bgcolor: (theme) => theme.palette.primary.main }}>
                                                    {getInitials(user.name)}
                                                </Avatar>
                                                <Typography color="textPrimary" variant="body1">
                                                    {user.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.position ?? 'Guest'}</TableCell>
                                        <TableCell>{user.is_admin ? 'true' : 'false'}</TableCell>
                                        <TableCell>{user.createdAt}</TableCell>
                                    </TableRow>
                                );
                            })}

                            {/* {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                        {columns.map((column, index) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })} */}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
