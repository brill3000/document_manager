import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { db } from '../../firebase-config';
import { getDocs, collection, query, where, Timestamp, doc, addDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { useUserAuth } from 'context/authContext';

const omit = (obj, omitKeys) => {
    let newobj = { ...obj };
    omitKeys.forEach((omitKey) => {
        newobj = {
            ...Object.keys(newobj)
                .filter((key) => key !== omitKey)
                .reduce((result, key) => ({ ...result, [key]: obj[key] }), {})
        };
    });
    return newobj;
};

class Folder {
    constructor(created_by, date_created, date_modified, folder_name, isFolder, no_of_files, parent, size, zipped, trashed) {
        this.created_by = created_by;
        this.date_created = new Date(date_created.seconds).toString();
        this.date_modified = new Date(date_modified.seconds).toString();
        this.folder_name = folder_name;
        this.isFolder = isFolder;
        this.no_of_files = no_of_files;
        this.parent = parent;
        this.size = size;
        this.zipped = zipped;
        this.trashed = trashed;
    }
    toString() {
        return (
            this.created_by +
            ', ' +
            this.date_created +
            ', ' +
            this.date_modified +
            ', ' +
            this.folder_name +
            ', ' +
            this.isFolder +
            ', ' +
            this.no_of_files +
            ', ' +
            this.parent +
            ', ' +
            this.size
        );
    }
}

// Firestore data converter
const folderConverter = {
    toFirestore: (folder) => {
        let sent_folder = {
            created_by: folder.created_by.id,
            created_by_name: folder.created_by.name,
            date_created: Timestamp.fromDate(new Date()),
            date_modified: Timestamp.fromDate(new Date()),
            folder_name: folder.folder_name,
            isFolder: folder.isFolder,
            no_of_files: folder.no_of_files,
            parent: folder.parent,
            trashed: folder.trashed ?? false,
            user_access: folder.user_access ?? null,
            archived: folder.archived ?? false,
            zipped: folder.zipped ?? false,
            size: folder.size
        };
        if (folder.department_access) {
            sent_folder = {
                ...sent_folder,
                department_access: folder.department_access
            };
        }
        return sent_folder;
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Folder(
            data.created_by,
            data.date_created,
            data.date_modified,
            data.folder_name,
            data.isFolder,
            data.no_of_files,
            data.parent,
            data.size,
            data.zipped,
            data.trashed
        );
    }
};

class Log {
    constructor(created_by, date_created, folder_name, log_type, log_description) {
        this.created_by = created_by;
        this.date_created = new Date(date_created.seconds).toString();
        this.folder_name = folder_name;
        this.log_type = log_type;
        this.log_description = log_description;
    }
    toString() {
        return this.created_by + ', ' + this.date_created + ', ' + this.log_type + ', ' + this.log_description + ', ';
    }
    getLog() {
        return {
            created_by: this.created_by,
            date_created: this.date_created,
            folder_name: this.folder_name,
            log_type: this.log_type,
            log_description: this.log_description
        };
    }
}

const logsConverter = {
    toFirestore: (log) => {
        return {
            created_by: log.created_by.id,
            created_by_name: log.created_by.name,
            date_created: Timestamp.fromDate(new Date()),
            folder_name: log.folder_name,
            log_type: log.log_type,
            log_category: log.log_category,
            log_description: log.log_description
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Folder(
            data.created_by,
            data.date_created,
            data.date_modified,
            data.folder_name,
            data.isFolder,
            data.no_of_files,
            data.parent,
            data.size,
            data.zipped,
            data.trashed
        );
    }
};

export const foldersQuery = createApi({
    reducerPath: 'folders_query',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['folders'],
    endpoints: (builder) => ({
        getFoldersByParentId: builder.query({
            async queryFn(queryParams) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);
                    let folders = [];

                    switch (queryParams.route) {
                        case '/documents/my-document':
                        case '/documents':
                            const myDocQuery = query(
                                collection(db, 'folders'),
                                where('parent', '==', queryParams.parent),
                                where('created_by', '==', queryParams.user),
                                where('trashed', '==', false)
                            );
                            const myDocQuerySnapshot = await getDocs(myDocQuery);
                            myDocQuerySnapshot?.forEach((data) => {
                                let folderData = { ...data.data() };
                                let folderDataOmited = omit(folderData, ['date_created', 'date_modified']);
                                const folder = {
                                    id: data.id,
                                    date_created: new Date(data.data().date_created.seconds * 1000).toDateString(),
                                    date_modified: new Date(data.data().date_modified.seconds * 1000).toDateString(),
                                    ...folderDataOmited
                                };

                                folders.push(folder);
                            });
                            break;
                        case '/documents/trash':
                            if (queryParams.parent) {
                                const trashedQuery = query(
                                    collection(db, 'folders'),
                                    where('created_by', '==', queryParams.user),
                                    where('trashed', '==', true)
                                );
                                const trashedQuerySnapshot = await getDocs(trashedQuery);
                                trashedQuerySnapshot?.forEach((data) => {
                                    let folderData = { ...data.data() };
                                    let folderDataOmited = omit(folderData, ['date_created', 'date_modified']);
                                    const folder = {
                                        id: data.id,
                                        date_created: new Date(data.data().date_created.seconds * 1000).toDateString(),
                                        date_modified: new Date(data.data().date_modified.seconds * 1000).toDateString(),
                                        ...folderDataOmited
                                    };

                                    folders.push(folder);
                                });
                            } else {
                                const trashedQuery = query(
                                    collection(db, 'folders'),
                                    where('created_by', '==', queryParams.user),
                                    where('trashed', '==', true)
                                );
                                const trashedQuerySnapshot = await getDocs(trashedQuery);
                                trashedQuerySnapshot?.forEach((data) => {
                                    let folderData = { ...data.data() };
                                    let folderDataOmited = omit(folderData, ['date_created', 'date_modified']);
                                    const folder = {
                                        id: data.id,
                                        date_created: new Date(data.data().date_created.seconds * 1000).toDateString(),
                                        date_modified: new Date(data.data().date_modified.seconds * 1000).toDateString(),
                                        ...folderDataOmited
                                    };

                                    folders.push(folder);
                                });
                            }
                            break;
                        case '/documents/document-for-my-approval':
                            const approvalDocQuery = query(
                                collection(db, 'folders'),
                                where('parent', '==', queryParams.parent),
                                where('created_by', '==', queryParams.user),
                                where('trashed', '==', false)
                            );
                            const approvalQuerySnapshot = await getDocs(approvalDocQuery);
                            approvalQuerySnapshot?.forEach((data) => {
                                let folderData = { ...data.data() };
                                let folderDataOmited = omit(folderData, ['date_created', 'date_modified']);
                                const folder = {
                                    id: data.id,
                                    date_created: new Date(data.data().date_created.seconds * 1000).toDateString(),
                                    date_modified: new Date(data.data().date_modified.seconds * 1000).toDateString(),
                                    ...folderDataOmited
                                };
                                folders.push(folder);
                            });
                            break;

                        default:
                            const defaultQuery = query(
                                collection(db, 'folders'),
                                where('parent', '==', queryParams.parent),
                                where('created_by', '==', queryParams.user),
                                where('trashed', '==', false)
                            );
                            const defaultQuerySnapshot = await getDocs(defaultQuery);
                            defaultQuerySnapshot?.forEach((data) => {
                                let folderData = { ...data.data() };
                                let folderDataOmited = omit(folderData, ['date_created', 'date_modified']);
                                const folder = {
                                    id: data.id,
                                    date_created: new Date(data.data().date_created.seconds * 1000).toDateString(),
                                    date_modified: new Date(data.data().date_modified.seconds * 1000).toDateString(),
                                    ...folderDataOmited
                                };

                                folders.push(folder);
                            });
                            break;
                    }

                    return { data: folders };
                } catch (e) {
                    return { error: e.message };
                }
            },
            providesTags: ['folders']
        }),
        addFolder: builder.mutation({
            async queryFn(folder) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);
                    const q = collection(db, 'folders');
                    const { id } = await addDoc(q, folderConverter.toFirestore(folder));
                    const q2 = collection(db, 'logs');
                    const log = {
                        created_by: {
                            id: folder.created_by.id,
                            name: folder.created_by.name
                        },
                        date_created: Timestamp.fromDate(new Date()),
                        folder_name: folder.folder_name,
                        log_type: 'create_folder',
                        log_category: 'folders',
                        log_description: `User ${folder.created_by.name} created ${folder.folder_name} folder`
                    };
                    await addDoc(q2, logsConverter.toFirestore(log));

                    return { data: { id } };
                } catch (e) {
                    return { error: e.message };
                }
            },
            invalidatesTags: ['folders', 'logs']
        }),
        deleteFolder: builder.mutation({
            async queryFn(folderId) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);

                    const docRef = doc(db, 'folders', folderId);
                    const docSnap = await getDoc(docRef);
                    let folderData = { ...docSnap.data() };
                    await deleteDoc(docRef);
                    const q2 = collection(db, 'logs');
                    const log = {
                        created_by: {
                            id: folderData.created_by,
                            name: folderData.created_by_name
                        },
                        date_created: Timestamp.fromDate(new Date()),
                        folder_name: folderData.folder_name,
                        log_type: 'deleted_folder',
                        log_category: 'folders',
                        log_description: `User ${folderData.created_by_name} created ${folderData.folder_name} folder`
                    };
                    await addDoc(q2, logsConverter.toFirestore(log));

                    return { data: folderId };
                } catch (e) {
                    return { error: e };
                }
            },
            invalidatesTags: ['folders', 'logs']
        }),
        trashFolder: builder.mutation({
            async queryFn(folderId) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);

                    const data = {
                        trashed: true
                    };
                    const docRef = doc(db, 'folders', folderId);
                    await updateDoc(docRef, data);
                    const docSnap = await getDoc(docRef);
                    let folderData = { ...docSnap.data() };
                    const q2 = collection(db, 'logs');
                    const log = {
                        created_by: {
                            id: folderData.created_by,
                            name: folderData.created_by_name
                        },
                        date_created: Timestamp.fromDate(new Date()),
                        folder_name: folderData.folder_name,
                        log_type: 'trashed_folder',
                        log_category: 'folders',
                        log_description: `User ${folderData.created_by_name} trashed ${folderData.folder_name} folder`
                    };
                    await addDoc(q2, logsConverter.toFirestore(log));

                    return { data: folderId };
                } catch (e) {
                    return { error: e.message };
                }
            },
            invalidatesTags: ['folders', 'logs']
        }),
        restoreFolder: builder.mutation({
            async queryFn(folder) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);

                    const data = {
                        trashed: false
                    };

                    const docRef = doc(db, 'folders', folder.id);
                    await updateDoc(docRef, data);
                    const docSnap = await getDoc(docRef);
                    let folderData = { ...docSnap.data() };
                    const q2 = collection(db, 'logs');
                    const log = {
                        created_by: {
                            id: folderData.created_by,
                            name: folderData.created_by_name
                        },
                        date_created: Timestamp.fromDate(new Date()),
                        folder_name: folderData.folder_name,
                        log_type: 'restored_folder',
                        log_category: 'folders',
                        log_description: `User ${folderData.created_by_name} restored ${folderData.folder_name} folder`
                    };
                    await addDoc(q2, logsConverter.toFirestore(log));

                    return { data: true };
                } catch (e) {
                    return { error: e.message };
                }
            },
            invalidatesTags: ['folders', 'logs']
        }),
        renameFolder: builder.mutation({
            async queryFn(folder) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);

                    const data = {
                        folder_name: folder.folder_name
                    };

                    const docRef = doc(db, 'folders', folder.id);
                    await updateDoc(docRef, data);
                    const docSnap = await getDoc(docRef);
                    let folderData = { ...docSnap.data() };
                    const q2 = collection(db, 'logs');
                    const log = {
                        created_by: {
                            id: folderData.created_by,
                            name: folderData.created_by_name
                        },
                        date_created: Timestamp.fromDate(new Date()),
                        folder_name: folderData.folder_name,
                        log_type: 'renamed_folder',
                        log_category: 'folders',
                        log_description: `User ${folderData.created_by_name} renamed ${folderData.folder_name} folder`
                    };
                    await addDoc(q2, logsConverter.toFirestore(log));

                    return { data: true };
                } catch (e) {
                    return { error: e.message };
                }
            },
            invalidatesTags: ['folders', 'logs']
        })
    })
});
export const folders_query = foldersQuery.reducer;
export const {
    useGetFoldersByParentIdQuery,
    useGetFilesQuery,
    useAddFolderMutation,
    useDeleteFolderMutation,
    useRenameFolderMutation,
    useTrashFolderMutation,
    useRestoreFolderMutation
} = foldersQuery;
