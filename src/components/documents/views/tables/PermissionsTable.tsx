import * as React from 'react';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import { UserPermission } from 'components/documents/Interface/FileBrowser';

const columns = [
    {
        field: 'id',
        headerName: 'User',
        width: 250
    },
    {
        field: 'read',
        headerName: 'Read',
        width: 70,
        renderCell: (params: GridCellParams) => <TableCheckBox params={params} />
    },
    {
        field: 'write',
        headerName: 'Write',
        width: 70,
        renderCell: (params: GridCellParams) => <TableCheckBox params={params} />
    },
    {
        field: 'delete',
        headerName: 'Delete',
        width: 70,
        renderCell: (params: GridCellParams) => <TableCheckBox params={params} />
    },
    {
        field: 'securtiy',
        headerName: 'Security',
        width: 70,
        renderCell: (params: GridCellParams) => <TableCheckBox params={params} />
    }
];

const TableCheckBox = ({ params }: { params: GridCellParams }) => {
    const [value, setValue] = React.useState(params.value);
    console.log(params, 'Params');
    return <Checkbox color="primary" checked={value ?? false} onChange={(event) => setValue(event.target.value)} />;
};

export default function PermissionsTable({ users }: { users: UserPermission[] }) {
    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid rows={users} columns={columns} checkboxSelection disableRowSelectionOnClick />
        </div>
    );
}
