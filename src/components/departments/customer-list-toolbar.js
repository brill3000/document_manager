import { Box, Button, TextField, InputAdornment, SvgIcon, Typography } from '@mui/material';
import { Search as SearchIcon } from './icons/search';
import { Upload as UploadIcon } from './icons/upload';
import { Download as DownloadIcon } from './icons/download';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenFileView } from 'store/reducers/documents';
import MainCard from 'components/MainCard';

export const CustomerListToolbar = (props) => {
    const departments = useSelector((state) => state.departments.currentDepartment);
    const dispatch = useDispatch();
    return (
        <Box {...props}>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    m: -1
                }}
            >
                <Typography sx={{ m: 1 }} variant="h4">
                    {departments ?? 'Department'}
                </Typography>
                <Box sx={{ m: 1 }}>
                    <Button startIcon={<UploadIcon fontSize="small" />} sx={{ mr: 1 }}>
                        Import
                    </Button>
                    <Button startIcon={<DownloadIcon fontSize="small" />} sx={{ mr: 1 }}>
                        Export
                    </Button>
                    <Button color="primary" variant="contained" onClick={() => dispatch(setOpenFileView({ openFileView: true }))}>
                        Add Members
                    </Button>
                </Box>
            </Box>
            <Box sx={{ mt: 3 }}>
                <MainCard>
                    <Box sx={{ maxWidth: 500 }}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon color="action" fontSize="small">
                                            <SearchIcon />
                                        </SvgIcon>
                                    </InputAdornment>
                                )
                            }}
                            onChange={(e) => props.setSearch(e.target.value)}
                            placeholder="Search customer"
                            variant="outlined"
                        />
                    </Box>
                </MainCard>
            </Box>
        </Box>
    );
};
