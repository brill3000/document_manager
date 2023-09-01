import { useState } from 'react';
// DRAFTS
import { DraftHandleValue, Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
// ICONS
import { BsTypeBold, BsTypeItalic, BsTypeUnderline } from 'react-icons/bs';
// MUI
import { Box, IconButton, Stack, Typography } from '@mui/material';

export function NoteTaker() {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const handleKeyCommand = (command: string) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return (true as unknown) as DraftHandleValue;
        }
        return (false as unknown) as DraftHandleValue;
    };
    return (
        <Stack height="100%" width="100%" onClick={(e) => e.stopPropagation()}>
            <Toolbar editorState={editorState} setEditorState={setEditorState} />
            <Editor
                placeholder="Enter note..."
                editorState={editorState}
                handleKeyCommand={handleKeyCommand}
                onChange={(editorState) => {
                    const contentState = editorState.getCurrentContent();
                    console.log(convertToRaw(contentState));
                    setEditorState(editorState);
                }}
            />
        </Stack>
    );
}

export const Toolbar = ({ editorState, setEditorState }: { editorState: any; setEditorState: any }) => {
    const tools = [
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
        // {
        //     label: 'strike-through',
        //     style: 'STRIKETHROUGH',
        //     icon: <BsTypeStrikethrough />,
        //     method: 'inline'
        // },
        // {
        //     label: 'Superscript',
        //     style: 'SUPERSCRIPT',
        //     icon: <BsTypeStrikethrough />,
        //     method: 'inline'
        // },
        // {
        //     label: 'Subscript',
        //     style: 'SUBSCRIPT',
        //     icon: <BsTypeStrikethrough />,
        //     method: 'inline'
        // },
        // {
        //     label: 'Monospace',
        //     style: 'CODE',
        //     icon: <BsTypeStrikethrough />,
        //     method: 'inline'
        // },
        // {
        //     label: 'Blockquote',
        //     style: 'blockQuote',
        //     icon: <BsTypeStrikethrough />,
        //     method: 'block'
        // },
        // {
        //     label: 'Unordered-List',
        //     style: 'unordered-list-item',
        //     method: 'block',
        //     icon: <BsTypeStrikethrough />
        // },
        // {
        //     label: 'Ordered-List',
        //     style: 'ordered-list-item',
        //     method: 'block',
        //     icon: <BsTypeStrikethrough />
        // },
        // {
        //     label: 'Code Block',
        //     style: 'CODEBLOCK',
        //     icon: <BsTypeStrikethrough />,
        //     method: 'inline'
        // },
        // {
        //     label: 'Uppercase',
        //     style: 'UPPERCASE',
        //     icon: <BsTypeStrikethrough />,
        //     method: 'inline'
        // },
        // {
        //     label: 'lowercase',
        //     style: 'LOWERCASE',
        //     icon: <BsTypeStrikethrough />,
        //     method: 'inline'
        // },
        // {
        //     label: 'Left',
        //     style: 'leftAlign',
        //     icon: <BsTypeStrikethrough />,
        //     method: 'block'
        // },
        // {
        //     label: 'Center',
        //     style: 'centerAlign',
        //     icon: <BsTypeStrikethrough />,
        //     method: 'block'
        // },
        // {
        //     label: 'Right',
        //     style: 'rightAlign',
        //     icon: <BsTypeStrikethrough />,
        //     method: 'block'
        // },
        { label: 'H1', style: 'header-one', method: 'block' },
        { label: 'H2', style: 'header-two', method: 'block' },
        { label: 'H3', style: 'header-three', method: 'block' },
        { label: 'H4', style: 'header-four', method: 'block' },
        { label: 'H5', style: 'header-five', method: 'block' },
        { label: 'H6', style: 'header-six', method: 'block' }
    ];

    const applyStyle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, style: any, method: string) => {
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

    return (
        <Box className="toolbar-grid">
            {tools.map((item, idx) => (
                <IconButton
                    style={{
                        color: isActive(item.style, item.method) ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)'
                    }}
                    key={`${item.label}-${idx}`}
                    onClick={(e) => applyStyle(e, item.style, item.method)}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    {item.icon || <Typography variant="caption">{item.label}</Typography>}
                </IconButton>
            ))}
        </Box>
    );
};

export default Toolbar;
