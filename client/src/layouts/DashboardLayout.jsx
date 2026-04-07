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
    Sun,
    Moon,
    FileText,
    ChevronRight,
    ChevronLeft,
    Menu,
    X,
    Languages,
    Key,
    Layers,
    UserCheck,
    Globe,
    Settings,
    ClipboardCheck,
    Gavel,
    User,
    MapPin
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import NotificationPanel from '../components/NotificationPanel';
import ofpptLogo from '../assets/OFPPT.png';

const DashboardLayout = ({ children }) => {
    const { user, logout, skipPasswordUpdate } = useAuth();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
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

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsNotifOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.dir = isRtl ? 'rtl' : 'ltr';
    }, [isRtl]);

    const toggleLanguage = () => {
        const nextLng = i18n.language === 'fr' ? 'ar' : 'fr';
        i18n.changeLanguage(nextLng);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const getSidebarLinks = () => {
        // If it's first login and they haven't explicitly skipped for this session, hide all nav links
        if (user?.first_login && !skipPasswordUpdate) {
            return [];
        }

        switch (user?.role) {
            case 'admin':
                return [
                    { icon: LayoutDashboard, label: t('nav.dashboard'), path: '/admin' },
                    { icon: Key, label: t('nav.members'), path: '/admin/users' },
                    { icon: Layers, label: t('nav.filieres_nav'), path: '/admin/filieres' },
                    { icon: MapPin, label: t('nav.salles_nav'), path: '/admin/salles' },
                    { icon: Layers, label: t('nav.groups'), path: '/admin/groups' },
                    { icon: FileText, label: t('nav.reports'), path: '/admin/reports' },
                    { icon: ClipboardCheck, label: 'ABSENCES', path: '/admin/absence-registry' },
                    { icon: User, label: 'MON PROFIL', path: '/admin/profile' },
                ];
            case 'formateur':
                const formateurLinks = [
                    { icon: LayoutDashboard, label: t('nav.dashboard'), path: '/formateur' },
                    { icon: UserCheck, label: t('nav.my_groups'), path: '/formateur/groups' },
                    { icon: User, label: 'MON PROFIL', path: '/formateur/profile' }
                ];
                return formateurLinks;
            default:
                return [];
        }
    };

    const links = getSidebarLinks();

    return (
        <div className={`flex bg-[var(--background)] min-h-screen text-[var(--text)] transition-all duration-300 ${isRtl ? 'font-arabic' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <aside className={`
                    fixed top-0 h-screen transition-all duration-300 z-50 bg-white dark:bg-[var(--surface)] border-[var(--border)]
                    flex flex-col
                    ${isRtl ? 'right-0 border-l' : 'left-0 border-r'}
                    ${isMobileMenuOpen ? 'w-64 translate-x-0 shadow-2xl' : `w-0 ${isRtl ? 'translate-x-full' : '-translate-x-full'} lg:translate-x-0 lg:w-20 xl:w-64`}
                    overflow-hidden
                `}>
                <div className="p-4 xl:p-8 flex flex-col items-center">
                    <div className={`flex items-center justify-between w-full lg:justify-center mb-8 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                        <img src={ofpptLogo} alt="OFPPT" className="h-10 xl:h-16" />
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 hover:bg-slate-100 rounded-xl lg:hidden text-slate-400"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="text-center hidden xl:block animate-in fade-in zoom-in duration-500">
                        <h2 className="text-xl font-bold tracking-tight text-[var(--secondary)]">{t('nav.portal')}</h2>
                        <p className="text-[9px] text-[var(--primary)] uppercase tracking-widest mt-1 font-black">{t('nav.digital_campus')}</p>
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
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${isRtl ? 'flex-row-reverse' : ''} ${isActive
                                        ? 'bg-[var(--primary)] text-white shadow-lg shadow-green-900/10'
                                        : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--primary)]'
                                        }`}
                                    title={link.label}
                                >
                                    <link.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:text-[var(--primary)]'}`} />
                                    <span className={`text-[11px] font-black uppercase tracking-widest flex-1 truncate ${isRtl ? 'text-right' : ''} ${isMobileMenuOpen ? 'block' : 'hidden xl:block'}`}>{link.label}</span>
                                    {isActive && (isRtl ? <ChevronLeft className={`w-3 h-3 text-white/50 ${isMobileMenuOpen ? 'block' : 'hidden xl:block'}`} /> : <ChevronRight className={`w-3 h-3 text-white/50 ${isMobileMenuOpen ? 'block' : 'hidden xl:block'}`} />)}
                                </Link>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-[var(--text-muted)] hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all mt-auto mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}
                        title={t('nav.logout')}
                    >
                        <LogOut className={`w-5 h-5 flex-shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
                        <span className={`text-[11px] font-black uppercase tracking-widest flex-1 truncate ${isRtl ? 'text-right' : ''} ${isMobileMenuOpen ? 'block' : 'hidden xl:block'}`}>{t('nav.logout')}</span>
                    </button>
                </nav>
            </aside>

            <main className={`flex-1 min-h-screen relative min-w-0 transition-all duration-300 ${isRtl ? 'lg:mr-20 xl:mr-64' : 'lg:ml-20 xl:ml-64'}`}>
                <header className={`h-20 flex items-center justify-between px-4 lg:px-10 bg-white/80 dark:bg-[var(--surface)]/80 backdrop-blur-md sticky top-0 z-40 border-b border-[var(--border)] transition-all duration-300 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2.5 hover:bg-[var(--surface-hover)] rounded-xl lg:hidden text-[var(--secondary)]"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                            <Link to={user?.role === 'admin' ? '/admin/profile' : '/formateur/profile'} className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center text-white font-bold text-xs lg:text-sm shadow-md">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="hidden sm:block">
                                    <h3 className="text-[10px] lg:text-[11px] font-black tracking-widest text-[var(--secondary)] uppercase leading-none mb-1">{user?.name}</h3>
                                    <p className="text-[8px] lg:text-[9px] text-[var(--primary)] uppercase tracking-[0.2em] font-black opacity-70">{user?.role === 'admin' ? t('header.admin_access') : t('header.formateur_access')}</p>
                                </div>
                            </Link>
                    </div>

                    <div className={`flex items-center gap-2 lg:gap-3 relative ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <button
                            onClick={toggleTheme}
                            className="p-2 lg:p-2.5 rounded-xl bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-all focus:outline-none"
                            title={t('header.theme_toggle')}
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

                        <button
                            onClick={toggleLanguage}
                            className="p-2 lg:p-2.5 rounded-xl bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-all flex items-center gap-2"
                            title={i18n.language === 'fr' ? 'العربية' : 'Français'}
                        >
                            <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{i18n.language === 'fr' ? 'AR' : 'FR'}</span>
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
