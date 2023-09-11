// material-ui
import { Box, FormControl, InputAdornment, OutlinedInput, Stack } from '@mui/material';

// assets
import { SearchOutlined } from '@ant-design/icons';

import logo from 'assets/images/icons/eparliament_logo.png';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = () => (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
        <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
            <OutlinedInput
                size="small"
                id="header-search"
                startAdornment={
                    <InputAdornment position="start" sx={{ mr: -0.5 }}>
                        <SearchOutlined />
                    </InputAdornment>
                }
                aria-describedby="header-search-text"
                inputProps={{
                    'aria-label': 'weight'
                }}
                placeholder="Ctrl + K"
            />
        </FormControl>
        <Box
            component="img"
            src={logo}
            sx={{
                height: (theme) => (typeof theme.mixins.toolbar.minHeight === 'number' ? theme.mixins.toolbar.minHeight - 15 : 40),
                objectFit: 'contain',
                flexGrow: 2
            }}
        />
    </Stack>
);

export default Search;
