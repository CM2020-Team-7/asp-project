import apiSlice from '@/app/api/apiSlice';

export const learningPlanApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPlan: builder.mutation({
            query: (body) => ({
                url: '/content/plans',
                method: 'POST',
                body,
            }),
        }),
        editPlan: builder.mutation({
            query: (body) => ({
                url: '/content/plans',
                method: 'PUT',
                body,
            }),
        }),
        getPlans: builder.mutation({
            query: () => ({
                url: '/content/plans',
                method: 'GET',
            }),
        }),
        getPlanById: builder.mutation({
            query: (planId) => ({
                url: `/content/plans/${planId}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useCreatePlanMutation, useGetPlansMutation } =
    learningPlanApiSlice;
