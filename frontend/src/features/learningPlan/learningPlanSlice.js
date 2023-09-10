import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userPlans: [],
    selectedPlan: null,
};

export const learningPlanSlice = createSlice({
    name: 'learningPlan',
    initialState,
    reducers: {
        setPlans: (state, action) => {
            state.userPlans = action.payload.UserPlans;
        },
        setSelectedPlan: (state, action) => {
            state.selectedPlan = action.payload.Plan;
        },
    },
});

export const { setPlans, setSelectedPlan } = learningPlanSlice.actions;

export const selectPlans = (state) => state.learningPlan.userPlans;
export const selectSelectedPlan = (state) => state.learningPlan.selectedPlan;

export default learningPlanSlice.reducer;
