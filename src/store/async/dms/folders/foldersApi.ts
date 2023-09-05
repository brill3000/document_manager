import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import {
    CategoryRequestType,
    CreateFoldersProps,
    CreateFoldersSimpleProps,
    CreateMissingFoldersProps,
    DeleteFolderRequest,
    ExtendeCopyFoldersProps,
    FolderInterface,
    FolderReponseInterface,
    GetFoldersContentProps,
    MoveFoldersProps,
    RenameFoldersProps,
    SetFoldersPropertiesProps
} from 'global/interfaces';
import { isObject, isEmpty, isNull, isUndefined, last } from 'lodash';
import { UriHelper } from 'utils/constants/UriHelper';
import { PermissionTypes } from 'components/documents/Interface/FileBrowser';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { createPermissionObj } from 'utils/hooks';
import { decodeHtmlEntity } from 'utils';
type UserTags =
    | 'DMS_FOLDERS'
    | 'DMS_FOLDERS_SUCCESS'
    | 'DMS_FOLDERS_ERROR'
    | 'DMS_FOLDER_INFO'
    | 'DMS_FOLDER_INFO_SUCCESS'
    | 'DMS_FOLDER_INFO_ERROR';

export const axiosBaseQuery = (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
): BaseQueryFn<
    {
        url: string;
        method: AxiosRequestConfig['method'];
        data?: AxiosRequestConfig['data'];
        params?: AxiosRequestConfig['params'];
        onUploadProgress?: AxiosRequestConfig['onUploadProgress']; // Add onUploadProgress option
    },
    unknown,
    unknown
> => async ({ url, method, data, params, onUploadProgress }) => {
    try {
        const result = await axios({ url: baseUrl + url, method, data, params, onUploadProgress, withCredentials: true });
        return { data: result.data };
    } catch (axiosError) {
        const err = axiosError as AxiosError;
        return {
            error: {
                status: err.response?.status,
                data: err.response?.data || err.message
            }
        };
    }
};

