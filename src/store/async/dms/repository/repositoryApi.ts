import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi } from '@reduxjs/toolkit/query/react';
import { FolderInterface, FolderReponseInterface } from 'global/interfaces';
import { isUndefined } from 'lodash';
import { UriHelper } from 'utils/constants/UriHelper';
import { PermissionTypes } from 'components/documents/Interface/FileBrowser';
import { Permissions } from 'utils/constants/Permissions';
import { axiosBaseQuery } from 'utils/hooks';
type UserTags = 'DMS_REPOSITORY' | 'DMS_REPOSITORY_SUCCESS' | 'DMS_REPOSITORY_ERROR';

export const repositoryApi = createApi({
    reducerPath: 'repository_api',
    baseQuery: axiosBaseQuery({
        baseUrl: UriHelper.HOST
    }),
    tagTypes: ['DMS_REPOSITORY', 'DMS_REPOSITORY_SUCCESS', 'DMS_REPOSITORY_ERROR'],
    endpoints: (build) => ({
        // ===========================| GETTERS |===================== //
        getRootFolder: build.query<FolderInterface, { url: string | null }>({
            query: ({ url }: { url: string | null }) => ({
                url: `${url !== null ? url : UriHelper.REPOSITORY_GET_ROOT_FOLDER}`,
                method: 'GET'
            }),
            transformResponse: (response: FolderReponseInterface) => {
                const folderCopy = { ...response };
                let doc_name = '';
                let is_dir = false;
                const pathArray = folderCopy.path.split('/');
                doc_name = pathArray[pathArray.length - 1];
                is_dir = true;
                const folderPermission: PermissionTypes = {
                    read: false,
                    write: false,
                    delete: false,
                    security: false
                };
                if (!isUndefined(folderCopy.permissions)) {
                    const { permissions: permissionId } = folderCopy;

                    switch (permissionId) {
                        case Permissions.ALL_GRANTS:
                            folderPermission.read = true;
                            folderPermission.write = true;
                            folderPermission.delete = true;
                            folderPermission.security = true;
                            break;
                        case Permissions.READ:
                            folderPermission.read = true;
                            folderPermission.write = false;
                            folderPermission.delete = false;
                            folderPermission.security = false;
                            break;
                        case Permissions.WRITE:
                            folderPermission.read = false;
                            folderPermission.write = true;
                            folderPermission.delete = false;
                            folderPermission.security = false;
                            break;
                        case Permissions.DELETE:
                            folderPermission.read = false;
                            folderPermission.write = false;
                            folderPermission.delete = true;
                            folderPermission.security = false;
                            break;
                        case Permissions.SECURITY:
                            folderPermission.read = false;
                            folderPermission.write = false;
                            folderPermission.delete = false;
                            folderPermission.security = true;
                            break;
                        case Permissions.READ + Permissions.WRITE:
                            folderPermission.read = true;
                            folderPermission.write = true;
                            folderPermission.delete = false;
                            folderPermission.security = false;
                            break;
                        case Permissions.READ + Permissions.DELETE:
                            folderPermission.read = true;
                            folderPermission.write = false;
                            folderPermission.delete = true;
                            folderPermission.security = false;
                            break;
                        case Permissions.READ + Permissions.SECURITY:
                            folderPermission.read = true;
                            folderPermission.write = false;
                            folderPermission.delete = false;
                            folderPermission.security = true;
                            break;
                        case Permissions.WRITE + Permissions.DELETE:
                            folderPermission.read = false;
                            folderPermission.write = true;
                            folderPermission.delete = true;
                            folderPermission.security = false;
                            break;
                        case Permissions.WRITE + Permissions.SECURITY:
                            folderPermission.read = false;
                            folderPermission.write = true;
                            folderPermission.delete = false;
                            folderPermission.security = true;
                            break;
                        case Permissions.READ + Permissions.WRITE + Permissions.DELETE:
                            folderPermission.read = true;
                            folderPermission.write = true;
                            folderPermission.delete = true;
                            folderPermission.security = false;
                            break;
                        default:
                            break;
                    }
                }
                return { doc_name, is_dir, ...folderCopy, permissions: folderPermission } as FolderInterface;
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
        }),
        // ===========================| MUTATIIONS: POST |===================== //
        // -------------------------------| MUTATIONS: PUT|-------------------------------- //
        // -------------------------------| MUTATIONS: DELETE|-------------------------------- //
        purgeTrashFolder: build.mutation<any, void>({
            query: () => ({
                url: UriHelper.REPOSITORY_PURGE_TRASH,
                method: 'DELETE'
            })
        })
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
    useGetConfigurationQuery,
    /**
     * Mutations: POST
     */
    /**
     * Mutations: PUT
     */
    usePurgeTrashFolderMutation
    /**
     * Mutations: DELETE
     */
} = repositoryApi;
