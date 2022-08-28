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
        this.date_modified = new Date(date_created.seconds).toDateString()
        this.folder_name = folder_name;
        this.isFolder = isFolder;
        this.no_of_files = no_of_files;
        this.parent = parent;
        this.size = size;
    }
    toString() {
        return this.created_by + ', ' + this.date_created + ', ' + this.date_modified, + ', ' + this.folder_name + ', ' + this.isFolder + ', ' + this.no_of_files + ', ' + this.parent + ', ' + this.size;
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
            isFolder: folder.isFolder,
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


export const documentsApi = createApi({
    reducerPath: 'documents_fetch',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['documents'],
    endpoints: (builder) => ({
        getFiles: builder.query({
            async queryFn(parentId) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)
                    let folders = [];
                    // const q = query(collection(db, "folders"), where("parent", "==", parentId), orderBy("folder_name"), endAt(50));
                    const q = query(collection(db, "files"), where("parent", "==", parentId));

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
        }),
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
            providesTags: ['documents']
        }),
        addFolder: builder.mutation({
            async queryFn(folder) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)

                    let isCreatedfolder = null
                    const q = collection(db, "folders");
                    addDoc(q, folderConverter.toFirestore(folder))
                        .then(docRef => {
                            isCreatedfolder = docRef.id
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    return { data: isCreatedfolder }

                } catch (e) {
                    return { error: e }
                }

            },
            invalidatesTags: ['documents']
        }),
        deleteFolder: builder.mutation({
            async queryFn(folderId) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)

                    let isCreatedfolder = null
                    const docRef = doc(db, "folders", folderId);
                    deleteDoc(docRef)
                        .then(deletedRef => {
                            isCreatedfolder = deletedRef.id
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    return { data: isCreatedfolder }

                } catch (e) {
                    return { error: e }
                }

            },
            invalidatesTags: ['documents']
        }),
        renameFolder: builder.mutation({
            async queryFn(folder) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)

                    let isCreatedfolder = null
                    const data = {
                        folder_name: folder.folder_name
                    };
                    console.log(data, "FOLDER NAME")

                    const docRef = doc(db, "folders", folder.id);
                    updateDoc(docRef, data)
                        .then(deletedRef => {
                            isCreatedfolder = deletedRef.id
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    return { data: isCreatedfolder }

                } catch (e) {
                    return { error: e }
                }

            },
            invalidatesTags: ['documents']
        })

    })
})
export const document_fetch = documentsApi.reducer
export const { useGetFoldersByParentIdQuery, useGetFilesQuery, useAddFolderMutation, useDeleteFolderMutation, useRenameFolderMutation } = documentsApi
