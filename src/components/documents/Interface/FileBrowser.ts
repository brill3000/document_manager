import React, { RefObject, SetStateAction } from 'react';

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
export interface FolderGridProps {
    documents: (DocumentType | undefined)[];
    selected: DocumentType[];
    setSelected: React.Dispatch<React.SetStateAction<DocumentType[]>>;
    select: (nodeId: key) => void;
    nav: any[];
    gridRef: RefObject<HTMLDivElement>;
}

export interface FileBrowserNaviagationProps {
    history: (string | number)[];
    select: (nodeId: key) => void;
}
export interface DocumentType {
    id: key;
    doc_name: string;
    is_dir: boolean;
    size: number;
    size_units: Units;
    is_archived: boolean;
    custom_attributes?: any;
    parent: key | null;
    children: (number | string)[] | null;
    type: string;
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
    parent?: key | null;
    children?: (number | string)[] | null;
}

export interface FileBrowserContentProps {
    selected: DocumentType[];
    setSelected: React.Dispatch<React.SetStateAction<DocumentType[]>>;
    documents: (DocumentType | undefined)[];
    select: (nodeId: key) => void;
    nav: any[];
    gridRef: RefObject<HTMLDivElement>;
}

export interface FileBrowserFooterProps {
    selected: DocumentType[];
}

export interface DocumentProps {
    document: DocumentType | undefined;
    selected: DocumentType[];
    setSelected: React.Dispatch<SetStateAction<DocumentType[]>>;
    select: (nodeId: key) => void;
    actions: UseModelActions;
    isOverDoc: boolean;
    setIsOverDoc: React.Dispatch<SetStateAction<boolean>>;
    setCloseContext: React.Dispatch<SetStateAction<boolean>>;
    closeContext: boolean;
    scrollPosition?: number;
}
export interface DocumentListProps {
    documents: (DocumentType | undefined)[];
    selected: DocumentType[];
    setSelected: React.Dispatch<SetStateAction<DocumentType[]>>;
    select: (nodeId: key) => void;
    actions: UseModelActions;
    isOverDoc: boolean;
    setIsOverDoc: React.Dispatch<SetStateAction<boolean>>;
    setCloseContext: React.Dispatch<SetStateAction<boolean>>;
    closeContext: boolean;
    scrollPosition: number;
    width?: string | number;
    height?: string | number;
}

export interface UseModelActions {
    createDocument: (key: key, val: DocumentType | undefined) => boolean | Error;
    clear: () => boolean | Error;
    delete: (key: key) => boolean | Error;
    getChildren: (parent: key | null) => Array<DocumentType | undefined> | null;
    changeDetails: (key: key | null, details: EditDocumentType) => boolean | Error;
    move: (key: key | null, parent: key | null) => boolean | Error;
    uploadFiles: (parent: string | number, files: DocumentType[]) => boolean | Error;
    deleteById: (key: key | null) => boolean | Error;
}

export interface StoreState {
    fileMap: Map<key, DocumentType | undefined>;
    root: key | null | undefined;
    initiateFileBrowser: (documents: DocumentType[]) => boolean | Error;
    actions: UseModelActions;
}

export type key = string | number;

export interface RenderTree {
    id: string;
    doc_name: string;
    children?: Array<RenderTree | null>;
    hasChildren: boolean;
}
