import React, { DragEvent } from 'react';
import { TableRowProps } from '@mui/material/TableRow';
import { StyledTableRow } from '../views/UI/Tables';

type DragDropTableRowProps = TableRowProps & {
    onDrop: () => void;
};

const DragDropTableRow = React.forwardRef<HTMLTableRowElement, DragDropTableRowProps>(({ onDrop, ...props }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false);

    const handleDragStart = (event: DragEvent<HTMLTableRowElement>) => {
        event.dataTransfer.setData('text/plain', 'dragging');
        setIsDragging(true);
    };

    const handleDragOver = (event: DragEvent<HTMLTableRowElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: DragEvent<HTMLTableRowElement>) => {
        event.preventDefault();
        onDrop();
        setIsDragging(false);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    return (
        <StyledTableRow
            {...props}
            ref={ref}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        />
    );
});

export default DragDropTableRow;
