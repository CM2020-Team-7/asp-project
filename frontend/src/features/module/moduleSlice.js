import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userModules: [],
    selectedModule: null,
};

export const moduleSlice = createSlice({
    name: 'module',
    initialState,
    reducers: {
        setModules: (state, action) => {
            state.userModules = action.payload.UserModules;
        },
        setSelectedModule: (state, action) => {
            state.selectedModule = action.payload.Module;
        },
    },
});

export const { setModules, setSelectedModule } = moduleSlice.actions;

export const selectModules = (state) => state.module.userModules;
export const selectSelectedModule = (state) => state.module.selectedModule;

export default moduleSlice.reducer;
