import React from 'react';
import PDFViewer from './PDFView';
import { FileInterface } from 'global/interfaces';
import { isNull, isUndefined } from 'lodash';

export function Content({ filePath, file }: { filePath: string; file?: FileInterface | null }) {
    return !isUndefined(file) && !isNull(file) ? <PDFViewer filePath={filePath} file={file} /> : <></>;
}
