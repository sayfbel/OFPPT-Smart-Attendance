import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Search, Plus, Filter, UserCheck, UserX, ChevronDown, Edit3, Trash2, AlertTriangle, X, User } from 'lucide-react';
import axios from 'axios';
import IdentityModal from '../../components/IdentityModal';
import { useNotification } from '../../context/NotificationContext';

const Accounts = () => {
    const { addNotification } = useNotification();
    const [availableClasses, setAvailableClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [users, setUsers] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'stagiaire', class_ids: [] });
    const [searchQuery, setSearchQuery] = useState('');
    const [streamFilter, setStreamFilter] = useState('ALL');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    // Delete Confirmation State
    const [userToDelete, setUserToDelete] = useState(null);

    const uniqueStreams = ['ALL', ...new Set(availableClasses.map(cls => cls.id.replace(/[0-9_ -]/g, '').trim()))];

    const displayedClasses = availableClasses.filter(cls =>
        streamFilter === 'ALL' || cls.id.startsWith(streamFilter)
    );

    const displayedUsers = users.filter(user =>
        user.role === 'stagiaire' &&
        (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
    );

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const res = await axios.get('/api/admin/schedule', config);
                const classes = res.data.classes || [];
                setAvailableClasses(classes);

                // Auto-select the first class if none is selected
                if (classes.length > 0 && !selectedClass) {
                    setSelectedClass(classes[0].id);
                }

                const fRes = await axios.get('/api/admin/formateurs', config);
                setFormateurs(fRes.data.formateurs || []);
            } catch (error) {
                console.error('Error fetching initial data', error);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!selectedClass) return;
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`/api/admin/users/by-class/${selectedClass}`, config);
                setUsers(res.data.users || []);
            } catch (error) {
                console.error('Error fetching users', error);
                setUsers([]);
            }
        };
        fetchUsers();
    }, [selectedClass]);

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const targetClass = newUser.role === 'stagiaire' ? (newUser.class_id || selectedClass) : null;

            if (newUser.role === 'stagiaire' && !targetClass) {
                addNotification('Veuillez sélectionner un groupe.', 'error');
                return;
            }
            if (newUser.role === 'formateur' && (!newUser.class_ids || newUser.class_ids.length === 0)) {
                addNotification('Veuillez sélectionner au moins un groupe pour le formateur.', 'error');
                return;
            }

            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                ...newUser,
                class_id: newUser.role === 'formateur'
                    ? newUser.class_ids.join(', ')
                    : (newUser.class_id || selectedClass)
            };

            const res = await axios.post('/api/admin/users', payload, config);

            if (newUser.role === 'formateur') {
                const fRes = await axios.get('/api/admin/formateurs', config);
                setFormateurs(fRes.data.formateurs || []);
            } else if (payload.class_id === selectedClass) {
                setUsers([...users, res.data.user]);
            }

            setIsModalOpen(false);
            setNewUser({ name: '', email: '', role: 'stagiaire', class_ids: [] });
            addNotification('Compte créé avec succès.', 'success');
        } catch (error) {
            console.error('Error adding user', error);
            addNotification(error.response?.data?.message || 'Erreur lors de la création du compte', 'error');
        }
    };

    const handleEditClick = (user) => {
        const assignedClasses = availableClasses
            .filter(cls => cls.lead && cls.lead.includes(user.name))
            .map(cls => cls.id);

        setNewUser({
            ...user,
            class_ids: assignedClasses,
            class_id: user.class_id || ''
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                ...newUser,
                class_id: newUser.role === 'formateur' ? newUser.class_ids.join(', ') : newUser.class_id
            };

            await axios.put(`/api/admin/users/${newUser.id}`, payload, config);

            // Refresh data
            if (newUser.role === 'formateur') {
                const fRes = await axios.get('/api/admin/formateurs', config);
                setFormateurs(fRes.data.formateurs || []);
            } else {
                setUsers(prev => prev.map(u => u.id === newUser.id ? { ...u, ...newUser } : u));
            }

            setIsModalOpen(false);
            setIsEditing(false);
            addNotification('Informations mises à jour.', 'success');
        } catch (error) {
            console.error('Error updating user', error);
            addNotification(error.response?.data?.message || 'Erreur lors de la mise à jour', 'error');
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`/api/admin/users/${userToDelete.id}?role=${userToDelete.role}`, config);

            if (userToDelete.role === 'formateur') {
                setFormateurs(prev => prev.filter(f => f.id !== userToDelete.id));
            } else {
                setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            }

            setUserToDelete(null);
            addNotification('Utilisateur supprimé du système.', 'success');
        } catch (error) {
            console.error('Error deleting user', error);
            addNotification('Échec de la suppression: Erreur serveur.', 'error');
        }
    };

    return (
        <div className="space-y-12 fade-up transition-all duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-[var(--border)] pb-8 lg:pb-12 gap-6 lg:gap-8">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-[0.9]">Comptes</h1>
                    <p className="text-[var(--text-muted)] text-[10px] lg:text-xs tracking-[0.4em] uppercase font-black">Gestion des Utilisateurs ISTA</p>
                </div>
                <div className="flex flex-wrap gap-4 justify-end">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            className="bg-white border border-[var(--border)] px-6 py-4 rounded-xl flex items-center gap-4 hover:border-[var(--primary)] transition-all shadow-sm"
                        >
                            <Filter className="w-4 h-4 text-[var(--primary)]" />
                            <span className="text-[10px] font-black tracking-widest uppercase text-[var(--secondary)]">{streamFilter === 'ALL' ? 'TOUTES LES FILIÈRES' : streamFilter}</span>
                            <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterDropdownOpen && (
                            <div className="absolute top-full left-0 mt-3 bg-white border border-[var(--border)] rounded-2xl z-50 shadow-2xl min-w-[200px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {uniqueStreams.map(stream => (
                                    <div
                                        key={stream}
                                        className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors ${streamFilter === stream ? 'bg-[var(--primary)] text-white' : 'text-[var(--secondary)] hover:bg-slate-50'}`}
                                        onClick={() => {
                                            setStreamFilter(stream);
                                            setIsFilterDropdownOpen(false);
                                        }}
                                    >
                                        {stream === 'ALL' ? 'TOUTES LES FILIÈRES' : stream}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => {
                        setNewUser({ name: '', email: '', role: 'stagiaire', class_ids: [] });
                        setIsEditing(false);
                        setIsModalOpen(true);
                    }} className="btn-ista px-8 py-4 flex items-center gap-3">
                        <Plus className="w-5 h-5" />
                        <span>AJOUTER UN UTILISATEUR</span>
                    </button>
                </div>
            </div>

            {/* STAGIAIRE SECTION */}
            <div className="flex gap-6 border-t border-slate-50 pb-8 overflow-x-auto no-scrollbar transition-all duration-500 pt-8">
                {displayedClasses.map((cls, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedClass(cls.id)}
                        className={`min-w-[280px] flex-shrink-0 p-8 rounded-3xl border transition-all duration-500 group cursor-pointer ${selectedClass === cls.id
                            ? 'border-[var(--primary)] bg-green-50/30 ring-4 ring-green-500/5'
                            : 'border-[var(--border)] bg-white hover:border-[var(--primary)]/30'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-black tracking-widest text-[var(--primary)] uppercase">{cls.id}</span>
                            <div className={`w-3 h-3 rounded-full ${selectedClass === cls.id ? 'bg-[var(--primary)] animate-pulse' : 'bg-slate-200'}`}></div>
                        </div>
                        <h3 className="text-xl font-black italic text-[var(--secondary)] tracking-tight mb-2 truncate group-hover:text-[var(--primary)] transition-colors">{cls.title}</h3>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-4 border-t border-slate-50 pt-4">
                            Filière: <span className="text-[var(--secondary)]">{cls.stream}</span>
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex items-center pt-8 mb-4 gap-6">
                <h2 className="text-4xl font-black italic tracking-tighter text-[var(--secondary)] uppercase">Stagiaires</h2>
                <div className="flex-1 border-b border-slate-100"></div>
            </div>

            <div className="space-y-8 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm transition-all duration-500">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">Liste des Stagiaires</h3>
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl w-full md:w-80 group focus-within:border-[var(--primary)] transition-all px-5">
                        <Search className="w-4 h-4 text-slate-300 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="RECHERCHER UN NOM OU ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-[11px] font-bold py-4 px-4 w-full tracking-widest focus:ring-0 text-[var(--secondary)] placeholder-slate-300 uppercase"
                        />
                    </div>
                </div>

                {!selectedClass ? (
                    <div className="border-2 border-dashed border-slate-100 rounded-3xl py-24 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Filter className="w-6 h-6 text-slate-200" />
                        </div>
                        <span className="text-xs font-black tracking-widest uppercase text-[var(--primary)] mb-2">SÉLECTIONNEZ UN GROUPE</span>
                        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Veuillez choisir un groupe ci-dessus pour voir les stagiaires.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto ista-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-50">
                                    <th className="pb-6 px-4">ID</th>
                                    <th className="pb-6 px-4">Nom Complet</th>
                                    <th className="pb-6 px-4">Rôle</th>
                                    <th className="pb-6 px-4">État</th>
                                    <th className="pb-6 px-4">Dernière Connexion</th>
                                    <th className="pb-6 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {displayedUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center text-[10px] font-black tracking-widest uppercase text-slate-300">Aucun stagiaire trouvé</td>
                                    </tr>
                                ) : (
                                    displayedUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-6 px-4 text-[10px] font-black text-slate-400">{user.id}</td>
                                            <td className="py-6 px-4">
                                                <span className="text-sm font-black italic text-[var(--secondary)] uppercase transition-colors group-hover:text-[var(--primary)]">{user.name}</span>
                                            </td>
                                            <td className="py-6 px-4">
                                                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black bg-slate-100 px-3 py-1 rounded-full">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-6 px-4">
                                                <span className={`text-[9px] font-black tracking-widest px-3 py-1 rounded-full border ${user.status === 'ACTIVE'
                                                    ? 'border-[var(--primary)] text-[var(--primary)] bg-green-50/50'
                                                    : 'border-slate-200 text-slate-400 bg-slate-50'
                                                    }`}>
                                                    {user.status || 'ACTIF'}
                                                </span>
                                            </td>
                                            <td className="py-6 px-4 text-[10px] font-bold text-slate-400 uppercase italic">
                                                {user.lastLogin || 'Récent'}
                                            </td>
                                            <td className="py-6 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(user)}
                                                        className="p-3 rounded-xl border border-slate-100 hover:border-[var(--primary)] hover:text-[var(--primary)] text-slate-400 transition-all bg-white shadow-sm"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setUserToDelete(user)}
                                                        className="p-3 rounded-xl border border-slate-100 hover:border-red-500 hover:text-red-500 text-slate-400 transition-all bg-white shadow-sm"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* FORMATEUR SECTION */}
            <div className="flex items-center pt-16 mb-4 gap-6">
                <h2 className="text-4xl font-black italic tracking-tighter text-[var(--secondary)] uppercase">Formateurs</h2>
                <div className="flex-1 border-b border-slate-100"></div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm transition-all duration-500 mb-12">
                <div className="overflow-x-auto ista-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-50">
                                <th className="pb-6 px-4">ID</th>
                                <th className="pb-6 px-4">Nom Complet</th>
                                <th className="pb-6 px-4">Groupes Assignés</th>
                                <th className="pb-6 px-4">État</th>
                                <th className="pb-6 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {formateurs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-[10px] font-black tracking-widest uppercase text-slate-300">Aucun formateur trouvé</td>
                                </tr>
                            ) : (
                                formateurs.map((formateur) => {
                                    const assignedClasses = availableClasses
                                        .filter(cls => cls.lead && cls.lead.includes(formateur.name))
                                        .map(cls => cls.id);

                                    return (
                                        <tr key={formateur.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-6 px-4 text-[10px] font-black text-slate-400">{formateur.id}</td>
                                            <td className="py-6 px-4">
                                                <span className="text-sm font-black italic text-[var(--secondary)] uppercase group-hover:text-[var(--primary)] transition-colors">{formateur.name}</span>
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {assignedClasses.length > 0 ? (
                                                        assignedClasses.map(clsId => (
                                                            <span key={clsId} className="px-3 py-1 bg-slate-50 text-[9px] font-black text-[var(--primary)] border border-green-500/10 rounded-lg">
                                                                {clsId}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[9px] font-bold text-slate-300 uppercase italic">NON ASSIGNÉ</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <span className="text-[9px] font-black tracking-widest px-3 py-1 rounded-full border border-[var(--primary)] text-[var(--primary)] bg-green-50/50">
                                                    ACTIF
                                                </span>
                                            </td>
                                            <td className="py-6 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(formateur)}
                                                        className="p-3 rounded-xl border border-slate-100 hover:border-[var(--primary)] hover:text-[var(--primary)] text-slate-400 transition-all bg-white shadow-sm"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setUserToDelete(formateur)}
                                                        className="p-3 rounded-xl border border-slate-100 hover:border-red-500 hover:text-red-500 text-slate-400 transition-all bg-white shadow-sm"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DELETE CONFIRMATION OVERLAY */}
            {userToDelete && ReactDOM.createPortal(
                <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-500 animate-in fade-in">
                    <div className="bg-white rounded-[40px] w-full max-w-md p-12 relative shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                        <button
                            onClick={() => setUserToDelete(null)}
                            className="absolute top-8 right-8 text-slate-300 hover:text-[var(--secondary)] transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-red-50 rounded-[32px] flex items-center justify-center mb-8">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-3xl font-black italic tracking-tighter text-[var(--secondary)] uppercase mb-4">Confirmation</h3>
                            <p className="text-sm font-bold text-slate-400 leading-relaxed mb-10">
                                Vous êtes sur le point de supprimer <span className="text-red-500">{userToDelete.name}</span>. Cette action est irréversible et révoquera tous les accès.
                            </p>

                            <div className="flex flex-col w-full gap-4">
                                <button
                                    onClick={handleDeleteUser}
                                    className="w-full bg-red-500 text-white py-5 rounded-2xl font-black tracking-widest text-xs uppercase hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all active:scale-[0.98]"
                                >
                                    SUPPRIMER DÉFINITIVEMENT
                                </button>
                                <button
                                    onClick={() => setUserToDelete(null)}
                                    className="w-full bg-slate-50 text-[var(--secondary)] py-5 rounded-2xl font-black tracking-widest text-xs uppercase hover:bg-slate-100 transition-all active:scale-[0.98]"
                                >
                                    ANNULER
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <IdentityModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setIsEditing(false);
                }}
                isEditing={isEditing}
                newUser={newUser}
                setNewUser={setNewUser}
                handleAddUser={handleAddUser}
                handleUpdateUser={handleUpdateUser}
                selectedClass={selectedClass}
                availableClasses={availableClasses}
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
