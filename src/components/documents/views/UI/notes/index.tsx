import { useState } from 'react';
// DRAFTS
import { DraftHandleValue, Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { convertToHTML } from 'draft-convert';
// ICONS
import {
    BsListOl,
    BsListUl,
    BsSubscript,
    BsSuperscript,
    BsTypeBold,
    BsTypeItalic,
    BsTypeStrikethrough,
    BsTypeUnderline
} from 'react-icons/bs';
// ICONS
import { IconBaseProps } from 'react-icons/lib';
import { FiAlignCenter, FiAlignJustify, FiAlignRight } from 'react-icons/fi';
import { PiTextAUnderlineBold, PiTextAaBold } from 'react-icons/pi';
import { LiaTextWidthSolid } from 'react-icons/lia';
import { IoClose } from 'react-icons/io5';
import { MdOutlineAdd } from 'react-icons/md';
// MUI
import { Box, ButtonBase, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

// RTK QUERY
import { useAddNoteMutation } from 'store/async/dms/notes/notesApi';
import { enqueueSnackbar } from 'notistack';
import { Interweave } from 'interweave';
import { isString } from 'lodash';
import { INote } from 'global/interfaces';
import { getDateFromObject } from 'utils/constants/UriHelper';
import { stripHtmlTags } from 'utils';

interface IToolbarItem {
    label: string;
    style?: string;
    icon?: React.ReactElement<IconBaseProps>;
    method: 'inline' | 'block';
    children?: Array<IToolbarItem>;
}

// ============================== | TOOLS | =============================== //

const tools: Array<IToolbarItem> = [
    {
        label: 'text styling',
        style: 'TEXT-STYLING',
        icon: <PiTextAUnderlineBold />,
        method: 'inline',
        children: [
            {
                label: 'bold',
                style: 'BOLD',
                icon: <BsTypeBold />,
                method: 'inline'
            },
            {
                label: 'italic',
                style: 'ITALIC',
                icon: <BsTypeItalic />,
                method: 'inline'
            },
            {
                label: 'underline',
                style: 'UNDERLINE',
                icon: <BsTypeUnderline />,
                method: 'inline'
            },
            {
                label: 'highlight',
                style: 'HIGHLIGHT',
                icon: <BsTypeItalic />,
                method: 'inline'
            },
            {
                label: 'strike-through',
                style: 'STRIKETHROUGH',
                icon: <BsTypeStrikethrough />,
                method: 'inline'
            }
        ]
    },
    {
        label: 'caps',
        style: 'CAPS',
        icon: <PiTextAaBold />,
        method: 'inline',
        children: [
            { label: 'AA', style: 'uppercase', method: 'inline' },
            { label: 'aa', style: 'lowercase', method: 'inline' }
        ]
    },
    {
        label: 'scripts',
        style: 'SCRIPTS',
        icon: <BsSuperscript />,
        method: 'inline',
        children: [
            {
                label: 'Superscript',
                style: 'SUPERSCRIPT',
                icon: <BsSuperscript />,
                method: 'inline'
            },
            {
                label: 'Subscript',
                style: 'SUBSCRIPT',
                icon: <BsSubscript />,
                method: 'inline'
            }
        ]
    },
    {
        label: 'lists',
        style: 'LISTS',
        method: 'inline',
        icon: <BsListUl />,
        children: [
            {
                label: 'Unordered-List',
                style: 'unordered-list-item',
                method: 'block',
                icon: <BsListUl />
            },
            {
                label: 'Ordered-List',
                style: 'ordered-list-item',
                method: 'block',
                icon: <BsListOl />
            }
        ]
    },
    {
        label: 'justify',
        style: 'none',
        icon: <FiAlignJustify />,
        method: 'inline',
        children: [
            {
                label: 'Left',
                style: 'leftAlign',
                icon: <FiAlignRight />,
                method: 'block'
            },
            {
                label: 'Center',
                style: 'centerAlign',
                icon: <FiAlignCenter />,
                method: 'block'
            },
            {
                label: 'Right',
                style: 'rightAlign',
                icon: <FiAlignRight />,
                method: 'block'
            }
        ]
    },
    {
        label: 'text',
        style: 'text',
        icon: <LiaTextWidthSolid />,
        method: 'inline',
        children: [
            { label: 'H1', style: 'header-one', method: 'block' },
            { label: 'H2', style: 'header-two', method: 'block' },
            { label: 'H3', style: 'header-three', method: 'block' },
            { label: 'H4', style: 'header-four', method: 'block' },
            { label: 'H5', style: 'header-five', method: 'block' },
            { label: 'H6', style: 'header-six', method: 'block' }
        ]
    }
];

export function NoteTaker({ nodeId, onClose }: { nodeId: string | null; node_name?: string; onClose: () => void }) {
    // ============================== | STATE | ================================== //
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    // ============================== | RTK QUERY | ================================== //
    const [addNote] = useAddNoteMutation();
    // ============================== | EVENTS | ================================== //
    const handleKeyCommand = (command: string) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return (true as unknown) as DraftHandleValue;
        }
        return (false as unknown) as DraftHandleValue;
    };
    const handleCreateNote = async () => {
        try {
            if (nodeId === null || nodeId === undefined) throw new Error('Failed to add note');
            const contentState = editorState.getCurrentContent();
            const content = convertToHTML(contentState);
            await addNote({ nodeId, text: content }).unwrap();
            enqueueSnackbar('Note added', { variant: 'success' });
            onClose();
        } catch (error) {
            enqueueSnackbar('Failed to add note', { variant: 'error' });
        }
    };
    return (
        <Stack height="100%" width="100%" onClick={(e) => e.stopPropagation()}>
            <Toolbar editorState={editorState} setEditorState={setEditorState} />
            <Box
                height={300}
                overflow="auto"
                px={1}
                py={0.5}
                my={1}
                border="1px solid"
                borderColor={(theme) => theme.palette.divider}
                borderRadius={1}
            >
                <Editor
                    placeholder="Enter note..."
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    onChange={(editorState) => {
                        setEditorState(editorState);
                    }}
                />
            </Box>
            <Stack direction="row" justifyContent="space-between">
                <IconButton sx={{ border: 1 }} color="error" size="small" onClick={onClose}>
                    <IoClose />
                </IconButton>
                <IconButton sx={{ border: 1 }} color="success" size="small" onClick={handleCreateNote}>
                    <MdOutlineAdd />
                </IconButton>
            </Stack>
        </Stack>
    );
}

