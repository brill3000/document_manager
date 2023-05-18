import Button from '@mui/joy/Button';
import React from 'react';
import { useStoreApi, useReactFlow } from 'react-flow-renderer';

const Sidebar = () => {
    const store = useStoreApi();
    const { zoomIn, zoomOut, setCenter, addNodes } = useReactFlow();

    const focusNode = () => {
        const { nodeInternals } = store.getState();
        const nodes = Array.from(nodeInternals).map(([, node]) => node);

        if (nodes.length > 0) {
            const node = nodes[0];

            const x = node.position.x + node.width / 2;
            const y = node.position.y + node.height / 2;
            const zoom = 1.85;

            setCenter(x, y, { zoom, duration: 1000 });
        }
    };

    return (
        <aside>
            <div className="description">This is an example of how you can use the zoom pan helper hook</div>
            <Button variant="outlined" onClick={focusNode}>
                focus node
            </Button>
            <Button variant="outlined" onClick={zoomIn}>
                zoom in
            </Button>
            <Button variant="outlined" onClick={zoomOut}>
                zoom out
            </Button>
        </aside>
    );
};

export default Sidebar;
