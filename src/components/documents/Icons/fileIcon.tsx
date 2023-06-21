import * as React from 'react';
import { BsFileEarmarkPdfFill, BsFillFileEarmarkImageFill, BsFillFileEarmarkTextFill, BsFillFileEarmarkZipFill } from 'react-icons/bs';
import { RiFileExcel2Fill, RiFilePpt2Fill, RiFileWord2Fill } from 'react-icons/ri';
import { green } from '@mui/material/colors';
import { darken } from '@mui/material';
import { isNull, isUndefined } from 'lodash';
import UnzipIcon from 'assets/images/icons/UnzipIcon';
import EmptyTrash from 'assets/images/icons/EmptyTrash';
import EmptyFolder from 'assets/images/icons/EmptyFolder';
import SearchIcon from 'assets/images/icons/SearchIcon';
const MemorizedBsFileEarmarkPdfFill = React.memo(BsFileEarmarkPdfFill);
const MemorizedBsFillFileEarmarkTextFill = React.memo(BsFillFileEarmarkTextFill);
const MemorizedBsFillImageFill = React.memo(BsFillFileEarmarkImageFill);
const MemorizedRiFileExcel2Fill = React.memo(RiFileExcel2Fill);
const MemorizedRiFilePpt2Fill = React.memo(RiFilePpt2Fill);
const MemorizedRiFileWord2Fill = React.memo(RiFileWord2Fill);
const MemorizedBsFillFileEarmarkZipFill = React.memo(BsFillFileEarmarkZipFill);
export const MemorizedBsFillFileEarmarkUnZipFill = React.memo(UnzipIcon);
export const MemorizedBsEmptyTrashFill = React.memo(EmptyTrash);
export const MemorizedBsEmptyFolder = React.memo(EmptyFolder);
export const MemorizedSearchIcon = React.memo(SearchIcon);

export interface FileIconProps {
    mimeType: string | undefined;
    size?: number;
    file_icon_margin?: number;
    contrast?: string | null;
    dark?: boolean;
}

export const fileIcon = ({ mimeType, size, file_icon_margin, contrast, dark }: FileIconProps) => {
    const dFactor = 0.3;
    const resize = 4;
    const transition = '0.15s';
    switch (mimeType) {
        case 'application/pdf':
            return (
                <MemorizedBsFileEarmarkPdfFill
                    size={size !== undefined ? (dark ? size - 2 + resize : size - 2) : 50}
                    style={{
                        transition: `${transition} all`,
                        transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                        color:
                            !isUndefined(contrast) && !isNull(contrast)
                                ? darken(contrast, dark ? dFactor : 0)
                                : darken('#c50606', dark ? dFactor : 0),
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px'
                    }}
                />
            );
        case 'application/zip':
        case 'application/x-rar-compressed':
            return (
                <MemorizedBsFillFileEarmarkZipFill
                    size={size !== undefined ? (dark ? size - 2 + resize : size - 2) : 50}
                    style={{
                        transition: `${transition} all`,
                        transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                        color:
                            !isUndefined(contrast) && !isNull(contrast)
                                ? darken(contrast, dark ? dFactor : 0)
                                : darken('rgb(255, 202, 40)', dark ? dFactor : 0),
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
                    size={size !== undefined ? (dark ? size + resize : size) : 53}
                    style={{
                        transition: `${transition} all`,
                        transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                        color:
                            !isUndefined(contrast) && !isNull(contrast)
                                ? darken(contrast, dark ? dFactor : 0)
                                : darken('#257a7ade', dark ? dFactor : 0),
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
                    size={size !== undefined ? (dark ? size + resize : size) : 53}
                    style={{
                        transition: `${transition} all`,
                        transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                        color:
                            !isUndefined(contrast) && !isNull(contrast)
                                ? darken(contrast, dark ? dFactor : 0)
                                : darken('#bb1a1acc', dark ? dFactor : 0),
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
                    size={size !== undefined ? (dark ? size + resize : size) : 53}
                    style={{
                        transition: `${transition} all`,
                        transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                        color:
                            !isUndefined(contrast) && !isNull(contrast)
                                ? darken(contrast, dark ? dFactor : 0)
                                : darken('#144497d9', dark ? dFactor : 0),
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
                    size={size !== undefined ? (dark ? size - 2 + resize : size - 2) : 50}
                    style={{
                        transition: `${transition} all`,
                        transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                        color:
                            !isUndefined(contrast) && !isNull(contrast)
                                ? darken(contrast, dark ? dFactor : 0)
                                : darken(green[600], dark ? dFactor : 0),
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '5px'
                    }}
                />
            );

        default:
            return (
                <MemorizedBsFillFileEarmarkTextFill
                    size={size !== undefined ? (dark ? size - 2 + resize : size - 2) : 50}
                    style={{
                        transition: `${transition} all`,
                        transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                        color:
                            !isUndefined(contrast) && !isNull(contrast)
                                ? darken(contrast, dark ? dFactor : 0)
                                : darken('#2563a2cc', dark ? dFactor : 0),
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin - 1 : '8px'
                    }}
                />
            );
    }
};
