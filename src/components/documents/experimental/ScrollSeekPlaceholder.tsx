import React from 'react';
import { LazyLoader } from '../views';

// You can use index to randomize
// and make the placeholder list more organic.
// the height passed is the one measured for the real item.
// the placeholder should be the same size.
export default function ScrollSeekPlaceholder({ height }: { height: number; index: number; context?: any }) {
    return <LazyLoader height={height} width="100%" align="flex-start" />;
}
