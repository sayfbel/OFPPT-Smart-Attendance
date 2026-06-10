import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Users,
    Search,
    UserPlus,
    Trash2,
    Pencil,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { useNotification } from '../../../hooks/useNotification';
import { IdentityModal, ConfirmationModal } from '../../../components/Modals';
import { useTranslation } from 'react-i18next';
import studentService from '../../../services/studentService';
import './Accounts.css';

const Accounts = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const groupFilter = queryParams.get('group');
    
    const { t, i18n } = useTranslation();
    const { addNotification } = useNotification();
    const [users, setUsers] = useState([]);
    const [availableGroups, setAvailableGroups] = useState([]);
    const [availableFilieres, setAvailableFilieres] = useState([]);

    const [selectedGroup, setSelectedGroup] = useState(groupFilter || 'all');
    const [selectedFiliere, setSelectedFiliere] = useState('all');
    const [showFiliereDropdown, setShowFiliereDropdown] = useState(false);
    
    const isRtl = i18n.language === 'ar';
    const filteredGroups = availableGroups.filter(grp => selectedFiliere === 'all' || grp.filiereId === selectedFiliere);
    
    useEffect(() => {
        if (groupFilter) setSelectedGroup(groupFilter);
    }, [groupFilter]);

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

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, groupsRes, filieresRes] = await Promise.all([
                studentService.getUsers(),
                studentService.getGroups(),
                studentService.getFilieres()
            ]);
            setUsers(usersRes.users || []);
            const groups = groupsRes.groups || [];
            setAvailableGroups(groups);
            setAvailableFilieres(filieresRes.filieres || []);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // If the current selectedGroup is not in the filtered groups, reset it
        if (selectedGroup !== 'all') {
            const exists = filteredGroups.some(g => g.id === selectedGroup);
            if (!exists) {
                setSelectedGroup(filteredGroups[0]?.id || 'all');
            }
        } else if (filteredGroups.length > 0 && !groupFilter) {
            setSelectedGroup(filteredGroups[0].id);
        }
    }, [filteredGroups, selectedGroup, groupFilter]);

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const userToSubmit = { ...newUser };
            if (newUser.role !== 'stagiaire' && newUser.group_ids?.length > 0) {
                userToSubmit.group_id = newUser.group_ids.join(',');
            }
            await studentService.createUser(userToSubmit);
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
            const userToSubmit = { ...newUser };
            if (newUser.role !== 'stagiaire' && newUser.group_ids?.length > 0) {
                userToSubmit.group_id = newUser.group_ids.join(',');
            }
            await studentService.updateUser(newUser.id, userToSubmit);
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
            await studentService.deleteUser(id, role);
            await fetchData();
            setIsConfirmOpen(false);
            addNotification(t('accounts.delete_success'), 'success');
        } catch (err) {
            addNotification('Error deleting user', 'error');
        }
    };

    const handleImportExcel = async (file, groupId, filiereId) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('groupId', groupId);
            if (filiereId) {
                formData.append('filiereId', filiereId);
            }

            const response = await studentService.importUsers(formData);
            await fetchData();
            setIsModalOpen(false);
            addNotification(
                t('accounts.import_success', { success: response.summary?.success || 0 }) + 
                (response.summary?.errors > 0 ? ` (${response.summary.errors} ${isRtl ? 'أخطاء' : 'erreurs'})` : ''),
                'success'
            );
        } catch (err) {
            addNotification(err.response?.data?.message || 'Error importing file', 'error');
            throw err;
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
                    <div className="relative">
                        <button 
                            onClick={() => setShowFiliereDropdown(!showFiliereDropdown)}
                            className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-all text-[10px] font-black tracking-widest text-[var(--secondary)] uppercase"
                        >
                            <svg className="w-4 h-4 text-[var(--primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span className="truncate max-w-[200px]">
                                {selectedFiliere === 'all' ? t('accounts.all_streams') : availableFilieres.find(f => f.id === selectedFiliere)?.nom || t('accounts.all_streams')}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 ml-2 transition-transform ${showFiliereDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showFiliereDropdown && (
                            <div className="absolute top-full mt-2 right-0 w-[280px] max-h-[300px] overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden ista-scrollbar">
                                <button 
                                    onClick={() => { setSelectedFiliere('all'); setShowFiliereDropdown(false); setSelectedGroup('all'); }}
                                    className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${selectedFiliere === 'all' ? 'bg-[var(--primary)]/5 text-[var(--primary)]' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {t('accounts.all_streams')}
                                </button>
                                {availableFilieres.map(f => (
                                    <button 
                                        key={f.id}
                                        title={f.nom}
                                        onClick={() => { setSelectedFiliere(f.id); setShowFiliereDropdown(false); setSelectedGroup('all'); }}
                                        className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-colors truncate ${selectedFiliere === f.id ? 'bg-[var(--primary)]/5 text-[var(--primary)]' : 'text-[var(--secondary)] hover:bg-slate-50'}`}
                                    >
                                        {f.nom}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

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
                {filteredGroups.length > 0 ? (
                    filteredGroups.map((grp) => (
                        <div
                            key={grp.id}
                            onClick={() => setSelectedGroup(grp.id)}
                            className={`min-w-[320px] p-8 rounded-[24px] cursor-pointer accounts-card border ${
                                selectedGroup === grp.id 
                                    ? 'accounts-card-selected' 
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
                                    selectedGroup === grp.id ? 'bg-[var(--primary)] outline-[var(--primary)]/20 accounts-card-active-dot' : 'bg-slate-200 outline-slate-100'
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
                        <table className={`w-full min-w-[800px] ${isRtl ? 'text-right' : 'text-left'}`}>
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className={`pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest w-16`}>{t('accounts.col_id')}</th>
                                    <th className={`pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest`}>{t('accounts.col_name')}</th>
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
                                                <Link to={`/admin/student/${user.id}`} className="text-sm font-black italic text-[var(--secondary)] uppercase tracking-tight truncate-text max-w-[150px] hover:text-[var(--primary)] transition-colors">
                                                    {user.name}
                                                </Link>
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
                                            <td className={`py-6 ${isRtl ? 'text-left' : 'text-right'}`}>
                                                <div className="flex justify-end gap-2 transition-opacity">
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
                        <table className={`w-full min-w-[800px] ${isRtl ? 'text-right' : 'text-left'}`}>
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className={`pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest w-16`}>{t('accounts.col_id')}</th>
                                    <th className={`pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest`}>{t('accounts.col_name')}</th>
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
                                            <td className={`py-6 ${isRtl ? 'text-left' : 'text-right'}`}>
                                                <div className="flex justify-end gap-2 transition-opacity">
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
                handleImportExcel={handleImportExcel}
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
