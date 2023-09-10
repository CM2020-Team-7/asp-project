import React from 'react';
import { Routes, Route, Navigate, useRoutes } from 'react-router-dom';
import {
    Template,
    Login,
    Register,
    Home,
    Dashboard,
    Resources,
    Contact,
    About,
    Templates,
} from '@/pages';
import CreatePlan from '@/pages/Dashboard/CreatePlan';
import { useSelector } from 'react-redux';
import LearningPlanFull from '@/pages/LearningPlanFull/LearningPlanFull';
import CreateModule from '@/pages/Dashboard/CreateModule';
import ModuleFull from '@/pages/ModuleFull/ModuleFull';

function Routing() {
    const token = useSelector((state) => state.user.token);
    const isAuthenticated = !!token;
    return (
        <Routes>
            <Route
                index
                element={
                    isAuthenticated ? <Navigate to="/dashboard" /> : <Home />
                }
            />
            <Route
                path="dashboard"
                element={isAuthenticated ? <Dashboard /> : <Login />}
            />
            <Route
                path="dashboard/createPlan"
                element={isAuthenticated ? <CreatePlan /> : <Login />}
            />
            <Route
                path="dashboard/createModule"
                element={isAuthenticated ? <CreateModule /> : <Login />}
            />
            <Route
                path="template"
                element={isAuthenticated ? <Template /> : <Login />}
            />
            <Route
                path="templates"
                element={isAuthenticated ? <Templates /> : <Login />}
            />
            <Route
                path="resources"
                element={isAuthenticated ? <Resources /> : <Login />}
            />
            <Route
                path="contact"
                element={isAuthenticated ? <Contact /> : <Login />}
            />
            <Route
                path="about"
                element={isAuthenticated ? <About /> : <Login />}
            />
            <Route
                path="plan/:planId"
                element={isAuthenticated ? <LearningPlanFull /> : <Login />}
            />
            <Route
                path="module/:moduleId"
                element={isAuthenticated ? <ModuleFull /> : <Login />}
            />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default Routing;
