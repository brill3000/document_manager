import * as React from 'react';
import { BsFileEarmarkPdfFill, BsFillFileEarmarkImageFill, BsFillFileEarmarkTextFill, BsFillFileEarmarkZipFill } from 'react-icons/bs';
import { RiFileExcel2Fill, RiFilePpt2Fill, RiFileWord2Fill } from 'react-icons/ri';

const MemorizedBsFileEarmarkPdfFill = React.memo(BsFileEarmarkPdfFill);
const MemorizedBsFillFileEarmarkTextFill = React.memo(BsFillFileEarmarkTextFill);
const MemorizedBsFillImageFill = React.memo(BsFillFileEarmarkImageFill);
const MemorizedRiFileExcel2Fill = React.memo(RiFileExcel2Fill);
const MemorizedRiFilePpt2Fill = React.memo(RiFilePpt2Fill);
const MemorizedRiFileWord2Fill = React.memo(RiFileWord2Fill);
const MemorizedBsFillFileEarmarkZipFill = React.memo(BsFillFileEarmarkZipFill);

export function fileIcon(mimeType: string | undefined, size: number, file_icon_margin: number, contrast: string | null = null) {
    switch (mimeType) {
        case 'application/pdf':
            return (
                <MemorizedBsFileEarmarkPdfFill
                    size={size !== undefined ? size : 50}
                    style={{
                        color: contrast !== null ? contrast : '#c50606',
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px'
                    }}
                />
            );
        case 'application/zip':
        case 'application/x-rar-compressed':
            return (
                <MemorizedBsFillFileEarmarkZipFill
                    size={size !== undefined ? size : 50}
                    style={{
                        color: contrast !== null ? contrast : 'rgb(255, 202, 40)',
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px'
                    }}
                />
            );
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/vnd.oasis.opendocument.spreadsheet':
            return (
                <MemorizedRiFileExcel2Fill
                    size={size !== undefined ? size + 3 : 53}
                    style={{
                        color: contrast !== null ? contrast : '#257a7ade',
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '8px'
                    }}
                />
            );
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'application/vnd.oasis.opendocument.presentation':
            return (
                <MemorizedRiFilePpt2Fill
                    size={size !== undefined ? size + 3 : 53}
                    style={{
                        color: contrast !== null ? contrast : '#bb1a1acc',
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '8px'
                    }}
                />
            );
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
        case 'application/vnd.oasis.opendocument.text':
            return (
                <MemorizedRiFileWord2Fill
                    size={size !== undefined ? size + 3 : 53}
                    style={{
                        color: '#144497d9',
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '8px'
                    }}
                />
            );
        case 'image/jpeg':
        case 'image/gif':
        case 'image/bmp':
        case 'image/avif':
        case 'image/png':
        case 'image/svg+xml':
        case 'image/svg':
        case 'image/tiff':
        case 'image/webp':
            return (
                <MemorizedBsFillImageFill
                    size={size !== undefined ? size + 3 : 53}
                    style={{
                        color: '#2563a2cc',
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '5px'
                    }}
                />
            );

        default:
            return (
                <MemorizedBsFillFileEarmarkTextFill
                    size={size !== undefined ? size + 3 : 53}
                    style={{
                        color: '#2563a2cc',
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin - 1 : '8px'
                    }}
                />
            );
    }
}
