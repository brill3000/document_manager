import { createApi } from '@reduxjs/toolkit/query/react';
import { AddToNoteProps } from 'global/interfaces';
import { UriHelper } from 'utils/constants/UriHelper';
import { axiosBaseQuery } from 'utils/hooks';

export const notesApi = createApi({
    reducerPath: 'notes_api',
    baseQuery: axiosBaseQuery({
        baseUrl: UriHelper.HOST
    }),
    tagTypes: ['DMS_NOTES', 'DMS_NOTES_SUCCESS', 'DMS_NOTES_ERROR', 'DMS_NOTES_INFO', 'DMS_NOTES_INFO_SUCCESS', 'DMS_NOTES_INFO_ERROR'],
    endpoints: (build) => ({
        // ===========================| GETTERS |===================== //
        // -------------------------------| MUTATIONS: PUT|-------------------------------- //
        addNote: build.mutation<any, AddToNoteProps>({
            query: ({ nodeId, text }) => ({
                url: UriHelper.NOTE_ADD,
                method: 'POST',
                params: { nodeId },
                data: { text }
            }),
            invalidatesTags: ['DMS_NOTES']
            // async onQueryStarted({ docId }, { dispatch, queryFulfilled }) {
            //     const patchChildrenResult = dispatch(
            //         filesApi.util.updateQueryData('getFolderChildrenFiles', { fldId: parent }, (draft) => {
            //             const draftCopy = draft.documents.map((cachedRole) => {
            //                 if (cachedRole.path === oldPath) {
            //                     cachedRole['doc_name'] = newName;
            //                     cachedRole['path'] = newPath;
            //                 }
            //                 return cachedRole;
            //             });

            //             Object.assign(draft.documents, draftCopy);
            //         })
            //     );
            //     const patchInfoResult = dispatch(
            //         filesApi.util.updateQueryData('getFileProperties', { docId }, (draft) => {
            //             if (!isNull(draft) && draft.path === oldPath) {
            //                 const draftCopy = { ...draft };
            //                 draftCopy['doc_name'] = newName;
            //                 draftCopy['path'] = newPath;

            //                 Object.assign(draft, draftCopy);
            //             }
            //         })
            //     );
            //     try {
            //         await queryFulfilled;
            //     } catch {
            //         patchChildrenResult.undo();
            //         patchInfoResult.undo();
            //         /**
            //          * Alternatively, on failure you can invalidate the corresponding cache tags
            //          * to trigger a re-fetch:
            //          * dispatch(api.util.invalidateTags(['Post']))
            //          */
            //     }
            // }
        }),
        deleteNote: build.mutation<any, { nodeId: string }>({
            query: ({ nodeId }) => ({
                url: UriHelper.NOTE_DELETE,
                method: 'DELETE',
                params: { nodeId }
            }),
            invalidatesTags: ['DMS_NOTES']
            // async onQueryStarted({ docId }, { dispatch, queryFulfilled }) {
            //     const patchChildrenResult = dispatch(
            //         filesApi.util.updateQueryData('getFolderChildrenFiles', { fldId: parent }, (draft) => {
            //             const draftCopy = draft.documents.map((cachedRole) => {
            //                 if (cachedRole.path === oldPath) {
            //                     cachedRole['doc_name'] = newName;
            //                     cachedRole['path'] = newPath;
            //                 }
            //                 return cachedRole;
            //             });

            //             Object.assign(draft.documents, draftCopy);
            //         })
            //     );
            //     const patchInfoResult = dispatch(
            //         filesApi.util.updateQueryData('getFileProperties', { docId }, (draft) => {
            //             if (!isNull(draft) && draft.path === oldPath) {
            //                 const draftCopy = { ...draft };
            //                 draftCopy['doc_name'] = newName;
            //                 draftCopy['path'] = newPath;

            //                 Object.assign(draft, draftCopy);
            //             }
            //         })
            //     );
            //     try {
            //         await queryFulfilled;
            //     } catch {
            //         patchChildrenResult.undo();
            //         patchInfoResult.undo();
            //         /**
            //          * Alternatively, on failure you can invalidate the corresponding cache tags
            //          * to trigger a re-fetch:
            //          * dispatch(api.util.invalidateTags(['Post']))
            //          */
            //     }
            // }
        })
        // -------------------------------| MUTATIONS: DELETE|-------------------------------- //
    })
});

export const notes_api = notesApi.reducer;
export const {
    /**
     * Getters
     */
    /**
     * Lazy Getters
     */
    /**
     * Mutations: POST
     */
    useAddNoteMutation,
    /**
     * Mutations: PUT
     */
    useDeleteNoteMutation
    /**
     * Mutations: DELETE
     */
} = notesApi;
