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
    const [availableFilieres, setAvailableFilieres] = useState([]);
    const [availableOptions, setAvailableOptions] = useState([]);
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
        class_ids: [],
        filiereId: '',
        optionId: '',
        annee: '1er'
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
                const [usersRes, classesRes, filieresRes, optionsRes] = await Promise.all([
                    axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/admin/classes', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/admin/filieres', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/admin/options', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setUsers(usersRes.data.users || []);
                setAvailableClasses(classesRes.data.classes || []);
                setAvailableFilieres(filieresRes.data.filieres || []);
                setAvailableOptions(optionsRes.data.options || []);
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
            setNewUser({ name: '', email: '', role: 'stagiaire', class_id: '', class_ids: [], filiereId: '', optionId: '', annee: '1er' });
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
        <div className="space-y-12 fade-up max-w-[1600px] mx-auto">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-500">
                <div className="space-y-2">
                    <h1 className="text-5xl md:text-[64px] font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-none">
                        COMPTES
                    </h1>
                    <p className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase">
                        GESTION DES UTILISATEURS ISTA
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-all text-[10px] font-black tracking-widest text-[var(--secondary)] uppercase">
                        <svg className="w-4 h-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        TOUTES LES FILIÈRES
                        <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
                    </button>

                    <button
                        onClick={() => { setIsEditing(false); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-2xl shadow-xl shadow-[var(--primary)]/20 transition-all group"
                    >
                        <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] uppercase font-black tracking-widest">AJOUTER UN UTILISATEUR</span>
                    </button>
                </div>
            </div>

            {/* Class Cards */}
            <div className="flex gap-6 overflow-x-auto pb-6 ista-scrollbar">
                {availableClasses.length > 0 ? (
                    availableClasses.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => setSelectedClass(cls.id)}
                            className={`min-w-[320px] p-8 rounded-[24px] cursor-pointer transition-all duration-300 border ${
                                selectedClass === cls.id 
                                    ? 'bg-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/5' 
                                    : 'bg-white border-slate-100 hover:border-slate-300 opacity-60 hover:opacity-100'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <span className={`text-[12px] font-black uppercase tracking-widest ${
                                    selectedClass === cls.id ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'
                                }`}>
                                    {(cls.title || cls.id || '').split('-')[0].trim()}
                                </span>
                                <div className={`w-2.5 h-2.5 rounded-full outline outline-4 outline-offset-2 ${
                                    selectedClass === cls.id ? 'bg-[var(--primary)] outline-[var(--primary)]/20' : 'bg-slate-200 outline-slate-100'
                                }`}></div>
                            </div>
                            <h3 className="text-2xl font-black italic text-[var(--secondary)] uppercase tracking-tight mb-8">
                                {cls.title || cls.id} {(cls.title && (cls.title.includes('SQUADRON') || cls.title.includes('CLUSTER'))) ? '' : '- SQUADRON'}
                            </h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                FILIÈRE: <span className="text-[var(--secondary)] ml-1">
                                    {cls.stream || 'GESTION DES ENTREPRISES'}
                                </span>
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="min-w-[320px] p-8 rounded-[24px] bg-white border border-slate-100 opacity-60 flex items-center justify-center">
                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">AUCUNE CLASSE DISPONIBLE</p>
                    </div>
                )}
            </div>

            {/* Students Section */}
            <div className="space-y-6">
                <h2 className="text-3xl font-black italic tracking-tighter text-[var(--secondary)] uppercase">
                    STAGIAIRES
                </h2>

                <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">LISTE DES STAGIAIRES</span>
                        
                        <div className="flex items-center bg-slate-50 border border-transparent focus-within:border-slate-200 hover:border-slate-200 rounded-2xl w-full max-w-[400px] px-5 py-4 transition-all">
                            <Search className="w-4 h-4 text-slate-400 mr-3" />
                            <input
                                type="text"
                                placeholder="RECHERCHER UN NOM OU ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none text-[10px] font-bold w-full tracking-widest focus:ring-0 text-[var(--secondary)] placeholder-slate-300 p-0 uppercase"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest w-16">ID</th>
                                    <th className="pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest">NOM COMPLET</th>
                                    <th className="pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">RÔLE</th>
                                    <th className="pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">ÉTAT</th>
                                    <th className="pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">DERNIÈRE CONNEXION</th>
                                    <th className="pb-6 text-[9px] font-black text-slate-300 uppercase tracking-widest text-right">ACTIONS</th>
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
                                                <span className="text-sm font-black italic text-[var(--secondary)] uppercase tracking-tight">
                                                    {user.name}
                                                </span>
                                            </td>
                                            <td className="py-6 text-center">
                                                <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded-full uppercase tracking-widest">
                                                    STAGIAIRE
                                                </span>
                                            </td>
                                            <td className="py-6 text-center">
                                                <span className="inline-block px-4 py-1.5 border border-[var(--primary)] text-[var(--primary)] text-[9px] font-black rounded-full uppercase tracking-widest bg-[var(--primary)]/5">
                                                    ACTIVE
                                                </span>
                                            </td>
                                            <td className="py-6 text-center">
                                                <span className="text-[10px] font-bold text-slate-400 italic uppercase">
                                                    NO LOGIN
                                                </span>
                                            </td>
                                            <td className="py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setNewUser(user);
                                                            setIsEditing(true);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserToDelete(user.id);
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
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-slate-400">AUCUN STAGIAIRE TROUVÉ</p>
                                            </div>
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
                selectedClass={selectedClass}
                availableClasses={availableClasses}
                availableFilieres={availableFilieres}
                availableOptions={availableOptions}
                isEditing={isEditing}
            />

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => handleDeleteUser(userToDelete)}
                title={t('accounts.delete_confirm_title')}
                message={t('accounts.delete_confirm_message')}
            />
        </div>
    );
};

export default Accounts;
