import { FullTagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi } from '@reduxjs/toolkit/query/react';
import { SearchResultsInterface } from 'global/interfaces';
import { UriHelper } from 'utils/constants/UriHelper';
import { axiosBaseQuery } from 'utils/hooks';
type UserTags = 'DMS_SEARCH' | 'DMS_SEARCH_SUCCESS' | 'DMS_SEARCH_ERROR';

export const searchApi = createApi({
    reducerPath: 'search_api',
    baseQuery: axiosBaseQuery({
        baseUrl: UriHelper.HOST
    }),
    tagTypes: ['DMS_SEARCH', 'DMS_SEARCH_SUCCESS', 'DMS_SEARCH_ERROR'],
    endpoints: (build) => ({
        // ===========================| GETTERS |===================== //
        findByContent: build.query<SearchResultsInterface, { content: string }>({
            query: ({ content }) => ({ url: `${UriHelper.SEARCH_FIND_BY_CONTENT}`, method: 'GET', params: { content } }),
            providesTags: (result: any, error: any): FullTagDescription<UserTags>[] => {
                const tags: FullTagDescription<UserTags>[] = [{ type: 'DMS_SEARCH' }];
                if (result) return [...tags, { type: 'DMS_SEARCH_SUCCESS', id: 'success' }];
                if (error) return [...tags, { type: 'DMS_SEARCH_ERROR', id: 'error' }];
                return tags;
            }
        })
        // ===========================| MUTATIIONS: POST |===================== //
        // -------------------------------| MUTATIONS: PUT|-------------------------------- //
        // -------------------------------| MUTATIONS: DELETE|-------------------------------- //
    })
});

export const search_api = searchApi.reducer;
export const {
    /**
     * Getters
     */
    useLazyFindByContentQuery
    /**
     * Mutations: POST
     */
    /**
     * Mutations: PUT
     */
    /**
     * Mutations: DELETE
     */
} = searchApi;
