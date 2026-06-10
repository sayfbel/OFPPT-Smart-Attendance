import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, NotificationProvider } from './contexts';
import AppRoutes from './routes/AppRoutes';

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <AppRoutes />
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
