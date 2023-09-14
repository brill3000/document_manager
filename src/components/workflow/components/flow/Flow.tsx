import React, { useEffect, useMemo } from 'react';
import ReactFlow, { addEdge, Controls, Background, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

import { nodes as initialNodes, edges as initialEdges } from './data/generate_intiial-elements';
import { nodes as motionNodes, edges as motionEdges } from './data/motion-tabling';

import { FlowWrapper } from '../UI';
import { useAppContext } from 'context/appContext';
import { IWorkflowInstance } from 'global/interfaces';
const proOptions = { hideAttribution: true };

const OverviewFlow = ({ selected }: { selected: string | null }) => {
    const { workflowsInstances } = useAppContext();
    const workflow = useMemo(() => {
        if (selected === null) return { nodes: [], edges: [] };
        if (workflowsInstances === null) return { nodes: [], edges: [] };
        if (workflowsInstances[selected] === null || workflowsInstances[selected] === undefined) return { nodes: [], edges: [] };
        const workflow: IWorkflowInstance = workflowsInstances[selected];
        return workflow;
    }, [workflowsInstances]);
    const [nodes, setNodes, onNodesChange] = useNodesState(workflow.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(workflow.edges);
    const onConnect = React.useCallback((params: any) => setEdges((eds) => addEdge({ ...params, type: 'buttonedge' }, eds)), []);
    const onInit = (reactFlowInstance: any) => console.log('flow loaded:', reactFlowInstance);

    return (
        <FlowWrapper>
            <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
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
