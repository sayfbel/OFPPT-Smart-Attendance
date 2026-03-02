import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    User,
    BookOpen,
    Calendar,
    LogOut,
    Bell,
    Settings,
    Sun,
    Moon,
    FileText
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Option to persist in localStorage could be added here
        if (!isDark) {
            document.documentElement.classList.add('light-mode');
        } else {
            document.documentElement.classList.remove('light-mode');
        }
    }, [isDark]);

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
                    { icon: LayoutDashboard, label: 'OVERVIEW', path: '/admin' },
                    { icon: Users, label: 'ACCOUNTS', path: '/admin/users' },
                    { icon: BookOpen, label: 'SQUADRONS', path: '/admin/classes' },
                    { icon: Calendar, label: 'TIMELINES', path: '/admin/timetable' },
                    { icon: FileText, label: 'RAPPORTS', path: '/admin/reports' },
                ];
            case 'formateur':
                return [
                    { icon: LayoutDashboard, label: 'SESSION', path: '/formateur' },
                    { icon: BookOpen, label: 'DIVISIONS', path: '/formateur/classes' },
                    { icon: Calendar, label: 'TIMELINES', path: '/formateur/timetable' },
                ];
            case 'stagiaire':
                return [
                    { icon: LayoutDashboard, label: 'OVERVIEW', path: '/stagiaire' },
                    { icon: User, label: 'PROFILE', path: '/stagiaire/profile' },
                    { icon: Calendar, label: 'TIMELINES', path: '/stagiaire/timetable' },
                    { icon: FileText, label: 'ABSENCES', path: '/stagiaire/absences' },
                ];
            default:
                return [];
        }
    };

    const links = getSidebarLinks();

    return (
        <div className="flex bg-[var(--background)] min-h-screen text-[var(--text)] transition-colors duration-500">
            {/* Sidebar */}
            <aside className="w-64 h-screen flex flex-col border-r border-[var(--border-strong)] fixed left-0 top-0 overflow-y-auto z-20 bg-[var(--background)] transition-colors duration-500">
                <div className="p-10">
                    <h2 className="text-3xl font-black tracking-tighter text-[var(--primary)]">OFPPT</h2>
                    <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-[0.3em] mt-2 font-bold">D.A.D Division</p>
                </div>

                <nav className="mt-8 px-6 pb-12 flex-1 flex flex-col">
                    <div className="space-y-4">
                        {links.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-4 px-4 py-3 transition-all group ${location.pathname === link.path
                                    ? 'text-[var(--primary)]'
                                    : 'text-[var(--text-muted)] hover:text-[var(--primary)]'
                                    }`}
                            >
                                <link.icon className={`w-4 h-4 transition-transform group-hover:invert-0 ${location.pathname === link.path ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'
                                    }`} />
                                <span className="text-[10px] font-bold tracking-widest leading-none">{link.label}</span>
                            </Link>
                        ))}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 text-[var(--text-muted)] hover:text-[var(--primary)] transition-all mt-auto"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-[10px] font-bold tracking-widest">DISCONNECT</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 min-h-screen bg-[var(--background)] transition-colors duration-500">
                {/* Header */}
                <header className="h-24 flex items-center justify-between px-12 border-b border-[var(--border-strong)] bg-[var(--background)] sticky top-0 z-10 transition-colors duration-500">
                    <div className="flex items-center gap-6">
                        <div className="w-8 h-8 bg-[var(--primary)] flex items-center justify-center text-[var(--primary-text)] font-black text-xs">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-[var(--primary)] uppercase">{user?.name}</h3>
                            <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest mt-1 font-bold">{user?.role} NODE</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <button
                            onClick={toggleTheme}
                            className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors focus:outline-none"
                            title="Toggle Light/Dark Mode"
                        >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <button className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                            <Bell className="w-4 h-4" />
                        </button>
                        <button className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                <div className="p-12 page-transition">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
