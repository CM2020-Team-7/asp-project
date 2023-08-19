import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { useAuth } from '@/providers/AuthProvider';

function Routing() {
    const { isAuthenticated } = useAuth();
    return (
        <Routes>
            <Route
                path="/"
                element={
                    isAuthenticated ? <Navigate to="/dashboard" /> : <Home />
                }
            />
            <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Login />}
            />
            <Route path="/template/*" element={<Template />} />
            <Route path="/templates/*" element={<Templates />} />
            <Route path="/resources/*" element={<Resources />} />
            <Route path="/contact/*" element={<Contact />} />
            <Route path="/about/*" element={<About />} />
            <Route path="/login/*" element={<Login />} />
            <Route path="/register/*" element={<Register />} />
        </Routes>
    );
}

export default Routing;
