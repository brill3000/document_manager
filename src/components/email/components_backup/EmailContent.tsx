import * as React from 'react';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import AspectRatio from '@mui/joy/AspectRatio';
import ListDivider from '@mui/joy/ListDivider';
import Avatar from '@mui/joy/Avatar';

// Icons import
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ForwardToInboxRoundedIcon from '@mui/icons-material/ForwardToInboxRounded';
import FolderIcon from '@mui/icons-material/Folder';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import { Delete, PersonOffRounded, PersonRounded } from '@mui/icons-material';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import { Stack } from '@mui/material';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import { Conversation, Error } from 'ui-component/LoadHandlers';
import { GoogleLoader } from 'ui-component/LoadHandlers';
import { useUserAuth } from 'context/authContext';
import zIndex from '@mui/material/styles/zIndex';

function padTo2Digits(num: any) {
    return num.toString().padStart(2, '0');
}

function formatDate(date: Date) {
    return (
        [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join('-') +
        ' ' +
        [padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes()), padTo2Digits(date.getSeconds())].join(':')
    );
}

type Mail = {
    id: string;
    sender: string;
    receiver: string;
    date: string;
    body: string;
};

const EmailContent: React.FC<any> = ({
    selectedMail,
    selectedUser,
    getMessageByUser,
    to,
    from
}: {
    selectedMail: any;
    selectedUser: any;
    getMessageByUser: any;
    to: any;
    from: any;
}) => {
    const [mails, setMails] = React.useState<Array<Mail> | null>(null);
    const { data, isSuccess, isLoading, isFetching, isError, error } = getMessageByUser;
    const { user } = useUserAuth();
    React.useEffect(() => {
        if (data && Array.isArray(data) && isSuccess) {
            setMails(
                [
                    ...data.map((mail) => {
                        let send_date: any = formatDate(new Date(Date.parse(mail.time_sent)));
                        if (new Date(Date.parse(mail.time_sent)).toDateString() === new Date().toDateString()) {
                            send_date = send_date.split(' ')[1];
                        }
                        return {
                            id: mail.id,
                            user_id: mail.sender.id,
                            sender: mail.sender.name,
                            receiver: mail.receiver.name,
                            date: send_date,
                            body: mail.message
                        };
                    })
                ].reverse()
            );
        }
    }, [data, isSuccess]);
    return (
        <Sheet
            sx={{
                height: 450,
                variant: 'outlined',
                width: '100%',
                borderRadius: 'sm',
                p: 2,
                mt: 2,
                mb: 3,
                overflowY: 'auto'
            }}
        >
            {to && from && (isFetching || isLoading) ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <Stack direction="column">
                        <GoogleLoader height={150} width={150} loop={true} />
                        <Typography level="body2" sx={{ pl: 3 }}>
                            Loading Conversation ...
                        </Typography>
                    </Stack>
                </Box>
            ) : to && from && isError ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <Stack direction="column">
                        <Error height={100} width={100} />
                        <Typography level="body2" sx={{ pl: 3 }}>
                            Error Loading Conversation ...
                        </Typography>
                    </Stack>
                </Box>
            ) : to && from && mails && Array.isArray(mails) && mails.length > 0 ? (
                <Stack direction="column">
                    {selectedUser && selectedUser.name && (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                            <Chip variant="outlined" startDecorator={<PersonRounded />}>
                                <Typography level="body3" color="neutral">
                                    {selectedUser.name}
                                </Typography>
                            </Chip>
                        </Box>
                    )}
                    <List>
                        {mails.map((mail, i) =>
                            mail.sender === user?.displayName ? (
                                <ListItem
                                    sx={{
                                        mt: 2,
                                        display: 'flex',
                                        justifyContent: 'flex-end'
                                    }}
                                    key={mail.id}
                                >
                                    <Stack direction="column" spacing={1}>
                                        <Box
                                            sx={{
                                                maxWidth: 300,
                                                bgcolor: 'warning.100',
                                                borderRadius: '5px 15px',
                                                pt: 1.5,
                                                pb: 1.5,
                                                pl: 2,
                                                pr: 2
                                            }}
                                        >
                                            <Typography level="body2" color="neutral">
                                                {mail.body}
                                            </Typography>
                                            {/* {
                              i % 3 === 0 &&
                              <Stack direction="column">
                                <List>
                                  <ListItem>
                                    <ListItemDecorator><HiOutlineDocumentText /></ListItemDecorator> <Link href="#"><Typography level='body3'>Approval Doc 1.pdf</Typography></Link>
                                  </ListItem>
                                  <ListItem>
                                    <ListItemDecorator><HiOutlineDocumentText /></ListItemDecorator> <Link href="#"><Typography level='body3'>Approval Doc 1.pdf</Typography></Link>
                                  </ListItem>
                                  <ListItem>
                                    <ListItemDecorator><HiOutlineDocumentText /></ListItemDecorator> <Link href="#"><Typography level='body3'>Approval Doc 1.pdf</Typography></Link>
                                  </ListItem>
                                  <ListItem>
                                    <ListItemDecorator><HiOutlineDocumentText /></ListItemDecorator> <Link href="#"><Typography level='body3'>Approval Doc 1.pdf</Typography></Link>
                                  </ListItem>
                                </List>
                              </Stack>} */}
                                        </Box>
                                        <Stack direction="row" alignItems="center">
                                            <Avatar src="/static/images/avatar/1.jpg" size="sm" />
                                            <Stack direction="column" sx={{ pl: 1 }}>
                                                <Typography level="body4">Me</Typography>
                                                <Typography level="body4">{mail.date}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </ListItem>
                            ) : (
                                <ListItem
                                    sx={{
                                        mt: 2
                                    }}
                                >
                                    <Stack direction="column" spacing={1}>
                                        <Box
                                            sx={{
                                                maxWidth: 300,
                                                bgcolor: 'primary.100',
                                                borderRadius: '15px 5px',
                                                pt: 1.5,
                                                pb: 1.5,
                                                pl: 2,
                                                pr: 2
                                            }}
                                        >
                                            <Typography level="body2" color="neutral">
                                                {mail.body}
                                            </Typography>
                                            {/* {
                              i % 5 === 0 &&
                              <Stack direction="column">
                                <List>
                                  <ListItem>
                                    <ListItemDecorator><HiOutlineDocumentText /></ListItemDecorator> <Link href="#"><Typography level='body3'>Approval Doc 1.pdf</Typography></Link>
                                  </ListItem>
                                </List>
                              </Stack>} */}
                                        </Box>
                                        <Stack direction="row" alignItems="center">
                                            <Avatar src="/static/images/avatar/1.jpg" size="sm" />
                                            <Stack direction="column" sx={{ pl: 1 }}>
                                                <Typography level="body4">{mail.sender}</Typography>
                                                <Typography level="body4">{mail.date}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </ListItem>
                            )
                        )}
                    </List>
                </Stack>
            ) : (
                <Stack
                    direction="column"
                    sx={{
                        mt: !(selectedUser && selectedUser.name) ? 15 : 5
                    }}
                    spacing={5}
                >
                    {selectedUser && selectedUser.name && (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                            <Chip variant="outlined" startDecorator={<PersonRounded />}>
                                <Typography level="body3">{selectedUser.name}</Typography>
                            </Chip>
                        </Box>
                    )}
                    <Stack display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                        <Conversation height={150} width={150} loop={true} />
                        <Typography level="body2" sx={{ pl: 3 }}>
                            No Conversation ...
                        </Typography>
                    </Stack>
                </Stack>
            )}
        </Sheet>
    );
};

export default EmailContent;
