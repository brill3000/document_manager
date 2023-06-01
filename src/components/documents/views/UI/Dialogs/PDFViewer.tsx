import React from 'react';

const PdfViewer = ({ content, title, mimeType }: { content: string; title: string; mimeType: string }) => {
    const [base64Data, setBase64Data] = React.useState<string>('');

    // const convertToBase64 = (binaryData: string) => {
    //     const blob = new Blob([binaryData], { type: mimeType });

    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         const base64Data = reader.result;
    //         if (typeof base64Data === 'string') setBase64Data(base64Data);
    //     };
    //     reader.readAsDataURL(blob);
    // };

    // React.useEffect(() => {
    //     convertToBase64(content);
    // }, [content]);
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    return (
        <>
            <iframe src={url} width="100%" height="600px" title={title} />
        </>
    );
};

export default PdfViewer;
