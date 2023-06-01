import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi } from '@reduxjs/toolkit/query/react';
import { GetFetchedFoldersProps } from 'global/interfaces';
import _ from 'lodash';
import { UriHelper } from 'utils/constants/UriHelper';
import { axiosBaseQuery } from '../files/filesApi';
type UserTags = 'DMS_REPOSITORY' | 'DMS_REPOSITORY_SUCCESS' | 'DMS_REPOSITORY_ERROR';

export const repositoryApi = createApi({
    reducerPath: 'repository_api',
    baseQuery: axiosBaseQuery({
        baseUrl: UriHelper.HOST
    }),
    tagTypes: ['DMS_REPOSITORY', 'DMS_REPOSITORY_SUCCESS', 'DMS_REPOSITORY_ERROR'],
    endpoints: (build) => ({
        // ===========================| GETTERS |===================== //
        getRootFolder: build.query<GetFetchedFoldersProps, Record<string, never>>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_ROOT_FOLDER}`, method: 'GET' }),
            transformResponse: (response: GetFetchedFoldersProps) => {
                const dataCopy = { ...response };
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
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_TRASH_FOLDER}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getTrashFolderBase: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_ROOT_TRASH}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getPersonalFolder: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_PERSONAL_FOLDER}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getPersonalFolderBase: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_ROOT_PERSONAL}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getMailFolder: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_MAIL_FOLDER}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getMailFolderBase: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_ROOT_PERSONAL}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getThesaurusFolder: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_ROOT_THESAURUS}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getCategoriesFolder: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_CATEGORIES_FOLDERS}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getUpdateMessage: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_UPDATE_MESSAGE}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getRepositoryUuid: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_RESPOSITORY_UUID}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        hasNode: build.query<any, { nodeId: string }>({
            query: (nodeId) => ({ url: `${UriHelper.REPOSITORY_HAS_NODE}`, method: 'GET', params: { nodeId } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getNodePath: build.query<any, { uuid: string }>({
            query: (uuid) => ({ url: `${UriHelper.REPOSITORY_GET_NODE_PATH}`, method: 'GET', params: { uuid } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getAppVersion: build.query<any, void>({
            query: () => ({ url: `${UriHelper.REPOSITORY_GET_APP_VERSION}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_REPOSITORY' }];
                if (result) return [...tags, { type: 'DMS_REPOSITORY_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_REPOSITORY_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getConfiguration: build.query<any, { key: string }>({
            query: (key) => ({ url: `${UriHelper.REPOSITORY_GET_CONFIGURATION}`, method: 'GET', params: { key } }),
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
