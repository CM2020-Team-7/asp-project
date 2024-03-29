import apiSlice from '@/app/api/apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({
                url: '/auth',
                method: 'POST',
                body,
                credentials: 'include',
            }),
        }),
        register: builder.mutation({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'GET',
            }),
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/refresh',
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
            }),
        }),

    }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
    userApiSlice;
