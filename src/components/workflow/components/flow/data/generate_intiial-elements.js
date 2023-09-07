import React from 'react';
import { MarkerType } from 'reactflow';

export const nodes = [
    {
        id: '3',
        data: {
            label: 'Document Assembly'
        },
        position: { x: 250, y: 100 },
        style: {
            color: '#333',
            border: '.8px solid #222138',
            width: 180
        }
    },
    {
        id: '4',
        position: { x: 250, y: 200 },
        data: {
            label: 'Assignment of Approval Document'
        },
        style: {
            color: '#333',
            border: '.8px solid #222138',
            width: 180
        }
    },
    {
        id: '5',
        data: {
            label: 'Signing and approval of document'
        },
        position: { x: 250, y: 325 },
        style: {
            color: '#333',
            border: '.8px solid #222138',
            width: 180
        }
    },
    {
        id: '6',
        type: 'output',
        data: {
            label: 'Complete and filing of Licencing Agreement'
        },
        position: { x: 100, y: 480 },
        style: {
            color: '#333',
            border: '.8px solid #222138',
            width: 180
        }
    },
    {
        id: '7',
        type: 'output',
        data: { label: 'Report Generation and Feedback' },
        position: { x: 400, y: 450 },
        style: {
            background: '#f6ab6c',
            color: '#333',
            border: '.8px solid #222138',
            width: 180
        }
    }
];

export const edges = [
    {
        id: 'e3-4',
        source: '3',
        target: '4',
        animated: true,
        type: 'smoothstep',
        style: { stroke: 'red' },
        label: 'being reviewed'
    },
    {
        id: 'e4-5',
        source: '4',
        target: '5',
        type: 'smoothstep',
        style: { stroke: 'green' },
        label: 'completed'
    },
    {
        id: 'e5-6',
        source: '5',
        target: '6',
        type: 'smoothstep',
        style: { stroke: 'green' },
        label: 'completed'
    },
    {
        id: 'e5-7',
        source: '5',
        target: '7',
        type: 'smoothstep',
        style: { stroke: '#f6ab6c' },
        label: 'In progress',
        animated: true,
        labelStyle: { fill: '#f6ab6c', fontWeight: 700 }
    }
];
