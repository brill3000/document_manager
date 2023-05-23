import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    CreateFoldersProps,
    CreateFoldersSimpleProps,
    CreateMissingFoldersProps,
    ExtendeCopyFoldersProps,
    GetChildrenFoldersProps,
    GetFoldersContentProps,
    MoveFoldersProps,
    RenameFoldersProps,
    SetFoldersPropertiesProps
} from 'global/interfaces';
import _ from 'lodash';
import { UriHelper } from 'utils/constants/UriHelper';
type UserTags = 'DMS_FOLDERS' | 'DMS_FOLDERS_SUCCESS' | 'DMS_FOLDERS_ERROR';

export const foldersApi = createApi({
    reducerPath: 'folders_api',
    baseQuery: fetchBaseQuery({
        baseUrl: UriHelper.HOST,
        prepareHeaders: (headers) => {
            const cookies = document.cookie;
            headers.set('Cookie', cookies);
            return headers;
        },
        credentials: 'include'
    }),
    tagTypes: ['DMS_FOLDERS', 'DMS_FOLDERS_SUCCESS', 'DMS_FOLDERS_ERROR'],
    endpoints: (build) => ({
        // ===========================| GETTERS |===================== //
        getFoldersProperties: build.query({
            query: ({ fldId }) => ({ url: `${UriHelper.FOLDER_GET_PROPERTIES}`, params: { fldId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFoldersContentPropsInfo: build.query<any, GetFoldersContentProps>({
            query: ({ fldId }) => ({ url: `${UriHelper.FOLDER_GET_CONTENT_INFO}`, params: { fldId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFoldersChildren: build.query<{ folder: GetChildrenFoldersProps[] | GetChildrenFoldersProps }, GetFoldersContentProps>({
            query: ({ fldId }) => ({ url: `${UriHelper.FOLDER_GET_CHILDREN}`, params: { fldId } }),
            transformResponse: (response: { data: { folder: GetChildrenFoldersProps[] | GetChildrenFoldersProps } }) => {
                const dataCopy = { ...response.data };
                if (Array.isArray(dataCopy.folder)) {
                    dataCopy.folder = dataCopy.folder.map((fld) => {
                        const folderCopy = { ...fld };
                        const pathArray = fld.path.split('/');
                        folderCopy['doc_name'] = pathArray[pathArray.length - 1];
                        folderCopy['is_dir'] = true;

                        return folderCopy;
                    });
                    return dataCopy;
                } else if (_.isObject(dataCopy.folder) && !_.isEmpty(dataCopy.folder)) {
                    const pathArray = dataCopy.folder.path.split('/');
                    dataCopy.folder['doc_name'] = pathArray[pathArray.length - 1];
                    dataCopy.folder['is_dir'] = true;
                    dataCopy.folder = [dataCopy.folder];
                    return dataCopy;
                } else {
                    dataCopy.folder = [];
                    return dataCopy;
                }
            },
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        isFolderValid: build.query<any, GetFoldersContentProps>({
            query: ({ fldId }) => ({ url: `${UriHelper.FOLDER_IS_VALID}`, params: { fldId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFolderPath: build.query<any, GetFoldersContentProps>({
            query: ({ fldId }) => ({ url: `${UriHelper.FOLDER_GET_PATH}`, params: { fldId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        // ===========================| MUTATIIONS: POST |===================== //
        createFolder: build.mutation<any, CreateFoldersProps>({
            query: ({ fld }) => ({
                url: UriHelper.FOLDER_CREATE,
                method: 'POST',
                body: { fld }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        createSimpleFolder: build.mutation<any, CreateFoldersSimpleProps>({
            query: ({ docPath, content }) => ({
                url: UriHelper.FOLDER_CREATE_SIMPLE,
                method: 'POST',
                body: { docPath, content }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        // -------------------------------| MUTATIONS: PUT|-------------------------------- //
        purgeFolder: build.mutation<any, { fldId: string }>({
            query: ({ fldId }) => ({
                url: UriHelper.FOLDER_PURGE,
                method: 'PUT',
                params: { fldId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        renameFolder: build.mutation<any, RenameFoldersProps>({
            query: ({ fldId, newName }) => ({
                url: UriHelper.FOLDER_RENAME,
                method: 'PUT',
                body: { fldId, newName }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        setFolderProperties: build.mutation<any, SetFoldersPropertiesProps>({
            query: ({ doc }) => ({
                url: UriHelper.DOCUMENT_SET_PROPERTIES,
                method: 'PUT',
                body: { doc }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        moveFolder: build.mutation<any, MoveFoldersProps>({
            query: ({ fldId, dstId }) => ({
                url: UriHelper.DOCUMENT_SET_PROPERTIES,
                method: 'PUT',
                params: { fldId, dstId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        copyFolders: build.mutation<any, MoveFoldersProps>({
            query: ({ fldId, dstId }) => ({
                url: UriHelper.FOLDER_COPY,
                method: 'PUT',
                params: { fldId, dstId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        extendedFolderCopy: build.mutation<any, ExtendeCopyFoldersProps>({
            query: ({ fldId, dstId, name, categories, keywords, notes, propertyGroups, wiki }) => ({
                url: UriHelper.FOLDER_EXTENDED_COPY,
                method: 'PUT',
                params: { fldId, dstId, name, categories, keywords, notes, propertyGroups, wiki }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        createMissingFolders: build.mutation<any, CreateMissingFoldersProps>({
            query: ({ fldPath }) => ({
                url: UriHelper.FOLDER_CREATE_MISSING_FOLDERS,
                method: 'PUT',
                params: { fldPath }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        // -------------------------------| MUTATIONS: DELETE|-------------------------------- //
        deleteFolderDoc: build.mutation<any, GetFoldersContentProps>({
            query: ({ fldId }) => ({
                url: UriHelper.FOLDER_DELETE,
                method: 'DELETE',
                params: { fldId }
            }),
            transformResponse: (response: { data: any }) => response.data
        })
    })
});

export const folders_api = foldersApi.reducer;
export const {
    /**
     * Getters
     */
    useGetFoldersPropertiesQuery,
    useGetFoldersContentPropsInfoQuery,
    useGetFoldersChildrenQuery,
    useIsFolderValidQuery,
    useGetFolderPathQuery,
    /**
     * Mutations: POST
     */
    useCreateFolderMutation,
    useCreateSimpleFolderMutation,
    /**
     * Mutations: PUT
     */
    usePurgeFolderMutation,
    useRenameFolderMutation,
    useSetFolderPropertiesMutation,
    useMoveFolderMutation,
    useCopyFoldersMutation,
    useExtendedFolderCopyMutation,
    useCreateMissingFoldersMutation,
    /**
     * Mutations: DELETE
     */
    useDeleteFolderDocMutation
} = foldersApi;
