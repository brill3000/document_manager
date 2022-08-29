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
    constructor(archived, created_by, date_created, date_modified, file_name, file_type, isFolder, file_ref, parent, size, trashed, locked) {
        this.archived = archived
        this.created_by = created_by;
        this.date_created = new Date(date_created.seconds).toDateString()
        this.date_modified = new Date(date_modified.seconds).toDateString()
        this.file_name = file_name;
        this.isFolder = isFolder;
        this.file_ref = file_ref;
        this.file_type = file_type;
        this.parent = parent;
        this.size = size;
        this.trashed = trashed;
        this.locked = locked;
    }
    toString() {
        return this.created_by + ', ' + this.date_created + ', ' + this.date_modified + ', ' + this.file_name + ', ' + this.isFolder + ', ' + this.file_ref + ', ' + this.parent + ', ' + this.size + ', ' + this.trashed + ', ' + this.locked;
    }
}


// Firestore data converter
const fileConverter = {
    toFirestore: (file) => {
        return {
            archived: file.archived,
            created_by: "Admin",
            date_created: Timestamp.fromDate(new Date()),
            date_modified: Timestamp.fromDate(new Date()),
            file_name: file.file_name,
            isFolder: false,
            file_ref: file.file_ref,
            file_type: file.file_type,
            parent: file.parent,
            size: file.size,
            trashed: file.trashed,
            locked: file.locked,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new File(data.archived, data.created_by, data.date_created, data.date_modified, data.file_name, data.file_type, data.isFolder, data.file_ref, data.parent, data.size, data.trashed, data.locked);
    }
};


export const filesQuery = createApi({
    reducerPath: 'files_query',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['files'],
    endpoints: (builder) => ({
        getFilesByParentId: builder.query({
            async queryFn(parentId) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)
                    let files = [];
                    // const q = query(collection(db, "files"), where("parent", "==", parentId), orderBy("file_name"), endAt(50));
                    const q = query(collection(db, "files"), where("parent", "==", parentId));

                    const querySnapshot = await getDocs(q);
                    querySnapshot?.forEach((data) => {
                        let fileData = { ...data.data() };
                        let fileDataOmited = omit(fileData, ['date_created', 'date_modified'])
                        const folder = {
                            id: data.id,
                            date_created: new Date(data.data().date_created.seconds).toDateString(),
                            date_modified: new Date(data.data().date_modified.seconds).toDateString(),
                            ...fileDataOmited
                        }

                        files.push(folder)
                    })
                    return { data: files }

                } catch (e) {
                    return { error: e.message }
                }
            },
            providesTags: ['files']
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
            invalidatesTags: ['folders']
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
            invalidatesTags: ['folders']
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
            invalidatesTags: ['files']
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
