import { Box } from '@mui/material';
import React from 'react';
// import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
function MsFileViewer({ content, mimeType }: { content: ArrayBuffer; title: string; mimeType: string }) {
    // Convert array buffer to base64-encoded string
    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    // Create data URL from base64 string
    const createDataUrl = (base64String: string) => {
        return `data:${mimeType};base64,${base64String}`;
    };

    // Convert array buffer to base64-encoded string
    const base64String = arrayBufferToBase64(content);

    // Create data URL from base64 string
    const dataUrl = createDataUrl(base64String);
    return <Box></Box>;
    // return <DocViewer documents={[{ uri: dataUrl }]} pluginRenderers={DocViewerRenderers} />;
}

export default MsFileViewer;
