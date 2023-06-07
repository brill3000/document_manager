import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
    CreateFoldersProps,
    CreateFoldersSimpleProps,
    CreateMissingFoldersProps,
    ExtendeCopyFoldersProps,
    FolderInterface,
    FolderReponseInterface,
    GetFoldersContentProps,
    MoveFoldersProps,
    RenameFoldersProps,
    SetFoldersPropertiesProps
} from 'global/interfaces';
import { isObject, isEmpty, isUndefined } from 'lodash';
import { UriHelper } from 'utils/constants/UriHelper';
import { axiosBaseQuery } from '../files/filesApi';
import { PermissionTypes } from 'components/documents/Interface/FileBrowser';
import { Permissions } from 'utils/constants/Permissions';
type UserTags =
    | 'DMS_FOLDERS'
    | 'DMS_FOLDERS_SUCCESS'
    | 'DMS_FOLDERS_ERROR'
    | 'DMS_FOLDER_INFO'
    | 'DMS_FOLDER_INFO_SUCCESS'
    | 'DMS_FOLDER_INFO_ERROR';

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

                            return { doc_name, is_dir, ...folderCopy };
                        }) as unknown) as FolderInterface[]
                    };
                } else if (isObject(dataCopy.folders) && !isEmpty(dataCopy.folders)) {
                    const pathArray = dataCopy.folders.path.split('/');
                    const doc_name = pathArray[pathArray.length - 1];
                    const is_dir = true;
                    return { folders: [({ doc_name, is_dir, ...dataCopy.folders } as unknown) as FolderInterface] };
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
            invalidatesTags: ['DMS_FOLDERS', 'DMS_FOLDER_INFO']
        }),
        createSimpleFolder: build.mutation<any, CreateFoldersSimpleProps>({
            query: ({ docPath, content }) => ({
                url: UriHelper.FOLDER_CREATE_SIMPLE,
                method: 'POST',
                body: { docPath, content }
            }),
            invalidatesTags: ['DMS_FOLDERS', 'DMS_FOLDER_INFO']
        }),
        // -------------------------------| MUTATIONS: PUT|-------------------------------- //
        purgeFolder: build.mutation<any, { fldId: string }>({
            query: ({ fldId }) => ({
                url: UriHelper.FOLDER_PURGE,
                method: 'PUT',
                params: { fldId }
            }),
            invalidatesTags: ['DMS_FOLDERS', 'DMS_FOLDER_INFO']
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
            invalidatesTags: ['DMS_FOLDERS', 'DMS_FOLDER_INFO']
        }),
        setFolderProperties: build.mutation<any, SetFoldersPropertiesProps>({
            query: ({ doc }) => ({
                url: UriHelper.DOCUMENT_SET_PROPERTIES,
                method: 'PUT',
                body: { doc }
            }),
            invalidatesTags: ['DMS_FOLDERS', 'DMS_FOLDER_INFO']
        }),
        moveFolder: build.mutation<any, MoveFoldersProps>({
            query: ({ fldId, dstId }) => ({
                url: UriHelper.FOLDER_MOVE,
                method: 'PUT',
                params: { fldId, dstId }
            }),
            invalidatesTags: ['DMS_FOLDERS', 'DMS_FOLDER_INFO']
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
