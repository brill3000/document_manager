import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { db } from '../../firebase-config';
import { getDocs, collection, query, Timestamp, doc, getDoc, runTransaction } from 'firebase/firestore';
import { getAuth, deleteUser } from 'firebase/auth';

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

class User {
    constructor(
        user_id,
        user_name,
        first_name,
        last_name,
        registration_date,
        deregistration_date,
        departments,
        company,
        is_admin,
        is_logged_in,
        logs_id,
        position
    ) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.first_name = first_name;
        this.last_name = last_name;
        this.registration_date = new Date(registration_date.seconds).toLocaleString();
        this.deregistration_date = new Date(deregistration_date.seconds).toLocaleString();
        this.departments = departments;
        this.position = position;
        this.company = company;
        this.is_admin = is_admin;
        this.is_logged_in = is_logged_in;
        this.logs_id = logs_id;
    }
    toString() {
        return (
            this.user_id +
            ', ' +
            this.user_name +
            ', ' +
            this.first_name +
            ', ' +
            this.last_name +
            ', ' +
            this.registration_date +
            ', ' +
            this.deregistration_date +
            ', ' +
            this.locked +
            ', ' +
            this.company +
            ', ' +
            this.is_admin +
            ', ' +
            this.blocked +
            ', ' +
            this.logs_id
        );
    }
}

// Firestore data converter
const userConverter = {
    toFirestore: (user) => {
        return {
            user_id: user.user_id,
            name: {
                first_name: user.name.first_name,
                last_name: user.name.last_name
            },
            email: user.email,
            registration_date: Timestamp.fromDate(new Date()),
            deregistration_date: null,
            position: user.position ?? 'Guest',
            is_admin: user.is_admin ?? true,
            is_logged_in: user.is_logged_in ?? false,
            departments: user.departments ?? null,
            company: user.company,
            blocked: user.blocked ?? true
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(
            data.id,
            data.user_name,
            data.first_name,
            data.last_name,
            data.registration_date,
            data.deregistration_date,
            data.departments,
            data.company,
            data.is_admin,
            data.is_logged_in,
            data.logs_id,
            data.position
        );
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
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);
                    let users = [];
                    const q = query(collection(db, 'users'));

                    const querySnapshot = await getDocs(q);
                    querySnapshot?.forEach((data) => {
                        let userData = { ...data.data() };
                        let userDataOmited = omit(userData, ['registration_date', 'deregistration_date']);
                        const user = {
                            registration_date: data.data().registration_date
                                ? new Date(data.data().registration_date.seconds * 1000).toLocaleString()
                                : null,
                            deregistration_date: data.data().deregistration_date
                                ? new Date(data.data().deregistration_date.seconds * 1000).toLocaleString()
                                : null,
                            ...userDataOmited
                        };
                        users.push(user);
                    });
                    return { data: users };
                } catch (e) {
                    return { error: e.message };
                }
            },
            providesTags: ['users']
        }),
        createUser: builder.mutation({
            async queryFn(user) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);

                    await runTransaction(db, async (transaction) => {
                        const q = doc(db, 'users', user.user_id);
                        const countRef = doc(db, 'system_summary', 'user_count');
                        const countDoc = await transaction.get(countRef);

                        const setVal = transaction.set(q, userConverter.toFirestore(user));
                        const data = {
                            document_count: 0,
                            last_update: Timestamp.fromDate(new Date()),
                            weekly: {
                                0: 0,
                                1: 0,
                                2: 0,
                                3: 0,
                                4: 0,
                                5: 0,
                                6: 0
                            },
                            monthly: {
                                0: 0,
                                1: 0,
                                2: 0,
                                3: 0,
                                4: 0,
                                5: 0,
                                6: 0,
                                7: 0,
                                8: 0,
                                9: 0,
                                10: 0,
                                11: 0
                            }
                        };
                        transaction.set(doc(db, 'user_summary', user.user_id), data);
                        transaction.update(countRef, { users: countDoc.data().users + 1 });
                    });

                    return { data: { user: user.user_id } };
                } catch (e) {
                    const auth = getAuth();
                    const user = auth.currentUser;

                    await deleteUser(user);

                    return { error: e.message };
                }
            }
        }),
        getUsersSummary: builder.query({
            async queryFn(user) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);
                    const summaryRef = doc(db, 'user_summary', user);
                    const countRef = doc(db, 'system_summary', 'user_count');
                    const docSnap = await getDoc(summaryRef);
                    const countDoc = await getDoc(countRef);
                    let summaryData = { ...docSnap.data(), users_count: countDoc.data().users };
                    summaryData.last_update = new Date(summaryData.last_update.seconds * 1000).toString();
                    return { data: summaryData };
                } catch (e) {
                    return { error: e.message };
                }
            }
        })
    })
});
export const users_query = usersQuery.reducer;
export const { useGetSystemUsersQuery, useCreateUserMutation, useGetUsersSummaryQuery } = usersQuery;
