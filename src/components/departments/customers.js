import { Box, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { CustomerListResults } from './customer-list-results';
import { CustomerListToolbar } from './customer-list-toolbar';
import * as React from 'react';


const Customers = ({ currentDepartment }) => {
  const customers = useSelector(state => state.departments.users);
  const [search, setSearch] = React.useState('')

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
      }}
    >
      <Container maxWidth={false}>
        <CustomerListToolbar currentDepartment={currentDepartment} setSearch={setSearch}/>
        <Box sx={{ mt: 3 }}>
          <CustomerListResults customers={search.length === 0 && customers.length === 0 ? customers : customers.filter(customer => customer &&customer.name.includes(search.toLowerCase()))} />
        </Box>
      </Container>
    </Box>
  )
};

export default Customers;
