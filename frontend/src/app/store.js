import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/features/counter/counterSlice';
import userReducer from '@/features/user/userSlice';
import learningPlanReducer from '@/features/learningPlan/learningPlanSlice';
import moduleReducer from '@/features/module/moduleSlice';
import apiSlice from './api/apiSlice';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        counter: counterReducer,
        user: userReducer,
        learningPlan: learningPlanReducer,
        module: moduleReducer,
    },
    middleware: (getdefaultMiddleware) =>
        getdefaultMiddleware().concat(apiSlice.middleware),
    devTools: false,
});

export default store;
