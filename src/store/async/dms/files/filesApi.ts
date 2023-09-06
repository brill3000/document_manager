import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi } from '@reduxjs/toolkit/query/react';
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
    RenameDocumentsProps,
    FileInterface,
    DeleteFileRequest,
    AddToCategoryProps,
    CategoryRequestType
} from 'global/interfaces';
import { isEmpty, isNull, isObject, isString, isUndefined, last } from 'lodash';
import { UriHelper } from 'utils/constants/UriHelper';
import { PermissionTypes } from 'components/documents/Interface/FileBrowser';
import { axiosBaseQuery, createPermissionObj } from 'utils/hooks';
import { foldersApi } from '../folders/foldersApi';
import { decodeHtmlEntity } from 'utils';
type UserTags = 'DMS_FILES' | 'DMS_FILES_SUCCESS' | 'DMS_FILES_ERROR' | 'DMS_FILE_INFO' | 'DMS_FILE_INFO_SUCCESS' | 'DMS_FILE_INFO_ERROR';

export const filesApi = createApi({
    reducerPath: 'files_api',
    baseQuery: axiosBaseQuery({
        baseUrl: UriHelper.HOST
    }),
    tagTypes: ['DMS_FILES', 'DMS_FILES_SUCCESS', 'DMS_FILES_ERROR', 'DMS_FILE_INFO', 'DMS_FILE_INFO_SUCCESS', 'DMS_FILE_INFO_ERROR'],
    endpoints: (build) => ({
        // ===========================| GETTERS |===================== //
        getFileProperties: build.query<FileInterface | null, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_GET_PROPERTIES}`, method: 'GET', params: { docId } }),
            transformResponse: (response: FileResponseInterface) => {
                const fileCopy = { ...response };
                let doc_name = '';
                let is_dir = false;
                if (isObject(fileCopy) && !isEmpty(fileCopy)) {
                    doc_name = last(fileCopy.path.split('/')) ?? '';
                    const notes = fileCopy.notes.map((note) => ({ ...note, text: decodeHtmlEntity(note.text) }));
                    const categories = fileCopy.categories.map((category) => ({ ...category, doc_name: last(category.path.split('/')) }));

                    is_dir = false;
                    const filePermission: PermissionTypes = createPermissionObj({ permissionId: fileCopy.permissions });
                    return { ...fileCopy, permissions: filePermission, doc_name, is_dir, notes, categories } as FileInterface;
                } else {
                    return null;
                }
            },
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILE_INFO' }];
                if (result) return [...tags, { type: 'DMS_FILE_INFO_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILE_INFO_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFileContent: build.query<string, GetDocumentContentProps>({
            query: ({ docId }) => ({
                url: `${UriHelper.DOCUMENT_GET_CONTENT}`,
                method: 'GET',
                params: { docId },
                responseType: 'blob'
            }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFileContentByVersion: build.query<any, GetDocumentContentByVersionProps>({
            query: ({ docId, versionId }) => ({
                url: `${UriHelper.DOCUMENT_GET_CONTENT_BY_VERSION}`,
                method: 'GET',
                params: { docId, versionId },
                responseType: 'blob'
            }),
            // transformResponse: (response: string) => {

            // },
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFolderChildrenFiles: build.query<{ documents: FileInterface[] }, FolderRequestType>({
            query: ({ fldId }) => ({ url: `${UriHelper.DOCUMENT_GET_CHILDREN}`, method: 'GET', params: { fldId } }),
            transformResponse: (response: { documents: FileResponseInterface[] | FileResponseInterface }) => {
                const dataCopy = { ...response };
                if (Array.isArray(dataCopy.documents)) {
                    return {
                        documents: dataCopy.documents.map((doc) => {
                            const fileCopy = { ...doc };
                            let doc_name = '';
                            let is_dir = false;
                            const pathArray = doc.path.split('/');
                            doc_name = pathArray[pathArray.length - 1];
                            is_dir = false;
                            const filePermission: PermissionTypes = createPermissionObj({ permissionId: doc.permissions });

                            return { doc_name, is_dir, ...fileCopy, permissions: filePermission } as FileInterface;
                        })
                    };
                } else if (isObject(dataCopy.documents) && !isEmpty(dataCopy.documents)) {
                    const pathArray = dataCopy.documents.path.split('/');
                    const doc_name = pathArray[pathArray.length - 1];
                    const is_dir = false;
                    const { permissions: permissionId } = dataCopy.documents;
                    const filePermission: PermissionTypes = createPermissionObj({ permissionId });

                    return { documents: [{ doc_name, is_dir, ...dataCopy.documents, permissions: filePermission } as FileInterface] };
                } else {
                    return { documents: [] as FileInterface[] };
                }
            },
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),

        getCategorizedChildrenFiles: build.query<{ documents: FileInterface[] }, CategoryRequestType>({
            query: ({ categoryId }) => ({
                url: `${UriHelper.SEARCH_GET_CATEGORIZED_DOCUMENTS}`,
                method: 'GET',
                params: { categoryId }
            }),
            transformResponse: (response: { documents: FileResponseInterface[] | FileResponseInterface }) => {
                const dataCopy = { ...response };
                if (Array.isArray(dataCopy.documents)) {
                    return {
                        documents: dataCopy.documents.map((doc) => {
                            const fileCopy = { ...doc };
                            let doc_name = '';
                            let is_dir = false;
                            const pathArray = doc.path.split('/');
                            doc_name = pathArray[pathArray.length - 1];
                            is_dir = false;
                            const filePermission: PermissionTypes = createPermissionObj({ permissionId: doc.permissions });

                            return { doc_name, is_dir, ...fileCopy, permissions: filePermission } as FileInterface;
                        })
                    };
                } else if (isObject(dataCopy.documents) && !isEmpty(dataCopy.documents)) {
                    const pathArray = dataCopy.documents.path.split('/');
                    const doc_name = pathArray[pathArray.length - 1];
                    const is_dir = false;
                    const { permissions: permissionId } = dataCopy.documents;
                    const filePermission: PermissionTypes = createPermissionObj({ permissionId });

                    return { documents: [{ doc_name, is_dir, ...dataCopy.documents, permissions: filePermission } as FileInterface] };
                } else {
                    return { documents: [] as FileInterface[] };
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
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_CHECKOUT}`, method: 'GET', params: { docId } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        isCheckedOut: build.query<any, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_IS_CHECKOUT}`, method: 'GET', params: { docId } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFileVersionHistory: build.query<any, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_GET_VERSION_HISTORY}`, method: 'GET', params: { docId } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        isLocked: build.query<any, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_IS_LOCKED}`, method: 'GET', params: { docId } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getLockInfo: build.query<any, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_GET_LOCKINFO}`, method: 'GET', params: { docId } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFileVersionHistorySize: build.query<any, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_GET_VERSION_HISTORY_SIZE}`, method: 'GET', params: { docId } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFilePath: build.query<any, GetDocumentContentProps>({
            query: ({ docId }) => ({ url: `${UriHelper.DOCUMENT_GET_PATH}`, method: 'GET', params: { docId } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FILES' }];
                if (result) return [...tags, { type: 'DMS_FILES_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FILES_ERROR', id: 'error' }];
                return tags;
            }
        }),
        // ===========================| MUTATIIONS: POST |===================== //
        createFile: build.mutation<any, CreateDocumentProps>({
            query: ({ doc, content, fileName }) => {
                const formData = new FormData();
                formData.set('content', doc, fileName);
                formData.set('doc', doc);
                return {
                    url: UriHelper.DOCUMENT_CREATE,
                    method: 'POST',
                    data: { doc, content }
                };
            },
            invalidatesTags: ['DMS_FILES']
        }),
        createSimpleFile: build.mutation<any, CreateDocumentSimpleProps>({
            query: ({ docPath, file, fileName }) => {
                const formData = new FormData();
                formData.set('content', file, fileName);
                formData.set('docPath', docPath);
                return {
                    url: UriHelper.DOCUMENT_CREATE_SIMPLE,
                    method: 'POST',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const progress = !isUndefined(progressEvent.total)
                            ? Math.round((progressEvent.loaded / progressEvent.total) * 100)
                            : 0;
                        // Dispatch the progress update or update the state as needed
                        console.log(`Upload Progress: ${progress}%`);
                    },
                    data: formData
                };
            },
            invalidatesTags: ['DMS_FILES']
        }),
        checkin: build.mutation<any, CheckInProps>({
            query: ({ docId, content, comment, increment, fileName }) => {
                const formData = new FormData();
                formData.set('content', content, fileName);
                formData.set('docId', docId);
                formData.set('comment', comment);
                formData.set('comment', increment);
                return {
                    url: UriHelper.DOCUMENT_CHECKIN,
                    method: 'POST',
                    data: { docId, content, comment, increment },
                    headers: { 'Content-Type': 'multipart/form-data' }
                };
            },
            invalidatesTags: ['DMS_FILES']
        }),
        // -------------------------------| MUTATIONS: PUT|-------------------------------- //

        renameFile: build.mutation<any, RenameDocumentsProps>({
            query: ({ docId, newName }) => ({
                url: UriHelper.DOCUMENT_RENAME,
                method: 'PUT',
                params: { docId, newName }
            }),
            async onQueryStarted({ docId, newName, parent, newPath, oldPath }, { dispatch, queryFulfilled }) {
                const patchChildrenResult = dispatch(
                    filesApi.util.updateQueryData('getFolderChildrenFiles', { fldId: parent }, (draft) => {
                        const draftCopy = draft.documents.map((cachedRole) => {
                            if (cachedRole.path === oldPath) {
                                cachedRole['doc_name'] = newName;
                                cachedRole['path'] = newPath;
                            }
                            return cachedRole;
                        });

                        Object.assign(draft.documents, draftCopy);
                    })
                );
                const patchInfoResult = dispatch(
                    filesApi.util.updateQueryData('getFileProperties', { docId }, (draft) => {
                        if (!isNull(draft) && draft.path === oldPath) {
                            const draftCopy = { ...draft };
                            draftCopy['doc_name'] = newName;
                            draftCopy['path'] = newPath;

                            Object.assign(draft, draftCopy);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchChildrenResult.undo();
                    patchInfoResult.undo();
                    /**
                     * Alternatively, on failure you can invalidate the corresponding cache tags
                     * to trigger a re-fetch:
                     * dispatch(api.util.invalidateTags(['Post']))
                     */
                }
            }
        }),
        addToCategory: build.mutation<any, AddToCategoryProps>({
            query: ({ nodeId, catId }) => ({
                url: UriHelper.PROPERTY_ADD_CATEGORY,
                method: 'POST',
                params: { nodeId, catId }
            }),
            invalidatesTags: ['DMS_FILES']
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
        removeFromCategory: build.mutation<any, AddToCategoryProps>({
            query: ({ nodeId, catId }) => ({
                url: UriHelper.PROPERTY_REMOVE_CATEGORY,
                method: 'DELETE',
                params: { nodeId, catId }
            }),
            invalidatesTags: ['DMS_FILES']
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
        extractFile: build.mutation<any, { docId: string; parent: string | null }>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_EXTRACT,
                method: 'PUT',
                params: { docId }
            }),
            async onQueryStarted({ docId, parent }, { dispatch, queryFulfilled }) {
                const patchChildrenResult = !isNull(parent)
                    ? dispatch(
                          filesApi.util.updateQueryData('getFolderChildrenFiles', { fldId: parent }, (draft) => {
                              const draftCopy = draft.documents.map((cachedRole) => {
                                  if (cachedRole.path === docId) {
                                      cachedRole['isExtracting'] = true;
                                  }
                                  return cachedRole;
                              });

                              Object.assign(draft.documents, draftCopy);
                          })
                      )
                    : null;

                try {
                    await queryFulfilled;
                    !isNull(parent) &&
                        dispatch(
                            filesApi.util.updateQueryData('getFolderChildrenFiles', { fldId: parent }, (draft) => {
                                const draftCopy = draft.documents.map((cachedRole) => {
                                    if (cachedRole.path === docId) {
                                        cachedRole['isExtracting'] = false;
                                    }
                                    return cachedRole;
                                });

                                Object.assign(draft.documents, draftCopy);
                            })
                        );
                    dispatch(foldersApi.util.invalidateTags(['DMS_FOLDERS']));
                    dispatch(filesApi.util.invalidateTags(['DMS_FILES']));
                } catch {
                    !isNull(patchChildrenResult) && patchChildrenResult.undo();
                    /**
                     * Alternatively, on failure you can invalidate the corresponding cache tags
                     * to trigger a re-fetch:
                     * dispatch(api.util.invalidateTags(['Post']))
                     */
                }
            }
        }),
        setFileProperties: build.mutation<any, { doc: string }>({
            query: ({ doc }) => ({
                url: UriHelper.DOCUMENT_SET_PROPERTIES,
                method: 'PUT',
                data: { doc }
            }),
            invalidatesTags: ['DMS_FILES']
        }),
        cancelCheckout: build.mutation<any, GetDocumentContentProps>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_CANCEL_CHECKOUT,
                method: 'PUT',
                params: { docId }
            }),
            invalidatesTags: ['DMS_FILES']
        }),
        forceCancelCheckout: build.mutation<any, GetDocumentContentProps>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_FORCE_CANCEL_CHECKOUT,
                method: 'PUT',
                params: { docId }
            }),
            invalidatesTags: ['DMS_FILES']
        }),
        lock: build.mutation<any, GetDocumentContentProps>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_LOCK,
                method: 'PUT',
                params: { docId }
            }),
            invalidatesTags: ['DMS_FILES']
        }),
        unlock: build.mutation<any, GetDocumentContentProps>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_UNLOCK,
                method: 'PUT',
                params: { docId }
            }),
            invalidatesTags: ['DMS_FILES']
        }),
        forceUnlock: build.mutation<any, GetDocumentContentProps>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_FORCE_UNLOCK,
                method: 'PUT',
                params: { docId }
            }),
            invalidatesTags: ['DMS_FILES']
        }),
        purgeFile: build.mutation<any, DeleteFileRequest>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_PURGE,
                method: 'PUT',
                params: { docId }
            }),
            async onQueryStarted({ docId, parent }, { dispatch, queryFulfilled }) {
                const patchChildrenResult = !isNull(parent)
                    ? dispatch(
                          filesApi.util.updateQueryData('getFolderChildrenFiles', { fldId: parent }, (draft) => {
                              draft.documents = draft.documents.filter((cachedRole) => cachedRole.path !== docId);
                          })
                      )
                    : null;
                try {
                    await queryFulfilled;
                } catch {
                    !isNull(patchChildrenResult) ? patchChildrenResult.undo() : null;
                    /**
                     * Alternatively, on failure you can invalidate the corresponding cache tags
                     * to trigger a re-fetch:
                     * dispatch(api.util.invalidateTags(['Post']))
                     */
                }
            },
            invalidatesTags: ['DMS_FILES']
        }),
        moveFile: build.mutation<any, MoveDocumentProps>({
            query: ({ docId, dstId }) => ({
                url: UriHelper.DOCUMENT_MOVE,
                method: 'PUT',
                params: { docId, dstId }
            }),
            async onQueryStarted({ docId, currentId, newPath, oldPath }, { dispatch, queryFulfilled }) {
                const patchChildrenResult =
                    isString(currentId) && !isEmpty(currentId)
                        ? dispatch(
                              filesApi.util.updateQueryData('getFolderChildrenFiles', { fldId: currentId }, (draft) => {
                                  draft.documents = draft.documents.filter((cachedRole) => cachedRole.path !== docId);
                              })
                          )
                        : null;
                const patchInfoResult =
                    isString(newPath) && !isEmpty(newPath)
                        ? dispatch(
                              filesApi.util.updateQueryData('getFileProperties', { docId }, (draft) => {
                                  if (!isNull(draft) && draft.path === oldPath) {
                                      const draftCopy = { ...draft };
                                      draftCopy['path'] = newPath;
                                      Object.assign(draft, draftCopy);
                                  }
                              })
                          )
                        : null;
                try {
                    await queryFulfilled;
                    dispatch(filesApi.util.invalidateTags(['DMS_FILES']));
                } catch {
                    !isNull(patchChildrenResult) && patchChildrenResult.undo();
                    !isNull(patchInfoResult) && patchInfoResult.undo();
                    /**
                     * Alternatively, on failure you can invalidate the corresponding cache tags
                     * to trigger a re-fetch:
                     * dispatch(api.util.invalidateTags(['Post']))
                     */
                }
            }
        }),
        copyFile: build.mutation<any, MoveDocumentProps>({
            query: ({ docId, dstId }) => ({
                url: UriHelper.DOCUMENT_COPY,
                method: 'PUT',
                params: { docId, dstId }
            }),
            invalidatesTags: ['DMS_FILES']
        }),
        restoreVersion: build.mutation<any, GetDocumentContentByVersionProps>({
            query: ({ docId, versionId }) => ({
                url: UriHelper.DOCUMENT_RESTORE_VERSION,
                method: 'PUT',
                params: { docId, versionId }
            }),
            invalidatesTags: ['DMS_FILES']
        }),
        purgeVersionHistory: build.mutation<any, GetDocumentContentByVersionProps>({
            query: ({ docId, versionId }) => ({
                url: UriHelper.DOCUMENT_PURGE_VERSION_HISTORY,
                method: 'PUT',
                params: { docId, versionId }
            }),
            invalidatesTags: ['DMS_FILES']
        }),
        extendedFileCopy: build.mutation<any, ExtendeCopyDocumentsProps>({
            query: ({ docId, dstId, name, categories, keywords, notes, propertyGroups, wiki }) => ({
                url: UriHelper.DOCUMENT_EXTEND_COPY,
                method: 'PUT',
                params: { docId, dstId, name, categories, keywords, notes, propertyGroups, wiki }
            }),
            invalidatesTags: ['DMS_FILES']
        }),
        createFromTemplate: build.mutation<any, ExtendeCopyDocumentsProps>({
            query: ({ docId, dstId, name, categories, keywords, notes, propertyGroups, wiki }) => ({
                url: UriHelper.DOCUMENT_CREATE_FROM_TEMPLATE,
                method: 'PUT',
                params: { docId, dstId, name, categories, keywords, notes, propertyGroups, wiki }
            }),
            invalidatesTags: ['DMS_FILES']
        }),
        // -------------------------------| MUTATIONS: DELETE|-------------------------------- //
        moveFileToTrash: build.mutation<any, DeleteFileRequest>({
            query: ({ docId }) => ({
                url: UriHelper.DOCUMENT_DELETE,
                method: 'DELETE',
                params: { docId }
            }),
            async onQueryStarted({ docId, parent }, { dispatch, queryFulfilled }) {
                const patchChildrenResult = !isNull(parent)
                    ? dispatch(
                          filesApi.util.updateQueryData('getFolderChildrenFiles', { fldId: parent }, (draft) => {
                              draft.documents = draft.documents.filter((cachedRole) => cachedRole.path !== docId);
                          })
                      )
                    : null;
                try {
                    await queryFulfilled;
                } catch {
                    !isNull(patchChildrenResult) ? patchChildrenResult.undo() : null;
                    /**
                     * Alternatively, on failure you can invalidate the corresponding cache tags
                     * to trigger a re-fetch:
                     * dispatch(api.util.invalidateTags(['Post']))
                     */
                }
            }
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
    useGetCategorizedChildrenFilesQuery,
    /**
     * Lazy Getters
     */
    useLazyGetFilePropertiesQuery,
    useLazyGetFileContentQuery,
    useLazyGetFileContentByVersionQuery,
    useLazyGetFolderChildrenFilesQuery,
    useLazyCheckoutQuery,
    useLazyIsCheckedOutQuery,
    useLazyGetFileVersionHistoryQuery,
    useLazyGetLockInfoQuery,
    useLazyGetFilePathQuery,
    useLazyGetFileVersionHistorySizeQuery,
    useLazyGetCategorizedChildrenFilesQuery,
    /**
     * Mutations: POST
     */
    useCreateFileMutation,
    useCreateSimpleFileMutation,
    useCheckinMutation,
    /**
     * Mutations: PUT
     */
    useExtractFileMutation,
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
    useCopyFileMutation,
    useAddToCategoryMutation,
    /**
     * Mutations: DELETE
     */
    useMoveFileToTrashMutation,
    useRemoveFromCategoryMutation
} = filesApi;
