import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    CheckInProps,
    CreateDocumentProps,
    CreateDocumentSimpleProps,
    FileResponseInterface,
    ExtendeCopyDocumentsProps,
    FolderRequestType,
    GetDocumentContentByVersionProps,
    GetDocumentContentProps,
    MoveDocumentProps,
    RenameDocumentsProps
} from 'global/interfaces';
import { isEmpty, isObject } from 'lodash';
import { UriHelper } from 'utils/constants/UriHelper';
type UserTags = 'DMS_FILES' | 'DMS_FILES_SUCCESS' | 'DMS_FILES_ERROR';

export const filesApi = createApi({
    reducerPath: 'files_api',
    baseQuery: fetchBaseQuery({
        baseUrl: UriHelper.HOST,
        prepareHeaders: (headers) => {
            const cookies = document.cookie;
            headers.set('Cookie', cookies);
            return headers;
        },
        credentials: 'include'
    }),
    tagTypes: ['DMS_FILES', 'DMS_FILES_SUCCESS', 'DMS_FILES_ERROR'],
    endpoints: (build) => ({
        // ===========================| GETTERS |===================== //
        getFileProperties: build.query<FileResponseInterface | null, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_GET_PROPERTIES}`, params: { docId } }),
            transformResponse: (response: { data: FileResponseInterface }) => {
                const fileCopy = { ...response.data };
                if (isObject(fileCopy) && !isEmpty(fileCopy)) {
                    const pathArray = fileCopy.path.split('/');
                    fileCopy['doc_name'] = pathArray[pathArray.length - 1];
                    fileCopy['is_dir'] = true;
                    return fileCopy;
                } else {
                    return null;
                }
            },
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFileContent: build.query<ArrayBuffer, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_GET_CONTENT}`, params: { docId } }),
            transformResponse: (response: { data: ArrayBuffer }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFileContentByVersion: build.query<any, GetDocumentContentByVersionProps>({
            query: ({ docId, versionId }) => ({ url: `${UriHelper.DOCUMENT_GET_CONTENT_BY_VERSION}`, params: { docId, versionId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFolderChildrenFiles: build.query<{ document: FileResponseInterface[] | FileResponseInterface }, FolderRequestType>({
            query: ({ fldId }) => ({ url: `${UriHelper.DOCUMENT_GET_CHILDREN}`, params: { fldId } }),
            transformResponse: (response: { data: { document: FileResponseInterface[] | FileResponseInterface } }) => {
                const dataCopy = { ...response.data };
                if (Array.isArray(dataCopy.document)) {
                    dataCopy.document = dataCopy.document.map((doc) => {
                        const documentCopy = { ...doc };
                        const pathArray = doc.path.split('/');
                        documentCopy['doc_name'] = pathArray[pathArray.length - 1];
                        documentCopy['is_dir'] = false;

                        return documentCopy;
                    });
                    return dataCopy;
                } else if (isObject(dataCopy.document) && !isEmpty(dataCopy.document)) {
                    const pathArray = dataCopy.document.path.split('/');
                    dataCopy.document['doc_name'] = pathArray[pathArray.length - 1];
                    dataCopy.document['is_dir'] = false;
                    dataCopy.document = [dataCopy.document];
                    return dataCopy;
                } else {
                    dataCopy.document = [];
                    return dataCopy;
                }
            },
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        checkout: build.query<any, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_CHECKOUT}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        isCheckedOut: build.query<any, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_IS_CHECKOUT}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFileVersionHistory: build.query<any, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_GET_VERSION_HISTORY}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        isLocked: build.query<any, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_IS_LOCKED}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getLockInfo: build.query<any, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_GET_LOCKINFO}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFileVersionHistorySize: build.query<any, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_GET_VERSION_HISTORY_SIZE}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFilePath: build.query<any, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_GET_PATH}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        // ===========================| MUTATIIONS: POST |===================== //
        createFile: build.mutation<any, CreateDocumentProps>({
            query: ({ doc, content }) => ({
                url: UriHelper.DOCUMENT_CREATE,
                method: 'POST',
                body: { doc, content }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        createSimpleFile: build.mutation<any, CreateDocumentSimpleProps>({
            query: ({ docPath, content }) => ({
                url: UriHelper.DOCUMENT_CREATE,
                method: 'POST',
                body: { docPath, content }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        checking: build.mutation<any, CheckInProps>({
            query: ({ docId, content, comment, increment }) => ({
                url: UriHelper.DOCUMENT_CREATE,
                method: 'POST',
                body: { docId, content, comment, increment }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        // -------------------------------| MUTATIONS: PUT|-------------------------------- //

        renameFile: build.mutation<any, RenameDocumentsProps>({
            query: ({ docId, newName }) => ({
                url: UriHelper.DOCUMENT_RENAME,
                method: 'PUT',
                body: { docId, newName }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        setFileProperties: build.mutation<any, { doc: string }>({
            query: ({ doc }) => ({
                url: UriHelper.DOCUMENT_SET_PROPERTIES,
                method: 'PUT',
                body: { doc }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        cancelCheckout: build.mutation<any, GetDocumentContentProps>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_SET_PROPERTIES,
                method: 'PUT',
                params: { docId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        forceCancelCheckout: build.mutation<any, GetDocumentContentProps>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_FORCE_CANCEL_CHECKOUT,
                method: 'PUT',
                params: { docId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        lock: build.mutation<any, GetDocumentContentProps>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_LOCK,
                method: 'PUT',
                params: { docId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        unlock: build.mutation<any, GetDocumentContentProps>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_UNLOCK,
                method: 'PUT',
                params: { docId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        forceUnlock: build.mutation<any, GetDocumentContentProps>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_FORCE_UNLOCK,
                method: 'PUT',
                params: { docId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        purgeFile: build.mutation<any, GetDocumentContentProps>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_PURGE,
                method: 'PUT',
                params: { docId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        moveFile: build.mutation<any, MoveDocumentProps>({
            query: ({ docId, dstId }) => ({
                url: UriHelper.DOCUMENT_MOVE,
                method: 'PUT',
                params: { docId, dstId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        restoreVersion: build.mutation<any, GetDocumentContentByVersionProps>({
            query: ({ docId, versionId }) => ({
                url: UriHelper.DOCUMENT_RESTORE_VERSION,
                method: 'PUT',
                params: { docId, versionId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        purgeVersionHistory: build.mutation<any, GetDocumentContentByVersionProps>({
            query: ({ docId, versionId }) => ({
                url: UriHelper.DOCUMENT_PURGE_VERSION_HISTORY,
                method: 'PUT',
                params: { docId, versionId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        extendedFileCopy: build.mutation<any, ExtendeCopyDocumentsProps>({
            query: ({ docId, dstId, name, categories, keywords, notes, propertyGroups, wiki }) => ({
                url: UriHelper.DOCUMENT_EXTEND_COPY,
                method: 'PUT',
                params: { docId, dstId, name, categories, keywords, notes, propertyGroups, wiki }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        createFromTemplate: build.mutation<any, ExtendeCopyDocumentsProps>({
            query: ({ docId, dstId, name, categories, keywords, notes, propertyGroups, wiki }) => ({
                url: UriHelper.DOCUMENT_CREATE_FROM_TEMPLATE,
                method: 'PUT',
                params: { docId, dstId, name, categories, keywords, notes, propertyGroups, wiki }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        }),
        // -------------------------------| MUTATIONS: DELETE|-------------------------------- //
        deleteFile: build.mutation<any, GetDocumentContentProps>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_DELETE,
                method: 'DELETE',
                params: { docId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FILES']
        })
    })
});

export const files_api = filesApi.reducer;
export const {
    /**
     * Getters
     */
    useGetFilePropertiesQuery,
    useGetFileContentQuery,
    useGetFileContentByVersionQuery,
    useGetFolderChildrenFilesQuery,
    useCheckoutQuery,
    useIsCheckedOutQuery,
    useGetFileVersionHistoryQuery,
    useIsLockedQuery,
    useGetLockInfoQuery,
    useGetFilePathQuery,
    useGetFileVersionHistorySizeQuery,
    /**
     * Mutations: POST
     */
    useCreateFileMutation,
    useCreateSimpleFileMutation,
    useCheckingMutation,
    /**
     * Mutations: PUT
     */
    useRenameFileMutation,
    useSetFilePropertiesMutation,
    useCancelCheckoutMutation,
    useForceCancelCheckoutMutation,
    useLockMutation,
    useUnlockMutation,
    useForceUnlockMutation,
    usePurgeFileMutation,
    useMoveFileMutation,
    useRestoreVersionMutation,
    usePurgeVersionHistoryMutation,
    useExtendedFileCopyMutation,
    useCreateFromTemplateMutation,
    /**
     * Mutations: DELETE
     */
    useDeleteFileMutation
} = filesApi;
