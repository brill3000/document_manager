import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import { Card, useTheme } from '@mui/material';
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
                backgroundColor: 'transparent',
            },
        },
        '&.Mui-selected': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
            '&:hover, &.Mui-hovered': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY +
                    theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity,
                ),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        ODD_OPACITY + theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    },
}));


export default function CustomDataGrid({ users, columns }: { users: Array<any>, columns: Array<any> }) {


    const newColumns = React.useMemo(() => {
        return [...columns.map((x) => {
            return {
                field: x.id,
                editable: true,
                headerName: x.label,
                width: x.id === 'createdAt' || x.id === 'email' ? 280 : 150,
                aggregable: false
            }
        })]
    }, [columns])



    const theme = useTheme();

    const initialState = {
        columns: {
            columnVisibilityModel: {
                id: false,
            }
        }
    }

    return (
        <Stack spacing={2}>
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
                        rows={users}
                        checkboxSelection
                        initialState={initialState}
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        columns={newColumns}
                        components={{ Toolbar: GridToolbar }}
                        componentsProps={{
                            toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: { debounceMs: 500 },
                            },
                        }}
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                        }
                    />
                </Box>
            </Card>
        </Stack>
    );
}
