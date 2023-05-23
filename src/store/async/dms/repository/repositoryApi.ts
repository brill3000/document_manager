import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GetChildrenFoldersProps } from 'global/interfaces';
import _ from 'lodash';
import { UriHelper } from 'utils/constants/UriHelper';
type UserTags = 'DMS_REPOSITORY' | 'DMS_REPOSITORY_SUCCESS' | 'DMS_REPOSITORY_ERROR';

export const repositoryApi = createApi({
    reducerPath: 'repository_api',
    baseQuery: fetchBaseQuery({
        baseUrl: UriHelper.HOST,
        prepareHeaders: (headers) => {
            const cookies = document.cookie;
            headers.set('Cookie', cookies);
            return headers;
        },
        credentials: 'include'
    }),
    tagTypes: ['DMS_REPOSITORY', 'DMS_REPOSITORY_SUCCESS', 'DMS_REPOSITORY_ERROR'],
    endpoints: (build) => ({
        // ===========================| GETTERS |===================== //
        getRootFolder: build.query<GetChildrenFoldersProps, Record<string, never>>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_ROOT_FOLDER}` }),
            transformResponse: (response: { data: GetChildrenFoldersProps }) => {
                const dataCopy = { ...response.data };
                if (_.isObject(dataCopy) && !_.isEmpty(dataCopy)) {
                    const pathArray = dataCopy.path.split('/');
                    const name = pathArray[pathArray.length - 1];
                    if (name) {
                        const nameArray = name.split(':');
                        dataCopy['doc_name'] = nameArray[nameArray.length - 1];
                    }
                    return dataCopy;
                }
                return dataCopy;
            },
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getTrashFolder: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_TRASH_FOLDER}` }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getTrashFolderBase: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_ROOT_TRASH}` }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getPersonalFolder: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_PERSONAL_FOLDER}` }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getPersonalFolderBase: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_ROOT_PERSONAL}` }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getMailFolder: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_MAIL_FOLDER}` }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getMailFolderBase: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_ROOT_PERSONAL}` }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getThesaurusFolder: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_ROOT_THESAURUS}` }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getCategoriesFolder: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_CATEGORIES_FOLDERS}` }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getUpdateMessage: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_UPDATE_MESSAGE}` }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getRepositoryUuid: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_RESPOSITORY_UUID}` }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        hasNode: build.query<any, { nodeId: string }>({
            query: (nodeId) => ({ url: `${UriHelper.REPOSITORY_HAS_NODE}`, params: { nodeId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getNodePath: build.query<any, { uuid: string }>({
            query: (uuid) => ({ url: `${UriHelper.REPOSITORY_GET_NODE_PATH}`, params: { uuid } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getAppVersion: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_APP_VERSION}` }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getConfiguration: build.query<any, { key: string }>({
            query: (key) => ({ url: `${UriHelper.REPOSITORY_GET_CONFIGURATION}`, params: { key } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        })
        // ===========================| MUTATIIONS: POST |===================== //
        // -------------------------------| MUTATIONS: PUT|-------------------------------- //
        // -------------------------------| MUTATIONS: DELETE|-------------------------------- //
    })
});

export const repository_api = repositoryApi.reducer;
export const {
    /**
     * Getters
     */
    useGetRootFolderQuery,
    useGetTrashFolderQuery,
    useGetTrashFolderBaseQuery,
    useGetPersonalFolderBaseQuery,
    useGetPersonalFolderQuery,
    useGetMailFolderQuery,
    useGetMailFolderBaseQuery,
    useGetThesaurusFolderQuery,
    useGetCategoriesFolderQuery,
    useGetUpdateMessageQuery,
    useGetRepositoryUuidQuery,
    useHasNodeQuery,
    useGetNodePathQuery,
    useGetAppVersionQuery,
    useGetConfigurationQuery
    /**
     * Mutations: POST
     */
    /**
     * Mutations: PUT
     */
    /**
     * Mutations: DELETE
     */
} = repositoryApi;
