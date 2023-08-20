import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Routing from './routes/Routing';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './providers/AuthProvider';

function App() {
    return (
        <BrowserRouter>
            <CssBaseline />
            <AuthProvider>
                <Navbar />
                <Routing />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
