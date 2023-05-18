import * as React from 'react';
import Box from '@mui/material/Box';
import { Button, Card, useTheme } from '@mui/material';
import { BsHandIndex } from 'react-icons/bs';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    fontSize: '.9rem',
    [`& .${gridClasses.row}.even`]: {
        backgroundColor: theme.palette.grey[200],
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent'
            }
        },
        '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
            '&:hover, &.Mui-hovered': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
                ),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity)
                }
            }
        }
    }
}));

const columns2 = [
    { id: 'id', label: 'ID', minWidth: 30 },
    { id: 'index', label: 'Index', minWidth: 100 },
    { id: 'description', label: 'Description', minWidth: 100 },
    {
        id: 'no_of_docs',
        label: 'No of Documents',
        minWidth: 50
    },
    {
        id: 'last_modified',
        label: 'Last Modfified',
        minWidth: 50
    }
];

export default function IndexTable() {
    const columns = React.useMemo(() => {
        return [
            ...columns2.map((x) => {
                return {
                    field: x.id,
                    editable: true,
                    headerName: x.label,
                    width: x.id === 'description' ? 220 : 200,
                    aggregable: false
                };
            })
        ];
    }, []);

    const theme = useTheme();

    return (
        <Stack spacing={2}>
            <Box maxHeight={50} maxWidth={200}>
                <Button variant="contained" startIcon={<BsHandIndex size={20} />}>
                    Create Index
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
                <Box sx={{ height: 600 }}>
                    <StripedDataGrid
                        rows={[]}
                        checkboxSelection
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        columns={columns}
                        components={{ Toolbar: GridToolbar }}
                        componentsProps={{
                            toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: { debounceMs: 500 }
                            }
                        }}
                    />
                </Box>
            </Card>
        </Stack>
    );
}
