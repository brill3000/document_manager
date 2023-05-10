import { Divider, MenuItem, Stack, Typography } from '@mui/material'
import React from 'react'
import { BsFolderPlus } from 'react-icons/bs'
import { IoMdCopy, IoMdTrash } from 'react-icons/io'
import { IoCutOutline } from 'react-icons/io5'
import { StyledMenu } from './StyledMenu'
import { CiEdit, CiEraser } from "react-icons/ci";
import { theme } from '../../../../Themes/theme'


interface ActionMenuProps {
    contextMenu: { mouseX: number, mouseY: number } | null,
    handleMenuClose: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    handleMenuClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>, type: 'open' | 'copy' | 'cut' | 'rename' | 'edit' | 'delete') => void
}


export const ActionMenu = ({ contextMenu, handleMenuClose, handleMenuClick }: ActionMenuProps) => {
    const [selected, setSelected] = React.useState<'open' | 'copy' | 'cut' | 'rename' | 'edit' | 'delete' | null>(null)
    React.useEffect(() => {
        return () => {
            setSelected(null)
        }
    })
    return (
        <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
            }}
            open={contextMenu !== null}
            onClose={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { handleMenuClose(e); setSelected(null); }}
            anchorReference="anchorPosition"
            verticalOrigin='top'
            horizontalOrigin='left'
            anchorPosition={contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined}
            disableAutoFocusItem={true}
        >
            <MenuItem
                selected={selected === 'open'}
                onClick={(e) => { setSelected('open'); handleMenuClick(e, 'open') }}
            >
                <Stack height='max-content' direction='row' spacing={1} p={.3} borderRadius={1}>
                    <BsFolderPlus size={18} />
                    <Typography variant='body2' fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>Open</Typography>
                </Stack>
            </MenuItem>
            <MenuItem
                selected={selected === 'copy'}
                onClick={(e) => { setSelected('copy'); handleMenuClick(e, 'copy') }}
            >
                <Stack height='max-content' direction='row' spacing={1} p={.3} borderRadius={1}>
                    <IoMdCopy size={20} />
                    <Typography variant='body2' fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>Copy</Typography>
                </Stack>
            </MenuItem>
            <MenuItem
                selected={selected === 'cut'}
                onClick={(e) => { setSelected('cut'); handleMenuClick(e, 'cut') }}
            >
                <Stack height='max-content' direction='row' spacing={1} p={.3} borderRadius={1}>
                    <IoCutOutline size={20} />
                    <Typography variant='body2' fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>Cut</Typography>
                </Stack>
            </MenuItem>
            <Divider sx={{ my: 0.2 }} variant='middle' />
            <MenuItem
                selected={selected === 'rename'}

                onClick={(e) => { setSelected('rename'); handleMenuClick(e, 'rename') }}
            >
                <Stack height='max-content' direction='row' spacing={1} p={.3} borderRadius={1}>
                    <CiEdit size={21} />
                    <Typography variant='body2' fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>Rename</Typography>
                </Stack>
            </MenuItem>
            <MenuItem
                selected={selected === 'edit'}

                onClick={(e) => { setSelected('edit'); handleMenuClick(e, 'edit') }}
            >
                <Stack height='max-content' direction='row' spacing={1} p={.3} borderRadius={1}>
                    <CiEraser size={20} />
                    <Typography variant='body2' fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>Edit</Typography>
                </Stack>
            </MenuItem>
            <Divider sx={{ my: 0.2 }} variant='middle' />
            <MenuItem
                selected={selected === 'delete'}
                onClick={(e) => { setSelected('delete'); handleMenuClick(e, 'delete') }}
            >
                <Stack height='max-content' direction='row' spacing={1} p={.3} borderRadius={1}>
                    <IoMdTrash size={20} color={theme.palette.error.main} />
                    <Typography variant='body2' fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>Delete</Typography>
                </Stack>
            </MenuItem>
        </StyledMenu>
    )
}

export default ActionMenu
