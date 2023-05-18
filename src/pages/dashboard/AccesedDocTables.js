import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
// import NumberFormat from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';
import { formatDate } from './RecentActivity';

function createData(name, fat, carbs, protein) {
    return { name, fat, carbs, protein };
}

const rows = [
    createData('Budget Approval', 'pdf', 2, 4.5),
    createData('New Approval', 'pdf', 0, 1.8),
    createData('Sample Approval', 'pdf', 1, 9.0),
    createData('Test Approval', 'pdf', 1, 10.2),
    createData('Computer Accessories', 'pdf', 1, 8.3),
    createData('EBRS', 'pdf', 0, 4.1),
    createData('Cases', 'pdf', 2, 7.0),
    createData('Training', 'pdf', 2, 10.5),
    createData('DBMS', 'pdf', 1, 9.8),
    createData('OpenInNewIcon', 'pdf', 0, 1.4)
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
    // {
    //     id: 'trackingNo',
    //     align: 'left',
    //     disablePadding: false,
    //     label: 'Tracking No.'
    // },
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: 'Document Name'
    },
    {
        id: 'modification',
        align: 'right',
        disablePadding: false,
        label: 'Modification Date'
    },
    {
        id: 'date',
        align: 'left',
        disablePadding: false,

        label: 'Modification'
    },
    {
        id: 'user',
        align: 'right',
        disablePadding: false,
        label: 'User Modified'
    }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function AccesedDocTableHead({ order, orderBy }) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

AccesedDocTableHead.propTypes = {
    order: PropTypes.string,
    orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

const AccessStatus = ({ status }) => {
    let color;
    let title;

    switch (status) {
        case 'trashed':
            color = 'warning';
            title = 'Trashed';
            break;
        case 'renamed':
            color = 'primary';
            title = 'Renamed';
            break;
        case 'approved':
            color = 'success';
            title = 'Approved';
            break;
        case 'deleted':
            color = 'error';
            title = 'Deleted';
            break;
        default:
            color = 'primary';
            title = 'None';
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
};

AccessStatus.propTypes = {
    status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

export default function AccesedDocTables({ recentlyModified }) {
    const [order] = useState('asc');
    const [orderBy] = useState('name');
    const [selected] = useState([]);

    const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

    return (
        <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                {recentlyModified.isLoading || recentlyModified.isFetching ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={300} minWidth="100%">
                        <GoogleLoader height={100} width={150} loop={true} />
                    </Box>
                ) : recentlyModified.isError ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={300} minWidth="100%">
                        <Stack direction="column">
                            <Error height={50} width={50} />
                            <Typography variant="body3">{recentlyModified.error ?? 'Opps... An Error  has occured'}</Typography>
                        </Stack>
                    </Box>
                ) : recentlyModified.isSuccess &&
                  recentlyModified.data &&
                  Array.isArray(recentlyModified.data) &&
                  recentlyModified.data.length > 0 ? (
                    <Table
                        aria-labelledby="tableTitle"
                        sx={{
                            '& .MuiTableCell-root:first-of-type': {
                                pl: 2
                            },
                            '& .MuiTableCell-root:last-child': {
                                pr: 3
                            }
                        }}
                    >
                        <AccesedDocTableHead order={order} orderBy={orderBy} />
                        <TableBody>
                            {stableSort(recentlyModified.data, getComparator(order, orderBy)).map((row, index) => {
                                const isItemSelected = isSelected(row.name);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                let newDate = formatDate(new Date(Date.parse(row.date_created)));
                                if (new Date(Date.parse(row.date_created)).toDateString() === new Date().toDateString()) {
                                    newDate = 'Today, ' + newDate.split(' ')[1];
                                }
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={index}
                                        selected={isItemSelected}
                                    >
                                        <TableCell component="th" id={labelId} scope="row" align="left">
                                            <Link color="secondary" component={RouterLink} to="">
                                                {row.file_name}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="right">{newDate}</TableCell>
                                        <TableCell align="left">
                                            <AccessStatus status={row.log_type} />
                                        </TableCell>
                                        <TableCell align="right">{row.created_by_name}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={300} minWidth="100%" p={3}>
                        <Typography variant="h5"> No Recently Modified Document </Typography>
                    </Box>
                )}
            </TableContainer>
        </Box>
    );
}
