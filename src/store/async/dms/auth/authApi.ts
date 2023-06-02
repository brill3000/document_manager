import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
    AssignRoleRequest,
    CreateRoleRequest,
    CreateUserRequest,
    DeleteUserRequest,
    GrantRoleRequest,
    LoginRequest,
    UserResponse
} from 'global/interfaces';
import { UriHelper } from 'utils/constants/UriHelper';
import { axiosBaseQuery } from '../files/filesApi';
import qs from 'qs';
type UserTags = 'DMS_USER' | 'DMS_USER_SUCCESS' | 'DMS_USER_ERROR';

export const authApi = createApi({
    reducerPath: 'auth_api',
    baseQuery: axiosBaseQuery({
        baseUrl: UriHelper.HOST
    }),
    tagTypes: ['DMS_USER', 'DMS_USER_SUCCESS', 'DMS_USER_ERROR'],
    endpoints: (build) => ({
        // ===========================| GETTERS |===================== //
        getUsers: build.query({
            query: () => ({ url: `${UriHelper.AUTH_GET_USERS}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getRoles: build.query({
            query: () => ({ url: `${UriHelper.AUTH_GET_ROLES}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getGrantedRoles: build.query({
            query: (id) => ({ url: `${UriHelper.AUTH_GET_GRANTED_ROLES}`, method: 'GET', params: { id: id } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getGrantedUsers: build.query({
            query: (id) => ({ url: `${UriHelper.AUTH_GET_GRANTED_USERS}`, method: 'GET', params: { id: id } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getUsersByRole: build.query({
            query: (role) => ({ url: `${UriHelper.AUTH_GET_USERS_BY_ROLE}`, method: 'GET', params: { role: role } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getRolesByUser: build.query({
            query: (user) => ({ url: `${UriHelper.AUTH_GET_ROLES_BY_USER}`, method: 'GET', params: { user: user } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getMail: build.query({
            query: (user) => ({ url: `${UriHelper.AUTH_GET_MAIL}`, method: 'GET', params: { user: user } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getName: build.query({
            query: (user) => ({ url: `${UriHelper.AUTH_GET_NAME}`, method: 'GET', params: { user: user } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        isAuthenticated: build.query({
            query: (user) => ({ url: `${UriHelper.AUTH_IS_AUTHENTICATED}`, method: 'GET', params: { user: user } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        // ===========================| MUTATIIONS: POST |===================== //
        login: build.mutation<UserResponse, LoginRequest>({
            query: ({ username, password }) => {
                return {
                    url: UriHelper.AUTH_LOGIN,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: qs.stringify({ user: username, pass: password })
                };
            },
            transformResponse: (response: { data: UserResponse }) => response.data,
            invalidatesTags: ['DMS_USER']
        }),
        logoutUser: build.mutation<void, LoginRequest>({
            query: () => ({
                url: UriHelper.AUTH_LOGOUT,
                method: 'PUT'
            }),
            invalidatesTags: ['DMS_USER']
        }),
        createUser: build.mutation<any, CreateUserRequest>({
            query: ({ username, password, email, active }) => ({
                url: UriHelper.AUTH_CREATE_USER,
                method: 'POST',
                data: { username, password, email, active }
            }),
            transformResponse: (response: { data: UserResponse }) => response.data,
            invalidatesTags: ['DMS_USER']
        }),
        createRole: build.mutation<any, CreateRoleRequest>({
            query: ({ role, active }) => ({
                url: UriHelper.AUTH_CREATE_ROLE,
                method: 'POST',
                data: { role, active }
            }),
            transformResponse: (response: { data: UserResponse }) => response.data
        }),
        updateUser: build.mutation<any, CreateUserRequest>({
            query: ({ username, password, email, active }) => ({
                url: UriHelper.AUTH_UPDATE_USER,
                method: 'PUT',
                data: { username, password, email, active }
            }),
            transformResponse: (response: { data: UserResponse }) => response.data,
            invalidatesTags: ['DMS_USER']
        }),
        grantRole: build.mutation<any, GrantRoleRequest>({
            query: ({ nodeId, role, permissions, recursive }) => ({
                url: UriHelper.AUTH_GRANT_ROLE,
                method: 'PUT',
                data: { nodeId, role, permissions, recursive }
            }),
            transformResponse: (response: { data: UserResponse }) => response.data,
            invalidatesTags: ['DMS_USER']
        }),
        grantUser: build.mutation<any, GrantRoleRequest>({
            query: ({ nodeId, role, permissions, recursive }) => ({
                url: UriHelper.AUTH_GRANT_USER,
                method: 'PUT',
                data: { nodeId, role, permissions, recursive }
            }),
            invalidatesTags: ['DMS_USER']
        }),
        updateRole: build.mutation<any, CreateRoleRequest>({
            query: ({ role, active }) => ({
                url: UriHelper.AUTH_UPDATE_ROLE,
                method: 'PUT',
                data: { role, active }
            }),
            transformResponse: (response: { data: UserResponse }) => response.data
        }),
        assignRole: build.mutation<any, AssignRoleRequest>({
            query: ({ user, active }) => ({
                url: UriHelper.AUTH_ASSIGN_ROLE,
                method: 'PUT',
                data: { user, active }
            }),
            transformResponse: (response: { data: UserResponse }) => response.data
        }),
        removeRole: build.mutation<any, CreateRoleRequest>({
            query: ({ role, active }) => ({
                url: UriHelper.AUTH_REMOVE_ROLE,
                method: 'PUT',
                data: { role, active }
            }),
            transformResponse: (response: { data: UserResponse }) => response.data
        }),
        revokeRole: build.mutation<any, GrantRoleRequest>({
            query: ({ nodeId, role, permissions, recursive }) => ({
                url: UriHelper.AUTH_REVOKE_ROLE,
                method: 'PUT',
                data: { nodeId, role, permissions, recursive }
            }),
            transformResponse: (response: { data: UserResponse }) => response.data
        }),
        // -------------------------------| MUTATIONS: DELETE|-------------------------------- //
        deleteUser: build.mutation<any, DeleteUserRequest>({
            query: ({ user }) => ({
                url: UriHelper.AUTH_DELETE_USER,
                method: 'DELETE',
                params: { user }
            }),
            transformResponse: (response: { data: UserResponse }) => response.data
        }),
        deleteRole: build.mutation<any, DeleteUserRequest>({
            query: ({ user }) => ({
                url: UriHelper.AUTH_DELETE_ROLE,
                method: 'DELETe',
                params: { user }
            }),
            transformResponse: (response: { data: UserResponse }) => response.data
        })
    })
});

export const auth_api = authApi.reducer;
export const {
    /**
     * Getters
     */
    useGetUsersQuery,
    useGetGrantedRolesQuery,
    useGetGrantedUsersQuery,
    useGetMailQuery,
    useGetRolesByUserQuery,
    useGetRolesQuery,
    useGetNameQuery,
    useIsAuthenticatedQuery,
    /**
     * Mutations: POST
     */
    useLoginMutation,
    useLogoutUserMutation,
    useCreateRoleMutation,
    useCreateUserMutation,
    /**
     * Mutations: PUT
     */
    useUpdateUserMutation,
    useUpdateRoleMutation,
    useGrantRoleMutation,
    useGrantUserMutation,
    useAssignRoleMutation,
    useRemoveRoleMutation,
    useRevokeRoleMutation,
    /**
     * Mutations: DELETE
     */
    useDeleteRoleMutation,
    useDeleteUserMutation
} = authApi;
