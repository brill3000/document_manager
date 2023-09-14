import { create } from 'zustand';
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges
} from 'reactflow';
import { IWorkflowActionTypes, NodeData } from 'global/interfaces';

const initialNodes = [
    {
        id: '0',
        type: 'input',
        data: { label: 'Start' },
        position: { x: 300, y: 200 }
    }
];

export type RFState = {
    nodes: Node<NodeData>[];
    edges: Edge[];
    selected: Node | null;
    addNode: (newNode: Node) => void;
    addEdge: (newEdge: Edge) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    updateNodeLabel: (nodeId: string, title: string) => void;
    addAction: (nodeId: string, action: { id: string; type: IWorkflowActionTypes; label: string; values: any }) => void;
    deleteAction: (nodeId: string, action: string) => void;
    handleNodeClicked: (node: Node<NodeData>) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
    nodes: initialNodes,
    selected: null,
    edges: [],
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes)
        });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges)
        });
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges)
        });
    },
    updateNodeLabel: (nodeId: string, label: string, action?: any) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    // it's important to create a new object here, to inform React Flow about the changes

                    node.data.label = label;
                    if (action) {
                        node.data['action'] = action;
                    }
                }

                return node;
            })
        });
    },
    deleteAction: (nodeId: string, action: string) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    // it's important to create a new object here, to inform React Flow about the changes
                    if (action) {
                        if (Array.isArray(node.data.action)) {
                            node.data.action = node.data.action.filter((act) => act.id !== action);
                        }
                    }
                }
                return node;
            })
        });
    },
    addAction: (nodeId: string, action: { id: string; type: IWorkflowActionTypes; label: string; values: any }) => {
        set({
            nodes: get().nodes.map((node) => {
                if (String(node.id) === String(nodeId)) {
                    // it's important to create a new object here, to inform React Flow about the changes
                    if (action) {
                        if (Array.isArray(node.data.action)) {
                            if (!node.data.action.some((act) => act.type === action.type)) {
                                node.data.action = [...node.data.action, action];
                            }
                        } else {
                            node.data.action = [action];
                        }
                    }
                }
                return node;
            })
        });
    },
    handleNodeClicked: (node) => {
        set({
            selected: node
        });
    },
    addNode: (newNode: Node) => {
        set({
            nodes: get().nodes.concat(newNode)
        });
    },
    addEdge: (newEdge: Edge) => {
        set({
            edges: get().edges.concat(newEdge)
        });
    }
}));

export default useStore;
