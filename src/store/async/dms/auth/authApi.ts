import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UriHelper } from 'utils/constants/UriHelper';
type UserTags = 'DMS_USER' | 'DMS_USER_SUCCESS' | 'DMS_USER_ERROR';

export const authApi = createApi({
    reducerPath: 'auth_api',
    baseQuery: fetchBaseQuery({
        baseUrl: UriHelper.HOST,
        prepareHeaders: (headers) => {
            // Get the token from your state or any other source
            const token = UriHelper.AUTHORIZATION;
            if (token) {
                headers.set('Authorization', `${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['DMS_USER', 'DMS_USER_SUCCESS', 'DMS_USER_ERROR'],
    endpoints: (build: {
        query: (arg0: {
            // note: an optional `queryFn` may be used in place of `query`
            query: (id: string) => { url: string };
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response: any) => any;
            providesTags: (result: any, error: any) => FullTagDescription<UserTags>[];
        }) => any;
    }) => ({
        getUsers: build.query({
            query: () => ({ url: `${UriHelper.AUTH_GET_USERS}` }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getRoles: build.query({
            query: () => ({ url: `${UriHelper.AUTH_GET_ROLES}` }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getGrantedRoles: build.query({
            query: (id) => ({ url: `${UriHelper.AUTH_GET_GRANTED_ROLES}`, params: { id: id } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getGrantedUsers: build.query({
            query: (id) => ({ url: `${UriHelper.AUTH_GET_GRANTED_USERS}`, params: { id: id } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getUsersByRole: build.query({
            query: (role) => ({ url: `${UriHelper.AUTH_GET_USERS_BY_ROLE}`, params: { role: role } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getRolesByUser: build.query({
            query: (user) => ({ url: `${UriHelper.AUTH_GET_ROLES_BY_USER}`, params: { user: user } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getMail: build.query({
            query: (user) => ({ url: `${UriHelper.AUTH_GET_MAIL}`, params: { user: user } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getName: build.query({
            query: (user) => ({ url: `${UriHelper.AUTH_GET_NAME}`, params: { user: user } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        }),
        isAuthenticated: build.query({
            query: (user) => ({ url: `${UriHelper.AUTH_IS_AUTHENTICATED}`, params: { user: user } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];
                if (result) return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                return tags;
            }
        })
    })
});

export const auth_api = authApi.reducer;
export const {
    useGetUsersQuery,
    useGetGrantedRolesQuery,
    useGetGrantedUsersQuery,
    useGetMailQuery,
    useGetRolesByUserQuery,
    useGetRolesQuery,
    useGetNameQuery
} = authApi;
