import apiSlice from '@/app/api/apiSlice';

export const moduleApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createModule: builder.mutation({
            query: (body) => ({
                url: '/content/modules',
                method: 'POST',
                body,
            }),
        }),
        getModules: builder.mutation({
            query: () => ({
                url: '/content/modules',
                method: 'GET',
            }),
        }),
        getModuleById: builder.mutation({
            query: (moduleId) => ({
                url: `/content/modules/${moduleId}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useCreateModuleMutation,
    useGetModulesMutation,
    useGetModuleByIdMutation,
} = moduleApiSlice;
