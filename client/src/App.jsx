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
import Rapports from './pages/admin/Rapports';
import AbsenceRegistry from './pages/admin/AbsenceRegistry';
import StudentProfile from './pages/admin/StudentProfile';
import Filiere from './pages/admin/Filiere';
import Salles from './pages/admin/Salles';
import Divisions from './pages/formateur/Divisions';
import Profile from './pages/Profile';
import ForceUpdatePassword from './pages/formateur/ForceUpdatePassword';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading, skipPasswordUpdate } = useAuth();

    if (loading) return <div className="flex items-center justify-center h-screen bg-[var(--background)] text-[var(--text)]">Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    // Force password update on first login for formateurs, unless they skipped for this session
    if (user.role === 'formateur' && user.first_login && !skipPasswordUpdate && window.location.pathname !== '/formateur/force-update-password') {
        return <Navigate to="/formateur/force-update-password" />;
    }

    return children;
};

const RootRedirect = () => {
    const { user, skipPasswordUpdate } = useAuth();
    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
        case 'admin': return <Navigate to="/admin" />;
        case 'formateur': 
            return (user.first_login && !skipPasswordUpdate)
                ? <Navigate to="/formateur/force-update-password" /> 
                : <Navigate to="/formateur" />;
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
                        
                        <Route path="/admin/student/:id" element={
                            <ProtectedRoute roles={['admin', 'formateur']}>
                                <DashboardLayout>
                                    <StudentProfile />
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />

                        {/* Admin Routes */}
                        <Route path="/admin/*" element={
                            <ProtectedRoute roles={['admin']}>
                                <DashboardLayout>
                                    <Routes>
                                        <Route index element={<AdminDashboard />} />
                                        <Route path="users" element={<Accounts />} />
                                        <Route path="groups" element={<Squadrons />} />
                                        <Route path="reports" element={<Rapports />} />
                                        <Route path="absence-registry" element={<AbsenceRegistry />} />
                                        <Route path="filieres" element={<Filiere />} />
                                        <Route path="salles" element={<Salles />} />
                                        <Route path="profile" element={<Profile />} />
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
                                        <Route path="groups" element={<Divisions />} />
                                        <Route path="profile" element={<Profile />} />
                                        <Route path="force-update-password" element={<ForceUpdatePassword />} />
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
