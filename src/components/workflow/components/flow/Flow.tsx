import React from 'react';
import ReactFlow, { addEdge, Controls, Background, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

import { nodes as initialNodes, edges as initialEdges } from './data/generate_intiial-elements';
import { FlowWrapper } from '../UI';
const onInit = (reactFlowInstance: any) => console.log('flow loaded:', reactFlowInstance);
const proOptions = { hideAttribution: true };

const OverviewFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = React.useCallback((params: any) => setEdges((eds) => addEdge({ ...params, type: 'buttonedge' }, eds)), []);

    return (
        <FlowWrapper>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={onInit}
                proOptions={proOptions}
                snapToGrid={true}
                fitView
                attributionPosition="top-right"
            >
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </FlowWrapper>
    );
};

export default OverviewFlow;
