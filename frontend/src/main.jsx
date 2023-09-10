import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import React from 'react';
import store from './app/store';
import AppThemeProvider from './themes/AppThemeProvider';
import App from './App';
import './main.css';
import { CookiesProvider } from 'react-cookie';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <AppThemeProvider>
                    <CookiesProvider defaultSetCookies={{ path: '/' }}>
                        <App />
                    </CookiesProvider>
                </AppThemeProvider>
            </LocalizationProvider>
        </Provider>
    </React.StrictMode>,
);
