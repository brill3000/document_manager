import { VirtualizedList as List } from './ListView';
import { VirtualizedGrid as Grid } from './GridView';
import { memo } from 'react';

const VirtualizedGrid = memo(Grid);
const VirtualizedList = memo(List);

export { VirtualizedGrid, VirtualizedList };
