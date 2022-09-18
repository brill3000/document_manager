import { Add } from '@mui/icons-material';
import Button from '@mui/joy/Button';
import { Collapse } from '@mui/material';
import { Stack } from '@mui/system';
import { Formik } from 'formik';
import { FormikText, FormikTextMultiline } from 'global/UI/FormMUI/Components';
import { title } from 'process';
import React, { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  applyEdgeChanges,
  applyNodeChanges,
  // useReactFlow,
  ReactFlowProvider,
  useReactFlow
} from 'react-flow-renderer';
import './GenerateFlow.css'
// Custom components & data
import { nodes as initialNodes, edges as initialEdges } from './generate_intiial-elements';
import TextUpdaterNode from './TextUpdaterNode';
// const flowKey = 'example-flow';
const getNodeId = () => `randomnode_${+new Date()}`;


// const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);

const GenerateFlow = () => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [openForm, setOpenForm] = React.useState(false)
  const flowKey = 'flow'
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const yPos = useRef(0);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
  const [rfInstance, setRfInstance] = React.useState(null);

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
      }
    };

    restoreFlow();
    // }, [setNodes, setViewport]);
  }, [setNodes]);


  const onAdd = useCallback((title) => {
    yPos.current += 50;
    const newNode = {
      id: getNodeId(),
      data: { label: title ?? '' },
      position: { x: 350, y: yPos.current },

    };
    setNodes((nds) => nds.concat(newNode));
    setOpenForm(false)
  }, [setNodes]);



  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}

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
      <ReactFlowProvider>
        <div className="save__controls">
          {/* <button onClick={onSave}>save</button>
          <button onClick={onRestore}>restore</button> */}
          {!openForm && <Button variant='soft' startIcon={<Add />} onClick={() => setOpenForm(true)}>Add Process</Button>}
          <Collapse in={openForm} timeout="auto" unmountOnExit>
            <Stack>
              <Formik
                initialValues={{ title: '', placeholder: '', minRows: 1, isRequired: '', initialValue: '', defaultChecked: false }}
                validate={values => {
                  const errors = {};
                  if (!values.title) {
                    errors['title'] = 'Required';
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  onAdd(values.title)
                }}>
                {({
                  values,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  /* and other goodies */
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Button
                      variant='soft'
                      type="submit"
                      sx={{ mt: 2 }}
                      disabled={isSubmitting}
                      startIcon={<Add />}
                      size="sm"
                      onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
                    >
                      Add Process
                    </Button>
                    <FormikTextMultiline
                      label="Title"
                      name="title"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.label}
                      sx={{ py: 1 }}
                    />
                  </form>
                )}
              </Formik>
            </Stack>
          </Collapse>
        </div>
      </ReactFlowProvider>
    </>
  );
};

export default GenerateFlow;




