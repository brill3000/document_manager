import React from 'react';
import { MarkerType } from 'reactflow';

export const nodes = [
    {
        id: '3',
        data: {
            label: 'First reacding'
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
            label: 'Second Reading'
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
            label: 'Third Reading'
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
        data: {
            label: 'Presidential Assent'
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
        data: { label: 'commencement' },
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
        label: 'completed'
    },
    {
        id: 'e4-5',
        source: '4',
        target: '5',
        type: 'smoothstep',
        style: { stroke: 'green' },
        label: 'being reviewed'
    },
    {
        id: 'e5-6',
        source: '5',
        target: '6',
        type: 'smoothstep',
        style: { stroke: 'green' },
        label: 'Paused'
    },
    {
        id: 'e5-7',
        source: '6',
        target: '7',
        type: 'smoothstep',
        style: { stroke: '#f6ab6c' },
        label: 'Paused',
        animated: true,
        labelStyle: { fill: '#f6ab6c', fontWeight: 700 }
    }
];
