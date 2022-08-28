
// import * as React from 'react';
// import Box from '@mui/material/Box';
// import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';

// const columns = [
//   { field: 'id', headerName: 'ID', width: 90 },
//   {
//     field: 'user',
//     headerName: 'User',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'read',
//     headerName: 'read',
//     type: 'number',
//     width: 50,
//     editable: true,
//   },
// //   {
// //     field: 'fullName',
// //     headerName: 'Full name',
// //     description: 'This column has a value getter and is not sortable.',
// //     sortable: false,
// //     width: 160,
// //     valueGetter: (params) =>
// //       `${params.row.firstName || ''} ${params.row.user || ''}`,
// //   },
// ];

// const rows = [
//   { id: 1, user: 'Snow', read: true },
//   { id: 2, user: 'Lannister', read: true },
//   { id: 3, user: 'Lannister',  read: true },
//   { id: 4, user: 'Stark', read: true },
//   { id: 5, user: 'Targaryen', read: false },
//   { id: 6, user: 'Melisandre', read: true },
//   { id: 7, user: 'Clifford', read: false },
//   { id: 8, user: 'Frances', read: true },
//   { id: 9, user: 'Roxie', read: false },
// ];

// export default function DataGridDemo() {
//   return (
//     <Box sx={{ height: 400, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         preadSize={5}
//         rowsPerPreadOptions={[5]}
//         checkboxSelection
//         disableSelectionOnClick
//         experimentalFeatures={{ newEditingApi: true }}
//       />
//     </Box>
//   );
// }
import * as React from 'react';
import { DataGrid } from "@mui/x-data-grid";
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';




export default function App() {

    const [columns, setColumns] = React.useState([
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'user',
            headerName: 'User',
            width: 150,
            editable: true,
        },
        {
            field: "read",
            headerName: "Read",
            flex: 1.0,
            disableClickEventBubbling: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (cellValues) => {
                return (
                    <Checkbox
                        checked={cellValues.value.isChecked}
                        onChange={() => handleChange('read',cellValues)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                )
            }
        },
        {
            field: "write",
            headerName: "Write",
            flex: 1.0,
            disableClickEventBubbling: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (cellValues) => {
                return (
                    <Checkbox
                        checked={cellValues.value.isChecked}
                        onChange={() => handleChange('write',cellValues)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                )
            }
        },
        {
            field: "delete",
            headerName: "Delete",
            flex: 1.0,
            disableClickEventBubbling: true,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (cellValues) => {
                return (
                    <Checkbox
                        checked={cellValues.value.isChecked}
                        onChange={() => handleChange('delete',cellValues)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                )
            }
        }
    ])
    const [rows, setRows] = React.useState([
        { id: 1, user: 'Snow', read: { id: 1, isChecked: false }, write: { id: 1, isChecked: false }, delete: { id: 1, isChecked: false } },
        { id: 2, user: 'Lannister', read: { id: 1, isChecked: true }, write: { id: 1, isChecked: false }, delete: { id: 1, isChecked: false } },
        { id: 3, user: 'Lannister', read: { id: 1, isChecked: true },  write: { id: 1, isChecked: false }, delete: { id: 1, isChecked: false } },
        { id: 4, user: 'Stark', read: { id: 1, isChecked: true },  write: { id: 1, isChecked: false }, delete: { id: 1, isChecked: false } },
        { id: 5, user: 'Targaryen', read: { id: 1, isChecked: true },  write: { id: 1, isChecked: false }, delete: { id: 1, isChecked: false } },
        { id: 6, user: 'Melisandre', read: { id: 1, isChecked: true },  write: { id: 1, isChecked: false }, delete: { id: 1, isChecked: false } },
        { id: 7, user: 'Clifford', read: { id: 1, isChecked: true },  write: { id: 1, isChecked: false }, delete: { id: 1, isChecked: false } },
        { id: 8, user: 'Frances', read: { id: 1, isChecked: true },  write: { id: 1, isChecked: false }, delete: { id: 1, isChecked: false } },
        { id: 9, user: 'Roxie', read: { id: 1, isChecked: true },  write: { id: 1, isChecked: false }, delete: { id: 1, isChecked: false } },
    ])

    const handleChange = (column,cellValues) => {
        setRows(rows.map(row => {
            if(cellValues.id === row.id){
                row[column].isChecked = !cellValues.value.isChecked;
            }
            return row
        }))
    };





    return (

        <Box sx={{ height: 400, width: '100%', minWidth: 700 }}>
            <DataGrid
                rows={rows}
                columns={columns}
                preadSize={5}
                rowsPerPreadOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
            />
        </Box>
    );
}

