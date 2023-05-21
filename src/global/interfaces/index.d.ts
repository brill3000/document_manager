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

export interface GetContent {
    docId: string;
}

export interface GetContentByVersion extends GetContent {
    versionId: string;
}

export interface GetChildren {
    fldId: string;
}

export interface CreateDocument {
    doc: string;
    content: string;
}
export interface CreateDocumentSimple {
    docPath: string;
    content: string;
}

export interface CheckInProps extends GetContent {
    content: string;
    comment: string;
    increment: string;
}

export interface RenameProps extends GetContent {
    newName: string;
}

export interface MoveProps extends GetContent {
    dstId: string;
}

export interface ExtendeCopyProps extends MoveProps {
    name: string;
    categories: boolean;
    keywords: boolean;
    notes: boolean;
    propertyGroups: boolean;
    wiki: boolean;
}
