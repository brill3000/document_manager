import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import { db } from "../../firebase-config"
import { getDocs, collection, query, where, Timestamp, doc, addDoc, deleteDoc, updateDoc, endAt } from "firebase/firestore"



const omit = (obj, omitKeys) => {
    let newobj = { ...obj }
    omitKeys.forEach(omitKey => {
        newobj = { ...Object.keys(newobj).filter(key => key !== omitKey).reduce((result, key) => ({ ...result, [key]: obj[key] }), {}) }
    })
    return newobj
}


class User {
    constructor(user_id, user_name, first_name, last_name, registration_date, deregistration_date, departments, company, is_admin, is_logged_in, logs_id, position) {
        this.user_id = user_id
        this.user_name = user_name
        this.first_name = first_name
        this.last_name = last_name
        this.registration_date = new Date(registration_date.seconds).toLocaleString()
        this.deregistration_date = new Date(deregistration_date.seconds).toLocaleString()
        this.departments = departments
        this.position = position
        this.company = company
        this.is_admin = is_admin
        this.is_logged_in = is_logged_in
        this.logs_id = logs_id
    }
    toString() {
        return this.user_id + ', ' + this.user_name + ', ' + this.first_name + ', ' + this.last_name + ', ' + this.registration_date + ', ' + this.deregistration_date + ', ' + this.locked + ', ' + this.company + ', ' + this.is_admin + ', ' + this.blocked + ', ' + this.logs_id;
    }
}



// Firestore data converter
const userConverter = {
    toFirestore: (user) => {
        return {
            user_id: user.user_id,
            name: {
                first_name: user.name.first_name,
                last_name: user.name.last_name,
            },
            email: user.email,
            registration_date: Timestamp.fromDate(new Date()),
            deregistration_date: null,
            position: user.position ?? 'Guest',
            is_admin: user.is_admin ?? true,
            is_logged_in: user.is_logged_in ?? false,
            departments: user.departments ?? null,
            company: user.company,
            blocked: user.blocked ?? true,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.id, data.user_name, data.first_name, data.last_name, data.registration_date, data.deregistration_date, data.departments, data.company, data.is_admin, data.is_logged_in, data.logs_id, data.position);
    }
};


export const usersQuery = createApi({
    reducerPath: 'users_query',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['users'],
    endpoints: (builder) => ({
        getSystemUsers: builder.query({
            async queryFn() {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)
                    let users = [];
                    // const q = query(collection(db, "files"), where("parent", "==", parentId), orderBy("file_name"), endAt(50));
                    const q = query(collection(db, "users"));

                    const querySnapshot = await getDocs(q);
                    querySnapshot?.forEach((data) => {
                        let userData = { ...data.data() };
                        let userDataOmited = omit(userData, ['registration_date', 'deregistration_date'])
                        const user = {
                            registration_date: data.data().registration_date ? new Date(data.data().registration_date.seconds * 1000).toLocaleString() : null,
                            deregistration_date: data.data().deregistration_date ? new Date(data.data().deregistration_date.seconds * 1000).toLocaleString() : null,
                            ...userDataOmited
                        }                       
                        users.push(user)
                    })
                    return { data: users }

                } catch (e) {
                    return { error: e.message }
                }
            },
            providesTags: ['users']
        }),
        createUser: builder.mutation({
            async queryFn(user) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)
                    const q = collection(db, "users");
                    await addDoc(q, userConverter.toFirestore(user))
                    return { data: { user: user.user_id} }
                } catch (e) {
                    return { error: e.message }
                }
            },
            // invalidatesTags: ['users']
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
export const users_query = usersQuery.reducer
export const {
    useGetSystemUsersQuery,
    useCreateUserMutation,
} = usersQuery
