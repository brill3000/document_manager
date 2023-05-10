import * as React from 'react';
import ReactFlow, {
    useReactFlow,
    ReactFlowProvider,
    Controls,
    Background,
} from 'react-flow-renderer';

import './testFlow.css';
import TextUpdaterNode from './TextUpdaterNode';
import useStore from './store';


let id = 1;
const getId = () => `${id++}`;

const fitViewOptions = {
    padding: 3,
};

const AddNodeOnEdgeDrop = () => {
    const reactFlowWrapper = React.useRef(null);
    const connectingNodeId = React.useRef(null);

    const { nodes, edges, addEdge, addNode, onNodesChange, onEdgesChange, onConnect } = useStore();


    const { project } = useReactFlow();

    const onConnectStart = React.useCallback((_, { nodeId }) => {
        connectingNodeId.current = nodeId;
    }, []);

    const onConnectStop = React.useCallback(
        (event) => {
            const targetIsPane = event.target.classList.contains('react-flow__pane');

            if (targetIsPane) {
                // we need to remove the wrapper bounds, in order to get the correct position
                const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
                const id = getId();
                const newNode = {
                    id,
                    // we are removing the half of the node width (75) to center the new node
                    position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
                    data: { label: `Node ${id}` },
                    type: 'textUpdater'
                };

                addNode(newNode);
                addEdge({ 
                    id, 
                    source: connectingNodeId.current, 
                    target: id,
                    type: 'smoothstep',
                 });
            }
        },
        [project]
    );
    const nodeTypes = React.useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
    
    console.log(nodes, "NODE")
    console.log(edges, "EDGES")

    return (
        <div className="wrapper" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onConnectStart={onConnectStart}
                onConnectStop={onConnectStop}
                // fitView
                // fitViewOptions={fitViewOptions}
            />
            <Controls />

            <Background color="#aaa" gap={16} />
        </div>
    );
};

const TestFlow = () => (
    <ReactFlowProvider>
        <AddNodeOnEdgeDrop />
    </ReactFlowProvider>
);
export default TestFlow