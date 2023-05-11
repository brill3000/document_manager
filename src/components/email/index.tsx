import * as React from 'react';
import { GlobalStyles } from '@mui/system';
import { CssVarsProvider } from '@mui/joy/styles';
import type { Theme } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import { useGetSystemUsersQuery } from 'store/async/usersQuery';


// Icons import
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';

// custom
import emailTheme from '../../global/Themes/theme';
import Layout from '../../global/UI/Layout';
import EmailNav from './components/EmailNav';
import Mails from './components/Mails';
import EmailContent from './components/EmailContent';
import { NavBar } from '../../global/UI/NavBar';
import { DropdownButton } from '../../global/UI/DropdownButton';
import Sheet from '@mui/joy/Sheet';
import { TbMessageDots } from "react-icons/tb";
import { CircularProgress, ClickAwayListener, Experimental_CssVarsProvider, Stack } from '@mui/material';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import UsersSelect from './components/UserSelect';
import { useGetMessageByUserQuery, useRefetchMessagesMutation, useSendMessageMutation } from 'store/async/messagesQuery';
import { useUserAuth } from 'context/authContext';
import { useSnackbar } from 'notistack';
import randomColor from "randomcolor";
import { GoogleLoader, Sending } from 'ui-component/LoadHandlers';
import { setOpenFileView } from 'store/reducers/documents';
import { useDispatch, useSelector } from 'react-redux';
import CustomTreeView from 'components/FolderStructure/Treeview';
import ViewFile from './components/ViewFile';
import ThemeCustomization from 'themes';
import { ReloadOutlined } from '@ant-design/icons';






const Create: React.FC<any> = ({ selectedUser, setSelectedUser, users, isLoading, isFetching, isError }: { selectedUser: any | null, setSelectedUser: Function, users: Array<any> | null, isLoading: Boolean, isFetching: Boolean, isError: Boolean }) => {
  const [openSearch, setOpenSearch] = React.useState(false);
  const handleClickAway = () => {
    setOpenSearch(false)
  }
  return (
    <>
      <IconButton variant="outlined" onClick={() => setOpenSearch(true)}>
        <ReloadOutlined />
      </IconButton>
      {/* {
        openSearch &&
        <ClickAwayListener onClickAway={handleClickAway}>
          <div>
            <UsersSelect setSelectedUser={setSelectedUser} selectedUser={selectedUser} users={users} isLoading={isLoading} isFetching={isFetching} isError={isError} />
          </div>
        </ClickAwayListener>
      } */}
    </>
  )
}

const Refetch: React.FC<any> = () => {
  const [refetchMessages] = useRefetchMessagesMutation()
  return (
    <>
      <IconButton variant="outlined" onClick={() => refetchMessages(true)}>
        <ReloadOutlined />
      </IconButton>
    </>
  )
}

type SelectedUser = {
  id: string,
  name: string,
  role: string,
  is_admin: boolean
}




