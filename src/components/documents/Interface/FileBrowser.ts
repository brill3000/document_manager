import React, { RefObject, SetStateAction } from 'react';
import { boolean } from 'yup';

export interface FileBrowserProps {
    height?: key;
    width?: key;
    bgColor?: string;
    border?: string;
    borderRadius?: key;
    browserDocuments?: DocumentType[];
    title: string;
}

export interface FileTextEventTarget extends EventTarget {
    index?: number;
}

export interface FileBrowerClickEvent extends React.MouseEvent<HTMLElement> {
    target: FileTextEventTarget;
    currentTarget: any;
}

export interface HistoryInteface {
    id: key;
    label: string;
}
export interface MainGridProps {
    gridRef: RefObject<HTMLDivElement>;
}

export interface FileBrowserNaviagationProps {
    history: (string | number)[];
    select: (nodeId: key) => void;
}
export interface DocumentType {
    id: string;
    doc_name: string;
    is_dir: boolean;
    size: number;
    size_units: Units;
    is_archived: boolean;
    custom_attributes?: any;
    parent: string | null;
    children: Array<string | null> | null;
    type: string;
}
export interface OkmDocumentType {
    author: string;
    created: string;
    doc_name: string;
    hasChildren: boolean;
    path: string;
    permissions: 15;
    subscribed: boolean;
    uuid: string;
    is_dir: boolean;
}

export interface ViewsProps {
    setCloseContext: React.Dispatch<React.SetStateAction<boolean>>;
    closeContext: boolean;
}

export enum Units {
    Kb = 'kb',
    Mb = 'mb',
    Gb = 'gb',
    b = 'b'
}
export interface EditDocumentType {
    doc_name?: string;
    is_dir?: boolean;
    size?: number;
    size_units?: Units;
    is_archived?: boolean;
    custom_attributes?: any;
    parent?: string | null;
    children?: Array<string | null> | null;
}

export interface FileBrowserContentProps {
    gridRef: React.MutableRefObject<HTMLInputElement | null>;
}

export interface FileBrowserFooterProps {
    selected: DocumentType[];
}

export interface DocumentProps {
    documentId: string | null;
    isOverDoc: boolean;
    setIsOverDoc: React.Dispatch<SetStateAction<boolean>>;
    setCloseContext: React.Dispatch<SetStateAction<boolean>>;
    closeContext: boolean;
    scrollPosition?: number;
}
export interface ListViewsProps extends ViewsProps {
    closeContext: boolean;
    scrollPosition: number;
    width?: string | number;
    height?: string | number;
}

export interface UseModelActions {
    createDocument: (key: key, val: DocumentType | undefined) => boolean | Error;
    setRoot: (key: key) => boolean | Error;
    clear: () => boolean | Error;
    delete: (key: key) => boolean | Error;
    getChildren: (parent: string | null) => Array<string | null> | null;
    changeDetails: (key: key | null, details: EditDocumentType) => boolean | Error;
    move: (key: string | null, parent: string | null) => boolean | Error;
    uploadFiles: (parent: string, files: DocumentType[]) => boolean | Error;
    deleteById: (key: key | null) => boolean | Error;
    setSelected: (arg0: Array<string>) => void;
    setFocused: (focused: string | null) => void;
    getDocument: (key: string) => DocumentType | undefined;
    documentExists: (key: string) => boolean;
}

export interface StoreState {
    fileMap: Map<key, DocumentType | undefined>;
    root: key | null | undefined;
    farthestPath: string | null;
    selected: Array<string>;
    focused: string | null;
    initiateFileBrowser: (documents: DocumentType[]) => boolean | Error;
    actions: UseModelActions;
}

export type key = string;

export interface RenderTree {
    id: string;
    index: number;
    doc_name: string;
    children?: Array<RenderTree | null>;
    hasChildren: boolean;
}
