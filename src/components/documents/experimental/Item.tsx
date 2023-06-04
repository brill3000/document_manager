import { useDrag, useDrop, DragSourceMonitor } from 'react-dnd';
import { Row } from './VirtualizedList';
export interface RowRenderer {
    columnIndex: number;
    key: number;
    rowIndex: number;
    style: any;
    rows: Row[];
    handleDrop: (item: number | string, destination: number | string) => void;
}

export const rowRenderer = ({ columnIndex, key, rowIndex, style, rows, handleDrop }: any) => {
    const row = rows[rowIndex];

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'item',
        item: { id: row.id },
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging()
        })
    }));

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'item',
        drop: (item: { id: number }) => handleDrop(item.id, row.id),
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    }));

    const opacity = isDragging ? 0.5 : 1;
    const backgroundColor = isOver ? 'lightblue' : 'white';

    let content;
    if (columnIndex === 0) {
        content = row.id;
    } else if (columnIndex === 1) {
        content = row.name;
    } else if (columnIndex === 2) {
        content = row.email;
    }

    return (
        <div ref={drop} key={key} style={{ ...style, opacity, backgroundColor }}>
            <div ref={drag}>{content}</div>
        </div>
    );
};
