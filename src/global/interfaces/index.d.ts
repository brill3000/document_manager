import { PermissionTypes, RolePermission, UserPermission } from 'components/documents/Interface/FileBrowser';
import { SetStateAction } from 'react';

export interface User {
    first_name: string;
    last_name: string;
}

export interface UserResponse {
    TOKEN: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}
export interface CreateUserRequest {
    username: string;
    password: string;
    email: string;
    active: string;
}

export interface CreateRoleRequest {
    role: string;
    active: string;
}

export interface GrantNodeRequest {
    nodeId: string;
    permissions: number;
    recursive: boolean;
}
export interface GrantRoleRequest extends GrantNodeRequest {
    role: string;
    type: keyof RolePermission;
}
export interface GrantUserRequest extends GrantNodeRequest {
    user: string;
    type: keyof UserPermission;
}
export interface AssignRoleRequest {
    user: string;
    active: string;
}
export interface DeleteUserRequest {
    user: string;
    active: string;
}

export interface GetDocumentContentProps {
    docId: string;
}

export interface GetDocumentContentByVersionProps extends GetDocumentContentProps {
    versionId: string;
}

export interface FolderRequestType {
    fldId: string;
}

export interface CreateDocumentProps {
    doc: Blob;
    content: string;
    fileName: string;
}
export interface CreateDocumentSimpleProps {
    docPath: string;
    file: File;
    fileName: string;
}

export interface CheckInProps extends GetDocumentContentProps {
    content: Blob;
    comment: string;
    increment: string;
    fileName: string;
}

export interface RenameDocumentsProps extends GetDocumentContentProps, GenericRenameProps {}

export interface MoveDocumentProps extends GetDocumentContentProps {
    dstId: string;
}

export interface ExtendeCopyDocumentsProps extends MoveDocumentProps {
    name: string;
    categories: boolean;
    keywords: boolean;
    notes: boolean;
    propertyGroups: boolean;
    wiki: boolean;
}

export interface GetFoldersContentProps {
    fldId: string;
}
export interface JavaCalendar {
    year: number;
    month: number;
    dayOfMonth: number;
    hourOfDay: number;
    minute: number;
    second: number;
}

// ================================= | Create Generic Document type | =============================== //

export interface GenericDocument {
    author: string;
    created: JavaCalendar;
    doc_name: string;
    path: string;
    permissions: PermissionTypes;
    subscribed: boolean;
    uuid: string;
    is_dir: boolean;
    mimeType?: string;
    size?: number;
    locked?: boolean;
    isLoading?: boolean;
    progress?: number;
    error?: boolean;
}

export interface FolderInterface extends Omit<GenericDocument, 'permissions'> {
    hasChildren: boolean;
    permissions: PermissionTypes;
}
export interface FileInterface extends Omit<GenericDocument, 'permissions'> {
    actualVersion: ActualVersionType;
    checkedOut: boolean;
    convertibleToPdf: boolean;
    convertibleToSwf: boolean;
    lastModified: string;
    permissions: PermissionTypes;
    lockInfo: LockInfoType;
    locked: boolean;
    mimeType: string;
    signed: boolean;
    title: string;
    uuid: string;
    doc_name: string;
    is_dir: boolean;
}
export interface CreateFoldersProps {
    fld: any;
}
export interface CreateFoldersSimpleProps {
    docPath: string;
    content: string;
}

interface GenericRenameProps {
    newName: string;
    parent: string;
    newPath: string;
    oldPath: string;
}
export interface RenameFoldersProps extends GetFoldersContentProps, GenericRenameProps {}

export interface SetFoldersPropertiesProps {
    doc: any;
}

export interface MoveFoldersProps extends GetFoldersContentProps {
    dstId: string;
}

export interface ExtendeCopyFoldersProps extends MoveFoldersProps {
    name: string;
    categories: boolean;
    keywords: boolean;
    notes: boolean;
    propertyGroups: boolean;
    wiki: boolean;
}

export interface CreateMissingFoldersProps {
    fldPath: string;
}

export interface LockInfoType {
    nodePath: string;
    owner: string;
    token: string;
}

// =============================== | Documents: Response Types | ============================== //

export type ActualVersionType = {
    actual: boolean;
    author: string;
    checksum: string;
    created: string;
    name: number;
    size: numeber;
};
export interface GenericDocumentResponse {
    author: string;
    path: string;
    permissions: number;
    signed: boolean;
    subscribed: boolean;
    title: string;
    uuid: string;
    created: JavaCalendar;
}
export interface FileResponseInterface extends GenericDocumentResponse {
    actualVersion: ActualVersionType;
    checkedOut: boolean;
    convertibleToPdf: boolean;
    convertibleToSwf: boolean;
    lastModified: string;
    lockInfo: LockInfoType;
    locked: boolean;
    mimeType: string;
    permissions: number;
    signed: boolean;
    title: string;
}
export interface FolderReponseInterface extends GenericDocumentResponse {
    hasChildren: boolean;
    subscriptors: Array<any>;
    keywords: Array<any>;
    categories: Array<any>;
    notes: Array<any>;
}

// =============================== | Treeview | ============================== //

export interface TreeMap {
    expanded: string[];
    treeMap: Map<string, GenericDocument[]>;
    setTreeMap: React.Dispatch<SetStateAction<Map<string, GenericDocument>>>;
}
