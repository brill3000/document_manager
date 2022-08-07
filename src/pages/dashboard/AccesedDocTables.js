import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
// import NumberFormat from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';

function createData(name, fat, carbs, protein) {
    return { name, fat, carbs, protein };
}

const rows = [
    createData('Budget Approval', "pdf", 2, 4.5),
    createData('New Approval', "pdf", 0, 1.8),
    createData('Sample Approval', "pdf", 1, 9.0),
    createData('Test Approval', "pdf", 1, 10.2),
    createData('Computer Accessories', "pdf", 1, 8.3),
    createData('EBRS', "pdf", 0, 4.1),
    createData('Cases', "pdf", 2, 7.0),
    createData('Training', "pdf", 2, 10.5),
    createData('DBMS', "pdf", 1, 9.8),
    createData('OpenInNewIcon', "pdf", 0, 1.4)
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
        id: 'fat',
        align: 'right',
        disablePadding: false,
        label: 'Document Type'
    },
    {
        id: 'carbs',
        align: 'left',
        disablePadding: false,

        label: 'Document Privacy'
    },
    {
        id: 'protein',
        align: 'right',
        disablePadding: false,
        label: 'Document Size'
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
        case 0:
            color = 'warning';
            title = 'Public';
            break;
        case 1:
            color = 'success';
            title = 'New';
            break;
        case 2:
            color = 'error';
            title = 'Private';
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

export default function AccesedDocTables() {
    const [order] = useState('asc');
    const [orderBy] = useState('trackingNo');
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
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-child': {
                            pl: 2
                        },
                        '& .MuiTableCell-root:last-child': {
                            pr: 3
                        }
                    }}
                >
                    <AccesedDocTableHead order={order} orderBy={orderBy} />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                            const isItemSelected = isSelected(row.name);
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.trackingNo}
                                    selected={isItemSelected}
                                >
                                    {/* <TableCell component="th" id={labelId} scope="row" align="left">
                                        <Link color="secondary" component={RouterLink} to="">
                                            {row.trackingNo}
                                        </Link>
                                    </TableCell> */}
                                    <TableCell component="th" id={labelId} scope="row" align="left">
                                        <Link color="secondary" component={RouterLink} to="">
                                            {row.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="left">
                                        <AccessStatus status={row.carbs} />
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.protein} MB
                                        {/* <NumberFormat value={row.protein} displayType="text" thousandSeparator prefix="$" /> */}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