export const Toolbar = ({ editorState, setEditorState }: { editorState: any; setEditorState: any }) => {
    // ============================== | STATE | =============================== //
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [options, setOptions] = useState<null | Array<IToolbarItem>>(null);
    const open = Boolean(anchorEl);
    // ============================== | EVENTS | =============================== //

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (e: React.MouseEvent<HTMLElement>, item: IToolbarItem) => {
        applyStyle(e, item.style, item.method);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // ============================== | STYLING | =============================== //

    const applyStyle = (e: React.MouseEvent<HTMLElement>, style: any, method: string) => {
        e.preventDefault();
        method === 'block'
            ? setEditorState(RichUtils.toggleBlockType(editorState, style))
            : setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    };

    const isActive = (style: any, method: string) => {
        if (method === 'block') {
            const selection = editorState.getSelection();
            const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
            return blockType === style;
        } else {
            const currentStyle = editorState.getCurrentInlineStyle();
            return currentStyle.has(style);
        }
    };

    const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: IToolbarItem) => {
        if (Array.isArray(item.children)) {
            setOptions(item.children);
            handleClickListItem(e);
        } else {
            applyStyle(e, item.style, item.method);
        }
    };

    return (
        <Grid2
            container
            direction="row"
            justifyContent="space-between"
            border="1px solid"
            borderColor={(theme) => theme.palette.divider}
            mx={0.1}
            borderRadius={1}
        >
            {tools.map((item, idx) => (
                <Grid2 key={item.label}>
                    <IconButton
                        key={`${item.label}-${idx}`}
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleMenuClick(e, item)}
                        onMouseDown={(e) => e.preventDefault()}
                        size="small"
                    >
                        {item.icon || (
                            <Typography variant="caption" component={Box} noWrap>
                                {item.label}
                            </Typography>
                        )}
                    </IconButton>
                </Grid2>
            ))}
            <Menu
                id={`notes-submenu-menu`}
                anchorEl={anchorEl}
                disableAutoFocus
                sx={{ '& .MuiPaper-root': { minWidth: 150 } }}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'notes-submenu-menu',
                    role: 'listbox'
                }}
            >
                {Array.isArray(options) &&
                    options.map((option) => (
                        <MenuItem key={option.label} onClick={(event) => handleMenuItemClick(event, option)}>
                            <Grid2
                                container
                                spacing={1}
                                width="100%"
                                sx={{
                                    color: isActive(option.style, option.method) ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.5)',
                                    border: isActive(option.style, option.method) ? '1px solid' : 0,
                                    borderRadius: 1
                                }}
                            >
                                {option.icon && (
                                    <Grid2 xs={3} display="flex" alignItems="center">
                                        {option.icon}
                                    </Grid2>
                                )}
                                <Grid2 xs={option.icon ? 9 : 12} display="flex" alignItems="center">
                                    <Typography variant="caption" component={Box} noWrap>
                                        {option.label}
                                    </Typography>
                                </Grid2>
                            </Grid2>
                        </MenuItem>
                    ))}
            </Menu>
        </Grid2>
    );
};

export const NoteDisplay = ({ note }: { note: INote }) => {
    return (
        <Stack width="100%">
            <Box
                component={ButtonBase}
                p={1}
                width="100%"
                height="max-content"
                fontSize={(theme) => theme.typography.caption.fontSize}
                display="flex"
                alignItems="start"
                color={(theme) => theme.palette.info.contrastText}
                bgcolor="primary.main"
                borderRadius={1}
                flexDirection="column"
            >
                <Box width="max-content" fontFamily="montserrat">
                    <Interweave content={isString(note.text) ? note.text : ''} />
                </Box>
            </Box>
            <Stack width="100%" direction="row" justifyContent="space-between">
                <Typography variant="caption">{note.author}</Typography>
                <Typography variant="caption">{getDateFromObject(note.date).toDateString()}</Typography>
            </Stack>
        </Stack>
    );
};
