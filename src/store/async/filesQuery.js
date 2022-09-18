import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import { db } from "../../firebase-config"
import { getDocs, collection, query, where, Timestamp, doc, addDoc, deleteDoc, updateDoc } from "firebase/firestore"


const omit = (obj, omitKeys) => {
    let newobj = { ...obj }
    omitKeys.forEach(omitKey => {
        newobj = { ...Object.keys(newobj).filter(key => key !== omitKey).reduce((result, key) => ({ ...result, [key]: obj[key] }), {}) }
    })
    return newobj
}


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
        locked,
    ) {
        this.created_by = created_by;
        this.date_created = new Date(date_created.seconds).toLocaleString()
        this.date_modified = new Date(date_modified.seconds).toLocaleString()
        this.file_name = file_name;
        this.isFolder = isFolder;
        this.no_of_files = no_of_files;
        this.file_ref = file_ref;
        this.file_type = file_type;
        this.parent = parent;
        this.size = size;
        this.zipped = zipped;
        this.trashed = trashed;
        this.locked = locked
    }
    toString() {
        return this.created_by + ', ' + this.date_created + ', ' + this.date_modified + ', ' + this.file_name + ', ' + this.isFolder + ', ' + this.no_of_files + ', ' + this.parent + ', ' + this.size;
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
        }
        if (file.department_access) {
            sent_file = {
                ...sent_file,
                department_access: file.department_access,
            }
        }
        return sent_file;
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new File
            (
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
                data.locked,
            );
    }
};


// class File {
//     constructor(archived, created_by, date_created, date_modified, file_name, file_type, isFolder, file_ref, parent, size, trashed, locked) {
//         this.archived = archived
//         this.created_by = created_by;
//         this.date_created = new Date(date_created.seconds).toDateString()
//         this.date_modified = new Date(date_modified.seconds).toDateString()
//         this.file_name = file_name;
//         this.isFolder = isFolder;
//         this.file_ref = file_ref;
//         this.file_type = file_type;
//         this.parent = parent;
//         this.size = size;
//         this.trashed = trashed;
//         this.locked = locked;
//     }
//     toString() {
//         return this.created_by + ', ' + this.date_created + ', ' + this.date_modified + ', ' + this.file_name + ', ' + this.isFolder + ', ' + this.file_ref + ', ' + this.parent + ', ' + this.size + ', ' + this.trashed + ', ' + this.locked;
//     }
// }


// // Firestore data converter
// const fileConverter = {
//     toFirestore: (file) => {
//         return {
//             archived: file.archived,
//             created_by: "Admin",
//             date_created: Timestamp.fromDate(new Date()),
//             date_modified: Timestamp.fromDate(new Date()),
//             file_name: file.file_name,
//             isFolder: false,
//             file_ref: file.file_ref,
//             file_type: file.file_type,
//             parent: file.parent,
//             size: file.size,
//             trashed: file.trashed,
//             locked: file.locked,
//         };
//     },
//     fromFirestore: (snapshot, options) => {
//         const data = snapshot.data(options);
//         return new File(data.archived, data.created_by, data.date_created, data.date_modified, data.file_name, data.file_type, data.isFolder, data.file_ref, data.parent, data.size, data.trashed, data.locked);
//     }
// };


export const filesQuery = createApi({
    reducerPath: 'files_query',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['files'],
    endpoints: (builder) => ({
        getFilesByParentId: builder.query({
            async queryFn(queryParams) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)
                    let files = [];
                    // const q = query(collection(db, "files"), where("parent", "==", parentId), orderBy("file_name"), endAt(50));
                    const q = query(collection(db, "files"), where("parent", "==", queryParams.parent), where("created_by", '==',  queryParams.user));

                    const querySnapshot = await getDocs(q);
                    querySnapshot?.forEach((data) => {
                        let fileData = { ...data.data() };
                        let fileDataOmited = omit(fileData, ['date_created', 'date_modified'])
                        const file = {
                            id: data.id,
                            date_created: data.data().date_created ? new Date(data.data().date_created.seconds * 1000).toDateString() : null,
                            date_modified: data.data().date_created ? new Date(data.data().date_modified.seconds * 1000).toDateString() : null,
                            ...fileDataOmited
                        }

                        files.push(file)
                    })
                    return { data: files }

                } catch (e) {
                    return { error: e.message }
                }
            },
            // providesTags: ['files']
        }),
        uploadFile: builder.mutation({
            async queryFn(file) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)

                    const q = collection(db, "files");
                    const { id } = await addDoc(q, fileConverter.toFirestore(file))

                    return { data: id }

                } catch (e) {
                    return { error: e.message }
                }

            },
            // invalidatesTags: ['files']
        }),
        trashFolder: builder.mutation({
            async queryFn(file) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)

                    const data = {
                        trashed: true
                    };

                    const docRef = doc(db, "files", file.id);
                    const response = await updateDoc(docRef, data)

                    return { data: response }

                } catch (e) {
                    return { error: e.message }
                }

            },
            // invalidatesTags: ['files']
        }),
        restoreFile: builder.mutation({
            async queryFn(file) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)

                    const data = {
                        trashed: false
                    };

                    const docRef = doc(db, "files", file.id);
                    const response = await updateDoc(docRef, data)

                    return { data: response }

                } catch (e) {
                    return { error: e.message }
                }

            },
            // invalidatesTags: ['files']
        }),

        renameFiles: builder.mutation({
            async queryFn(file) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)
                    const data = {
                        file_name: file.file_name
                    };
                    const docRef = doc(db, "files", file.id);
                    const response = await updateDoc(docRef, data)

                    return { data: response }

                } catch (e) {
                    return { error: e.message }
                }

            },
            // invalidatesTags: ['files']
        })
    })
})
export const files_query = filesQuery.reducer
export const {
    useGetFilesByParentIdQuery,
    useUploadFileMutation,
    useRenameFilesMutation,
    useTrashFileMutation,
    useRestorFileMutation
} = filesQuery
