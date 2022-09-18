import * as React from 'react';
import { GlobalStyles } from '@mui/system';
import { CssVarsProvider } from '@mui/joy/styles';
import type { Theme } from '@mui/joy/styles';
// import Box from '@mui/joy/Box';
// import Typography from '@mui/joy/Typography';
// import IconButton from '@mui/joy/IconButton';
import IconButton from '@mui/joy/IconButton';


// custom
import emailTheme from '../../global/Themes/theme';
import Layout from '../../global/UI/Layout';
import Navigation from './components/Navigation';
import { NavBar } from '../../global/UI/NavBar';
import Sheet from '@mui/joy/Sheet';
import { TiFlowChildren } from "react-icons/ti";
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { useGetSystemUsersQuery } from 'store/async/usersQuery';
import { Experimental_CssVarsProvider, useTheme } from '@mui/material';
import UserTable from './components/UserTable.jsx';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';



const Create: React.FC<any> = () => {
  return (
    <>
      <IconButton variant="outlined">
        <CreateOutlinedIcon />
      </IconButton>
    </>
  )
}



export default function Users({ title }: { title: string }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const department = useSelector((state: RootState) => state.departments.currentDepartment);

  // const customers = useSelector(state => state.departments.users);
  const [search, setSearch] = React.useState('')
  const [users, setUsers] = React.useState<Array<any>>([])
  const theme = useTheme()

  const usersQuery = useGetSystemUsersQuery(null)

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
    <CssVarsProvider disableTransitionOnChange theme={emailTheme}>
      <Sheet
        variant="outlined" color="neutral"
        sx={{
          borderRadius: 10,
          maxHeight: 650,
          overflowY: 'hidden'
        }}
      >
        <GlobalStyles<Theme>
          styles={(theme) => ({
            body: {
              margin: 0,
              fontFamily: theme.vars.fontFamily.body,
            },
          })}
        />
        {drawerOpen && (
          <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
            <Navigation department={department} />
          </Layout.SideDrawer>
        )}
        <Layout.Department
          sx={{
            ...(drawerOpen && {
              height: '100vh',
              overflow: 'hidden',
            }),
          }}
        >
          <NavBar setDrawerOpen={setDrawerOpen} title={department} icon={<TiFlowChildren size={17} />} actions={[<Create />]}/>
          <Layout.SideNav>
            <Navigation department={department} />
          </Layout.SideNav>
          <Layout.Main sx={{ maxHeight: 600, overflowY: 'auto', width: '100%' }}>

            {
              <Experimental_CssVarsProvider>
                <UserTable
                  usersIsLoading={usersQuery.isLoading}
                  usersIsError={usersQuery.isError}
                  usersIsFetching={usersQuery.isFetching}
                  // usersIsSuccess={usersQuery.isSuccess}
                  usersError={usersQuery.error}
                  users={search.length === 0 && users.length === 0 ? users : [...users].filter(customer => customer.name.toLowerCase().includes(search.toLowerCase())) || [...users].filter(customer => customer.email.toLowerCase().includes(search.toLowerCase()))} />
              </Experimental_CssVarsProvider>
            }

          </Layout.Main>
        </Layout.Department>
      </Sheet>
    </CssVarsProvider>
  );
}

