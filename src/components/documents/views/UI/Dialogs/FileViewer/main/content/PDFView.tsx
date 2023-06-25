import { Box } from '@mui/material';
import { LazyLoader } from 'components/documents/views';
import { isEmpty, isNull, isString, isUndefined } from 'lodash';
import React from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useGetFileContentQuery } from 'store/async/dms/files/filesApi';
// pdfjs.GlobalWorkerOptions.workerSrc = `pdf.worker.js`;
import { FileInterface } from 'global/interfaces';
interface PDFViewerProps {
    filePath: string;
    file: FileInterface;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ filePath, file }) => {
    // ==========================
    const [docFile, setDocFile] = React.useState<string | null>(null);

    const { data: fileContent, isLoading: fileContentIsLoading } = useGetFileContentQuery(
        { docId: !isNull(filePath) && !isUndefined(filePath) ? filePath : '' },
        {
            skip: isNull(filePath) || isUndefined(filePath) || isEmpty(filePath)
        }
    );
    React.useEffect(() => {
        if (!isUndefined(fileContent) && !isNull(fileContent)) {
            const blob = new Blob([fileContent], { type: file.mimeType });
            const url = URL.createObjectURL(blob);
            setDocFile(url);
        }
    }, [fileContent]);

    return (
        <>
            {fileContentIsLoading && !isString(docFile) ? (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <LazyLoader />
                </Box>
            ) : (
                <>
                    {isString(docFile) && !isEmpty(docFile) && (
                        <iframe title="pdf" src={docFile} style={{ height: '95%', width: '100%' }}></iframe>
                    )}
                </>
            )}
        </>
    );
};

export default React.memo(PDFViewer);
