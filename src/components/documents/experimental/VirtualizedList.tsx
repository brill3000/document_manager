import React from 'react';
import { ScrollSync, Grid } from 'react-virtualized';
import { useDrag, useDrop } from 'react-dnd';

export interface Row {
    id: number;
    name: string;
    email: string;
}

interface RowProps {
    row: Row;
    rowIndex: number;
}

const DraggableRow: React.FC<RowProps> = ({ row, rowIndex }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'row',
        item: { id: row.id, index: rowIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const [, drop] = useDrop({
        accept: 'row',
        drop: (item: { id: number; index: number }) => handleDrop(item.id, item.index, rowIndex)
    });

    const opacity = isDragging ? 0.5 : 1;
    const backgroundColor = 'white';
    const handleDrop = (item: number | string, destination: number | string, index: number) => {
        console.log(`${item}: ${destination}: ${index}`);
    };

    return (
        <div ref={drop} style={{ opacity, backgroundColor }}>
            <div ref={drag}>{row.name}</div>
        </div>
    );
};

interface Props {
    rows: Row[];
}

const VirtualizedList: React.FC<Props> = ({ rows }) => {
    const rowRenderer = ({ columnIndex, key, rowIndex, style }: any) => {
        const row = rows[rowIndex];

        let content;
        if (columnIndex === 0) {
            content = row.id;
        } else if (columnIndex === 1) {
            content = <DraggableRow row={row} rowIndex={rowIndex} />;
        } else if (columnIndex === 2) {
            content = row.email;
        }

        return (
            <div key={key} style={style}>
                {content}
            </div>
        );
    };

    const headerRenderer = ({ columnIndex, key, style }: any) => {
        let content;
        if (columnIndex === 0) {
            content = 'ID';
        } else if (columnIndex === 1) {
            content = 'Name';
        } else if (columnIndex === 2) {
            content = 'Email';
        }

        return (
            <div key={key} style={style}>
                {content}
            </div>
        );
    };

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        // Handle scroll event here
    };

    return (
        <ScrollSync>
            {({ onScroll, scrollTop }) => (
                <div>
                    <div style={{ display: 'flex', fontWeight: 'bold' }}>
                        <div style={{ flex: '0 0 200px' }}>ID</div>
                        <div style={{ flex: '1' }}>Name</div>
                        <div style={{ flex: '1' }}>Email</div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: '0 0 200px' }}>
                            <div style={{ height: '500px', overflowY: 'scroll' }} onScroll={handleScroll}>
                                {rows.map((_, index) => (
                                    <div key={index} style={{ height: '20px' }}>
                                        {index + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ flex: '1' }}>
                            <div style={{ height: '500px', overflowY: 'scroll', position: 'relative' }}>
                                <Grid
                                    cellRenderer={rowRenderer}
                                    columnCount={3}
                                    columnWidth={200}
                                    height={rows.length * 20} // Updated row height
                                    rowCount={rows.length}
                                    rowHeight={20} // Updated row height
                                    width={800}
                                    scrollTop={scrollTop}
                                    headerHeight={50}
                                    renderHeader={headerRenderer}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ScrollSync>
    );
};

export { VirtualizedList };
