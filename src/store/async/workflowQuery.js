import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { db } from '../../firebase-config';
import { getDocs, collection, query, where, Timestamp, doc, addDoc, deleteDoc, updateDoc, endAt } from 'firebase/firestore';

class Workflow {
    constructor(id, title, created_by, date_created, date_modified, nodes, edges, viewport) {
        this.id = id;
        this.created_by = created_by;
        this.title = title;
        this.date_created = new Date(date_created.seconds).toLocaleString();
        this.date_modified = date_modified ? new Date(date_modified.seconds).toLocaleString() : null;
        this.nodes = nodes;
        this.edges = edges;
        this.viewport = viewport;
    }
    toString() {
        return this.user_id + ', ';
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
        };
    }
}

// Firestore data converter
const workflowConverter = {
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
        return new Workflow(
            data.id,
            data.title,
            data.created_by,
            data.date_created,
            data.date_modified,
            data.nodes,
            data.edges,
            data.viewport
        );
    }
};
// Firestore data converter
const approvalConverter = {
    toFirestore: (approval) => {
        let obj = {};
        if (Array.isArray(approval.approvers)) {
            approval.approvers.forEach((x) => {
                obj[x.user_id] = {
                    name: x.name
                };
            });
        }
        return {
            created_by: approval.created_by,
            title: approval.title,
            date_created: Timestamp.fromDate(new Date()),
            approvers: obj
        };
    },
    fromFirestore: (snapshot) => {
        const data = snapshot.data();
        return new Workflow(
            data.id,
            data.title,
            data.created_by,
            data.date_created,
            data.date_modified,
            data.nodes,
            data.edges,
            data.viewport
        );
    }
};

export const workflowQuery = createApi({
    reducerPath: 'workflow_query',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['workflow'],
    endpoints: (builder) => ({
        getSavedWorkflows: builder.query({
            async queryFn() {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);
                    let users = [];
                    // const q = query(collection(db, "files"), where("parent", "==", parentId), orderBy("file_name"), endAt(50));
                    const q = query(collection(db, 'workflow'));

                    const querySnapshot = await getDocs(q);
                    querySnapshot?.forEach((data) => {
                        let userData = workflowConverter.fromFirestore(data);

                        users.push(userData.getWorkflow());
                    });
                    return { data: users };
                } catch (e) {
                    return { error: e.message };
                }
            },
            providesTags: ['workflow']
        }),
        createWorkflow: builder.mutation({
            async queryFn(workflow) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);
                    const q = collection(db, 'workflow');
                    await addDoc(q, workflowConverter.toFirestore(workflow));
                    return { data: true };
                } catch (e) {
                    return { error: e.message };
                }
            },
            invalidatesTags: ['workflow']
        }),
        createApprovalWorkflow: builder.mutation({
            async queryFn(workflow) {
                try {
                    if (!navigator.onLine) throw new Error(`It seems that you are offline`);
                    const q = collection(db, 'workflow');
                    const q2 = collection(db, 'approval');
                    let obj = {};
                    if (Array.isArray(workflow.approvers)) {
                        workflow.approvers.forEach((x) => {
                            obj[x.user_id] = {
                                read: true,
                                approve: true,
                                edit: false
                            };
                        });
                    }
                    const data = {
                        user_access: obj
                    };

                    const docRef = doc(db, 'files', workflow.file_id);
                    await addDoc(q, workflowConverter.toFirestore(workflow));
                    await addDoc(q2, approvalConverter.toFirestore(workflow));
                    await updateDoc(docRef, data);

                    return { data: true };
                } catch (e) {
                    return { error: e.message };
                }
            },
            invalidatesTags: ['workflow']
        })
    })
});
export const workflow_query = workflowQuery.reducer;
export const { useCreateWorkflowMutation, useCreateApprovalWorkflowMutation, useGetSavedWorkflowsQuery } = workflowQuery;
