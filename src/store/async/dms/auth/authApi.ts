import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
    AssignRoleRequest,
    CreateRoleRequest,
    CreateUserRequest,
    DeleteUserRequest,
    GrantRoleRequest,
    GrantUserRequest,
    LoginRequest,
    UserResponse
} from 'global/interfaces';
import { UriHelper } from 'utils/constants/UriHelper';
import { axiosBaseQuery } from '../files/filesApi';
import qs from 'qs';
import { isArray, isNull, isUndefined } from 'lodash';
import { Permissions } from 'utils/constants/Permissions';
import { RolePermission, User, UserPermission } from 'components/documents/Interface/FileBrowser';
type UserTags = 'DMS_USER' | 'DMS_USER_SUCCESS' | 'DMS_USER_ERROR';

export const authApi = createApi({
    reducerPath: 'auth_api',
    baseQuery: axiosBaseQuery({
        baseUrl: UriHelper.HOST
    }),
    tagTypes: ['DMS_USER', 'DMS_USER_SUCCESS', 'DMS_USER_ERROR'],
    endpoints: (build) => ({
        // ===========================| GETTERS |===================== //
        getUsers: build.query<User[], void>({
            queryFn: async (_args, _api, _extraOptions, baseQuery: any) => {
                try {
                    // Execute the getUsers query
                    const { data } = await baseQuery({ url: `${UriHelper.AUTH_GET_USERS}`, method: 'GET' });

                    // Assert the shape of the response
                    const users = data.users as string[];
                    if (!isUndefined(users) && !isArray(users)) {
                        throw new Error('An error occured while fetching users');
                    }

                    // Map over the user IDs and fetch the corresponding user names
                    const usersWithNames = await Promise.all(
                        users.map(async (userId: string) => {
                            const { data: name } = await baseQuery({ url: `${UriHelper.AUTH_GET_NAME}/${userId}`, method: 'GET' });
                            return { id: userId, name: name }; // Replace 'nameResult.name' with the actual property containing the user name in the response
                        })
                    );

                    return { data: usersWithNames };
                } catch (e) {
                    if (e instanceof Error) {
                        return { error: e.message };
                    } else {
                        return { error: e };
                    }
                }
            },
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
        getGrantedRoles: build.query<RolePermission[], { nodeId: string }>({
            // query: ({ nodeId }) => ({ url: `${UriHelper.AUTH_GET_GRANTED_ROLES}`, method: 'GET', params: { nodeId: nodeId } }),
            queryFn: async (args, _api, _extraOptions, baseQuery: any) => {
                try {
                    const { nodeId } = args;
                    // Execute the getRoles query
                    const { data: rolesData }: { data: { roles: string[] } } = await baseQuery({
                        url: `${UriHelper.AUTH_GET_ROLES}`,
                        method: 'GET'
                    });

                    const { data: rolesPemissionsData } = await baseQuery({
                        url: `${UriHelper.AUTH_GET_GRANTED_ROLES}`,
                        method: 'GET',
                        params: { nodeId }
                    });

                    // Assert the shape of the response
                    const rolesPermissionArray = rolesPemissionsData.grantedRoles as { role: string; permissions: number }[];
                    const grantedRoles = rolesData.roles as string[];
                    const rolesAccess = grantedRoles.map((role) => {
                        const getRolePermission = rolesPermissionArray.find((x) => x.role === role);
                        const rolePermission: RolePermission = {
                            name: role,
                            read: false,
                            write: false,
                            delete: false,
                            security: false
                        };
                        console.log(rolesPermissionArray, 'Permissions');
                        if (!isUndefined(getRolePermission)) {
                            const { permissions: permissionId } = getRolePermission;

                            switch (permissionId) {
                                case Permissions.ALL_GRANTS:
                                    rolePermission.read = true;
                                    rolePermission.write = true;
                                    rolePermission.delete = true;
                                    rolePermission.security = true;
                                    break;
                                case Permissions.READ:
                                    rolePermission.read = true;
                                    rolePermission.write = false;
                                    rolePermission.delete = false;
                                    rolePermission.security = false;
                                    break;
                                case Permissions.WRITE:
                                    rolePermission.read = false;
                                    rolePermission.write = true;
                                    rolePermission.delete = false;
                                    rolePermission.security = false;
                                    break;
                                case Permissions.DELETE:
                                    rolePermission.read = false;
                                    rolePermission.write = false;
                                    rolePermission.delete = true;
                                    rolePermission.security = false;
                                    break;
                                case Permissions.SECURITY:
                                    rolePermission.read = false;
                                    rolePermission.write = false;
                                    rolePermission.delete = false;
                                    rolePermission.security = true;
                                    break;
                                case Permissions.READ + Permissions.WRITE:
                                    rolePermission.read = true;
                                    rolePermission.write = true;
                                    rolePermission.delete = false;
                                    rolePermission.security = false;
                                    break;
                                case Permissions.READ + Permissions.DELETE:
                                    rolePermission.read = true;
                                    rolePermission.write = false;
                                    rolePermission.delete = true;
                                    rolePermission.security = false;
                                    break;
                                case Permissions.READ + Permissions.SECURITY:
                                    rolePermission.read = true;
                                    rolePermission.write = false;
                                    rolePermission.delete = false;
                                    rolePermission.security = true;
                                    break;
                                case Permissions.WRITE + Permissions.DELETE:
                                    rolePermission.read = false;
                                    rolePermission.write = true;
                                    rolePermission.delete = true;
                                    rolePermission.security = false;
                                    break;
                                case Permissions.WRITE + Permissions.SECURITY:
                                    rolePermission.read = false;
                                    rolePermission.write = true;
                                    rolePermission.delete = false;
                                    rolePermission.security = true;
                                    break;
                                case Permissions.READ + Permissions.WRITE + Permissions.DELETE:
                                    rolePermission.read = true;
                                    rolePermission.write = true;
                                    rolePermission.delete = true;
                                    rolePermission.security = false;
                                    break;
                                default:
                                    break;
                            }
                        }
                        return rolePermission;
                    });
                    return { data: rolesAccess };
                } catch (e) {
                    if (e instanceof Error) {
                        return { error: e.message };
                    } else {
                        return { error: e };
                    }
                }
            },
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getGrantedUsers: build.query<UserPermission[], { nodeId: string }>({
            queryFn: async (args, _api, _extraOptions, baseQuery: any) => {
                try {
                    const { nodeId } = args;
                    // Execute the getUsers query
                    const { data: usersData }: { data: { users: string[] } } = await baseQuery({
                        url: `${UriHelper.AUTH_GET_USERS}`,
                        method: 'GET'
                    });

                    const { data: userPemissionsData } = await baseQuery({
                        url: `${UriHelper.AUTH_GET_GRANTED_USERS}`,
                        method: 'GET',
                        params: { nodeId }
                    });

                    // Assert the shape of the response
                    const usersPermissionArray = userPemissionsData.grantedUsers as { user: string; permissions: number }[];
                    const users = usersData.users as string[];

                    if (!isUndefined(usersPermissionArray) && !isArray(usersPermissionArray)) {
                        throw new Error('An error occured while fetching users');
                    }

                    // Map over the user IDs and fetch the corresponding user names
                    const usersWithNames = await Promise.all(
                        users.map(async (user: string) => {
                            const getUserPermission = usersPermissionArray.find((x) => x.user === user);
                            const { data: name } = await baseQuery({ url: `${UriHelper.AUTH_GET_NAME}/${user}`, method: 'GET' });
                            const userPermission = {
                                read: false,
                                write: false,
                                delete: false,
                                security: false
                            };
                            if (!isUndefined(getUserPermission) && !isNull(getUserPermission)) {
                                const { permissions: permissionId } = getUserPermission;
                                switch (permissionId) {
                                    case Permissions.ALL_GRANTS:
                                        userPermission.read = true;
                                        userPermission.write = true;
                                        userPermission.delete = true;
                                        userPermission.security = true;
                                        break;
                                    case Permissions.READ:
                                        userPermission.read = true;
                                        userPermission.write = false;
                                        userPermission.delete = false;
                                        userPermission.security = false;
                                        break;
                                    case Permissions.WRITE:
                                        userPermission.read = false;
                                        userPermission.write = true;
                                        userPermission.delete = false;
                                        userPermission.security = false;
                                        break;
                                    case Permissions.DELETE:
                                        userPermission.read = false;
                                        userPermission.write = false;
                                        userPermission.delete = true;
                                        userPermission.security = false;
                                        break;
                                    case Permissions.SECURITY:
                                        userPermission.read = false;
                                        userPermission.write = false;
                                        userPermission.delete = false;
                                        userPermission.security = true;
                                        break;
                                    case Permissions.READ + Permissions.WRITE:
                                        userPermission.read = true;
                                        userPermission.write = true;
                                        userPermission.delete = false;
                                        userPermission.security = false;
                                        break;
                                    case Permissions.READ + Permissions.DELETE:
                                        userPermission.read = true;
                                        userPermission.write = false;
                                        userPermission.delete = true;
                                        userPermission.security = false;
                                        break;
                                    case Permissions.READ + Permissions.SECURITY:
                                        userPermission.read = true;
                                        userPermission.write = false;
                                        userPermission.delete = false;
                                        userPermission.security = true;
                                        break;
                                    case Permissions.WRITE + Permissions.DELETE:
                                        userPermission.read = false;
                                        userPermission.write = true;
                                        userPermission.delete = true;
                                        userPermission.security = false;
                                        break;
                                    case Permissions.WRITE + Permissions.SECURITY:
                                        userPermission.read = false;
                                        userPermission.write = true;
                                        userPermission.delete = false;
                                        userPermission.security = true;
                                        break;
                                    case Permissions.READ + Permissions.WRITE + Permissions.DELETE:
                                        userPermission.read = true;
                                        userPermission.write = true;
                                        userPermission.delete = true;
                                        userPermission.security = false;
                                        break;
                                    default:
                                        break;
                                }
                            }
                            return { id: user, name: name, ...userPermission }; // Replace 'nameResult.name' with the actual property containing the user name in the response
                        })
                    );

                    return { data: usersWithNames };
                } catch (e) {
                    if (e instanceof Error) {
                        return { error: e.message };
                    } else {
                        return { error: e };
                    }
                }
            },
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
            query: ({ user }) => ({ url: `${UriHelper.AUTH_GET_ROLES_BY_USER}`, method: 'GET', params: { user: user } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getMail: build.query({
            query: ({ user }) => ({ url: `${UriHelper.AUTH_GET_MAIL}`, method: 'GET', params: { user: user } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getName: build.query({
            query: ({ user }) => ({ url: `${UriHelper.AUTH_GET_NAME}/${user}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        isAuthenticated: build.query({
            query: ({ user }) => ({ url: `${UriHelper.AUTH_IS_AUTHENTICATED}`, method: 'GET', params: { user: user } }),
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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({ username, password, email, active })
            }),
            invalidatesTags: ['DMS_USER']
        }),
        createRole: build.mutation<any, CreateRoleRequest>({
            query: ({ role, active }) => ({
                url: UriHelper.AUTH_CREATE_ROLE,
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({ role, active })
            })
        }),
        updateUser: build.mutation<any, CreateUserRequest>({
            query: ({ username, password, email, active }) => ({
                url: UriHelper.AUTH_UPDATE_USER,
                method: 'PUT',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({ username, password, email, active })
            }),
            invalidatesTags: ['DMS_USER']
        }),
        grantRole: build.mutation<any, GrantRoleRequest>({
            query: ({ nodeId, role, permissions, recursive }) => ({
                url: UriHelper.AUTH_GRANT_ROLE,
                method: 'PUT',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({ nodeId, role, permissions, recursive })
            }),
            async onQueryStarted({ nodeId, role, type }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    authApi.util.updateQueryData('getGrantedRoles', { nodeId }, (draft) => {
                        const draftCopy = draft.map((cachedRole) => {
                            if (cachedRole.name === role) {
                                (cachedRole[type] as RolePermission[typeof type]) = true;
                            }
                            return cachedRole;
                        });

                        Object.assign(draft, draftCopy);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();

                    /**
                     * Alternatively, on failure you can invalidate the corresponding cache tags
                     * to trigger a re-fetch:
                     * dispatch(api.util.invalidateTags(['Post']))
                     */
                }
            }
        }),
        grantUser: build.mutation<any, GrantUserRequest>({
            query: ({ nodeId, user, permissions, recursive, type }) => ({
                url: UriHelper.AUTH_GRANT_USER,
                method: 'PUT',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({ nodeId, user, permissions, type, recursive })
            }),
            async onQueryStarted({ nodeId, user, type }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    authApi.util.updateQueryData('getGrantedUsers', { nodeId }, (draft) => {
                        const draftCopy = draft.map((cachedUser) => {
                            if (cachedUser.id === user) {
                                (cachedUser[type] as UserPermission[typeof type]) = true;
                            }
                            return cachedUser;
                        });

                        Object.assign(draft, draftCopy);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();

                    /**
                     * Alternatively, on failure you can invalidate the corresponding cache tags
                     * to trigger a re-fetch:
                     * dispatch(api.util.invalidateTags(['Post']))
                     */
                }
            }
        }),
        revokeUser: build.mutation<any, GrantUserRequest>({
            query: ({ nodeId, user, permissions, recursive, type }) => ({
                url: UriHelper.AUTH_REVOKE_USER,
                method: 'PUT',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({ nodeId, user, permissions, type, recursive })
            }),
            async onQueryStarted({ nodeId, user, type }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    authApi.util.updateQueryData('getGrantedUsers', { nodeId }, (draft) => {
                        const draftCopy = draft.map((cachedUser) => {
                            if (cachedUser.id === user) {
                                (cachedUser[type] as UserPermission[typeof type]) = false;
                            }
                            return cachedUser;
                        });

                        Object.assign(draft, draftCopy);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();

                    /**
                     * Alternatively, on failure you can invalidate the corresponding cache tags
                     * to trigger a re-fetch:
                     * dispatch(api.util.invalidateTags(['Post']))
                     */
                }
            }
        }),
        updateRole: build.mutation<any, CreateRoleRequest>({
            query: ({ role, active }) => ({
                url: UriHelper.AUTH_UPDATE_ROLE,
                method: 'PUT',
                data: { role, active }
            })
        }),
        assignRole: build.mutation<any, AssignRoleRequest>({
            query: ({ user, active }) => ({
                url: UriHelper.AUTH_ASSIGN_ROLE,
                method: 'PUT',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({ user, active })
            })
        }),
        removeRole: build.mutation<any, CreateRoleRequest>({
            query: ({ role, active }) => ({
                url: UriHelper.AUTH_REMOVE_ROLE,
                method: 'PUT',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({ role, active })
            })
        }),
        revokeRole: build.mutation<any, GrantRoleRequest>({
            query: ({ nodeId, role, permissions, recursive }) => ({
                url: UriHelper.AUTH_REVOKE_ROLE,
                method: 'PUT',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: qs.stringify({ nodeId, role, permissions, recursive })
            }),
            async onQueryStarted({ nodeId, role, type }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    authApi.util.updateQueryData('getGrantedRoles', { nodeId }, (draft) => {
                        const draftCopy = draft.map((cachedRole) => {
                            console.log(cachedRole, 'CACHE ROLE');
                            if (cachedRole.name === role) {
                                (cachedRole[type] as RolePermission[typeof type]) = false;
                            }
                            return cachedRole;
                        });

                        Object.assign(draft, draftCopy);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();

                    /**
                     * Alternatively, on failure you can invalidate the corresponding cache tags
                     * to trigger a re-fetch:
                     * dispatch(api.util.invalidateTags(['Post']))
                     */
                }
            }
        }),
        // -------------------------------| MUTATIONS: DELETE|-------------------------------- //
        deleteUser: build.mutation<any, DeleteUserRequest>({
            query: ({ user }) => ({
                url: UriHelper.AUTH_DELETE_USER,
                method: 'DELETE',
                params: { user }
            })
        }),
        deleteRole: build.mutation<any, DeleteUserRequest>({
            query: ({ user }) => ({
                url: UriHelper.AUTH_DELETE_ROLE,
                method: 'DELETe',
                params: { user }
            })
        })
    })
});

export const auth_api = authApi.reducer;
export const {
    /**
     * Getters
     */
    // ============= | USERS | =========== //
    useGetUsersQuery,
    useGetNameQuery,
    useIsAuthenticatedQuery,
    useGetGrantedUsersQuery,
    // ============= | MAILS | =========== //
    useGetMailQuery,
    // ============= | ROLES | =========== //
    useGetRolesByUserQuery,
    useGetGrantedRolesQuery,
    useGetRolesQuery,
    /**
     * Mutations: POST
     */
    useLoginMutation,
    useLogoutUserMutation,
    // ============= | USERS | =========== //
    useCreateRoleMutation,
    useCreateUserMutation,
    /**
     * Mutations: PUT
     */
    // ============= | USERS | =========== //
    useUpdateUserMutation,
    useGrantUserMutation,
    useRevokeUserMutation,
    // ============= | ROLES | =========== //
    useUpdateRoleMutation,
    useGrantRoleMutation,
    useAssignRoleMutation,
    useRemoveRoleMutation,
    useRevokeRoleMutation,
    /**
     * Mutations: DELETE
     */
    // ============= | USERS | =========== //
    useDeleteUserMutation,
    // ============= | ROLES | =========== //
    useDeleteRoleMutation
} = authApi;
