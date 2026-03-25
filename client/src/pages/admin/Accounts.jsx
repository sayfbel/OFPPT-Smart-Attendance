import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    UserPlus,
    X,
    Trash2,
    Shield,
    GraduationCap,
    Lock,
    Pencil,
    ChevronDown,
    LayoutDashboard,
    Key,
    Activity,
    AlertCircle,
    Info
} from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import IdentityModal from '../../components/IdentityModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useTranslation } from 'react-i18next';

const Accounts = () => {
    const { t } = useTranslation();
    const { addNotification } = useNotification();
    const [users, setUsers] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('all');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'stagiaire',
        class_id: '',
        class_ids: []
    });

    const streams = [
        { id: 'all', label: t('accounts.all_streams') },
        { id: 'DD', label: 'DÉVELOPPEMENT DIGITAL' },
        { id: 'ID', label: 'INFRASTRUCTURE DIGITALE' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [usersRes, classesRes] = await Promise.all([
                    axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/admin/classes', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setUsers(usersRes.data.users || []);
                setAvailableClasses(classesRes.data.classes || []);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userToSubmit = { ...newUser };
            if (newUser.role !== 'stagiaire' && newUser.class_ids?.length > 0) {
                userToSubmit.class_id = newUser.class_ids.join(',');
            }
            const res = await axios.post('/api/admin/users', userToSubmit, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers([...users, res.data.user]);
            setIsModalOpen(false);
            addNotification(t('accounts.create_success'), 'success');
            setNewUser({ name: '', email: '', role: 'stagiaire', class_id: '', class_ids: [] });
        } catch (err) {
            addNotification(err.response?.data?.message || 'Error adding user', 'error');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userToSubmit = { ...newUser };
            if (newUser.role !== 'stagiaire' && newUser.class_ids?.length > 0) {
                userToSubmit.class_id = newUser.class_ids.join(',');
            }
            const res = await axios.put(`/api/admin/users/${newUser.id}`, userToSubmit, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.map(u => u.id === res.data.user.id ? res.data.user : u));
            setIsModalOpen(false);
            setIsEditing(false);
            addNotification(t('accounts.update_success'), 'success');
        } catch (err) {
            addNotification(err.response?.data?.message || 'Error updating user', 'error');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u.id !== id));
            setIsConfirmOpen(false);
            addNotification(t('accounts.delete_success'), 'success');
        } catch (err) {
            addNotification('Error deleting user', 'error');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id.toString().includes(searchQuery);

        const matchesClass = selectedClass === 'all' || user.class_id === selectedClass || (user.class_ids && user.class_ids.includes(selectedClass));

        return matchesSearch && matchesClass;
    });

    const students = filteredUsers.filter(u => u.role === 'stagiaire');
    const formateurs = users.filter(u => u.role === 'formateur' || u.role === 'admin');

    return (
        <div className="space-y-12 fade-up">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--border)] pb-12 transition-all duration-500">
                <div className="space-y-4">
                    <h1 className="text-4xl lg:text-7xl font-black tracking-tight text-[var(--secondary)] uppercase italic leading-[0.9]">
                        {t('accounts.title')}
                    </h1>
                    <p className="text-[var(--text-muted)] text-[11px] font-bold tracking-[0.4em] uppercase opacity-60">
                        {t('accounts.subtitle')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex bg-white border border-[var(--border)] rounded-2xl p-1.5 shadow-sm overflow-x-auto max-w-full">
                        {streams.map((stream) => (
                            <button
                                key={stream.id}
                                onClick={() => setSelectedClass(stream.id)}
                                className={`px-4 lg:px-6 py-3 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${selectedClass === stream.id
                                    ? 'bg-[var(--secondary)] text-white shadow-lg'
                                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'
                                    }`}
                            >
                                {stream.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => { setIsEditing(false); setIsModalOpen(true); }}
                        className="w-full sm:w-auto btn-ista px-8 py-4 flex items-center justify-center gap-3 shadow-xl"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-black tracking-widest">{t('accounts.add_member')}</span>
                    </button>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left side: Main users list */}
                <div className="lg:col-span-8 space-y-8 overflow-x-auto md:overflow-visible">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></div>
                            <h3 className="text-xs font-black tracking-widest uppercase text-[var(--secondary)]">{t('accounts.list_title')}</h3>
                        </div>
                        <div className="flex items-center bg-white border border-[var(--border)] rounded-2xl w-full max-w-sm px-5 group focus-within:border-[var(--primary)] transition-all shadow-sm">
                            <Search className="w-4 h-4 text-slate-300 group-focus-within:text-[var(--primary)] transition-colors" />
                            <input
                                type="text"
                                placeholder={t('accounts.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none text-[11px] font-bold py-4 px-4 w-full tracking-widest focus:ring-0 text-[var(--secondary)] placeholder-slate-300 uppercase"
                            />
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4 text-amber-800 animate-in fade-in slide-in-from-top-4 duration-500">
                        <Info className="w-6 h-6 flex-shrink-0" />
                        <p className="text-[10px] font-black uppercase tracking-wider italic">
                            {t('accounts.reset_password_warning')}
                        </p>
                    </div>

                    <div className="ista-panel overflow-x-auto ista-scrollbar bg-white shadow-sm">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-100">
                                    <th className="p-6">{t('accounts.student_name')}</th>
                                    <th className="p-6">{t('accounts.email_id')}</th>
                                    <th className="p-6">{t('accounts.group')}</th>
                                    <th className="p-6 text-right">{t('accounts.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {students.length > 0 ? (
                                    students.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[11px] font-black text-[var(--secondary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-sm">
                                                        {user.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black italic text-[var(--secondary)] uppercase tracking-tight group-hover:text-[var(--primary)] transition-colors">{user.name}</span>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60">ID: #{user.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-[var(--secondary)] tracking-widest uppercase">{user.email}</span>
                                                    <span className="text-[9px] text-slate-300 font-mono mt-1">{t('accounts.portal_link')}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="px-3 py-1 bg-slate-100 text-[9px] font-black text-[var(--secondary)] rounded-lg uppercase tracking-widest">
                                                    {user.class_id || 'NA'}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setNewUser(user);
                                                            setIsEditing(true);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-3 hover:bg-white rounded-xl text-slate-400 hover:text-[var(--primary)] transition-all shadow-sm border border-transparent hover:border-slate-100"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserToDelete(user.id);
                                                            setIsConfirmOpen(true);
                                                        }}
                                                        className="p-3 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm border border-transparent hover:border-slate-100"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-24 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <Activity className="w-12 h-12 text-slate-300 animate-pulse" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-slate-400">{t('accounts.no_data')}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right side: Sidebar Info */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="ista-panel p-10 bg-[var(--secondary)] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-110 transition-transform duration-700">
                            <GraduationCap className="w-32 h-32 -rotate-12" />
                        </div>
                        <div className="relative z-10 space-y-12">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black italic tracking-tighter leading-none">{t('accounts.formateurs_title')}</h3>
                                <p className="text-[9px] font-bold text-white/40 tracking-[0.2em] uppercase">{t('accounts.formateurs_subtitle')}</p>
                            </div>

                            <div className="space-y-4">
                                {formateurs.map((f) => (
                                    <div key={f.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm group/card hover:bg-[var(--primary)] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[10px] font-black group-hover/card:bg-white group-hover/card:text-[var(--primary)] transition-all">
                                                {f.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black tracking-tight uppercase">{f.name}</span>
                                                <span className="text-[9px] font-bold text-white/40 tracking-widest uppercase">{t(`roles.${f.role}`)}</span>
                                            </div>
                                        </div>
                                        <Shield className={`w-4 h-4 ${f.role === 'admin' ? 'text-amber-400' : 'text-white/20'}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="ista-panel p-10 bg-white shadow-xl flex flex-col items-center text-center gap-6">
                        <div className="w-20 h-20 bg-green-50 rounded-[32px] flex items-center justify-center text-[var(--primary)] shadow-lg shadow-green-500/10">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-3xl font-black italic text-[var(--secondary)] tracking-tighter">{students.length.toString().padStart(2, '0')}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t('accounts.total_students')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <IdentityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                newUser={newUser}
                setNewUser={setNewUser}
                handleAddUser={handleAddUser}
                handleUpdateUser={handleUpdateUser}
                selectedClass={selectedClass}
                availableClasses={availableClasses}
                isEditing={isEditing}
            />

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => handleDeleteUser(userToDelete)}
                title={t('accounts.delete_confirm_title')}
                message={t('accounts.delete_confirm_message')}
            />
            <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Accounts;
