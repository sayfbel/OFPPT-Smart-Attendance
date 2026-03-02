import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages (to be created)
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/admin/Dashboard';
import FormateurDashboard from './pages/formateur/Dashboard';
import StagiaireDashboard from './pages/stagiaire/Dashboard';
import Scanner from './pages/Scanner';

// Admin Subpages
import Accounts from './pages/admin/Accounts';
import Squadrons from './pages/admin/Squadrons';
import Timelines from './pages/admin/Timelines';
import Rapports from './pages/admin/Rapports';
import FormateurTimelines from './pages/formateur/Timelines';
import Divisions from './pages/formateur/Divisions';
import StagiaireProfile from './pages/stagiaire/Profile';
import StagiaireTimelines from './pages/stagiaire/Timelines';
import StagiaireAbsence from './pages/stagiaire/Absence';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center h-screen bg-black">Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

const RootRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
        case 'admin': return <Navigate to="/admin" />;
        case 'formateur': return <Navigate to="/formateur" />;
        case 'stagiaire': return <Navigate to="/stagiaire" />;
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
                                        <Route path="timetable" element={<Timelines />} />
                                        <Route path="reports" element={<Rapports />} />
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
                                        <Route path="timetable" element={<FormateurTimelines />} />
                                        <Route path="classes" element={<Divisions />} />
                                    </Routes>
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />

                        {/* Stagiaire Routes */}
                        <Route path="/stagiaire/*" element={
                            <ProtectedRoute roles={['stagiaire']}>
                                <DashboardLayout>
                                    <Routes>
                                        <Route index element={<StagiaireDashboard />} />
                                        <Route path="profile" element={<StagiaireProfile />} />
                                        <Route path="timetable" element={<StagiaireTimelines />} />
                                        <Route path="absences" element={<StagiaireAbsence />} />
                                    </Routes>
                                </DashboardLayout>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
