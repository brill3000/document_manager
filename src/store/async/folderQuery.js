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


class Folder {
    constructor(created_by, date_created, date_modified, folder_name, isFolder, no_of_files, parent, size) {
        this.created_by = created_by;
        this.date_created = new Date(date_created.seconds).toDateString()
        this.date_modified = new Date(date_modified.seconds).toDateString()
        this.folder_name = folder_name;
        this.isFolder = isFolder;
        this.no_of_files = no_of_files;
        this.parent = parent;
        this.size = size;
    }
    toString() {
        return this.created_by + ', ' + this.date_created + ', ' + this.date_modified + ', ' + this.folder_name + ', ' + this.isFolder + ', ' + this.no_of_files + ', ' + this.parent + ', ' + this.size;
    }
}


// Firestore data converter
const folderConverter = {
    toFirestore: (folder) => {
        return {
            created_by: folder.created_by,
            date_created: Timestamp.fromDate(new Date()),
            date_modified: Timestamp.fromDate(new Date()),
            folder_name: folder.folder_name,
            isFolder: true,
            no_of_files: folder.no_of_files,
            parent: folder.parent,
            size: folder.size,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Folder(data.created_by, data.date_created, data.date_modified, data.folder_name, data.isFolder, data.no_of_files, data.parent, data.size);
    }
};


export const foldersQuery = createApi({
    reducerPath: 'folders_query',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['folders'],
    endpoints: (builder) => ({
        getFoldersByParentId: builder.query({
            async queryFn(parentId) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)
                    let folders = [];
                    // const q = query(collection(db, "folders"), where("parent", "==", parentId), orderBy("folder_name"), endAt(50));
                    const q = query(collection(db, "folders"), where("parent", "==", parentId));

                    const querySnapshot = await getDocs(q);
                    querySnapshot?.forEach((data) => {
                        let folderData = { ...data.data() };
                        let folderDataOmited = omit(folderData, ['date_created', 'date_modified'])
                        const folder = {
                            id: data.id,
                            date_created: new Date(data.data().date_created.seconds).toDateString(),
                            date_modified: new Date(data.data().date_modified.seconds).toDateString(),
                            ...folderDataOmited
                        }

                        folders.push(folder)
                    })
                    return { data: folders }

                } catch (e) {
                    return { error: e.message }
                }
            },
            providesTags: ['folders']
        }),
        addFolder: builder.mutation({
            async queryFn(folder) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)

                    const q = collection(db, "folders");
                    const { id } = await addDoc(q, folderConverter.toFirestore(folder))

                    return { data: { id } }

                } catch (e) {
                    return { error: e.message }
                }

            },
            invalidatesTags: ['folders']
        }),
        deleteFolder: builder.mutation({
            async queryFn(folderId) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)

                    const docRef = doc(db, "folders", folderId);
                    const reference = await deleteDoc(docRef)

                    return { data: reference }

                } catch (e) {
                    return { error: e }
                }

            },
            invalidatesTags: ['folders']
        }),
        trashFolder: builder.mutation({
            async queryFn(folder) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)

                    const data = {
                        trashed: true
                    };

                    const docRef = doc(db, "folders", folder.id);
                    const response = await updateDoc(docRef, data)

                    return { data: response }

                } catch (e) {
                    return { error: e.message }
                }

            },
            invalidatesTags: ['folders']
        }),
        restoreFolder: builder.mutation({
            async queryFn(folder) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)

                    const data = {
                        trashed: false
                    };

                    const docRef = doc(db, "folders", folder.id);
                    const response = await updateDoc(docRef, data)

                    return { data: response }

                } catch (e) {
                    return { error: e.message }
                }

            },
            invalidatesTags: ['folders']
        }),
        renameFolder: builder.mutation({
            async queryFn(folder) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)

                    const data = {
                        folder_name: folder.folder_name
                    };

                    const docRef = doc(db, "folders", folder.id);
                    const response = await updateDoc(docRef, data)

                    return { data: response }

                } catch (e) {
                    return { error: e.message }
                }

            },
            invalidatesTags: ['folders']
        })

    })
})
export const folders_query = foldersQuery.reducer
export const {
    useGetFoldersByParentIdQuery,
    useGetFilesQuery,
    useAddFolderMutation,
    useDeleteFolderMutation,
    useRenameFolderMutation,
    useTrashFolderMutation,
    useRestoreFolderMutation,
} = foldersQuery
