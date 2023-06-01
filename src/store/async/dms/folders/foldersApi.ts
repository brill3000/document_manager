import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
    CreateFoldersProps,
    CreateFoldersSimpleProps,
    CreateMissingFoldersProps,
    ExtendeCopyFoldersProps,
    GetFetchedFoldersProps,
    GetFoldersContentProps,
    MoveFoldersProps,
    RenameFoldersProps,
    SetFoldersPropertiesProps
} from 'global/interfaces';
import _ from 'lodash';
import { UriHelper } from 'utils/constants/UriHelper';
import { axiosBaseQuery } from '../files/filesApi';
type UserTags = 'DMS_FOLDERS' | 'DMS_FOLDERS_SUCCESS' | 'DMS_FOLDERS_ERROR';

export const foldersApi = createApi({
    reducerPath: 'folders_api',
    baseQuery: axiosBaseQuery({
        baseUrl: UriHelper.HOST
    }),
    tagTypes: ['DMS_FOLDERS', 'DMS_FOLDERS_SUCCESS', 'DMS_FOLDERS_ERROR'],
    endpoints: (build) => ({
        // ===========================| GETTERS |===================== //
        getFoldersProperties: build.query<GetFetchedFoldersProps | null, GetFoldersContentProps>({
            query: ({ fldId }) => ({ url: `${UriHelper.FOLDER_GET_PROPERTIES}`, method: 'GET', params: { fldId } }),
            transformResponse: (response: { data: GetFetchedFoldersProps }) => {
                const folderCopy = { ...response.data };
                if (_.isObject(folderCopy) && !_.isEmpty(folderCopy)) {
                    const pathArray = folderCopy.path.split('/');
                    folderCopy['doc_name'] = pathArray[pathArray.length - 1];
                    folderCopy['is_dir'] = true;
                    return folderCopy;
                } else {
                    return null;
                }
            },
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFoldersContentPropsInfo: build.query<any, GetFoldersContentProps>({
            query: ({ fldId }) => ({ url: `${UriHelper.FOLDER_GET_CONTENT_INFO}`, method: 'GET', params: { fldId } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFoldersChildren: build.query<{ folders: GetFetchedFoldersProps[] | GetFetchedFoldersProps }, GetFoldersContentProps>({
            query: ({ fldId }) => ({ url: `${UriHelper.FOLDER_GET_CHILDREN}`, method: 'GET', params: { fldId } }),
            transformResponse: (response: { folders: GetFetchedFoldersProps[] | GetFetchedFoldersProps }) => {
                const dataCopy = { ...response };
                if (Array.isArray(dataCopy.folders)) {
                    dataCopy.folders = dataCopy.folders.map((fld) => {
                        const folderCopy = { ...fld };
                        const pathArray = fld.path.split('/');
                        folderCopy['doc_name'] = pathArray[pathArray.length - 1];
                        folderCopy['is_dir'] = true;

                        return folderCopy;
                    });
                    return dataCopy;
                } else if (_.isObject(dataCopy.folders) && !_.isEmpty(dataCopy.folders)) {
                    const pathArray = dataCopy.folders.path.split('/');
                    dataCopy.folders['doc_name'] = pathArray[pathArray.length - 1];
                    dataCopy.folders['is_dir'] = true;
                    dataCopy.folders = [dataCopy.folders];
                    return dataCopy;
                } else {
                    dataCopy.folders = [];
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
            query: ({ fldId }) => ({ url: `${UriHelper.FOLDER_IS_VALID}`, method: 'GET', params: { fldId } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFolderPath: build.query<any, GetFoldersContentProps>({
            query: ({ fldId }) => ({ url: `${UriHelper.FOLDER_GET_PATH}/${fldId}`, method: 'GET' }),
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
            invalidatesTags: ['DMS_FOLDERS']
        }),
        createSimpleFolder: build.mutation<any, CreateFoldersSimpleProps>({
            query: ({ docPath, content }) => ({
                url: UriHelper.FOLDER_CREATE_SIMPLE,
                method: 'POST',
                body: { docPath, content }
            }),
            invalidatesTags: ['DMS_FOLDERS']
        }),
        // -------------------------------| MUTATIONS: PUT|-------------------------------- //
        purgeFolder: build.mutation<any, { fldId: string }>({
            query: ({ fldId }) => ({
                url: UriHelper.FOLDER_PURGE,
                method: 'PUT',
                params: { fldId }
            }),
            invalidatesTags: ['DMS_FOLDERS']
        }),
        renameFolder: build.mutation<any, RenameFoldersProps>({
            query: ({ fldId, newName }) => {
                console.log(fldId, 'FLDID');
                console.log(newName, 'NEW NAME');

                return {
                    url: UriHelper.FOLDER_RENAME,
                    method: 'PUT',
                    body: { fldId, newName }
                };
            },
            invalidatesTags: ['DMS_FOLDERS']
        }),
        setFolderProperties: build.mutation<any, SetFoldersPropertiesProps>({
            query: ({ doc }) => ({
                url: UriHelper.DOCUMENT_SET_PROPERTIES,
                method: 'PUT',
                body: { doc }
            }),
            invalidatesTags: ['DMS_FOLDERS']
        }),
        moveFolder: build.mutation<any, MoveFoldersProps>({
            query: ({ fldId, dstId }) => ({
                url: UriHelper.DOCUMENT_SET_PROPERTIES,
                method: 'PUT',
                params: { fldId, dstId }
            }),
            invalidatesTags: ['DMS_FOLDERS']
        }),
        copyFolders: build.mutation<any, MoveFoldersProps>({
            query: ({ fldId, dstId }) => ({
                url: UriHelper.FOLDER_COPY,
                method: 'PUT',
                params: { fldId, dstId }
            }),
            invalidatesTags: ['DMS_FOLDERS']
        }),
        extendedFolderCopy: build.mutation<any, ExtendeCopyFoldersProps>({
            query: ({ fldId, dstId, name, categories, keywords, notes, propertyGroups, wiki }) => ({
                url: UriHelper.FOLDER_EXTENDED_COPY,
                method: 'PUT',
                params: { fldId, dstId, name, categories, keywords, notes, propertyGroups, wiki }
            }),
            invalidatesTags: ['DMS_FOLDERS']
        }),
        createMissingFolders: build.mutation<any, CreateMissingFoldersProps>({
            query: ({ fldPath }) => ({
                url: UriHelper.FOLDER_CREATE_MISSING_FOLDERS,
                method: 'PUT',
                params: { fldPath }
            }),
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
