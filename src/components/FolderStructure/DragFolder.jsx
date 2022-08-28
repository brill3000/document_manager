import * as React from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';





export const DragFolder = React.forwardRef(({ children, ...props }, ref) => {
  const [, drag] = useDrag(() => ({
    // "type" is required. It is used by the "accept" specification of drop targets.
    type: 'Folder',
    // The collect function utilizes a "monitor" instance (see the Overview for what this is)
    // to pull important pieces of state from the DnD system.
    canDrag: props.canDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));
  return (
    <div ref={drag} {...props}>
      {children}
    </div>
  );
});
DragFolder.propTypes = {
  children: PropTypes.node.isRequired,
};
