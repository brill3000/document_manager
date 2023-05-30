import React from 'react';

const PdfViewer = ({ content, title }: { content: ArrayBuffer; title: string }) => {
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
        return `data:application/pdf;base64,${base64String}`;
    };

    // Convert array buffer to base64-encoded string
    const base64String = arrayBufferToBase64(content);

    // Create data URL from base64 string
    const dataUrl = createDataUrl(base64String);

    return (
        <>
            <iframe src={dataUrl} width="100%" height="600px" title={title} />
        </>
    );
};

export default PdfViewer;
