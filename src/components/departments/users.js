import { Box, Container } from '@mui/material';
// import { useSelector } from 'react-redux';
// import { CustomerListResults } from './customer-list-results';
import { CustomerListToolbar } from './customer-list-toolbar';
import * as React from 'react';
import UserTable from './usersList';
import MainCard from 'components/MainCard';
import { useGetSystemUsersQuery } from 'store/async/usersQuery';
// import { Stack, Typography } from '@mui/material';
// import Loader from 'components/Loader';
// import { Error } from 'ui-component/FolderLoader';
// import Loadable from 'components/Loadable';


const Customers = ({ currentDepartment }) => {
  // const customers = useSelector(state => state.departments.users);
  const [search, setSearch] = React.useState('')
  const [users, setUsers] = React.useState([])

  const usersQuery = useGetSystemUsersQuery()

  React.useEffect(() => {
    if (usersQuery.isSuccess) {
      setUsers(usersQuery.data)

      const users = usersQuery.data?.map(user => ({
        address: { country: 'USA OF A', state: 'West Virginia', city: 'Parkersburg', street: '2849 Fulton Street' },
        avatarUrl: "/static/images/avatars/avatar_3.png",
        createdAt: user.registration_date,
        email: user.email,
        id: user.user_id,
        name: user.name.first_name + ' ' + user.name.last_name,
        position: user.position,
        phone: "304-428-3097",
        is_admin: user.is_admin
      }))
      setUsers(users)

    }


  }, [usersQuery.isSuccess, usersQuery.data])




  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
      }}
    >
      <Container maxWidth={false}>
        <CustomerListToolbar currentDepartment={currentDepartment} setSearch={setSearch} />
        <MainCard sx={{ mt: 2 }} content={false}>
          {

            <UserTable
              usersIsLoading={usersQuery.isLoading}
              usersIsFetching={usersQuery.isFetching}
              usersIsError={usersQuery.isError}
              usersIsSuccess={usersQuery.isSuccess}
              usersError={usersQuery.error}
              users={search.length === 0 && users.length === 0 ? users : [...users].filter(customer => customer.name.toLowerCase().includes(search.toLowerCase())) || [...users].filter(customer => customer.email.toLowerCase().includes(search.toLowerCase()))} />

          }
        </MainCard>
      </Container>
    </Box>
  )
};

export default Customers;