export const foldersApi = createApi({
    reducerPath: 'folders_api',
    baseQuery: axiosBaseQuery({
        baseUrl: UriHelper.HOST
    }),
    tagTypes: [
        'DMS_FOLDERS',
        'DMS_FOLDERS_SUCCESS',
        'DMS_FOLDERS_ERROR',
        'DMS_FOLDER_INFO',
        'DMS_FOLDER_INFO_SUCCESS',
        'DMS_FOLDER_INFO_ERROR'
    ],
    endpoints: (build) => ({
        // ===========================| GETTERS |===================== //
        getFoldersProperties: build.query<FolderInterface | null, GetFoldersContentProps>({
            query: ({ fldId }) => ({ url: `${UriHelper.FOLDER_GET_PROPERTIES}`, method: 'GET', params: { fldId } }),
            transformResponse: (response: FolderReponseInterface) => {
                const folderCopy = { ...response };
                if (isObject(folderCopy) && !isEmpty(folderCopy)) {
                    let doc_name = '';
                    let is_dir = false;
                    doc_name = last(folderCopy.path.split('/')) ?? '';
                    const notes = folderCopy.notes.map((note) => ({ ...note, text: decodeHtmlEntity(note.text) }));
                    const categories = folderCopy.categories.map((category) => ({ ...category, doc_name: last(category.path.split('/')) }));
                    is_dir = true;

                    const folderPermission: PermissionTypes = createPermissionObj({ permissionId: folderCopy.permissions });

                    return { doc_name, is_dir, ...folderCopy, permissions: folderPermission, notes, categories } as FolderInterface;
                } else {
                    return null;
                }
            },
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDER_INFO' }];
                if (result) return [...tags, { type: 'DMS_FOLDER_INFO_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDER_INFO_ERROR', id: 'error' }];
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
        getFoldersChildren: build.query<{ folders: FolderInterface[] }, GetFoldersContentProps>({
            query: ({ fldId }) => ({ url: `${UriHelper.FOLDER_GET_CHILDREN}`, method: 'GET', params: { fldId } }),
            transformResponse: (response: { folders: FolderReponseInterface[] | FolderReponseInterface }) => {
                const dataCopy = { ...response };
                if (Array.isArray(dataCopy.folders)) {
                    return {
                        folders: (dataCopy.folders.map((fld) => {
                            const folderCopy = { ...fld };
                            const pathArray = fld.path.split('/');
                            const doc_name = pathArray[pathArray.length - 1];
                            const is_dir = true;
                            const folderPermission: PermissionTypes = createPermissionObj({ permissionId: fld.permissions });

                            return { doc_name, is_dir, ...folderCopy, permissions: folderPermission };
                        }) as unknown) as FolderInterface[]
                    };
                } else if (isObject(dataCopy.folders) && !isEmpty(dataCopy.folders)) {
                    const pathArray = dataCopy.folders.path.split('/');
                    const doc_name = pathArray[pathArray.length - 1];
                    const is_dir = true;
                    const folderPermission: PermissionTypes = createPermissionObj({ permissionId: dataCopy.folders.permissions });

                    return {
                        folders: [({ doc_name, is_dir, ...dataCopy.folders, permission: folderPermission } as unknown) as FolderInterface]
                    };
                } else {
                    return { folders: [] as FolderInterface[] };
                }
            },
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getCategorizedChildrenFolders: build.query<{ folders: FolderInterface[] }, CategoryRequestType>({
            query: ({ categoryId }) => ({ url: `${UriHelper.SEARCH_GET_CATEGORIZED_FOLDERS}`, method: 'GET', params: { categoryId } }),
            transformResponse: (response: { folders: FolderReponseInterface[] | FolderReponseInterface }) => {
                const dataCopy = { ...response };
                if (Array.isArray(dataCopy.folders)) {
                    return {
                        folders: (dataCopy.folders.map((fld) => {
                            const folderCopy = { ...fld };
                            const pathArray = fld.path.split('/');
                            const doc_name = pathArray[pathArray.length - 1];
                            const is_dir = true;
                            const folderPermission: PermissionTypes = createPermissionObj({ permissionId: fld.permissions });

                            return { doc_name, is_dir, ...folderCopy, permissions: folderPermission };
                        }) as unknown) as FolderInterface[]
                    };
                } else if (isObject(dataCopy.folders) && !isEmpty(dataCopy.folders)) {
                    const pathArray = dataCopy.folders.path.split('/');
                    const doc_name = pathArray[pathArray.length - 1];
                    const is_dir = true;
                    const folderPermission: PermissionTypes = createPermissionObj({ permissionId: dataCopy.folders.permissions });

                    return {
                        folders: [({ doc_name, is_dir, ...dataCopy.folders, permission: folderPermission } as unknown) as FolderInterface]
                    };
                } else {
                    return { folders: [] as FolderInterface[] };
                }
            },
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_FOLDERS' }];
                if (result) return [...tags, { type: 'DMS_FOLDERS_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_FOLDERS_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getFoldersExpandedChildren: build.query<{ folders: any[] }, { expanded: string[] }>({
            queryFn: async (_args, _api, _extraOptions, baseQuery: any) => {
                try {
                    const { expanded } = _args;
                    const someChildren: Array<FolderInterface & { children: string[] }> = [];
                    const expandedChildren = await Promise.allSettled(
                        expanded.map(async (fldId: string) => {
                            const { data: parentData }: { data: FolderReponseInterface } = await baseQuery({
                                url: `${UriHelper.FOLDER_GET_PROPERTIES}`,
                                method: 'GET',
                                params: { fldId }
                            });
                            const { data }: { data: { folders: FolderReponseInterface[] | FolderReponseInterface } } = await baseQuery({
                                url: `${UriHelper.FOLDER_GET_CHILDREN}`,
                                method: 'GET',
                                params: { fldId }
                            });
                            if (!isUndefined(parentData)) {
                                const parentCopy = { ...parentData };
                                const parentPathArray = parentData.path.split('/');
                                const doc_name = parentPathArray[parentPathArray.length - 1];
                                const is_dir = true;
                                const permissions: PermissionTypes = createPermissionObj({ permissionId: parentCopy.permissions });
                                let children: string[] = [];
                                if (Array.isArray(data.folders)) {
                                    children = data.folders.map((child) => {
                                        const childCopy = { ...child };
                                        const childPathArray = childCopy.path.split('/');
                                        const childDocName = childPathArray[childPathArray.length - 1];
                                        const childIsDir = true;
                                        const childPermissions: PermissionTypes = createPermissionObj({
                                            permissionId: childCopy.permissions
                                        });
                                        const childObj: FolderInterface & { children: string[] } = {
                                            doc_name: childDocName,
                                            is_dir: childIsDir,
                                            ...childCopy,
                                            permissions: childPermissions,
                                            children: []
                                        };
                                        someChildren.push(childObj);
                                        return child.path;
                                    });
                                } else if (isObject(data.folders) && !isEmpty(data.folders)) {
                                    children = [data.folders.path];
                                }
                                return { doc_name, is_dir, ...parentCopy, permissions, children: children };
                            }
                        })
                    );

                    return { data: { folders: [...expandedChildren, ...someChildren.filter((x) => !expanded.includes(x.path))] } };
                } catch (e) {
                    if (e instanceof Error) {
                        return { error: e.message };
                    } else {
                        return { error: e };
                    }
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
                data: { fld }
            }),
            invalidatesTags: ['DMS_FOLDERS', 'DMS_FOLDER_INFO']
        }),
        createSimpleFolder: build.mutation<any, CreateFoldersSimpleProps>({
            query: ({ fldPath }) => ({
                url: UriHelper.FOLDER_CREATE_SIMPLE,
                method: 'POST',
                data: { fldPath }
            }),
            invalidatesTags: ['DMS_FOLDERS', 'DMS_FOLDER_INFO']
        }),
        // -------------------------------| MUTATIONS: PUT|-------------------------------- //
        /**
         * This is a dangerous function that completely deletes the folder bypassing the trash
         */
        purgeFolder: build.mutation<any, DeleteFolderRequest>({
            query: ({ fldId }) => ({
                url: UriHelper.FOLDER_PURGE,
                method: 'PUT',
                params: { fldId }
            }),
            async onQueryStarted({ fldId, parent }, { dispatch, queryFulfilled }) {
                const patchChildrenResult = !isNull(parent)
                    ? dispatch(
                          foldersApi.util.updateQueryData('getFoldersChildren', { fldId: parent }, (draft) => {
                              draft.folders = draft.folders.filter((cachedRole) => cachedRole.path !== fldId);
                          })
                      )
                    : null;
                try {
                    await queryFulfilled;
                    dispatch(foldersApi.util.invalidateTags(['DMS_FOLDERS']));
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
        renameFolder: build.mutation<any, RenameFoldersProps>({
            query: ({ fldId, newName }) => {
                return {
                    url: UriHelper.FOLDER_RENAME,
                    method: 'PUT',
                    params: { fldId, newName }
                };
            },
            async onQueryStarted({ fldId, newName, parent, newPath, oldPath }, { dispatch, queryFulfilled }) {
                const patchChildrenResult = dispatch(
                    foldersApi.util.updateQueryData('getFoldersChildren', { fldId: parent }, (draft) => {
                        const draftCopy = draft.folders.map((cachedRole) => {
                            if (cachedRole.path === fldId) {
                                cachedRole['doc_name'] = newName;
                                cachedRole['path'] = newPath;
                            }
                            return cachedRole;
                        });
                        Object.assign(draft.folders, draftCopy);
                    })
                );
                const patchInfoResult = dispatch(
                    foldersApi.util.updateQueryData('getFoldersProperties', { fldId }, (draft) => {
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
                    dispatch(foldersApi.util.invalidateTags(['DMS_FOLDERS']));
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
        setFolderProperties: build.mutation<any, SetFoldersPropertiesProps>({
            query: ({ doc }) => ({
                url: UriHelper.DOCUMENT_SET_PROPERTIES,
                method: 'PUT',
                data: { doc }
            }),
            invalidatesTags: ['DMS_FOLDERS', 'DMS_FOLDER_INFO']
        }),
        moveFolder: build.mutation<any, MoveFoldersProps>({
            query: ({ fldId, dstId }) => ({
                url: UriHelper.FOLDER_MOVE,
                method: 'PUT',
                params: { fldId, dstId }
            }),
            async onQueryStarted({ fldId, currentId, newPath, oldPath }, { dispatch, queryFulfilled }) {
                const patchChildrenResult =
                    !isNull(currentId) && !isUndefined(currentId)
                        ? dispatch(
                              foldersApi.util.updateQueryData('getFoldersChildren', { fldId: currentId }, (draft) => {
                                  draft.folders = draft.folders.filter((cachedRole) => cachedRole.path !== fldId);
                              })
                          )
                        : null;
                const patchInfoResult =
                    !isNull(newPath) && !isUndefined(newPath)
                        ? dispatch(
                              foldersApi.util.updateQueryData('getFoldersProperties', { fldId }, (draft) => {
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
                    dispatch(foldersApi.util.invalidateTags(['DMS_FOLDERS']));
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
        copyFolders: build.mutation<any, MoveFoldersProps>({
            query: ({ fldId, dstId }) => ({
                url: UriHelper.FOLDER_COPY,
                method: 'PUT',
                params: { fldId, dstId }
            }),
            invalidatesTags: ['DMS_FOLDERS', 'DMS_FOLDER_INFO']
        }),
        extendedFolderCopy: build.mutation<any, ExtendeCopyFoldersProps>({
            query: ({ fldId, dstId, name, categories, keywords, notes, propertyGroups, wiki }) => ({
                url: UriHelper.FOLDER_EXTENDED_COPY,
                method: 'PUT',
                params: { fldId, dstId, name, categories, keywords, notes, propertyGroups, wiki }
            }),
            invalidatesTags: ['DMS_FOLDERS', 'DMS_FOLDER_INFO']
        }),
        createMissingFolders: build.mutation<any, CreateMissingFoldersProps>({
            query: ({ fldPath }) => ({
                url: UriHelper.FOLDER_CREATE_MISSING_FOLDERS,
                method: 'PUT',
                params: { fldPath }
            }),
            invalidatesTags: ['DMS_FOLDERS', 'DMS_FOLDER_INFO']
        }),
        // -------------------------------| MUTATIONS: DELETE|-------------------------------- //
        moveFolderToTrash: build.mutation<any, DeleteFolderRequest>({
            query: ({ fldId }) => ({
                url: UriHelper.FOLDER_DELETE,
                method: 'DELETE',
                params: { fldId }
            }),
            async onQueryStarted({ fldId, parent }, { dispatch, queryFulfilled }) {
                const patchChildrenResult = !isNull(parent)
                    ? dispatch(
                          foldersApi.util.updateQueryData('getFoldersChildren', { fldId: parent }, (draft) => {
                              draft.folders = draft.folders.filter((cachedRole) => cachedRole.path !== fldId);
                          })
                      )
                    : null;
                try {
                    await queryFulfilled;
                    dispatch(foldersApi.util.invalidateTags(['DMS_FOLDERS']));
                } catch {
                    !isNull(patchChildrenResult) && patchChildrenResult.undo();
                    /**
                     * Alternatively, on failure you can invalidate the corresponding cache tags
                     * to trigger a re-fetch:
                     * dispatch(api.util.invalidateTags(['Post']))
                     */
                }
            },
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
    useGetFoldersExpandedChildrenQuery,
    useIsFolderValidQuery,
    useGetFolderPathQuery,
    useGetCategorizedChildrenFoldersQuery,
    /**
     * LAZY: Getters
     */
    useLazyGetFoldersPropertiesQuery,
    useLazyGetFoldersContentPropsInfoQuery,
    useLazyGetFoldersChildrenQuery,
    useLazyGetFoldersExpandedChildrenQuery,
    useLazyIsFolderValidQuery,
    useLazyGetFolderPathQuery,
    useLazyGetCategorizedChildrenFoldersQuery,
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
    useMoveFolderToTrashMutation
} = foldersApi;
