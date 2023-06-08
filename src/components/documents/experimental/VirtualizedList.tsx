import { TableVirtuoso } from 'react-virtuoso';
import { generateUsers } from './data';
import React from 'react';
import Table, { TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import { useDrag, useDrop } from 'react-dnd';

const TableComponents = {
    // @ts-expect-error ref
    Scroller: React.forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
    Table: (props: TableProps) => <Table {...props} sx={{ borderCollapse: 'separate', width: '100vw' }} />,
    TableHead: TableHead,
    TableRow: React.forwardRef((props: React.ComponentPropsWithoutRef<typeof TableRow>, ref: React.Ref<any>) => {
        const rowRef = React.useRef<HTMLTableRowElement | null>(null);

        const handleDragStart = (event: React.DragEvent<HTMLTableRowElement>) => {
            event.dataTransfer.setData('text/plain', 'dragging');
        };

        const handleDragOver = (event: React.DragEvent<HTMLTableRowElement>) => {
            event.preventDefault();
        };

        const handleDrop = (event: React.DragEvent<HTMLTableRowElement>) => {
            event.preventDefault();
            console.log(event.target);
            // Handle the drop event here
        };
        return (
            <TableRow
                {...props}
                {...props}
                ref={(node) => {
                    if (ref && typeof ref === 'function') {
                        ref(node);
                    } else if (ref && typeof ref === 'object') {
                        (ref as React.MutableRefObject<HTMLTableRowElement | null>).current = node;
                    }
                    rowRef.current = node;
                }}
                draggable
                onDragStart={(e) => handleDragStart(e)}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e)}
            />
        );
    }),
    // @ts-expect-error ref
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />)
};

// function DraggableItem({ id, children }: { id: string; children: React.ReactNode }) {
//     const [{ isDragging }, drag] = useDrag({
//         item: { id },
//         collect: (monitor) => ({
//             isDragging: monitor.isDragging()
//         }),
//         type: 'item'
//     });

//     return (
//         <TableRow ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
//             {children}
//         </TableRow>
//     );
// }

// function DroppableArea({ children }: { children: React.ReactElement }) {
//     const [{ canDrop, isOver }, drop] = useDrop({
//         accept: 'item',
//         drop: (item: { type: string; id: string }) => {
//             // Handle the dropped item
//         },
//         collect: (monitor) => ({
//             canDrop: monitor.canDrop(),
//             isOver: monitor.isOver()
//         })
//     });

//     return (
//         <div ref={drop} style={{ backgroundColor: isOver && canDrop ? 'lightblue' : 'white' }}>
//             {/* Your content */}
//             {children}
//         </div>
//     );
// }

export function VirtualizedList({ height }: { height: number }) {
    return (
        <TableVirtuoso
            style={{ height: height }}
            data={generateUsers(100)}
            // @ts-expect-error components
            components={TableComponents}
            fixedHeaderContent={() => (
                <TableRow>
                    <TableCell style={{ width: 150, background: 'white', position: 'sticky', left: 0 }}>Name</TableCell>
                    <TableCell style={{ background: 'white' }}>Description</TableCell>
                    <TableCell style={{ background: 'white' }}>Description</TableCell>
                </TableRow>
            )}
            itemContent={(index, user) => (
                <>
                    <TableCell style={{ width: 150, background: 'white', position: 'sticky', left: 0 }}>{user.name}</TableCell>
                    <TableCell style={{ background: 'white' }}>{user.description}</TableCell>
                    <TableCell style={{ background: 'white' }}>{user.description}</TableCell>
                </>
            )}
        />
    );
}
