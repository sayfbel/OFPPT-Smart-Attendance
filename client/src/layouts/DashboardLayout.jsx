import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Calendar,
    LogOut,
    Bell,
    Settings,
    Sun,
    Moon,
    FileText,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import axios from 'axios';
import NotificationPanel from '../components/NotificationPanel';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDark, setIsDark] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await axios.get('/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Format time for the UI
            const formatted = res.data.notifications.map(n => {
                const date = new Date(n.created_at);
                const now = new Date();
                const diffMs = now - date;
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMins / 60);

                let timeStr = 'A L\'INSTANT';
                if (diffHours > 24) timeStr = date.toLocaleDateString();
                else if (diffHours > 0) timeStr = `IL Y A ${diffHours}H`;
                else if (diffMins > 0) timeStr = `IL Y A ${diffMins}M`;

                return {
                    id: n.id,
                    type: n.type,
                    category: n.category,
                    title: n.title,
                    message: n.message,
                    time: timeStr,
                    read: n.is_read
                };
            });
            setNotifications(formatted);
        } catch (err) {
            console.error("FETCH NOTIF ERROR:", err);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error("MARK READ ERROR:", err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/notifications/read-all', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error("MARK ALL READ ERROR:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 5 minutes
        const interval = setInterval(fetchNotifications, 300000);
        return () => clearInterval(interval);
    }, [location.pathname]);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsNotifOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const getSidebarLinks = () => {
        switch (user?.role) {
            case 'admin':
                return [
                    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/admin' },
                    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
                    { icon: BookOpen, label: 'Groupes', path: '/admin/classes' },
                    { icon: Calendar, label: 'Emploi du temps', path: '/admin/timetable' },
                    { icon: FileText, label: 'Rapports', path: '/admin/reports' },
                ];
            case 'formateur':
                return [
                    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/formateur' },
                    { icon: BookOpen, label: 'Mes Groupes', path: '/formateur/classes' },
                    { icon: Calendar, label: 'Emploi du temps', path: '/formateur/timetable' },
                ];
            default:
                return [];
        }
    };

    const links = getSidebarLinks();

    return (
        <div className="flex bg-[var(--background)] min-h-screen text-[var(--text)] transition-all duration-300">
            {/* Sidebar Overlay (Mobile) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 h-screen transition-all duration-300 z-50 bg-white dark:bg-[var(--surface)] border-r border-[var(--border)]
                flex flex-col
                ${isMobileMenuOpen ? 'w-64 translate-x-0 shadow-2xl' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-20 xl:w-64'}
                overflow-hidden
            `}>
                <div className="p-4 xl:p-8 flex flex-col items-center">
                    <div className="flex items-center justify-between w-full lg:justify-center mb-8">
                        <img src="/ofppt_logo.png" alt="OFPPT" className="h-10 xl:h-16" />
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 hover:bg-slate-100 rounded-xl lg:hidden text-slate-400"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="text-center hidden xl:block animate-in fade-in zoom-in duration-500">
                        <h2 className="text-xl font-bold tracking-tight text-[var(--secondary)]">ISTA_PORTAL</h2>
                        <p className="text-[9px] text-[var(--primary)] uppercase tracking-widest mt-1 font-black">Digital Campus</p>
                    </div>
                </div>

                <nav className="mt-4 px-3 xl:px-4 pb-12 flex-1 flex flex-col overflow-y-auto no-scrollbar">
                    <div className="space-y-2">
                        {links.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${isActive
                                        ? 'bg-[var(--primary)] text-white shadow-lg shadow-green-900/10'
                                        : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--primary)]'
                                        }`}
                                    title={link.label}
                                >
                                    <link.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:text-[var(--primary)]'}`} />
                                    <span className={`text-[11px] font-black uppercase tracking-widest flex-1 truncate ${isMobileMenuOpen ? 'block' : 'hidden xl:block'}`}>{link.label}</span>
                                    {isActive && <ChevronRight className={`w-3 h-3 text-white/50 ${isMobileMenuOpen ? 'block' : 'hidden xl:block'}`} />}
                                </Link>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-[var(--text-muted)] hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all mt-auto mb-4"
                        title="Déconnexion"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span className={`text-[11px] font-black uppercase tracking-widest ${isMobileMenuOpen ? 'block' : 'hidden xl:block'}`}>Déconnexion</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-h-screen relative min-w-0 transition-all duration-300 lg:ml-20 xl:ml-64">
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-4 lg:px-10 bg-white/80 dark:bg-[var(--surface)]/80 backdrop-blur-md sticky top-0 z-40 border-b border-[var(--border)] transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2.5 hover:bg-[var(--surface-hover)] rounded-xl lg:hidden text-[var(--secondary)]"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center text-white font-bold text-xs lg:text-sm shadow-md">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="hidden sm:block">
                                <h3 className="text-[10px] lg:text-[11px] font-black tracking-widest text-[var(--secondary)] uppercase leading-none mb-1">{user?.name}</h3>
                                <p className="text-[8px] lg:text-[9px] text-[var(--primary)] uppercase tracking-[0.2em] font-black opacity-70">{user?.role === 'admin' ? 'ADMIN ACCÈS' : 'FORMATEUR ACCÈS'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-3 relative">
                        <button
                            onClick={toggleTheme}
                            className="p-2 lg:p-2.5 rounded-xl bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-all focus:outline-none"
                            title="Changer le thème"
                        >
                            {isDark ? <Sun className="w-4 h-4 lg:w-5 lg:h-5" /> : <Moon className="w-4 h-4 lg:w-5 lg:h-5" />}
                        </button>
                        <div className="hidden lg:block w-[1px] h-6 bg-[var(--border)] mx-1 lg:mx-2"></div>

                        <div className="relative">
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className={`p-2 lg:p-2.5 rounded-xl transition-all relative group ${isNotifOpen ? 'bg-[var(--primary)] text-white shadow-lg' : 'bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
                            >
                                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full text-[8px] font-black flex items-center justify-center text-white p-[2px]">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            <NotificationPanel
                                isOpen={isNotifOpen}
                                onClose={() => setIsNotifOpen(false)}
                                notifications={notifications}
                                onMarkRead={handleMarkRead}
                                onMarkAllRead={handleMarkAllRead}
                            />
                        </div>

                        <button className="p-2 lg:p-2.5 rounded-xl bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-all">
                            <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
                        </button>
                    </div>
                </header>

                <div className="p-4 sm:p-6 lg:p-10 page-transition pb-20 sm:pb-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