export default function Email() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [collapseUnread, setCollapseUnread] = React.useState<boolean>(false);
  const [collapseOthers, setCollapseOthers] = React.useState<boolean>(false);
  const [selectedMail, setSelectedMail] = React.useState<any>(null)
  const [selectedUser, setSelectedUser] = React.useState<SelectedUser | null>(null)
  const [value, setValue] = React.useState<string>('')
  const { user } = useUserAuth()
  const { enqueueSnackbar } = useSnackbar();
  const [isSending, setIsSending] = React.useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = React.useState<string>('inbox');
  const [from, setFrom] = React.useState<string | null>(null);
  const [to, setTo] = React.useState<string | null>(null);
  const [openView, setOpenView] = React.useState<boolean>(false)

  // 👇️ ts-ignore ignores any ts errors on the next line
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore 
  const getMessageByUser = useGetMessageByUserQuery({ to: to, from: from })

  React.useEffect(() => {
    switch (selectedIndex) {
      case 'sent':
        setFrom(user.uid)
        setTo(null)
        break;
      case 'inbox':
        setTo(user.uid)
        setFrom(null)
        break;

      case 'draft':
      case 'flagged':
      case 'trash':
        setTo(null)
        setFrom(null)
        break;
      default:
        setFrom(selectedIndex)
        setTo(user.uid)
        break;
    }
  }, [selectedIndex, user.uid])
  React.useEffect(() => {
    if (selectedMail && selectedMail.senderId !== user.uid) {
      setSelectedIndex(selectedMail.senderId)
    } else if (selectedMail && selectedMail.senderId === user.uid) {
      setSelectedIndex(selectedMail.receiverId)
    }
  }, [selectedMail])



  // 👇️ ts-ignore ignores any ts errors on the next line
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore  
  const usersQuery = useGetSystemUsersQuery()
  const [users, setUsers] = React.useState<Array<any> | null>(null)


  React.useEffect(() => {
    if (usersQuery.isSuccess) {
      const users = usersQuery.data?.filter((data) => data.user_id !== user.uid).map(user => ({
        id: user.user_id,
        name: user.name.first_name + ' ' + user.name.last_name,
        role: user.position,
        is_admin: user.is_admin,
        color: randomColor()
      }))
      setUsers(users)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersQuery.isSuccess, usersQuery.data])

  const [sendMessage] = useSendMessageMutation();

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value)
  }

  const handleSendMessage: React.MouseEventHandler<HTMLAnchorElement> = () => {
    if (selectedUser && value.length > 0) {
      setIsSending(true)
      const message = {
        to: {
          id: selectedUser.id,
          name: selectedUser.name
        },
        from: {
          id: user.uid,
          name: user.displayName
        },
        message: value
      }
      sendMessage(message)
        .unwrap()
        .then(() => {
          setIsSending(false)
          setValue('')
          setTimeout(() => {
            const message = `Message Sent Successfully`
            enqueueSnackbar(message, { variant: 'success' })
          }, 300)
        })
        .catch(() => {
          setIsSending(false)
          setTimeout(() => {
            const message = `Failed to send`
            enqueueSnackbar(message, { variant: 'error' })
          }, 300)
        })
    }
  }

  const title: string = 'Emails';
  return (
    <CssVarsProvider disableTransitionOnChange theme={emailTheme}>
      <Sheet
        variant="outlined"
        color="neutral"
        sx={{ borderRadius: 10, maxHeight: 650, overflowY: 'hidden' }}>
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
            <EmailNav users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} isLoading={usersQuery.isLoading} isError={usersQuery.isError} selectedIndex={selectedIndex} setSelectedIndex={(value: string) => setSelectedIndex(value)} />
          </Layout.SideDrawer>
        )}
        <Layout.Mail
          sx={{
            ...(drawerOpen && {
              height: '100vh',
              overflow: 'hidden',
            }),
          }}
        >
          {/* <NavBar setDrawerOpen={setDrawerOpen} title={title} icon={<TbMessageDots size={20} />} actions={[<Create selectedUser={selectedUser} setSelectedUser={setSelectedUser} users={users} isLoading={usersQuery.isLoading} isFetching={usersQuery.isFetching} isError={usersQuery.isError} />]} /> */}
          <NavBar setDrawerOpen={setDrawerOpen} title={title} icon={<TbMessageDots size={20} />} actions={[<Refetch/>]} />
          {/* <NavBar setDrawerOpen={setDrawerOpen} title={title} icon={<TbMessageDots size={20} />} /> */}
          <Layout.SideNav>
            <EmailNav users={users} isLoading={usersQuery.isLoading} isFetching={usersQuery.isFetching} isError={usersQuery.isError} selectedIndex={selectedIndex} setSelectedUser={setSelectedUser} setSelectedIndex={(value: string) => setSelectedIndex(value)} />
          </Layout.SideNav>
          <Layout.SidePane sx={{ maxHeight: 600, overflowY: 'auto', pb: 10 }}>
            {/* <Box
              sx={{
                p: 2,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                textColor="neutral.500"
                fontWeight={700}
                sx={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '.1rem',
                }}
              >
                Unread
              </Typography>
              <IconButton
                size="sm"
                variant="plain"
                color="primary"
                sx={{ '--IconButton-size': '24px' }}
              >
                {DropdownButton(collapseUnread, setCollapseUnread)}
              </IconButton>
            </Box>
            {
              !collapseUnread && (
              <Box sx={{ py: 10 }}>
                <Typography
                  textColor="text.tertiary"
                  level="body2"
                  sx={{ textAlign: 'center' }}
                >
                  You&apos;ve read all messages in your inbox.
                </Typography> 
              </Box>
              )
            } */}
            <Box
              sx={{
                p: 2,
                mt: 2.3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                textColor="neutral.500"
                fontWeight={700}
                sx={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '.1rem',
                }}
              >
                Messsages
              </Typography>
              <IconButton
                size="sm"
                variant="plain"
                color="primary"
                sx={{ '--IconButton-size': '24px' }}
              >
                {DropdownButton(collapseOthers, setCollapseOthers)}
              </IconButton>
            </Box>
            {!collapseOthers && <Mails setSelectedMail={setSelectedMail} selectedMail={selectedMail} getMessageByUser={getMessageByUser} />}
          </Layout.SidePane>
          <Layout.Main sx={{ maxHeight: 600, overflowY: 'auto', width: '100%' }}>
            <EmailContent selectedMail={selectedMail} selectedUser={selectedUser} to={to} from={from} getMessageByUser={getMessageByUser} />
            <Stack direction="row" spacing={1}>
              <Textarea placeholder="Type in here…" variant="outlined" sx={{ minWidth: '83%' }} value={value} onChange={handleChange} />
              <Stack direction="row" spacing={1}>
                <Box maxHeight={20}>
                  <IconButton
                    variant="outlined"
                    disabled={value.length < 1 || isSending}
                    onClick={() => {
                      setOpenView(true)
                    }}
                  >
                    <AttachFileRoundedIcon />
                  </IconButton>
                </Box>

                {isSending ?
                  <Box maxHeight={20}>
                    <Sending height={40} width={40} loop={true} />
                  </Box>
                  :
                  <Box maxHeight={20}>
                    <IconButton variant="solid" disabled={value.length < 1} onClick={handleSendMessage} >
                      <SendRoundedIcon />
                    </IconButton>
                  </Box>
                }
              </Stack>
            </Stack>
          </Layout.Main>
        </Layout.Mail>
      </Sheet>
      <Experimental_CssVarsProvider>
        <ThemeCustomization>
          <ViewFile modalType="folder view" viewUrl={null} isFullScreen={true} openView={openView} setOpenView={setOpenView}>
            <CustomTreeView />
          </ViewFile>
        </ThemeCustomization>
      </Experimental_CssVarsProvider>

    </CssVarsProvider>
  );
}

