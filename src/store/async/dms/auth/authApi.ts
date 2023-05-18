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
            query: () => { url: string };
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response: { data: any }) => any;
            // Pick out errors and prevent nested properties in a hook or selector
            providesTags: (result: any, error: any) => FullTagDescription<UserTags>[];
        }) => any;
    }) => ({
        getUsers: build.query({
            // note: an optional `queryFn` may be used in place of `query`
            query: () => ({ url: `${UriHelper.AUTH_GET_USERS}` }),
            // Pick out data and prevent nested properties in a hook or selector
            transformResponse: (response: { data: any }) => response.data,
            // Pick out errors and prevent nested properties in a hook or selector
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_USER' }];

                if (result) {
                    return [...tags, { type: 'DMS_USER_SUCCESS', id: 'success' }];
                }

                if (error) {
                    return [...tags, { type: 'DMS_USER_ERROR', id: 'error' }];
                }

                return tags;
            }
        })
    })
});

export const auth_api = authApi.reducer;
export const { useGetUsersQuery } = authApi;
