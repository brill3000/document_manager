import * as React from 'react';
import { BsFileEarmarkPdfFill, BsFillFileEarmarkTextFill, BsFillImageFill } from "react-icons/bs";
import { RiFileExcel2Fill, RiFilePpt2Fill, RiFileWord2Fill } from "react-icons/ri";

export function fileIcon(fileType) {
  switch (fileType) {
    case 'application/pdf':
      return (
        <BsFileEarmarkPdfFill
          style={{
            fontSize: '40px',
            color: '#643936c9',
            marginTop: '9px',
            marginBottom: '9px',
          }} />
      );
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/vnd.oasis.opendocument.spreadsheet':
      return (
        <RiFileExcel2Fill
          style={{
            fontSize: '43px',
            color: '#257a7ade',
            marginTop: '6px',
            marginBottom: '8px',
          }} />
      );
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    case 'application/vnd.oasis.opendocument.presentation':
      return (
        <RiFilePpt2Fill
          style={{
            fontSize: '43px',
            color: '#bb1a1acc',
            marginTop: '6px',
            marginBottom: '8px',
          }} />
      );
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
    case 'application/vnd.oasis.opendocument.text':
      return (
        <RiFileWord2Fill
          style={{
            fontSize: '43px',
            color: '#144497d9',
            marginTop: '6px',
            marginBottom: '8px',
          }} />
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
        <BsFillImageFill
          style={{
            fontSize: '40px',
            color: '#21822ed9',
            marginTop: '9px',
            marginBottom: '9px',
            marginLeft: '5px'
          }} />
      );

    default:
      return (
        <BsFillFileEarmarkTextFill
          style={{
            fontSize: '40px',
            color: '#2563a2cc',
            marginTop: '8px',
            marginBottom: '8px',
          }} />
      );
  }
}
