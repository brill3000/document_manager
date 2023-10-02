import { useEffect, useRef, useState } from 'react';
import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
// import ReactBpmn from 'react-bpmn';
import { IBpmn } from 'global/interfaces';
import { Box } from '@mui/material';

const Bpmn = ({ url, diagramXML, onLoading, onError, onShown }: IBpmn) => {
    const [state, setState] = useState<{ diagramXML: string }>({ diagramXML: '' });
    const containerRef = useRef<HTMLDivElement>(null);
    const bpmnViewer = useRef<any>(null);

    // ============================= | EFFECTS | ================================ //
    useEffect(() => {
        const container = containerRef.current;
        if (container === null) return;
        bpmnViewer.current = new BpmnJS({
            container,
            keyboard: {
                bindTo: window
            },
            propertiesPanel: {
                parent: '#propview'
            }
        });

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

// const Bpmn = ({ url, diagramXML, onLoading, onError, onShown }: IBpmn) => {
//     // ============================= | STATES | ================================ //
//     const [state, setState] = useState<{ diagramXML: string }>({ diagramXML: '' });
//     // ============================= | REF | ================================ //
//     const containerRef = useRef<HTMLDivElement>(null);
//     const bpmnViewer = useRef<any>(null);

//     // ============================= | EFFECTS | ================================ //

//     return (
//         <Box width="100%" height="100%">
//             <ReactBpmn url={url} onShown={onShown} onLoading={onLoading} onError={onError} />
//         </Box>
//     );
// };

// export default Bpmn;
