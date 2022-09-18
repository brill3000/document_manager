import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import { Stack } from '@mui/system';
import { GoogleLoader } from 'ui-component/LoadHandlers';
import Chip from '@mui/joy/Chip';
import CallMadeRoundedIcon from '@mui/icons-material/CallMadeRounded';
import CallReceivedRoundedIcon from '@mui/icons-material/CallReceivedRounded';

function padTo2Digits(num: any) {
  return num.toString().padStart(2, '0');
}

function formatDate(date: Date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}

type Mail = {
  id: string,
  sender: string,
  receiver: string,
  senderId: string,
  receiverId: string,
  date: string,
  body: string
}


const EmailList: React.FC<any> = ({ setSelectedMail, selectedMail, getMessageByUser }: { setSelectedMail: any, selectedMail: any, getMessageByUser: any }) => {
  const [mails, setMails] = React.useState<Array<Mail> | null>(null)
  const { data, isSuccess, isLoading, isFetching, isError, error } = getMessageByUser
  React.useEffect(() => {
    if (data && Array.isArray(data) && isSuccess) {
      setMails([...data.map((mail => {
        let send_date: any = formatDate(new Date(Date.parse(mail.time_sent)))
        if (new Date(Date.parse(mail.time_sent)).toDateString() === new Date().toDateString()) {
          send_date = send_date.split(" ")[1]
        }
        return {
          id: mail.id,
          user_id: mail.sender.id,
          sender: mail.sender.name,
          senderId: mail.sender.id,
          receiverId: mail.receiver.id,
          receiver: mail.receiver.name,
          date: send_date,
          body: mail.message,
        }
      }))])
    }
  }, [data, isSuccess])
  return (
    <List sx={{ '--List-decorator-size': '30px' }}>
      {
        isLoading || !data || isFetching ?
          <GoogleLoader height={100} width={100} loop={true} />
          :
          mails &&
          mails.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemButton
                  {...(selectedMail && selectedMail.id === item.id && { variant: 'soft', color: 'primary' })}
                  sx={{ p: 2 }}
                  onClick={() => setSelectedMail(item)}
                >
                  <Box sx={{ width: '100%' }}>
                    <Stack
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        pb: 0.3,
                      }}
                      direction="row"
                    >
                      <Chip variant="soft" startDecorator={<CallMadeRoundedIcon />}>
                        <Typography level="body3">{item.sender}</Typography>
                      </Chip>
                      <Chip variant="soft" color="warning" startDecorator={<CallReceivedRoundedIcon />}>
                        <Typography level="body3">{item.receiver}</Typography>
                      </Chip>
                    </Stack>
                    <Stack direction="column" spacing={.5} sx={{ p: .5 }}>
                      <Typography level="body2">
                        <span style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: '3',
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.2
                        }}>
                          {item.body}
                        </span>
                      </Typography>
                      <Typography level="body4" textColor="text.tertiary">
                        {item.date}
                      </Typography>
                    </Stack>
                  </Box>
                </ListItemButton>
              </ListItem>
              <ListDivider sx={{ m: 0 }} />
            </React.Fragment>
          ))
      }
    </List >
  );
}

export default EmailList;