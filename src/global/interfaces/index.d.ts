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
