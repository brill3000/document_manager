import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { PermissionTypes, UserPermission } from 'components/documents/Interface/FileBrowser';
import { IconButton, Stack, useTheme } from '@mui/material';
import { isNull, isUndefined } from 'lodash';
import { useGrantUserMutation, useRevokeUserMutation } from 'store/async/dms/auth/authApi';
import { Permissions } from 'utils/constants/Permissions';
import { FaCircleCheck } from 'react-icons/fa6';
import { IoCloseCircle } from 'react-icons/io5';
import { ChangeEvent, RefObject, forwardRef, memo, useEffect, useMemo, useState } from 'react';

interface Column {
    id: 'id' | 'name' | keyof PermissionTypes;
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: boolean) => string;
}

const columns: Column[] = [
    { id: 'id', label: 'User ID', minWidth: 20 },
    { id: 'name', label: 'Username', minWidth: 100 },
    {
        id: 'read',
        label: 'Read',
        minWidth: 50,
        align: 'right',
        format: (value: boolean) => value.toString()
    },
    {
        id: 'write',
        label: 'write',
        minWidth: 50,
        align: 'right',
        format: (value: boolean) => value.toString()
    },
    {
        id: 'delete',
        label: 'Delete',
        minWidth: 50,
        align: 'right',
        format: (value: boolean) => value.toString()
    },
    {
        id: 'security',
        label: 'Security',
        minWidth: 50,
        align: 'right',
        format: (value: boolean) => value.toString()
    }
];

interface Data {
    id: string;
    name: string;
    read: boolean;
    write: boolean;
    delete: boolean;
    security: boolean;
}

function createData(id: string, name: string, read: boolean, write: boolean, del: boolean, security: boolean): Data {
    return { id, name, read, write, delete: del, security };
}

const PermissionsUsersTable = forwardRef<
    HTMLDivElement,
    {
        users: UserPermission[];
        nodeId: string;
        contentRef: RefObject<HTMLDivElement>;
        isOpen: boolean;
    }
>(({ users, nodeId, contentRef, isOpen }, ref) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const theme = useTheme();
    const [height, setHeight] = useState<number>();
    useEffect(() => {
        !isUndefined(contentRef.current) && !isNull(contentRef.current) && setHeight(contentRef.current.clientHeight);
    }, []);
    useEffect(() => {
        window.addEventListener(
            'resize',
            () => !isUndefined(contentRef.current) && !isNull(contentRef.current) && setHeight(contentRef.current.clientHeight)
        );
        return () => {
            window.removeEventListener('resize', () => console.log(''));
        };
    }, []);
    // ==================================== | Mutations | =================================== //
    const [revokeUser] = useRevokeUserMutation();
    const [grantUser] = useGrantUserMutation();
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const rows = useMemo(() => users.map((user) => createData(user.id, user.name, user.read, user.write, user.delete, user.security)), [
        users
    ]);
    const handleChange = (value: boolean | string, user: string, type: keyof PermissionTypes) => {
        if (typeof value === 'boolean') {
            switch (type) {
                case 'read':
                    value === true
                        ? grantUser({ nodeId, user, permissions: Permissions.READ, recursive: false, type: 'read' })
                        : revokeUser({ nodeId, user, permissions: Permissions.READ, recursive: false, type: 'read' });
                    break;
                case 'write':
                    value === true
                        ? grantUser({ nodeId, user, permissions: Permissions.WRITE, recursive: false, type: 'write' })
                        : revokeUser({ nodeId, user, permissions: Permissions.WRITE, recursive: false, type: 'write' });
                    break;
                case 'delete':
                    value === true
                        ? grantUser({ nodeId, user, permissions: Permissions.DELETE, recursive: false, type: 'delete' })
                        : revokeUser({ nodeId, user, permissions: Permissions.DELETE, recursive: false, type: 'delete' });
                    break;
                case 'security':
                    value === true
                        ? grantUser({ nodeId, user, permissions: Permissions.SECURITY, recursive: false, type: 'security' })
                        : revokeUser({ nodeId, user, permissions: Permissions.SECURITY, recursive: false, type: 'security' });
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
                    height: !isUndefined(height) ? height : '100%',
                    '& .MuiTableCell-root': {
                        fontSize: theme.typography.body2.fontSize
                    }
                }}
            >
                <Table stickyHeader aria-label="sticky table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" colSpan={2}>
                                User
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
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'boolean' ? (
                                                    <IconButton
                                                        // @ts-expect-error column.id is always of type PermissionTypes
                                                        onClick={() => handleChange(!value, row.id, column.id)}
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
export default memo(PermissionsUsersTable);
