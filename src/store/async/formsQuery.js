import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import { db } from "../../firebase-config"
import { getDocs, collection, query, where, Timestamp, doc, addDoc, deleteDoc, updateDoc, endAt } from "firebase/firestore"


class Form {
    constructor(id, title, created_by, date_created, date_modified, nodes, edges, viewport) {
        this.id = id
        this.created_by = created_by
        this.title = title
        this.date_created = new Date(date_created.seconds).toLocaleString() 
        this.date_modified = date_modified ? new Date(date_modified.seconds).toLocaleString() : null
        this.nodes = nodes
        this.edges = edges
        this.viewport = viewport
    }
    toString() {
        return this.user_id + ', '
    }
    getWorkflow() {
        return {
            id: this.id,
            title: this.title,
            created_by: this.created_by,
            date_created: this.date_created,
            date_modified: this.date_modified,
            nodes: this.nodes,
            edges: this.edges,
            viewport: this.viewport
        }
    }
}



// Firestore data converter
const userConverter = {
    toFirestore: (workflow) => {
        return {
            created_by: workflow.created_by,
            title: workflow.title,
            date_created: Timestamp.fromDate(new Date()),
            date_modified: null,
            nodes: workflow.nodes,
            edges: workflow.edges,
            viewport: workflow.viewport
        };
    },
    fromFirestore: (snapshot) => {
        const data = snapshot.data();
        return new Form(data.id, data.title, data.created_by, data.date_created, data.date_modified, data.nodes, data.edges, data.viewport);
    }
};


export const formsQuery = createApi({
    reducerPath: 'forms_query',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['forms'],
    endpoints: (builder) => ({
        getSavedForms: builder.query({
            async queryFn() {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)
                    let users = [];
                    // const q = query(collection(db, "files"), where("parent", "==", parentId), orderBy("file_name"), endAt(50));
                    const q = query(collection(db, "forms"));

                    const querySnapshot = await getDocs(q);
                    querySnapshot?.forEach((data) => {
                        console.log(data.data(), "DATA");
                        let userData = userConverter.fromFirestore(data);

                        users.push(userData.getWorkflow())
                    })
                    return { data: users }

                } catch (e) {
                    return { error: e.message }
                }
            },
            providesTags: ['forms']
        }),
        createForm: builder.mutation({
            async queryFn(workflow) {

                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)
                    const q = collection(db, "forms");
                    await addDoc(q, userConverter.toFirestore(workflow))
                    return { data: true }
                } catch (e) {
                    return { error: e.message }
                }
            },
            invalidatesTags: ['forms']
        }),
        // removeUserFromoDepartment: builder.mutation({
        //     async queryFn(user) {
        //         try {
        //             if (!navigator.onLine) throw new Error(`It seems that you are offline`)

        //             const q = collection(db, "departments", "users");

        //             const data = {
        //                 deregistration_date: Timestamp.fromDate(new Date()),
        //             };
        //             const docRef = doc(db, "departments", "users", user.id);
        //             const response = await updateDoc(docRef, data)


        //             return { data: response }

        //         } catch (e) {
        //             return { error: e.message }
        //         }

        //     },
        //     // invalidatesTags: ['users']
        // }),
        // deRegisterUser: builder.mutation({
        //     async queryFn(user) {
        //         try {
        //             if (!navigator.onLine) throw new Error(`It seems that you are offline`)

        //             const data = {
        //                 deregistration_date: Timestamp.fromDate(new Date()),
        //             };

        //             const docRef = doc(db, "users", user.id);
        //             const docRef2 = doc(db, "departments", "users", user.id);

        //             const response = await updateDoc(docRef, data)
        //             const response2 = await updateDoc(docRef2, data)


        //             return { data: response && response2 }

        //         } catch (e) {
        //             return { error: e.message }
        //         }

        //     },
        //     // invalidatesTags: ['users']
        // }),

        // restoreFile: builder.mutation({
        //     async queryFn(file) {
        //         try {
        //             if (!navigator.onLine) throw new Error(`It seems that you are offline`)

        //             const data = {
        //                 trashed: false
        //             };

        //             const docRef = doc(db, "files", file.id);
        //             const response = await updateDoc(docRef, data)

        //             return { data: response }

        //         } catch (e) {
        //             return { error: e.message }
        //         }

        //     },
        //     invalidatesTags: ['users']
        // }),

        // renameFiles: builder.mutation({
        //     async queryFn(file) {
        //         try {
        //             if (!navigator.onLine) throw new Error(`It seems that you are offline`)
        //             const data = {
        //                 file_name: file.file_name
        //             };
        //             const docRef = doc(db, "files", file.id);
        //             const response = await updateDoc(docRef, data)

        //             return { data: response }

        //         } catch (e) {
        //             return { error: e.message }
        //         }

        //     },
        //     invalidatesTags: ['files']
        // })
    })
})
export const forms_query = formsQuery.reducer
export const {
    useCreateFormMutation,
    useGetSavedFormsQuery,
} = formsQuery
