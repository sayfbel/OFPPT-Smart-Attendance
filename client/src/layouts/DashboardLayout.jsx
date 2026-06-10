import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, BookOpen, Calendar, LogOut, Bell, Sun, Moon, FileText,
    ChevronRight, ChevronLeft, Menu, X, Languages, Key, Layers, UserCheck, Globe,
    Settings, ClipboardCheck, Gavel, User, MapPin
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import NotificationPanel from '../components/UI/NotificationPanel';
import ofpptLogo from '../assets/OFPPT.png';
import './DashboardLayout.css';

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
            const res = await api.get('/notifications');
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
                    id: n.id, type: n.type, category: n.category, title: n.title,
                    message: n.message, time: timeStr, read: n.is_read
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
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error("MARK READ ERROR:", err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
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
        if (user?.first_login && !skipPasswordUpdate) return [];
        switch (user?.role) {
            case 'admin':
                return [
                    { icon: LayoutDashboard, label: t('nav.dashboard'), path: '/admin' },
                    { icon: Key, label: t('nav.members'), path: '/admin/users' },
                    { icon: Layers, label: t('nav.filieres_nav'), path: '/admin/filieres' },
                    { icon: MapPin, label: t('nav.salles_nav'), path: '/admin/salles' },
                    { icon: Layers, label: t('nav.groups'), path: '/admin/groups' },
                    { icon: FileText, label: t('nav.reports'), path: '/admin/reports' },
                    { icon: ClipboardCheck, label: t('nav.absence_registry'), path: '/admin/absence-registry' },
                    { icon: User, label: t('nav.profile'), path: '/admin/profile' },
                ];
            case 'formateur':
                return [
                    { icon: LayoutDashboard, label: t('nav.dashboard'), path: '/formateur' },
                    { icon: UserCheck, label: t('nav.my_groups'), path: '/formateur/groups' },
                    { icon: User, label: t('nav.profile'), path: '/formateur/profile' }
                ];
            default: return [];
        }
    };

    const links = getSidebarLinks();

    return (
        <div className={`dashboard-layout-root ${isRtl ? 'rtl-layout' : ''}`}>
            {isMobileMenuOpen && (
                <div className="mobile-overlay animate-fade-in" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            <aside className={`dashboard-sidebar ${isRtl ? 'rtl' : 'ltr'} ${isMobileMenuOpen ? 'sidebar-mobile-open' : 'sidebar-mobile-closed'}`}>
                <div className="sidebar-header">
                    <div className={`sidebar-logo-container ${isRtl ? 'rtl' : ''}`}>
                        <div className="sidebar-logo-wrapper">
                            <img src={ofpptLogo} alt="OFPPT" className="sidebar-logo" />
                            <span className="sidebar-logo-text">OFPPT</span>
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="sidebar-close-btn">
                            <X className="icon-lg" />
                        </button>
                    </div>

                    <div className="sidebar-portal-text">
                        <h2 className="portal-title">{t('nav.portal')}</h2>
                        <p className="portal-subtitle">{t('nav.digital_campus')}</p>
                    </div>
                </div>

                <div className="sidebar-nav-container ista-scrollbar">
                    <nav className="sidebar-nav">
                        {links.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`nav-link ${isRtl ? 'rtl' : ''} ${isActive ? 'active' : 'inactive'}`}
                                    title={link.label}
                                >
                                    <link.icon className="nav-link-icon" />
                                    <span className={`nav-link-text ${isRtl ? 'rtl' : ''} hide-on-mobile`}>
                                        {link.label}
                                    </span>
                                    {isActive && (isRtl ? 
                                        <ChevronLeft className="nav-link-chevron hide-on-mobile" /> : 
                                        <ChevronRight className="nav-link-chevron hide-on-mobile" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className={`logout-btn ${isRtl ? 'rtl' : ''}`} title={t('nav.logout')}>
                        <LogOut className={`logout-icon ${isRtl ? 'rtl' : ''}`} />
                        <span className={`nav-link-text ${isRtl ? 'rtl' : ''} hide-on-mobile`}>
                            {t('nav.logout')}
                        </span>
                    </button>
                </div>
            </aside>

            <main className={`main-content ${isRtl ? 'rtl' : 'ltr'}`}>
                <header className={`dashboard-header ${isRtl ? 'rtl' : ''}`}>
                    <div className={`header-left ${isRtl ? 'rtl' : ''}`}>
                        <button onClick={() => setIsMobileMenuOpen(true)} className="mobile-menu-btn">
                            <Menu className="icon-lg" />
                        </button>

                        <Link to={user?.role === 'admin' ? '/admin/profile' : '/formateur/profile'} className={`profile-link ${isRtl ? 'rtl' : ''}`}>
                            <div className="profile-avatar">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="profile-info">
                                <h3 className="profile-name">{user?.name}</h3>
                                <p className="profile-role">{user?.role === 'admin' ? t('header.admin_access') : t('header.formateur_access')}</p>
                            </div>
                        </Link>
                    </div>

                    <div className={`header-right ${isRtl ? 'rtl' : ''}`}>
                        <button onClick={toggleTheme} className="header-btn" title={t('header.theme_toggle')}>
                            {isDark ? <Sun className="header-icon" /> : <Moon className="header-icon" />}
                        </button>
                        <div className="header-divider"></div>

                        <div className="notif-wrapper">
                            <button onClick={() => setIsNotifOpen(!isNotifOpen)} className={`header-btn ${isNotifOpen ? 'notif-active' : ''}`}>
                                <Bell className="header-icon" />
                                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                            </button>
                            {isNotifOpen && (
                                <NotificationPanel
                                    isOpen={isNotifOpen}
                                    onClose={() => setIsNotifOpen(false)}
                                    notifications={notifications}
                                    onMarkRead={handleMarkRead}
                                    onMarkAllRead={handleMarkAllRead}
                                />
                            )}
                        </div>

                        <button onClick={toggleLanguage} className="header-btn" title={i18n.language === 'fr' ? 'العربية' : 'Français'}>
                            <Settings className="header-icon" />
                            <span className="lang-text">{i18n.language === 'fr' ? 'AR' : 'FR'}</span>
                        </button>
                    </div>
                </header>

                <div className="page-content page-transition">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
