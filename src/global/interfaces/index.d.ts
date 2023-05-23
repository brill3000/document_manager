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

export interface GetChildrenDocumentsProps {
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

export interface GetChildrenFoldersProps {
    author: string;
    created: string;
    hasChildren: boolean;
    doc_name: string;
    path: string;
    permissions: number;
    subscribed: boolean;
    uuid: string;
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
