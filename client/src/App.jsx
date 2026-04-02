import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages (to be created)
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/admin/Dashboard';
import FormateurDashboard from './pages/formateur/Dashboard';
import Scanner from './pages/Scanner';

// Admin Subpages
import Accounts from './pages/admin/Accounts';
import Squadrons from './pages/admin/Squadrons';
<<<<<<< HEAD
import Rapports from './pages/admin/Rapports';
import AbsenceRegistry from './pages/admin/AbsenceRegistry';
import Divisions from './pages/formateur/Divisions';
import Profile from './pages/formateur/Profile';
import ForceUpdatePassword from './pages/formateur/ForceUpdatePassword';
=======
import Timelines from './pages/admin/Timelines';
import Rapports from './pages/admin/Rapports';
import FormateurTimelines from './pages/formateur/Timelines';
import Divisions from './pages/formateur/Divisions';
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center h-screen bg-[var(--background)] text-[var(--text)]">Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />;
    }

<<<<<<< HEAD
    // Force password update on first login for formateurs
    if (user.role === 'formateur' && user.first_login && window.location.pathname !== '/formateur/force-update-password') {
        return <Navigate to="/formateur/force-update-password" />;
    }

=======
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
    return children;
};

const RootRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
        case 'admin': return <Navigate to="/admin" />;
<<<<<<< HEAD
        case 'formateur': 
            return user.first_login 
                ? <Navigate to="/formateur/force-update-password" /> 
                : <Navigate to="/formateur" />;
=======
        case 'formateur': return <Navigate to="/formateur" />;
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
        default: return <Navigate to="/login" />;
    }
};

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/scanner" element={<Scanner />} />

                        <Route path="/" element={<ProtectedRoute><RootRedirect /></ProtectedRoute>} />

                        {/* Admin Routes */}
                        <Route path="/admin/*" element={
                            <ProtectedRoute roles={['admin']}>
                                <DashboardLayout>
                                    <Routes>
                                        <Route index element={<AdminDashboard />} />
                                        <Route path="users" element={<Accounts />} />
                                        <Route path="classes" element={<Squadrons />} />
<<<<<<< HEAD
                                        <Route path="reports" element={<Rapports />} />
                                        <Route path="absence-registry" element={<AbsenceRegistry />} />
=======
                                        <Route path="timetable" element={<Timelines />} />
                                        <Route path="reports" element={<Rapports />} />
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
                                    </Routes>
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />

                        {/* Formateur Routes */}
                        <Route path="/formateur/*" element={
                            <ProtectedRoute roles={['formateur']}>
                                <DashboardLayout>
                                    <Routes>
                                        <Route index element={<FormateurDashboard />} />
<<<<<<< HEAD
                                        <Route path="classes" element={<Divisions />} />
                                        <Route path="profile" element={<Profile />} />
                                        <Route path="force-update-password" element={<ForceUpdatePassword />} />
=======
                                        <Route path="timetable" element={<FormateurTimelines />} />
                                        <Route path="classes" element={<Divisions />} />
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
                                    </Routes>
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />

                        {/* Redirect unknown routes */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
