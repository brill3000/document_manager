import React, { SetStateAction } from 'react';
import { TableRowProps } from '@mui/material/TableRow';
import { StyledTableRow } from '../views/UI/Tables';
import { useDragAndDropHandlers, useForwardRef, useHandleClickEvents } from 'utils/hooks';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { GenericDocument } from 'global/interfaces';
import { useBrowserStore } from '../data/global_state/slices/BrowserMock';
// import { isNull } from 'lodash';
// import ActionMenu from '../views/UI/Menus/DocumentActionMenu';

export type DragDropTableRowProps = TableRowProps & {
    item: GenericDocument;
    setContextParentMenu: React.Dispatch<SetStateAction<{ mouseX: number; mouseY: number } | null>>;
    parentContextMenu: { mouseX: number; mouseY: number } | null;
    setRenameTarget: React.Dispatch<SetStateAction<{ id: string; rename: boolean } | null>>;
    setRowSelected: React.Dispatch<SetStateAction<{ path: string; locked?: boolean; doc_name: string; is_dir: boolean }>>;
    setDisableDoubleClick: React.Dispatch<SetStateAction<boolean>>;
    disableDoubleClick: boolean;
    // onDrop: () => void;
};

const DragDropTableRow = React.forwardRef<HTMLTableRowElement, DragDropTableRowProps>(({ ...props }, ref) => {
    const { item, setContextParentMenu, parentContextMenu, setRenameTarget, setRowSelected, disableDoubleClick } = props;
    // ================================= | STATE | ============================= //
    const innerRef = useForwardRef(ref);
    // ================================= | Zustand | ============================= //
    const { focused } = useBrowserStore();
    // ================================= | Drag & Drop | ============================= //
    const { preview, isDragging, drag, drop, isOver } = useDragAndDropHandlers({
        is_dir: item.is_dir,
        doc_name: item.doc_name,
        path: item.path
    });
    // ================================= | Click Events Hook | ========================== //
    const { handleClick, handleDoubleClick } = useHandleClickEvents({
        path: item.path,
        is_dir: item.is_dir,
        doc_name: item.doc_name,
        setContextMenu: setContextParentMenu,
        contextMenu: parentContextMenu,
        setRenameTarget,
        setRowSelected
    });

    /**
     * Remove the current item for the preview image
     */

    React.useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    return (
        <StyledTableRow
            {...props}
            isOver={isOver}
            isDragging={isDragging}
            selected={focused.id === item.path ? true : false}
            ref={(node) => {
                innerRef.current = node;
                drag(node);
                drop(node);
            }}
            onClick={handleClick}
            onContextMenu={handleClick}
            onDoubleClick={() => handleDoubleClick(disableDoubleClick)}
            sx={{
                opacity: isDragging ? 0 : 1,
                transition: '0.1s opacity',
                transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                ...(focused.id === item.path && { bgcolor: (theme) => theme.palette.primary.main })
            }}
        />
    );
});

export default DragDropTableRow;
