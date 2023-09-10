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

function Routing() {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
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
            <Route path="dashboard/createPlan" element={<CreatePlan />} />
            <Route path="template" element={<Template />} />
            <Route path="templates" element={<Templates />} />
            <Route path="resources" element={<Resources />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default Routing;
