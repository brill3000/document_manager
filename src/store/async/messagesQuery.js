import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import { db } from "../../firebase-config"
import { getDocs, collection, query, where, Timestamp, doc, addDoc, deleteDoc, updateDoc, orderBy, limit } from "firebase/firestore"
import uuid from "react-uuid"

class Message {
    constructor(
        id,
        from,
        to,
        time_sent,
        message,
        files
    ) {
        this.messageId = id;
        this.from = from;
        this.to = to;
        this.time_sent = new Date(time_sent.seconds * 1000).toString()
        this.message = message;
        this.files = files;
    }
    getValues() {
        return {
            id: this.messageId,
            sender: this.from,
            receiver: this.to,
            time_sent: this.time_sent,
            message: this.message,
            files: this.files
        }
    }
    toString() {
        return this.from + ', ' + this.to + ', ' + this.time_sent + ', ' + this.message;
    }
}


// Firestore data converter
const messageConverter = {
    toFirestore: (message) => {
        let sent_file = {
            from: {
                id: message.from.id,
                name: message.from.name
            },
            to: {
                id: message.to.id,
                name: message.to.name
            },
            message: message.message,
            time_sent: Timestamp.fromDate(new Date()),

        }
        return sent_file;
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Message
            (
                data.from,
                data.to,
                data.time_sent,
                data.message,
                data.files
            );
    }
};



export const messageQuery = createApi({
    reducerPath: 'messages_query',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['messages'],
    endpoints: (builder) => ({
        getMessageByUser: builder.query({
            async queryFn(queryParams) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)
                    let messages = [];
                    if (queryParams.to && !queryParams.from) {
                        const q = query(collection(db, "messages"), where("to.id", "==", queryParams.to), orderBy('time_sent', "desc"), limit(10));
                        const querySnapshot = await getDocs(q);
                        querySnapshot?.forEach((data) => {
                            const message = new Message(uuid(), data.data().from, data.data().to, data.data().time_sent, data.data().message, data.data().files)
                            messages.push(message.getValues())
                        })
                    } else if (queryParams.from && !queryParams.to) {
                        const q = query(collection(db, "messages"), where("from.id", "==", queryParams.from), orderBy('time_sent', "desc"), limit(10));
                        const querySnapshot = await getDocs(q);
                        querySnapshot?.forEach((data) => {
                            const message = new Message(uuid(), data.data().from, data.data().to, data.data().time_sent, data.data().message, data.data().files)
                            messages.push(message.getValues())
                        })
                    } else if (queryParams.from && queryParams.to) {
                        const q = query(collection(db, "messages"), where("from.id", "==", queryParams.from), where("to.id", "==", queryParams.to), orderBy('time_sent', "desc"), limit(10));
                        const q2 = query(collection(db, "messages"), where("from.id", "==", queryParams.to), where("to.id", "==", queryParams.from), orderBy('time_sent', "desc"), limit(10));

                        const querySnapshot = await getDocs(q);
                        querySnapshot?.forEach((data) => {
                            const message = new Message(uuid(), data.data().from, data.data().to, data.data().time_sent, data.data().message, data.data().files)
                            messages.push(message.getValues())
                        })
                        const querySnapshot2 = await getDocs(q2);
                        querySnapshot2?.forEach((data) => {
                            const message = new Message(uuid(), data.data().from, data.data().to, data.data().time_sent, data.data().message, data.data().files)
                            messages.push(message.getValues())
                        })
                        messages = messages.sort((a, b) => {
                            a = new Date(a.time_sent);
                            b = new Date(b.time_sent);
                            return a > b ? -1 : a < b ? 1 : 0;
                        })
                    }

                    return { data: messages }

                } catch (e) {
                    return { error: e.message }
                }
            },
            providesTags: ['messages']
        }),
        sendMessage: builder.mutation({
            async queryFn(message) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)

                    const q = collection(db, "messages");
                    const { id } = await addDoc(q, messageConverter.toFirestore(message))

                    return { data: id }

                } catch (e) {
                    return { error: e.message }
                }

            },
            invalidatesTags: ['messages']
        }),
        refetchMessages: builder.mutation({
            async queryFn() {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`)

                    return { data: true }

                } catch (e) {
                    return { error: e.message }
                }

            },
            invalidatesTags: ['messages']
        }),
        // trashFolder: builder.mutation({
        //     async queryFn(file) {
        //         try {
        //             if (!navigator.onLine) throw new Error(`It seems that you are offline`)

        //             const data = {
        //                 trashed: true
        //             };

        //             const docRef = doc(db, "files", file.id);
        //             const response = await updateDoc(docRef, data)

        //             return { data: response }

        //         } catch (e) {
        //             return { error: e.message }
        //         }

        //     },
        //     // invalidatesTags: ['files']
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
        //     // invalidatesTags: ['files']
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
        //     // invalidatesTags: ['files']
        // })
    })
})
export const messages_query = messageQuery.reducer
export const {
    useGetMessageByUserQuery,
    useSendMessageMutation,
    useRefetchMessagesMutation
} = messageQuery
