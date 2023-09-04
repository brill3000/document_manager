import { TableCell, TableRow, TableRowProps, lighten, styled, tableCellClasses } from '@mui/material';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    maxWidth: 300,
    minWidth: 50,
    padding: '3px 10px',
    // backgroundColor: lighten(theme.palette.secondary.light, 0.95),
    color: theme.palette.text.primary,
    borderBottom: `0.5px solid ${theme.palette.divider}`,
    [`&.${tableCellClasses.head}`]: {
        padding: '5.5px 10px',
        backgroundColor: theme.palette.common.white,
        color: theme.palette.text.primary,
        fontSize: theme.typography.body2.fontSize
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: theme.typography.caption.fontSize
    }
}));
export const GenericDocumentKeyArray = [
    'author',
    'created',
    'doc_name',
    'path',
    'permissions',
    'subscribed',
    'uuid',
    'is_dir',
    'mimeType',
    'size',
    'locked',
    'isLoading',
    'progress',
    'error',
    'isOver',
    'setRenameTarget',
    'setContextParentMenu',
    'setRowSelected',
    'parentContextMenu',
    'setDisableDoubleClick',
    'disableDoubleClick'
];

interface StyledTableRowProps extends TableRowProps {
    isOver?: boolean;
    isDragging?: boolean;
}

export const StyledTableRow = styled(TableRow, {
    shouldForwardProp: (props) => !GenericDocumentKeyArray.includes(props as string) && props !== 'isDragging'
})<StyledTableRowProps>(({ theme, selected, isOver }) => ({
    cursor: 'pointer',
    backgroundColor:
        selected || isOver
            ? selected && isOver
                ? lighten(theme.palette.primary.dark, 0.8)
                : lighten(theme.palette.primary.dark, 0.9)
            : lighten(theme.palette.secondary.light, 0.9),
    '& td:first-of-type': {
        backgroundColor:
            selected || isOver
                ? selected && isOver
                    ? lighten(theme.palette.primary.dark, 0.8)
                    : lighten(theme.palette.primary.dark, 0.9)
                : lighten(theme.palette.secondary.light, 0.9)
    },
    '&:nth-of-type(odd) ': {
        backgroundColor:
            selected || isOver
                ? selected && isOver
                    ? lighten(theme.palette.primary.dark, 0.8)
                    : lighten(theme.palette.primary.dark, 0.9)
                : lighten(theme.palette.secondary.light, 0.8)
    },
    '&:nth-of-type(odd) td:first-of-type': {
        backgroundColor:
            selected || isOver
                ? selected && isOver
                    ? lighten(theme.palette.primary.dark, 0.8)
                    : lighten(theme.palette.primary.dark, 0.9)
                : lighten(theme.palette.secondary.light, 0.8)
    }
}));
