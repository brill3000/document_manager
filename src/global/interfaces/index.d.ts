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

export interface GrantRoleRequest {
    nodeId: string;
    role: string;
    permissions: string;
    recursive: string;
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
    doc: string;
    content: string;
}
export interface CreateDocumentSimpleProps {
    docPath: string;
    content: string;
}

export interface CheckInProps extends GetDocumentContentProps {
    content: string;
    comment: string;
    increment: string;
}

export interface RenameDocumentsProps extends GetDocumentContentProps {
    newName: string;
}

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

// ================================= | Create Generic Document type | =============================== //

export interface GenericDocument {
    author: string;
    created: string;
    doc_name: string;
    path: string;
    permissions: number;
    subscribed: boolean;
    uuid: string;
    is_dir: boolean;
    mimeType?: string;
    size?: number;
    locked?: boolean;
}

export interface GetFetchedFoldersProps extends GenericDocument {
    hasChildren: boolean;
}
export interface FileResponseInterface extends GenericDocument {
    actualVersion: ActualVersionType;
    checkedOut: boolean;
    convertibleToPdf: boolean;
    convertibleToSwf: boolean;
    lastModified: string;
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

export interface RenameFoldersProps extends GetFoldersContentProps {
    newName: string;
}

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
export interface FileResponseInterface {
    actualVersion: ActualVersionType;
    author: string;
    checkedOut: boolean;
    convertibleToPdf: boolean;
    convertibleToSwf: boolean;
    created: string;
    lastModified: string;
    lockInfo: LockInfoType;
    locked: boolean;
    mimeType: string;
    path: string;
    permissions: number;
    signed: boolean;
    subscribed: boolean;
    title: string;
    uuid: string;
    doc_name: string;
    is_dir: boolean;
}
