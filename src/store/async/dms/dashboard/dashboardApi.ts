import { createApi } from '@reduxjs/toolkit/query/react';
import { AddToNoteProps } from 'global/interfaces';
import { UriHelper } from 'utils/constants/UriHelper';
import { axiosBaseQuery } from 'utils/hooks';
import { filesApi } from '../files/filesApi';
import { encodeHtmlEntity } from 'utils';
import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
type DashboardTags =
    | 'DMS_DASHBOARD'
    | 'DMS_DASHBOARD_SUCCESS'
    | 'DMS_DASHBOARD_ERROR'
    | 'DMS_DASHBOARD_INFO'
    | 'DMS_DASHBOARD_INFO_SUCCESS'
    | 'DMS_DASHBOARD_INFO_ERROR';

export const dashboardApi = createApi({
    reducerPath: 'dashboard_api',
    baseQuery: axiosBaseQuery({
        baseUrl: UriHelper.HOST
    }),
    tagTypes: [
        'DMS_DASHBOARD',
        'DMS_DASHBOARD_SUCCESS',
        'DMS_DASHBOARD_ERROR',
        'DMS_DASHBOARD_INFO',
        'DMS_DASHBOARD_INFO_SUCCESS',
        'DMS_DASHBOARD_INFO_ERROR'
    ],
    endpoints: (build) => ({
        // ===========================| GETTERS |===================== //
        getUserCheckedOutDocuments: build.query<any, { content: string }>({
            query: ({ content }) => ({ url: `${UriHelper.DASHBOARD_GET_USER_CHECKED_OUT_DOCUMENTS}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<DashboardTags>[] => {
                const tags: FullTagDescription<DashboardTags>[] = [{ type: 'DMS_DASHBOARD_INFO' }];
                if (result) return [...tags, { type: 'DMS_DASHBOARD_INFO_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_DASHBOARD_INFO_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getUserLastModifiedDocuments: build.query<any, { content: string }>({
            query: ({ content }) => ({ url: `${UriHelper.DASHBOARD_GET_LAST_MODIFIED_DOCUMENTS}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<DashboardTags>[] => {
                const tags: FullTagDescription<DashboardTags>[] = [{ type: 'DMS_DASHBOARD_INFO' }];
                if (result) return [...tags, { type: 'DMS_DASHBOARD_INFO_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_DASHBOARD_INFO_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getUserLockedDocuments: build.query<any, { content: string }>({
            query: ({ content }) => ({ url: `${UriHelper.DASHBOARD_GET_USER_LOCKED_DOCUMENTS}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<DashboardTags>[] => {
                const tags: FullTagDescription<DashboardTags>[] = [{ type: 'DMS_DASHBOARD_INFO' }];
                if (result) return [...tags, { type: 'DMS_DASHBOARD_INFO_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_DASHBOARD_INFO_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getUserSubscribedDocuments: build.query<any, { content: string }>({
            query: ({ content }) => ({ url: `${UriHelper.DASHBOARD_GET_USER_SUBSCRIBED_DOCUMENTS}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<DashboardTags>[] => {
                const tags: FullTagDescription<DashboardTags>[] = [{ type: 'DMS_DASHBOARD_INFO' }];
                if (result) return [...tags, { type: 'DMS_DASHBOARD_INFO_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_DASHBOARD_INFO_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getUserSubscribedFolders: build.query<any, { content: string }>({
            query: ({ content }) => ({ url: `${UriHelper.DASHBOARD_GET_USER_SUBSCRIBED_FOLDERS}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<DashboardTags>[] => {
                const tags: FullTagDescription<DashboardTags>[] = [{ type: 'DMS_DASHBOARD_INFO' }];
                if (result) return [...tags, { type: 'DMS_DASHBOARD_INFO_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_DASHBOARD_INFO_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getUserLastUploadedDocuments: build.query<any, { content: string }>({
            query: ({ content }) => ({ url: `${UriHelper.DASHBOARD_GET_LAST_UPLOADED_DOCUMENTS}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<DashboardTags>[] => {
                const tags: FullTagDescription<DashboardTags>[] = [{ type: 'DMS_DASHBOARD_INFO' }];
                if (result) return [...tags, { type: 'DMS_DASHBOARD_INFO_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_DASHBOARD_INFO_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getUserLastDownloadedDocuments: build.query<any, { content: string }>({
            query: ({ content }) => ({ url: `${UriHelper.DASHBOARD_GET_USER_LAST_DOWNLOADED_DOCUMENTS}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<DashboardTags>[] => {
                const tags: FullTagDescription<DashboardTags>[] = [{ type: 'DMS_DASHBOARD_INFO' }];
                if (result) return [...tags, { type: 'DMS_DASHBOARD_INFO_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_DASHBOARD_INFO_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getLastWeekTopDownloadedDocuments: build.query<any, { content: string }>({
            query: ({ content }) => ({ url: `${UriHelper.DASHBOARD_GET_LAST_WEEK_TOP_DOWNLOADED_DOCUMENTS}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<DashboardTags>[] => {
                const tags: FullTagDescription<DashboardTags>[] = [{ type: 'DMS_DASHBOARD_INFO' }];
                if (result) return [...tags, { type: 'DMS_DASHBOARD_INFO_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_DASHBOARD_INFO_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getLastWeekTopModifiedDocuments: build.query<any, { content: string }>({
            query: ({ content }) => ({ url: `${UriHelper.DASHBOARD_GET_LAST_WEEK_TOP_MODIFIED_DOCUMENTS}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<DashboardTags>[] => {
                const tags: FullTagDescription<DashboardTags>[] = [{ type: 'DMS_DASHBOARD_INFO' }];
                if (result) return [...tags, { type: 'DMS_DASHBOARD_INFO_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_DASHBOARD_INFO_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getLastMonthTopModifiedDocuments: build.query<any, { content: string }>({
            query: ({ content }) => ({ url: `${UriHelper.DASHBOARD_GET_LAST_MONTH_TOP_MODIFIED_DOCUMENTS}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<DashboardTags>[] => {
                const tags: FullTagDescription<DashboardTags>[] = [{ type: 'DMS_DASHBOARD_INFO' }];
                if (result) return [...tags, { type: 'DMS_DASHBOARD_INFO_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_DASHBOARD_INFO_ERROR', id: 'error' }];
                return tags;
            }
        })

        // -------------------------------| MUTATIONS: PUT|-------------------------------- //
        // addNote: build.mutation<any, AddToNoteProps>({
        //     query: ({ nodeId, text }) => ({
        //         url: UriHelper.NOTE_ADD,
        //         method: 'POST',
        //         params: { nodeId },
        //         data: { text: encodeHtmlEntity(text) }
        //     }),
        //     invalidatesTags: ['DMS_DASHBOARD'],
        //     async onQueryStarted({ nodeId }, { dispatch, queryFulfilled }) {
        //         dispatch(filesApi.util.invalidateTags(['DMS_DASHBOARD']));
        //         try {
        //             await queryFulfilled;
        //         } catch {
        //             // patchChildrenResult.undo();
        //             // patchInfoResult.undo();
        //             /**
        //              * Alternatively, on failure you can invalidate the corresponding cache tags
        //              * to trigger a re-fetch:
        //              * dispatch(api.util.invalidateTags(['Post']))
        //              */
        //         }
        //     }
        // }),
        // deleteNote: build.mutation<any, { nodeId: string }>({
        //     query: ({ nodeId }) => ({
        //         url: UriHelper.NOTE_DELETE,
        //         method: 'DELETE',
        //         params: { nodeId }
        //     }),
        //     invalidatesTags: ['DMS_DASHBOARD']
        //     // async onQueryStarted({ docId }, { dispatch, queryFulfilled }) {
        //     //     const patchChildrenResult = dispatch(
        //     //         filesApi.util.updateQueryData('getFolderChildrenFiles', { fldId: parent }, (draft) => {
        //     //             const draftCopy = draft.documents.map((cachedRole) => {
        //     //                 if (cachedRole.path === oldPath) {
        //     //                     cachedRole['doc_name'] = newName;
        //     //                     cachedRole['path'] = newPath;
        //     //                 }
        //     //                 return cachedRole;
        //     //             });

        //     //             Object.assign(draft.documents, draftCopy);
        //     //         })
        //     //     );
        //     //     const patchInfoResult = dispatch(
        //     //         filesApi.util.updateQueryData('getFileProperties', { docId }, (draft) => {
        //     //             if (!isNull(draft) && draft.path === oldPath) {
        //     //                 const draftCopy = { ...draft };
        //     //                 draftCopy['doc_name'] = newName;
        //     //                 draftCopy['path'] = newPath;

        //     //                 Object.assign(draft, draftCopy);
        //     //             }
        //     //         })
        //     //     );
        //     //     try {
        //     //         await queryFulfilled;
        //     //     } catch {
        //     //         patchChildrenResult.undo();
        //     //         patchInfoResult.undo();
        //     //         /**
        //     //          * Alternatively, on failure you can invalidate the corresponding cache tags
        //     //          * to trigger a re-fetch:
        //     //          * dispatch(api.util.invalidateTags(['Post']))
        //     //          */
        //     //     }
        //     // }
        // })
        // -------------------------------| MUTATIONS: DELETE|-------------------------------- //
    })
});

export const dashboard_api = dashboardApi.reducer;
export const {
    /**
     * Getters
     */
    useGetUserLastDownloadedDocumentsQuery,
    useGetUserLastUploadedDocumentsQuery,
    useGetLastMonthTopModifiedDocumentsQuery,
    useGetLastWeekTopDownloadedDocumentsQuery,
    useGetLastWeekTopModifiedDocumentsQuery,
    useGetUserCheckedOutDocumentsQuery,
    useGetUserLastModifiedDocumentsQuery,
    useGetUserLockedDocumentsQuery,
    useGetUserSubscribedDocumentsQuery,
    useGetUserSubscribedFoldersQuery
    /**
     * Lazy Getters
     */
    /**
     * Mutations: POST
     */
    /**
     * Mutations: PUT
     */
    /**
     * Mutations: DELETE
     */
} = dashboardApi;
