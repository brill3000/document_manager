import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { db } from '../../firebase-config';
import { getDocs, collection, query, where, Timestamp, doc, addDoc, updateDoc, getDoc, runTransaction } from 'firebase/firestore';

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

class File {
    constructor(
        created_by,
        date_created,
        date_modified,
        file_name,
        isFolder,
        no_of_files,
        file_ref,
        file_type,
        parent,
        size,
        zipped,
        trashed,
        locked
    ) {
        this.created_by = created_by;
        this.date_created = new Date(date_created.seconds).toLocaleString();
        this.date_modified = new Date(date_modified.seconds).toLocaleString();
        this.file_name = file_name;
        this.isFolder = isFolder;
        this.no_of_files = no_of_files;
        this.file_ref = file_ref;
        this.file_type = file_type;
        this.parent = parent;
        this.size = size;
        this.zipped = zipped;
        this.trashed = trashed;
        this.locked = locked;
    }
    toString() {
        return (
            this.created_by +
            ', ' +
            this.date_created +
            ', ' +
            this.date_modified +
            ', ' +
            this.file_name +
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
const fileConverter = {
    toFirestore: (file) => {
        let sent_file = {
            created_by: file.created_by.id,
            created_by_name: file.created_by.name,
            date_created: Timestamp.fromDate(new Date()),
            date_modified: Timestamp.fromDate(new Date()),
            file_name: file.file_name,
            isFolder: file.isFolder,
            file_ref: file.file_ref,
            file_type: file.file_type,
            parent: file.parent,
            trashed: file.trashed ?? false,
            user_access: file.user_access ?? null,
            archived: file.archived,
            zipped: file.zipped ?? false,
            size: file.size,
            locked: file.locked ?? false
        };
        if (file.department_access) {
            sent_file = {
                ...sent_file,
                department_access: file.department_access
            };
        }
        return sent_file;
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new File(
            data.created_by,
            data.date_created,
            data.date_modified,
            data.file_name,
            data.isFolder,
            data.no_of_files,
            data.file_ref,
            data.file_type,
            data.parent,
            data.size,
            data.zipped,
            data.trashed,
            data.locked
        );
    }
};
const logsConverter = {
    toFirestore: (log) => {
        return {
            created_by: log.created_by.id,
            created_by_name: log.created_by.name,
            date_created: Timestamp.fromDate(new Date()),
            file_name: log.file_name,
            log_type: log.log_type,
            log_category: log.log_category,
            log_description: log.log_description,
            file_modified: log.file_modified ?? false
        };
    }
};

export const filesQuery = createApi({
    reducerPath: 'files_query',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['files'],
    endpoints: (builder) => ({
        getFilesByParentId: builder.query({
            async queryFn(queryParams) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);
                    let files = [];
                    // const q = query(collection(db, "files"), where("parent", "==", parentId), orderBy("file_name"), endAt(50));
                    const q = query(
                        collection(db, 'files'),
                        where('parent', '==', queryParams.parent),
                        where('created_by', '==', queryParams.user)
                    );

                    const querySnapshot = await getDocs(q);
                    querySnapshot?.forEach((data) => {
                        let fileData = { ...data.data() };
                        let fileDataOmited = omit(fileData, ['date_created', 'date_modified']);
                        const file = {
                            id: data.id,
                            date_created: data.data().date_created
                                ? new Date(data.data().date_created.seconds * 1000).toDateString()
                                : null,
                            date_modified: data.data().date_created
                                ? new Date(data.data().date_modified.seconds * 1000).toDateString()
                                : null,
                            ...fileDataOmited
                        };
                        files.push(file);
                    });
                    return { data: files };
                } catch (e) {
                    return { error: e.message };
                }
            }
            // providesTags: ['files']
        }),
        uploadFile: builder.mutation({
            async queryFn(file) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);

                    const q = collection(db, 'files');
                    const { id } = await addDoc(q, fileConverter.toFirestore(file));

                    const q2 = collection(db, 'logs');
                    const log = {
                        created_by: {
                            id: file.created_by.id,
                            name: file.created_by.name
                        },
                        date_created: Timestamp.fromDate(new Date()),
                        file_name: file.file_name,
                        log_type: 'uploaded',
                        log_category: 'files',
                        log_description: `User ${file.created_by.name} uploaded ${file.file_name}`
                    };
                    await addDoc(q2, logsConverter.toFirestore(log));
                    const summaryRef = doc(db, 'user_summary', file.created_by.id);

                    const day = new Date().getDay();
                    const month = new Date().getMonth();

                    await runTransaction(db, async (transaction) => {
                        const summaryDoc = await transaction.get(summaryRef);
                        if (!summaryDoc.exists()) {
                            throw new Error('Document does not exist!');
                        }

                        const weekly = { [day]: summaryDoc.data().weekly[day] + 1 };
                        const monthly = { [month]: summaryDoc.data().monthly[month] + 1 };

                        transaction.update(summaryRef, {
                            document_count: summaryDoc.data().document_count ? summaryDoc.data().document_count + 1 : 1,
                            last_update: Timestamp.fromDate(new Date()),
                            weekly: { ...summaryDoc.data().weekly, ...weekly },
                            monthly: { ...summaryDoc.data().monthly, ...monthly }
                        });
                    });

                    return { data: id };
                } catch (e) {
                    return { error: e.message };
                }
            },
            invalidatesTags: ['logs']
        }),
        trashFolder: builder.mutation({
            async queryFn(file) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);

                    const data = {
                        trashed: true
                    };

                    const docRef = doc(db, 'files', file.id);
                    const response = await updateDoc(docRef, data);
                    const q2 = collection(db, 'logs');
                    const docSnap = await getDoc(docRef);
                    let fileData = { ...docSnap.data() };
                    const log = {
                        created_by: {
                            id: fileData.created_by,
                            name: fileData.created_by_name
                        },
                        date_created: Timestamp.fromDate(new Date()),
                        file_name: fileData.file_name,
                        log_type: 'trashed',
                        log_category: 'files',
                        file_modified: true,
                        log_description: `User ${fileData.created_by_name} trashed ${fileData.file_name}`
                    };
                    await addDoc(q2, logsConverter.toFirestore(log));

                    return { data: response };
                } catch (e) {
                    return { error: e.message };
                }
            },
            invalidatesTags: ['logs']
        }),
        restoreFile: builder.mutation({
            async queryFn(file) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);
                    const data = {
                        trashed: false
                    };
                    const docRef = doc(db, 'files', file.id);
                    const response = await updateDoc(docRef, data);
                    const q2 = collection(db, 'logs');
                    const docSnap = await getDoc(docRef);
                    let fileData = { ...docSnap.data() };
                    const log = {
                        created_by: {
                            id: fileData.created_by,
                            name: fileData.created_by_name
                        },
                        date_created: Timestamp.fromDate(new Date()),
                        file_name: fileData.file_name,
                        log_type: 'restored',
                        log_category: 'files',
                        file_modified: true,
                        log_description: `User ${fileData.created_by_name} restored ${fileData.file_name}`
                    };
                    await addDoc(q2, logsConverter.toFirestore(log));

                    return { data: response };
                } catch (e) {
                    return { error: e.message };
                }
            },
            invalidatesTags: ['logs']
        }),

        renameFiles: builder.mutation({
            async queryFn(file) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);
                    const data = {
                        file_name: file.file_name
                    };
                    const docRef = doc(db, 'files', file.id);
                    const response = await updateDoc(docRef, data);
                    const q2 = collection(db, 'logs');
                    const docSnap = await getDoc(docRef);
                    let fileData = { ...docSnap.data() };
                    const log = {
                        created_by: {
                            id: fileData.created_by,
                            name: fileData.created_by_name
                        },
                        date_created: Timestamp.fromDate(new Date()),
                        file_name: fileData.file_name,
                        log_type: 'renamed',
                        log_category: 'files',
                        file_modified: true,
                        log_description: `User ${fileData.created_by_name} renamed ${fileData.file_name}`
                    };
                    await addDoc(q2, logsConverter.toFirestore(log));

                    return { data: response };
                } catch (e) {
                    return { error: e.message };
                }
            },
            invalidatesTags: ['logs']
        })
    })
});
export const files_query = filesQuery.reducer;
export const {
    useGetFilesByParentIdQuery,
    useUploadFileMutation,
    useRenameFilesMutation,
    useTrashFileMutation,
    useRestorFileMutation
} = filesQuery;
