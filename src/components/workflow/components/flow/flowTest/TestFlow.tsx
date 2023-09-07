import { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent, useCallback, useMemo, useRef } from 'react';
import ReactFlow, { useReactFlow, ReactFlowProvider, Controls, Background } from 'reactflow';
// ZUSTAND
import useStore from './store';
// CSS
// COMPONENTS
import TextUpdaterNode from './TextUpdaterNode';
import { FlowWrapper } from '../../UI';
import 'reactflow/dist/style.css';

let id = 1;
const getId = () => `${id++}`;

const AddNodeOnEdgeDrop = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const connectingNodeId = useRef<string | null>(null);

    const { nodes, edges, addEdge, addNode, onNodesChange, onEdgesChange, onConnect } = useStore();

    const { project } = useReactFlow();

    const onConnectStart = useCallback((_: ReactMouseEvent | ReactTouchEvent, { nodeId }: { nodeId: string | null }) => {
        if (connectingNodeId.current === null) return;
        connectingNodeId.current = nodeId;
    }, []);

    const onConnectStop = useCallback(
        (event: any) => {
            const targetIsPane = event.target.classList.contains('react-flow__pane');

            if (targetIsPane) {
                if (reactFlowWrapper.current === null) return;
                if (connectingNodeId.current === null) return;
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
                    type: 'smoothstep'
                });
            }
        },
        [project]
    );
    const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

    return (
        <FlowWrapper ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectStop}
                snapToGrid={true}
                attributionPosition="top-right"
            />
            <Controls />

            <Background color="#aaa" gap={16} />
        </FlowWrapper>
    );
};

const TestFlow = () => (
    <ReactFlowProvider>
        <AddNodeOnEdgeDrop />
    </ReactFlowProvider>
);
export default TestFlow;
