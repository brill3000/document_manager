import React from 'react';
import ReactFlow, {
    addEdge,
    // MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState
} from 'react-flow-renderer';

import { nodes as initialNodes, edges as initialEdges } from './data/generate_intiial-elements';
// import ButtonEdge from './ButtonEdge';
import { useGetSavedWorkflowsQuery } from 'store/async/workflowQuery';
import { Box, Typography } from '@mui/material';
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';

const onInit = (reactFlowInstance: any) => console.log('flow loaded:', reactFlowInstance);

// const edgeTypes = {
//     buttonedge: ButtonEdge
// };

const OverviewFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = React.useCallback((params: any) => setEdges((eds) => addEdge({ ...params, type: 'buttonedge' }, eds)), []);
    const workflowQuery = useGetSavedWorkflowsQuery(null);

    // React.useEffect(() => {
    //     if (Array.isArray(workflowQuery.data)) {
    //         workflowQuery.data.forEach((workflow, index) => {
    //             if (index === 0) {
    //                 console.log(workflow.nodes, 'NODES');
    //                 console.log(workflow.edges, 'EDGES');
    //                 setNodes(workflow.nodes);
    //                 setEdges(workflow.edges);
    //             }
    //         });
    //     }
    // }, [workflowQuery.data]);

    return workflowQuery.isLoading || workflowQuery.isFetching ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
            <GoogleLoader height={150} width={150} loop={true} />
        </Box>
    ) : workflowQuery.isError ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
            <Error height={100} width={100} />
            <Typography variant="body2">Error Occured..</Typography>
        </Box>
    ) : (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            snapToGrid={true}
            fitView
            attributionPosition="top-right"
        >
            {/* <MiniMap
        nodeStrokeColor={(n) => {
          if (n.style?.background) return n.style.background;
          if (n.type === 'input') return '#0041d0';
          if (n.type === 'output') return '#ff0072';
          if (n.type === 'default') return '#1a192b';

          return '#eee';
        }}
        nodeColor={(n) => {
          if (n.style?.background) return n.style.background;

          return '#fff';
        }}
        nodeBorderRadius={2}
      /> */}
            <Controls />
            <Background color="#aaa" gap={16} />
        </ReactFlow>
    );
};

export default OverviewFlow;
