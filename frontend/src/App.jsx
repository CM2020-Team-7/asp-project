import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Routing from './routes/Routing';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';


function App() {
    return (
        <BrowserRouter>
            <CssBaseline />
            <Navbar />
            <Routing />
            <Footer />
        </BrowserRouter>
    );
}

export default App;
