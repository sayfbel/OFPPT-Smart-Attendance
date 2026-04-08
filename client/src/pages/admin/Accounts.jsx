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
    const { t, i18n } = useTranslation();
    const { addNotification } = useNotification();
    const [users, setUsers] = useState([]);
    const [availableGroups, setAvailableGroups] = useState([]);
    const [availableFilieres, setAvailableFilieres] = useState([]);

    const [selectedGroup, setSelectedGroup] = useState('all');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState({ id: null, role: null });

    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'stagiaire',
        group_id: '',
        group_ids: [],
        filiereId: '',
        numInsc: ''
    });

    const streams = [
        { id: 'all', label: t('accounts.all_streams') },
        { id: 'DD', label: 'DÉVELOPPEMENT DIGITAL' },
        { id: 'ID', label: 'INFRASTRUCTURE DIGITALE' }
    ];

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const [usersRes, groupsRes, filieresRes] = await Promise.all([
                axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/groups', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/filieres', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setUsers(usersRes.data.users || []);
            setAvailableGroups(groupsRes.data.groups || []);
            setAvailableFilieres(filieresRes.data.filieres || []);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userToSubmit = { ...newUser };
            if (newUser.role !== 'stagiaire' && newUser.group_ids?.length > 0) {
                userToSubmit.group_id = newUser.group_ids.join(',');
            }
            await axios.post('/api/admin/users', userToSubmit, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchData();
            setIsModalOpen(false);
            addNotification(t('accounts.create_success'), 'success');
            setNewUser({ name: '', email: '', role: 'stagiaire', group_id: '', group_ids: [], filiereId: '', numInsc: '' });
        } catch (err) {
            addNotification(err.response?.data?.message || 'Error adding user', 'error');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userToSubmit = { ...newUser };
            if (newUser.role !== 'stagiaire' && newUser.group_ids?.length > 0) {
                userToSubmit.group_id = newUser.group_ids.join(',');
            }
            await axios.put(`/api/admin/users/${newUser.id}`, userToSubmit, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchData();
            setIsModalOpen(false);
            setIsEditing(false);
            addNotification(t('accounts.update_success'), 'success');
        } catch (err) {
            addNotification(err.response?.data?.message || 'Error updating user', 'error');
        }
    };

    const handleDeleteUser = async () => {
        try {
            const { id, role } = userToDelete;
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/users/${id}?role=${role}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchData();
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

        const matchesGroup = selectedGroup === 'all' || user.group_id === selectedGroup || (user.group_ids && user.group_ids.includes(selectedGroup));

        return matchesSearch && matchesGroup;
    });

    const students = filteredUsers.filter(u => u.role === 'stagiaire');
    const formateursList = users.filter(u => u.role === 'formateur');
    
    const [searchFormateur, setSearchFormateur] = useState('');
    const isRtl = i18n.language === 'ar';
    const filteredFormateurs = formateursList.filter(f => 
        f.name.toLowerCase().includes(searchFormateur.toLowerCase()) ||
        f.email.toLowerCase().includes(searchFormateur.toLowerCase())
    );

    return (
        <div className={`space-y-12 fade-up max-w-[1600px] mx-auto ${isRtl ? 'direction-rtl' : ''}`}>
            {/* Header section */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-500 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                <div className={`space-y-2 ${isRtl ? 'text-right' : ''}`}>
                    <h1 className="text-5xl md:text-[64px] font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-none">
                        {t('accounts.header_title')}
                    </h1>
                    <p className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase">
                        {t('accounts.header_subtitle')}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-all text-[10px] font-black tracking-widest text-[var(--secondary)] uppercase">
                        <svg className="w-4 h-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        {t('accounts.all_streams')}
                        <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
                    </button>

                    <button
                        onClick={() => { setIsEditing(false); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-2xl shadow-xl shadow-[var(--primary)]/20 transition-all group"
                    >
                        <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] uppercase font-black tracking-widest">{t('accounts.add_user')}</span>
                    </button>
                </div>
            </div>

            {/* Class Cards */}
            <div className={`flex gap-6 overflow-x-auto pb-6 ista-scrollbar ${isRtl ? 'flex-row-reverse' : ''}`}>
                {availableGroups.length > 0 ? (
                    availableGroups.map((grp) => (
                        <div
                            key={grp.id}
                            onClick={() => setSelectedGroup(grp.id)}
                            className={`min-w-[320px] p-8 rounded-[24px] cursor-pointer transition-all duration-300 border ${
                                selectedGroup === grp.id 
                                    ? 'bg-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/5' 
                                    : 'bg-white border-slate-100 hover:border-slate-300 opacity-60 hover:opacity-100'
                            }`}
                        >
                            <div className={`flex justify-between items-center mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <span className={`text-[12px] font-black uppercase tracking-widest truncate-text flex-1 ${
                                    selectedGroup === grp.id ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'
                                } ${isRtl ? 'text-right' : ''}`}>
                                    {(grp.id || '').split('-')[0].trim()}
                                </span>
                                <div className={`w-2.5 h-2.5 rounded-full outline outline-4 outline-offset-2 ${
                                    selectedGroup === grp.id ? 'bg-[var(--primary)] outline-[var(--primary)]/20' : 'bg-slate-200 outline-slate-100'
                                }`}></div>
                            </div>
                            <h3 className={`text-2xl font-black italic text-[var(--secondary)] uppercase tracking-tight mb-8 truncate-text ${isRtl ? 'text-right' : ''}`}>
                                {grp.id}
                            </h3>
                            <p className={`text-[9px] font-bold text-slate-400 uppercase tracking-widest ${isRtl ? 'text-right' : ''}`}>
                                {t('accounts.col_filiere')}: <span className="text-[var(--secondary)] ml-1 truncate-text inline-block align-bottom max-w-[150px]">
                                    {grp.filiere || 'GESTION DES ENTREPRISES'}
                                </span>
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="min-w-[320px] p-8 rounded-[24px] bg-white border border-slate-100 opacity-60 flex items-center justify-center">
                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{t('accounts.no_groups_available')}</p>
                    </div>
                )}
            </div>

            {/* Students Section */}
            <div className="space-y-6">
                <h2 className={`text-3xl font-black italic tracking-tighter text-[var(--secondary)] uppercase ${isRtl ? 'text-right' : ''}`}>
                    {t('accounts.students_section')}
                </h2>

                <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('accounts.students_list')}</span>
                        
                        <div className={`flex items-center bg-slate-50 border border-transparent focus-within:border-slate-200 hover:border-slate-200 rounded-2xl w-full max-w-[400px] px-5 py-4 transition-all ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <Search className={`w-4 h-4 text-slate-400 ${isRtl ? 'ml-3' : 'mr-3'}`} />
                            <input
                                type="text"
                                placeholder={t('accounts.search_stg_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`bg-transparent border-none text-[10px] font-bold w-full tracking-widest focus:ring-0 text-[var(--secondary)] placeholder-slate-300 p-0 uppercase ${isRtl ? 'text-right' : ''}`}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className={`border-b border-slate-100 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <th className={`pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest w-16 ${isRtl ? 'text-right' : ''}`}>{t('accounts.col_id')}</th>
                                    <th className={`pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest ${isRtl ? 'text-right' : ''}`}>{t('accounts.col_name')}</th>
                                    <th className="pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">{t('accounts.col_filiere')}</th>
                                    <th className="pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">{t('accounts.col_group')}</th>
                                    <th className={`pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest ${isRtl ? 'text-left' : 'text-right'}`}>{t('accounts.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {students.length > 0 ? (
                                    students.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="py-6 text-[11px] font-black text-slate-400">
                                                {user.id}
                                            </td>
                                            <td className="py-6">
                                                <span className="text-sm font-black italic text-[var(--secondary)] uppercase tracking-tight truncate-text max-w-[150px]">
                                                    {user.name}
                                                </span>
                                            </td>
                                            <td className="py-6 text-center">
                                                <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest truncate-text max-w-[100px] mx-auto">
                                                    {user.filiere || 'DD'}
                                                </span>
                                            </td>
                                            <td className="py-6 text-center">
                                                <span className="text-[10px] font-black text-[var(--secondary)] uppercase tracking-widest">
                                                    {user.group_id}
                                                </span>
                                            </td>
                                            <td className="py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            const userData = { ...user };
                                                            if (user.role === 'formateur' && user.groups) {
                                                                userData.group_ids = user.groups.split(',').map(g => g.trim()).filter(Boolean);
                                                            }
                                                            setNewUser(userData);
                                                            setIsEditing(true);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserToDelete({ id: user.id, role: 'stagiaire' });
                                                            setIsConfirmOpen(true);
                                                        }}
                                                        className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <Users className="w-12 h-12 text-slate-300" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-slate-400">{t('accounts.no_students_found')}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Formateurs Section */}
            <div className="space-y-6 pb-20">
                <h2 className={`text-3xl font-black italic tracking-tighter text-[var(--secondary)] uppercase ${isRtl ? 'text-right' : ''}`}>
                    {t('accounts.formateurs_section')}
                </h2>

                <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('accounts.formateurs_team')}</span>
                        
                        <div className={`flex items-center bg-slate-50 border border-transparent focus-within:border-slate-200 hover:border-slate-200 rounded-2xl w-full max-w-[400px] px-5 py-4 transition-all ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <Search className={`w-4 h-4 text-slate-400 ${isRtl ? 'ml-3' : 'mr-3'}`} />
                            <input
                                type="text"
                                placeholder={t('accounts.search_staff_placeholder')}
                                value={searchFormateur}
                                onChange={(e) => setSearchFormateur(e.target.value)}
                                className={`bg-transparent border-none text-[10px] font-bold w-full tracking-widest focus:ring-0 text-[var(--secondary)] placeholder-slate-300 p-0 uppercase ${isRtl ? 'text-right' : 'ml-2'}`}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className={`border-b border-slate-100 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <th className={`pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest ${isRtl ? 'text-right' : ''}`}>{t('accounts.col_name')}</th>
                                    <th className="pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">{t('accounts.col_groups')}</th>
                                    <th className="pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">{t('accounts.col_email')}</th>
                                    <th className="pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">{t('accounts.col_status')}</th>
                                    <th className={`pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest ${isRtl ? 'text-left' : 'text-right'}`}>{t('accounts.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredFormateurs.length > 0 ? (
                                    filteredFormateurs.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="py-6 text-[11px] font-black text-slate-400">{u.id}</td>
                                            <td className="py-6">
                                                <span className="text-sm font-black italic text-[var(--secondary)] uppercase tracking-tight truncate-text max-w-[200px]">{u.name}</span>
                                            </td>
                                            <td className="py-6 text-center">
                                                <div className="flex flex-wrap justify-center gap-1">
                                                    {(u.groups || '').split(',').map((grp, idx) => (
                                                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-[8px] font-black text-slate-500 rounded-lg">{grp.trim()}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-6 text-center">
                                                <span className="text-[10px] font-bold text-slate-400 lowercase truncate-text max-w-[180px] mx-auto">{u.email}</span>
                                            </td>
                                            <td className="py-6 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${u.is_online ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${u.is_online ? 'text-green-500' : 'text-slate-400'}`}>
                                                        {u.is_online ? t('accounts.status_online') : t('accounts.status_offline')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            const userData = { ...u };
                                                            if (u.role === 'formateur' && u.groups) {
                                                                userData.group_ids = u.groups.split(',').map(g => g.trim()).filter(Boolean);
                                                            }
                                                            setNewUser(userData);
                                                            setIsEditing(true);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserToDelete({ id: u.id, role: u.role });
                                                            setIsConfirmOpen(true);
                                                        }}
                                                        className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-24 text-center">
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-slate-400">{t('accounts.no_staff_found')}</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                selectedGroup={selectedGroup}
                availableGroups={availableGroups}
                availableFilieres={availableFilieres}

                isEditing={isEditing}
            />

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteUser}
                title={t('accounts.delete_confirm_title')}
                message={t('accounts.delete_confirm_message')}
            />
        </div>
    );
};

export default Accounts;
