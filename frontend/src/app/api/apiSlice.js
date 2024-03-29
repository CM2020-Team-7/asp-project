import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { setCredentials, logOut } from '../../features/user/userSlice';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8000',
    prepareHeaders: (headers, { getState }) => {
        const token = getCookie('jwt_token');

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // if (result?.error?.status === 401) {
    //     const refreshResult = await baseQuery('/refresh', api, extraOptions);
    //     if (refreshResult?.data) {
    //         const { user } = api.getState().auth;
    //         api.dispatch(setCredentials({ user, ...refreshResult.data }));
    //         result = await baseQuery(args, api, extraOptions);
    //     } else {
    //         api.dispatch(logOut());
    //     }
    // }

    return result;
};

const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
});

export default apiSlice;
