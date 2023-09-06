import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi } from '@reduxjs/toolkit/query/react';
import { IWorkflowRequest, IProcessDefinitionForm, IProcessDefinition, IRunWorkflowRequest } from 'global/interfaces';
import { UriHelper } from 'utils/constants/UriHelper';
import { axiosBaseQuery } from 'utils/hooks';
type UserTags = 'DMS_WORKFLOW' | 'DMS_WORKFLOW_SUCCESS' | 'DMS_WORKFLOW_ERROR';

export const workflowApi = createApi({
    reducerPath: 'workflow_api',
    baseQuery: axiosBaseQuery({
        baseUrl: UriHelper.HOST
    }),
    tagTypes: [
        'DMS_WORKFLOW',
        'DMS_WORKFLOW_SUCCESS',
        'DMS_WORKFLOW_ERROR',
        'DMS_WORKFLOW_INFO',
        'DMS_WORKFLOW_INFO_SUCCESS',
        'DMS_WORKFLOW_INFO_ERROR'
    ],
    endpoints: (build) => ({
        // ===========================| GETTERS |===================== //
        getProcessDefinition: build.query<IProcessDefinition, IWorkflowRequest>({
            query: ({ pdId }) => ({ url: `${UriHelper.WORKFLOW_GET_PROCESS_DEFINITION}`, method: 'GET', params: { pdId } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_WORKFLOW' }];
                if (result) return [...tags, { type: 'DMS_WORKFLOW_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_WORKFLOW_ERROR', id: 'error' }];
                return tags;
            }
        }),
        findAllProcessDefinitions: build.query<{ processDefinitions: IProcessDefinition[] }, void>({
            query: () => ({ url: `${UriHelper.WORKFLOW_FIND_ALL_PROCESS_DEFINITIONS}`, method: 'GET' }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_WORKFLOW' }];
                if (result) return [...tags, { type: 'DMS_WORKFLOW_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_WORKFLOW_ERROR', id: 'error' }];
                return tags;
            }
        }),
        findTaskInstances: build.query<any, { piId: string }>({
            query: ({ piId }) => ({ url: `${UriHelper.WORKFLOW_FIND_TASK_INSTANCES}`, method: 'GET', params: { piId } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_WORKFLOW' }];
                if (result) return [...tags, { type: 'DMS_WORKFLOW_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_WORKFLOW_ERROR', id: 'error' }];
                return tags;
            }
        }),
        getProcessDefinitionForms: build.query<IProcessDefinitionForm, IWorkflowRequest>({
            query: ({ pdId }) => ({ url: `${UriHelper.WORKFLOW_GET_PROCESS_DEFINITION_FORMS}`, method: 'GET', params: { pdId } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_WORKFLOW' }];
                if (result) return [...tags, { type: 'DMS_WORKFLOW_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_WORKFLOW_ERROR', id: 'error' }];
                return tags;
            }
        }),
        // -------------------------------| MUTATIONS: PUT|-------------------------------- //
        runProcessDefinition: build.mutation<any, IRunWorkflowRequest>({
            query: ({ pdId, uuid, values }) => ({
                url: UriHelper.WORKFLOW_RUN_PROCESS_DEFINITION,
                method: 'PUT',
                params: { pdId, uuid },
                data: { values }
            }),
            invalidatesTags: ['DMS_WORKFLOW']
        }),
        startTaskInstance: build.mutation<any, { tiId: string }>({
            query: ({ tiId }) => ({
                url: UriHelper.WORKFLOW_START_TASKINSTANCE,
                method: 'PUT',
                params: { tiId }
            }),
            invalidatesTags: ['DMS_WORKFLOW']
        })
        // -------------------------------| MUTATIONS: DELETE|-------------------------------- //
    })
});

export const workflow_api = workflowApi.reducer;
export const {
    /**
     * Getters
     */
    useLazyGetProcessDefinitionQuery,
    useLazyGetProcessDefinitionFormsQuery,
    useLazyFindAllProcessDefinitionsQuery,
    useLazyFindTaskInstancesQuery,
    /**
     * Lazy Getters
     */
    /**
     * Mutations: POST
     */
    /**
     * Mutations: PUT
     */
    useRunProcessDefinitionMutation,
    useStartTaskInstanceMutation
    /**
     * Mutations: DELETE
     */
} = workflowApi;
