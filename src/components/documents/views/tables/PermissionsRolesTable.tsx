import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { PermissionTypes, RolePermission } from 'components/documents/Interface/FileBrowser';
import { IconButton, Stack, useTheme } from '@mui/material';
import { isNull, isUndefined } from 'lodash';
import { useGrantRoleMutation, useRevokeRoleMutation } from 'store/async/dms/auth/authApi';
import { Permissions } from 'utils/constants/Permissions';
import { BsFillPatchCheckFill, BsFillPatchMinusFill } from 'react-icons/bs';
import { IoCloseCircle } from 'react-icons/io5';
import { FaCircleCheck } from 'react-icons/fa6';

interface Column {
    id: 'name' | keyof PermissionTypes;
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: boolean) => string;
}

const columns: Column[] = [
    { id: 'name', label: 'Role name', minWidth: 100 },
    {
        id: 'read',
        label: 'Read',
        minWidth: 50,
        align: 'right',
        format: (value: boolean) => value.toLocaleString()
    },
    {
        id: 'write',
        label: 'write',
        minWidth: 50,
        align: 'right',
        format: (value: boolean) => value.toLocaleString()
    },
    {
        id: 'delete',
        label: 'Delete',
        minWidth: 50,
        align: 'right',
        format: (value: boolean) => value.toLocaleString()
    },
    {
        id: 'security',
        label: 'Security',
        minWidth: 50,
        align: 'right',
        format: (value: boolean) => value.toLocaleString()
    }
];

interface Data extends PermissionTypes {
    name: string;
}

function createData(name: string, read: boolean, write: boolean, del: boolean, security: boolean): Data {
    return { name, read, write, delete: del, security };
}

const PermissionsRolesTable = React.forwardRef<
    HTMLDivElement,
    {
        roles: RolePermission[];
        nodeId: string;
        contentRef: React.RefObject<HTMLDivElement>;
        isOpen: boolean;
    }
>(({ roles, nodeId, contentRef, isOpen }, ref) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const theme = useTheme();
    const [height, setHeight] = React.useState<number>();
    React.useEffect(() => {
        !isUndefined(contentRef.current) && !isNull(contentRef.current) && setHeight(contentRef.current.clientHeight);
    }, []);
    // ==================================== | Mutations | =================================== //
    const [revokeRole] = useRevokeRoleMutation();
    const [grantRole] = useGrantRoleMutation();
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const rows = React.useMemo(() => roles.map((role) => createData(role.name, role.read, role.write, role.delete, role.security)), [
        roles
    ]);
    const handleChange = (value: boolean | string, role: string, type: keyof PermissionTypes) => {
        if (typeof value === 'boolean') {
            switch (type) {
                case 'read':
                    value === true
                        ? grantRole({ nodeId, role, permissions: Permissions.READ, recursive: false, type: 'read' })
                        : revokeRole({ nodeId, role, permissions: Permissions.READ, recursive: false, type: 'read' });
                    break;
                case 'write':
                    value === true
                        ? grantRole({ nodeId, role, permissions: Permissions.WRITE, recursive: false, type: 'write' })
                        : revokeRole({ nodeId, role, permissions: Permissions.WRITE, recursive: false, type: 'write' });
                    break;
                case 'delete':
                    value === true
                        ? grantRole({ nodeId, role, permissions: Permissions.DELETE, recursive: false, type: 'delete' })
                        : revokeRole({ nodeId, role, permissions: Permissions.DELETE, recursive: false, type: 'delete' });
                    break;
                case 'security':
                    value === true
                        ? grantRole({ nodeId, role, permissions: Permissions.SECURITY, recursive: false, type: 'security' })
                        : revokeRole({ nodeId, role, permissions: Permissions.SECURITY, recursive: false, type: 'security' });
                    break;
                default:
                    return;
            }
        } else if (typeof value === 'string') {
            // (rows[rowIndex][columnId] as Data[typeof columnId]) = value;
        }
    };

    return (
        <Stack
            width={isOpen ? '100%' : 0}
            height={!isUndefined(height) ? height : '100%'}
            ref={ref}
            sx={{ transition: '0.1s width', transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)' }}
        >
            <TableContainer
                sx={{
                    height: !isUndefined(contentRef.current) ? contentRef.current?.clientHeight : '100%',
                    '& .MuiTableCell-root': {
                        fontSize: theme.typography.body2.fontSize
                    }
                }}
            >
                <Table stickyHeader aria-label="sticky table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" colSpan={2}>
                                Role
                            </TableCell>
                            <TableCell align="center" colSpan={4}>
                                Permissions
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align} style={{ top: 57, minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'boolean' ? (
                                                    <IconButton
                                                        // @ts-expect-error column.id is always of type PermissionTypes
                                                        onClick={() => handleChange(!value, row.name, column.id)}
                                                        color={value === true ? 'success' : 'error'}
                                                    >
                                                        {value === true ? <FaCircleCheck size={15} /> : <IoCloseCircle size={18} />}
                                                    </IconButton>
                                                ) : (
                                                    value
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
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
        </Stack>
    );
});
export default React.memo(PermissionsRolesTable);
