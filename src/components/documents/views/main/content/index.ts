import { VirtualizedList as List } from './ListView';
import { VirtualizedGrid as Grid } from './GridView';
import React from 'react';

const VirtualizedGrid = React.memo(Grid);
const VirtualizedList = React.memo(List);

export { VirtualizedGrid, VirtualizedList };
