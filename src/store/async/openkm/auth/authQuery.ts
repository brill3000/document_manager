import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Post {
    id: number;
    name: string;
}

const api = createApi({
    reducerPath: 'auth_query',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: (build) => ({
        getPost: build.query<Post, number>({
            queryFn: (arg, queryApi, extraOptions, baseQuery) => {
                if (arg <= 0) {
                    return {
                        error: {
                            status: 500,
                            statusText: 'Internal Server Error',
                            data: 'Invalid ID provided.'
                        }
                    };
                }
                const post: Post = {
                    id: arg,
                    name: 'Brilliant'
                };
                return { data: post };
            }
        })
    })
});
