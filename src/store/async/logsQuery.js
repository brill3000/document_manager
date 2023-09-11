import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { db } from '../../firebase-config';
import { getDocs, collection, query, where, orderBy, limit } from 'firebase/firestore';

// class Log {
//     constructor(
//         created_by,
//         created_by_name,
//         date_created,
//         folder_name,
//         log_category,
//         log_description,
//         log_type
//     ) {
//         this.created_by = created_by;
//         this.date_created = new Date(date_created.seconds).toDateString()
//     }
//     toString() {
//         return this.created_by + ', ' + this.date_created + ', '
//     }
// }

// Firestore data converter
// const logConverter = {
//     fromFirestore: (snapshot, options) => {
//         const data = snapshot.data(options);
//         return new Log
//             (
//                 data.created_by,
//                 data.created_by_name,
//                 data.date_created,
//                 data.folder_name,
//                 data.log_category,
//                 data.log_description,
//                 data.log_type
//             );
//     }
// };

export const logsQuery = createApi({
    reducerPath: 'logs_query',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['logs'],
    endpoints: (builder) => ({
        getAllRecentLogs: builder.query({
            async queryFn(queryParams) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);
                    let logs = [];
                    // const q = query(collection(db, "files"), where("parent", "==", parentId), orderBy("file_name"), endAt(50));
                    const q = query(
                        collection(db, 'logs'),
                        where('created_by', '==', queryParams.user),
                        orderBy('date_created', 'desc'),
                        limit(3)
                    );
                    const querySnapshot = await getDocs(q);
                    querySnapshot?.forEach((data) => {
                        let fileData = { ...data.data() };
                        fileData.date_created = new Date(fileData.date_created.seconds * 1000).toString();
                        logs.push(fileData);
                    });
                    return { data: logs };
                } catch (e) {
                    return { error: e.message };
                }
            }
        }),
        getAllRecentlyModifiedDocuments: builder.query({
            async queryFn(queryParams) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);
                    let logs = [];
                    // const q = query(collection(db, "files"), where("parent", "==", parentId), orderBy("file_name"), endAt(50));
                    const q = query(
                        collection(db, 'logs'),
                        where('created_by', '==', queryParams.user),
                        where('file_modified', '==', true),
                        orderBy('date_created', 'desc'),
                        limit(5)
                    );
                    const querySnapshot = await getDocs(q);
                    querySnapshot?.forEach((data) => {
                        let fileData = { ...data.data() };
                        fileData.date_created = new Date(fileData.date_created.seconds * 1000).toString();
                        logs.push(fileData);
                    });
                    return { data: logs };
                } catch (e) {
                    return { error: e.message };
                }
            }
        })
    })
});
export const logs_query = logsQuery.reducer;
export const { useGetAllRecentLogsQuery, useGetAllRecentlyModifiedDocumentsQuery } = logsQuery;
