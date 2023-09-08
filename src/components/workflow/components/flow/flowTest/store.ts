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

const initialNodes = [
    {
        id: '0',
        type: 'input',
        data: { label: 'Start' },
        position: { x: 300, y: 200 }
    }
];

export type NodeData = {
    label: string;
    action?: any;
};

export type RFState = {
    nodes: Node<NodeData>[];
    edges: Edge[];
    addNode: (newNode: Node) => void;
    addEdge: (newEdge: Edge) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    updateNodeLabel: (nodeId: string, title: string) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
    nodes: initialNodes,
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
