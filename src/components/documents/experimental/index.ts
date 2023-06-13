import { VirtualizedList as List } from './VirtualizedList';
import { VirtualizedGrid as Grid } from './VirtualizedGrid';
import React from 'react';

const VirtualizedGrid = React.memo(Grid);
const VirtualizedList = React.memo(List);

export { VirtualizedGrid, VirtualizedList };
