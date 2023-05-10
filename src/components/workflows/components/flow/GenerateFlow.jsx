import { FormikText } from 'global/UI/FormMUI/Components';
import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  // useReactFlow,
} from 'react-flow-renderer';
import ActionNodeType from './ActionNodeType';
import './GenerateFlow.css'
// Custom components & data
import TextUpdaterNode from './TextUpdaterNode';
import ButtonEdge from './ButtonEdge';

// const flowKey = 'example-flow';


// const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);\

const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);

const edgeTypes = {
  buttonedge: ButtonEdge,
};


const GenerateFlow = ({onAdd, setOpenForm, openForm, setNodes, setEdges, nodes, edges }) => {
  
  // const flowKey = 'flow'
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) =>  applyEdgeChanges(changes, eds)
    ),
    [setEdges]
  );
  const nodeTypes = useMemo(() => ({ 
    textUpdater: TextUpdaterNode,
    actionNode: ActionNodeType,
   }), []);



  



  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        edgeTypes={edgeTypes}
        // onInit={setRfInstance}
        fitView
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
    </>
  );
};

export default GenerateFlow;





