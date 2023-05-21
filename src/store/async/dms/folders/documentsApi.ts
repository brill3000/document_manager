import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    CheckInProps,
    CreateDocument,
    CreateDocumentSimple,
    ExtendeCopyProps,
    GetChildren,
    GetContent,
    GetContentByVersion,
    MoveProps,
    RenameProps
} from 'global/interfaces';
import { UriHelper } from 'utils/constants/UriHelper';
type UserTags = 'DMS_FOLDERS' | 'DMS_FOLDERS_SUCCESS' | 'DMS_FOLDERS_ERROR';

export const documentsApi = createApi({
    reducerPath: 'documents_api',
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
        getProperties: build.query({
            query: (docId) => ({ url: `${UriHelper.DOCUMENT_GET_PROPERTIES}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getContent: build.query<any, GetContent>({
            query: (docId) => ({ url: `${UriHelper.DOCUMENT_GET_CONTENT}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getContentByVersion: build.query<any, GetContentByVersion>({
            query: ({ docId, versionId }) => ({ url: `${UriHelper.DOCUMENT_GET_CONTENT_BY_VERSION}`, params: { docId, versionId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getChildren: build.query<any, GetChildren>({
            query: (fldId) => ({ url: `${UriHelper.DOCUMENT_GET_CHILDREN}`, params: { fldId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        checkout: build.query<any, GetContent>({
            query: (docId) => ({ url: `${UriHelper.DOCUMENT_CHECKOUT}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        isCheckedOut: build.query<any, GetContent>({
            query: (docId) => ({ url: `${UriHelper.DOCUMENT_IS_CHECKOUT}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getVersionHistory: build.query<any, GetContent>({
            query: (docId) => ({ url: `${UriHelper.DOCUMENT_GET_VERSION_HISTORY}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        isLocked: build.query<any, GetContent>({
            query: (docId) => ({ url: `${UriHelper.DOCUMENT_IS_LOCKED}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getLockInfo: build.query<any, GetContent>({
            query: (docId) => ({ url: `${UriHelper.DOCUMENT_GET_LOCKINFO}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getVersionHistorySize: build.query<any, GetContent>({
            query: (docId) => ({ url: `${UriHelper.DOCUMENT_GET_VERSION_HISTORY_SIZE}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getPath: build.query<any, GetContent>({
            query: (docId) => ({ url: `${UriHelper.DOCUMENT_GET_PATH}`, params: { docId } }),
            transformResponse: (response: { data: any }) => response.data,
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        // ===========================| MUTATIIONS: POST |===================== //
        create: build.mutation<any, CreateDocument>({
            query: ({ doc, content }) => ({
                url: UriHelper.DOCUMENT_CREATE,
                method: 'POST',
                body: { doc, content }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        createSimple: build.mutation<any, CreateDocumentSimple>({
            query: ({ docPath, content }) => ({
                url: UriHelper.DOCUMENT_CREATE,
                method: 'POST',
                body: { docPath, content }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        checking: build.mutation<any, CheckInProps>({
            query: ({ docId, content, comment, increment }) => ({
                url: UriHelper.DOCUMENT_CREATE,
                method: 'POST',
                body: { docId, content, comment, increment }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        // -------------------------------| MUTATIONS: PUT|-------------------------------- //

        rename: build.mutation<any, RenameProps>({
            query: ({ docId, newName }) => ({
                url: UriHelper.DOCUMENT_RENAME,
                method: 'PUT',
                body: { docId, newName }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        setProperties: build.mutation<any, { doc: string }>({
            query: ({ doc }) => ({
                url: UriHelper.DOCUMENT_SET_PROPERTIES,
                method: 'PUT',
                body: { doc }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        cancelCheckout: build.mutation<any, GetContent>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_SET_PROPERTIES,
                method: 'PUT',
                params: { docId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        forceCancelCheckout: build.mutation<any, GetContent>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_FORCE_CANCEL_CHECKOUT,
                method: 'PUT',
                params: { docId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        lock: build.mutation<any, GetContent>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_LOCK,
                method: 'PUT',
                params: { docId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        unlock: build.mutation<any, GetContent>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_UNLOCK,
                method: 'PUT',
                params: { docId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        forceUnlock: build.mutation<any, GetContent>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_FORCE_UNLOCK,
                method: 'PUT',
                params: { docId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        purge: build.mutation<any, GetContent>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_PURGE,
                method: 'PUT',
                params: { docId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        move: build.mutation<any, MoveProps>({
            query: ({ docId, dstId }) => ({
                url: UriHelper.DOCUMENT_MOVE,
                method: 'PUT',
                params: { docId, dstId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        restoreVersion: build.mutation<any, GetContentByVersion>({
            query: ({ docId, versionId }) => ({
                url: UriHelper.DOCUMENT_RESTORE_VERSION,
                method: 'PUT',
                params: { docId, versionId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        purgeVersionHistory: build.mutation<any, GetContentByVersion>({
            query: ({ docId, versionId }) => ({
                url: UriHelper.DOCUMENT_PURGE_VERSION_HISTORY,
                method: 'PUT',
                params: { docId, versionId }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        extendedCopy: build.mutation<any, ExtendeCopyProps>({
            query: ({ docId, dstId, name, categories, keywords, notes, propertyGroups, wiki }) => ({
                url: UriHelper.DOCUMENT_EXTEND_COPY,
                method: 'PUT',
                params: { docId, dstId, name, categories, keywords, notes, propertyGroups, wiki }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        createFromTemplate: build.mutation<any, ExtendeCopyProps>({
            query: ({ docId, dstId, name, categories, keywords, notes, propertyGroups, wiki }) => ({
                url: UriHelper.DOCUMENT_CREATE_FROM_TEMPLATE,
                method: 'PUT',
                params: { docId, dstId, name, categories, keywords, notes, propertyGroups, wiki }
            }),
            transformResponse: (response: { data: any }) => response.data,
            invalidatesTags: ['DMS_FOLDERS']
        }),
        // -------------------------------| MUTATIONS: DELETE|-------------------------------- //
        deleteDoc: build.mutation<any, GetContent>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_DELETE,
                method: 'DELETE',
                params: { docId }
            }),
            transformResponse: (response: { data: any }) => response.data
        })
    })
});

export const documents_api = documentsApi.reducer;
export const {
    /**
     * Getters
     */
    useGetPropertiesQuery,
    useGetContentQuery,
    useGetContentByVersionQuery,
    useGetChildrenQuery,
    useCheckoutQuery,
    useIsCheckedOutQuery,
    useGetVersionHistoryQuery,
    useIsLockedQuery,
    useGetLockInfoQuery,
    useGetPathQuery,
    useGetVersionHistorySizeQuery,
    /**
     * Mutations: POST
     */
    useCreateMutation,
    useCreateSimpleMutation,
    useCheckingMutation,
    /**
     * Mutations: PUT
     */
    useRenameMutation,
    useSetPropertiesMutation,
    useCancelCheckoutMutation,
    useForceCancelCheckoutMutation,
    useLockMutation,
    useUnlockMutation,
    useForceUnlockMutation,
    usePurgeMutation,
    useMoveMutation,
    useRestoreVersionMutation,
    usePurgeVersionHistoryMutation,
    useExtendedCopyMutation,
    useCreateFromTemplateMutation,
    /**
     * Mutations: DELETE
     */
    useDeleteDocMutation
} = documentsApi;
