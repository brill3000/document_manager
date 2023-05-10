import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { FaWpforms } from "react-icons/fa";
import { MdOutlineApproval } from "react-icons/md";
import TouchAppIcon from '@mui/icons-material/TouchApp';


const actions = [
    { icon: <FaWpforms size={15}/>, name: 'Fill In Form', id: 'form'},
    { icon: <MdOutlineApproval size={15}/>, name: 'Approval', id: 'approval' },

];

export default function ActionDial({setSelectedAction}) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return (

        <Box sx={{
            position: 'relative',
            height: open ? 200 : 50,
            width: 'max-content',
            transitionDuration: '0.3s',

        }}>
            <SpeedDial
                ariaLabel="Actions"
                hidden={false}
                icon={<TouchAppIcon size="small" sx={{pr: .3 }}/>}
                direction={'down'}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
                FabProps={{ size:'small' }}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        tooltipOpen
                        key={action.name}
                        icon={action.icon}
                        tooltipPlacement="right"
                        tooltipTitle={action.name}
                        onClick={() => {
                            setOpen(false)
                            setSelectedAction(action.id)
                        }}
                        FabProps={{ size:'small', color:"secondary" }}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
}
