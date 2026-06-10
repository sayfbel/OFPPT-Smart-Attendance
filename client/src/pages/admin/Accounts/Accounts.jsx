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
import '../../../styles/admin-shared.css';

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
        <div className={`accounts-page-container ${isRtl ? 'direction-rtl' : ''}`}>
            {/* Header section */}
            <div className="admin-header-row">
                <div className="admin-header-text">
                    <h1 className="admin-page-title">
                        {t('accounts.header_title')}
                    </h1>
                    <p className="admin-page-subtitle">
                        {t('accounts.header_subtitle')}
                    </p>
                </div>

                <div className="accounts-header-actions">
                    <div className="relative">
                        <button 
                            onClick={() => setShowFiliereDropdown(!showFiliereDropdown)}
                            className="accounts-filiere-btn"
                        >
                            <svg className="accounts-filiere-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span className="accounts-filiere-text">
                                {selectedFiliere === 'all' ? t('accounts.all_streams') : availableFilieres.find(f => f.id === selectedFiliere)?.nom || t('accounts.all_streams')}
                            </span>
                            <ChevronDown className={`accounts-filiere-chevron ${showFiliereDropdown ? 'open' : ''}`} />
                        </button>
                        
                        {showFiliereDropdown && (
                            <div className="accounts-dropdown-menu ista-scrollbar">
                                <button 
                                    onClick={() => { setSelectedFiliere('all'); setShowFiliereDropdown(false); setSelectedGroup('all'); }}
                                    className={`accounts-dropdown-item ${selectedFiliere === 'all' ? 'active' : 'inactive'}`}
                                >
                                    {t('accounts.all_streams')}
                                </button>
                                {availableFilieres.map(f => (
                                    <button 
                                        key={f.id}
                                        title={f.nom}
                                        onClick={() => { setSelectedFiliere(f.id); setShowFiliereDropdown(false); setSelectedGroup('all'); }}
                                        className={`accounts-dropdown-item ${selectedFiliere === f.id ? 'active' : 'inactive'}`}
                                    >
                                        {f.nom}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => { setIsEditing(false); setIsModalOpen(true); }}
                        className="accounts-add-btn"
                    >
                        <UserPlus className="accounts-add-icon" />
                        <span className="accounts-add-text">{t('accounts.add_user')}</span>
                    </button>
                </div>
            </div>

            {/* Class Cards */}
            <div className="accounts-group-cards-row ista-scrollbar">
                {filteredGroups.length > 0 ? (
                    filteredGroups.map((grp) => (
                        <div
                            key={grp.id}
                            onClick={() => setSelectedGroup(grp.id)}
                            className={`accounts-card ${selectedGroup === grp.id ? 'accounts-card-selected' : ''}`}
                        >
                            <div className={`accounts-card-header ${isRtl ? 'rtl' : ''}`}>
                                <span className={`accounts-card-prefix ${selectedGroup === grp.id ? 'active' : ''} ${isRtl ? 'rtl' : ''}`}>
                                    {(grp.id || '').split('-')[0].trim()}
                                </span>
                                <div className={`accounts-card-dot ${selectedGroup === grp.id ? 'accounts-card-active-dot' : ''}`}></div>
                            </div>
                            <h3 className={`accounts-card-title ${isRtl ? 'rtl' : ''}`}>
                                {grp.id}
                            </h3>
                            <p className={`accounts-card-filiere ${isRtl ? 'rtl' : ''}`}>
                                {t('accounts.col_filiere')}: <span className="accounts-card-filiere-value">
                                    {grp.filiere || 'GESTION DES ENTREPRISES'}
                                </span>
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="accounts-empty-group">
                        <p className="accounts-empty-group-text">{t('accounts.no_groups_available')}</p>
                    </div>
                )}
            </div>

            {/* Students Section */}
            <div className="accounts-section">
                <h2 className={`accounts-section-title ${isRtl ? 'rtl' : ''}`}>
                    {t('accounts.students_section')}
                </h2>

                <div className="admin-table-container accounts-table-container">
                    <div className={`accounts-table-header ${isRtl ? 'rtl' : ''}`}>
                        <span className="accounts-table-label">{t('accounts.students_list')}</span>
                        
                        <div className={`accounts-search-wrapper ${isRtl ? 'rtl' : ''}`}>
                            <Search className={`accounts-search-icon ${isRtl ? 'rtl' : 'ltr'}`} />
                            <input
                                type="text"
                                placeholder={t('accounts.search_stg_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`accounts-search-input ${isRtl ? 'rtl' : ''}`}
                            />
                        </div>
                    </div>

                    <div className="accounts-table-wrapper">
                        <table className={`accounts-table ${isRtl ? 'rtl' : 'ltr'}`}>
                            <thead>
                                <tr>
                                    <th className={`accounts-th id-col ${isRtl ? 'rtl' : 'ltr'}`}>{t('accounts.col_id')}</th>
                                    <th className={`accounts-th ${isRtl ? 'rtl' : 'ltr'}`}>{t('accounts.col_name')}</th>
                                    <th className="accounts-th center">{t('accounts.col_filiere')}</th>
                                    <th className="accounts-th center">{t('accounts.col_group')}</th>
                                    <th className={`accounts-th ${isRtl ? 'ltr' : 'rtl'}`}>{t('accounts.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="accounts-tbody">
                                {students.length > 0 ? (
                                    students.map((user) => (
                                        <tr key={user.id} className="accounts-tr">
                                            <td className="accounts-td accounts-td-id">
                                                {user.id}
                                            </td>
                                            <td className="accounts-td">
                                                <Link to={`/admin/student/${user.id}`} className="accounts-td-name">
                                                    {user.name}
                                                </Link>
                                            </td>
                                            <td className="accounts-td accounts-td-filiere">
                                                <span className="accounts-td-filiere-span">
                                                    {user.filiere || 'DD'}
                                                </span>
                                            </td>
                                            <td className="accounts-td accounts-td-group">
                                                <span className="accounts-td-group-span">
                                                    {user.group_id}
                                                </span>
                                            </td>
                                            <td className={`accounts-td ${isRtl ? 'text-left' : 'text-right'}`}>
                                                <div className={`accounts-td-actions ${isRtl ? 'rtl' : 'ltr'}`}>
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
                                                        className="accounts-action-btn edit"
                                                    >
                                                        <Pencil className="accounts-action-icon" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserToDelete({ id: user.id, role: 'stagiaire' });
                                                            setIsConfirmOpen(true);
                                                        }}
                                                        className="accounts-action-btn delete"
                                                    >
                                                        <Trash2 className="accounts-action-icon" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="accounts-empty-tr">
                                        <td colSpan="5" className="accounts-empty-td">
                                            <div className="accounts-empty-wrapper">
                                                <Users className="accounts-empty-icon" />
                                                <p className="accounts-empty-text">{t('accounts.no_students_found')}</p>
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
            <div className="accounts-section accounts-section-bottom">
                <h2 className={`accounts-section-title ${isRtl ? 'rtl' : ''}`}>
                    {t('accounts.formateurs_section')}
                </h2>

                <div className="admin-table-container accounts-table-container">
                    <div className={`accounts-table-header ${isRtl ? 'rtl' : ''}`}>
                        <span className="accounts-table-label">{t('accounts.formateurs_team')}</span>
                        
                        <div className={`accounts-search-wrapper ${isRtl ? 'rtl' : ''}`}>
                            <Search className={`accounts-search-icon ${isRtl ? 'rtl' : 'ltr'}`} />
                            <input
                                type="text"
                                placeholder={t('accounts.search_staff_placeholder')}
                                value={searchFormateur}
                                onChange={(e) => setSearchFormateur(e.target.value)}
                                className={`accounts-search-input ${isRtl ? 'rtl-staff' : ''}`}
                            />
                        </div>
                    </div>

                    <div className="accounts-table-wrapper">
                        <table className={`accounts-table ${isRtl ? 'rtl' : 'ltr'}`}>
                            <thead>
                                <tr>
                                    <th className={`accounts-th id-col ${isRtl ? 'rtl' : 'ltr'}`}>{t('accounts.col_id')}</th>
                                    <th className={`accounts-th ${isRtl ? 'rtl' : 'ltr'}`}>{t('accounts.col_name')}</th>
                                    <th className="accounts-th center">{t('accounts.col_groups')}</th>
                                    <th className="accounts-th center">{t('accounts.col_email')}</th>
                                    <th className="accounts-th center">{t('accounts.col_status')}</th>
                                    <th className={`accounts-th ${isRtl ? 'ltr' : 'rtl'}`}>{t('accounts.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="accounts-tbody">
                                {filteredFormateurs.length > 0 ? (
                                    filteredFormateurs.map((u) => (
                                        <tr key={u.id} className="accounts-tr">
                                            <td className="accounts-td accounts-td-id">{u.id}</td>
                                            <td className="accounts-td">
                                                <span className="accounts-td-name formateur">{u.name}</span>
                                            </td>
                                            <td className="accounts-td center">
                                                <div className="accounts-groups-list">
                                                    {(u.groups || '').split(',').map((grp, idx) => (
                                                        <span key={idx} className="accounts-group-badge">{grp.trim()}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="accounts-td accounts-td-email">
                                                <span className="accounts-email-span">{u.email}</span>
                                            </td>
                                            <td className="accounts-td accounts-td-status">
                                                <div className="accounts-status-wrapper">
                                                    <div className={`accounts-status-dot ${u.is_online ? 'online' : 'offline'}`}></div>
                                                    <span className={`accounts-status-text ${u.is_online ? 'online' : 'offline'}`}>
                                                        {u.is_online ? t('accounts.status_online') : t('accounts.status_offline')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={`accounts-td ${isRtl ? 'text-left' : 'text-right'}`}>
                                                <div className={`accounts-td-actions ${isRtl ? 'rtl' : 'ltr'}`}>
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
                                                        className="accounts-action-btn edit"
                                                    >
                                                        <Pencil className="accounts-action-icon" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserToDelete({ id: u.id, role: u.role });
                                                            setIsConfirmOpen(true);
                                                        }}
                                                        className="accounts-action-btn delete"
                                                    >
                                                        <Trash2 className="accounts-action-icon" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="accounts-empty-tr">
                                        <td colSpan="6" className="accounts-empty-td">
                                            <p className="accounts-empty-text">{t('accounts.no_staff_found')}</p>
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
