
// import React from 'react';
// import { AutoSizer, Column, Table } from 'react-virtualized';
// import { useViewStore } from '../../../../data/global_state/slices/view';

// interface RowData {
//     name: string;
//     age: number;
//     gender: string;
//     email: string;
//     phone: string;
//     city: string;
//     state: string;
//     country: string;
// }

// const rows: RowData[] = [
//     { name: 'John Doe', age: 30, gender: 'Male', email: 'johndoe@example.com', phone: '555-1234', city: 'New York', state: 'NY', country: 'USA' },
//     { name: 'Jane Smith', age: 25, gender: 'Female', email: 'janesmith@example.com', phone: '555-5678', city: 'Los Angeles', state: 'CA', country: 'USA' },
//     { name: 'Bob Johnson', age: 45, gender: 'Male', email: 'bobjohnson@example.com', phone: '555-9012', city: 'Chicago', state: 'IL', country: 'USA' },
//     { name: 'Alice Williams', age: 35, gender: 'Female', email: 'alicewilliams@example.com', phone: '555-3456', city: 'Houston', state: 'TX', country: 'USA' },
//     { name: 'Steve Brown', age: 50, gender: 'Male', email: 'stevebrown@example.com', phone: '555-7890', city: 'Philadelphia', state: 'PA', country: 'USA' },
    
// ];

// interface Props {
//     width?: number;
//     height?: number;
// }

// const VirtualizedTable: React.FC<Props> = ({ width, height }) => {
//     const gridRef = React.useRef<Table>(null);
//     const [scrollLeft, setScrollLeft] = React.useState<number>(0);
//     const { browserHeight, browserWidth } = useViewStore()

//     const handleScroll = (params: { scrollLeft: number }) => {
//         if (params.scrollLeft !== scrollLeft) {
//             setScrollLeft(params.scrollLeft);
//         }
//     };

//     const renderCell = (dataKey: keyof RowData, rowIndex: number) => {
//         const rowData = rows[rowIndex];
//         return <div>{rowData[dataKey]}</div>;
//     };

//     return (
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-expect-error
//         <AutoSizer>
//             {({ width, height }) => (
//                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                 // @ts-expect-error
//                 <Table
//                     ref={gridRef}
//                     width={width ?? browserWidth}
//                     height={height ?? browserHeight}
//                     headerHeight={50}
//                     rowHeight={50}
//                     rowGetter={({ index }) => rows[index]}
//                     rowCount={rows.length}
//                     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                     // @ts-expect-error
//                     onScroll={handleScroll}
//                     scrollTop={0}
//                     scrollToAlignment='start'
//                 >
//                     {
//                         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                         // @ts-expect-error
//                         <Column
//                             label='Name'
//                             dataKey='name'
//                             width={200}
//                             cellRenderer={(params) => renderCell('name', params.rowIndex)}
//                             headerRenderer={() => <div style={{ position: 'absolute', left: scrollLeft }}>Name</div>}
//                             flexGrow={1}
//                             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                             // @ts-expect-error
//                             fixed
//                         />
//                     }

//                 </Table>
//             )}
//         </AutoSizer>
//     );
// };

// export default VirtualizedTable;



// import React from 'react';
// import { FixedSizeList } from 'react-virtualized';
// import { WindowScroller } from 'react-virtualized/dist/commonjs/WindowScroller';
// import { List } from '@material-ui/core';

// function ExampleList({ rowCount, rowHeight, rowRenderer }) {
//   const listRef = React.useRef(null);

//   function renderList(props) {
//     const { style, isScrolling, onScroll } = props;

//     return (
//       <List ref={listRef} style={style} onScroll={onScroll}>
//         <FixedSizeList
//           height={style.height}
//           width={style.width}
//           itemCount={rowCount}
//           itemSize={rowHeight}
//           overscanCount={5}
//           isScrolling={isScrolling}
//           scrollToAlignment="start"
//           scrollToIndex={0}
//           ref={listRef}
//         >
//           {rowRenderer}
//         </FixedSizeList>
//       </List>
//     );
//   }

//   return (
//     <WindowScroller>
//       {renderList}
//     </WindowScroller>
//   );
// }
import React from 'react'

function VirtualizedList() {
  return (
    <div>VirtualizedList</div>
  )
}

export default VirtualizedList