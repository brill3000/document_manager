import React, { useEffect, useRef, useState } from 'react';

import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
import { IBpmn } from 'global/interfaces';
import { Box } from '@mui/material';

// export default class Bpmn2 extends React.Component {
//     constructor(props) {
//         super(props);

//         this.state = {};

//         this.containerRef = React.createRef();
//     }

//     componentDidMount() {
//         const { url, diagramXML } = this.props;

//         const container = this.containerRef.current;

//         this.bpmnViewer = new BpmnJS({ container });

//         this.bpmnViewer.on('import.done', (event) => {
//             const { error, warnings } = event;

//             if (error) {
//                 return this.handleError(error);
//             }

//             this.bpmnViewer.get('canvas').zoom('fit-viewport');

//             return this.handleShown(warnings);
//         });

//         if (url) {
//             return this.fetchDiagram(url);
//         }

//         if (diagramXML) {
//             return this.displayDiagram(diagramXML);
//         }
//     }

//     componentWillUnmount() {
//         this.bpmnViewer.destroy();
//     }

//     componentDidUpdate(prevProps, prevState) {
//         const { props, state } = this;

//         if (props.url !== prevProps.url) {
//             return this.fetchDiagram(props.url);
//         }

//         const currentXML = props.diagramXML || state.diagramXML;

//         const previousXML = prevProps.diagramXML || prevState.diagramXML;

//         if (currentXML && currentXML !== previousXML) {
//             return this.displayDiagram(currentXML);
//         }
//     }

//     displayDiagram(diagramXML) {
//         this.bpmnViewer.importXML(diagramXML);
//     }

//     fetchDiagram(url) {
//         this.handleLoading();

//         fetch(url)
//             .then((response) => response.text())
//             .then((text) => this.setState({ diagramXML: text }))
//             .catch((err) => this.handleError(err));
//     }

//     handleLoading() {
//         const { onLoading } = this.props;

//         if (onLoading) {
//             onLoading();
//         }
//     }

//     handleError(err) {
//         const { onError } = this.props;

//         if (onError) {
//             onError(err);
//         }
//     }

//     handleShown(warnings) {
//         const { onShown } = this.props;

//         if (onShown) {
//             onShown(warnings);
//         }
//     }

//     render() {
//         return <div className="react-bpmn-diagram-container" ref={this.containerRef}></div>;
//     }
// }

const Bpmn = ({ url, diagramXML, onLoading, onError, onShown }: IBpmn) => {
    const [state, setState] = useState<{ diagramXML: string }>({ diagramXML: '' });
    const containerRef = useRef<HTMLDivElement>(null);
    const bpmnViewer = useRef<any>(null);

    // ============================= | EFFECTS | ================================ //
    useEffect(() => {
        const container = containerRef.current;
        if (container === null) return;
        bpmnViewer.current = new BpmnJS({ container });

        bpmnViewer.current.on('import.done', (event: any) => {
            const { error, warnings } = event;
            if (error) {
                return handleError(error);
            }
            bpmnViewer.current.get('canvas').zoom('fit-viewport');

            return handleShown(warnings);
        });

        return () => {
            bpmnViewer.current && bpmnViewer.current.destroy();
        };
    }, [url]);
    useEffect(() => {
        if (url) {
            fetchDiagram(url);
        }
    }, [url]);

    useEffect(() => {
        const currentXML = diagramXML || state.diagramXML;
        currentXML && displayDiagram(currentXML);
    }, [state]);

    // ============================= | EVENTS | ================================ //
    const displayDiagram = (diagramXML: unknown) => {
        bpmnViewer.current && bpmnViewer.current.importXML(diagramXML);
    };
    const fetchDiagram = (url: string) => {
        handleLoading();

        fetch(url)
            .then((response) => response.text())
            .then((text) => setState({ diagramXML: text }))
            .catch((err) => {
                handleError(err);
            });
    };

    const handleLoading = () => {
        if (onLoading) {
            onLoading();
        }
    };

    const handleError = (err: unknown) => {
        if (onError) {
            onError(err);
        }
    };

    const handleShown = (warnings: unknown) => {
        if (onShown) {
            onShown(warnings);
        }
    };
    return <Box width="100%" height="100%" className="react-bpmn-diagram-container" ref={containerRef}></Box>;
};

export default Bpmn;
