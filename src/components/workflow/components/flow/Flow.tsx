import React, { useEffect } from 'react';
import ReactFlow, { addEdge, Controls, Background, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

import { nodes as initialNodes, edges as initialEdges } from './data/generate_intiial-elements';
import { nodes as motionNodes, edges as motionEdges } from './data/motion-tabling';

import { FlowWrapper } from '../UI';
const onInit = (reactFlowInstance: any) => console.log('flow loaded:', reactFlowInstance);
const proOptions = { hideAttribution: true };

const OverviewFlow = ({ selected }: { selected: number | null }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(selected === 1 ? motionNodes : initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(selected === 1 ? motionEdges : initialEdges);
    const onConnect = React.useCallback((params: any) => setEdges((eds) => addEdge({ ...params, type: 'buttonedge' }, eds)), []);
    useEffect(() => {
        selected === 1 ? setNodes(motionNodes) : setNodes(initialNodes);
        selected === 1 ? setEdges(motionEdges) : setEdges(initialEdges);
    }, [selected]);
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
                attributionPosition="top-right"
            >
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </FlowWrapper>
    );
};

export default OverviewFlow;
