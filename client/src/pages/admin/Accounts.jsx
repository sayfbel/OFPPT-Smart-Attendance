import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, UserCheck, UserX, ChevronDown, Edit3, Trash2, AlertTriangle, X } from 'lucide-react';
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

                const res = await axios.get('http://localhost:5000/api/admin/schedule', config);
                setAvailableClasses(res.data.classes || []);

                const fRes = await axios.get('http://localhost:5000/api/admin/formateurs', config);
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
                const res = await axios.get(`http://localhost:5000/api/admin/users/by-class/${selectedClass}`, config);
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
                addNotification('Please select a squadron (Class) first.', 'error');
                return;
            }
            if (newUser.role === 'formateur' && (!newUser.class_ids || newUser.class_ids.length === 0)) {
                addNotification('Please select at least one squadron for the Formateur.', 'error');
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

            const res = await axios.post('http://localhost:5000/api/admin/users', payload, config);

            if (newUser.role === 'formateur') {
                const fRes = await axios.get('http://localhost:5000/api/admin/formateurs', config);
                setFormateurs(fRes.data.formateurs || []);
            } else if (payload.class_id === selectedClass) {
                setUsers([...users, res.data.user]);
            }

            setIsModalOpen(false);
            setNewUser({ name: '', email: '', role: 'stagiaire', class_ids: [] });
            addNotification('Identity successfully configured.', 'success');
        } catch (error) {
            console.error('Error adding user', error);
            addNotification(error.response?.data?.message || 'Error configuring identity', 'error');
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

            await axios.put(`http://localhost:5000/api/admin/users/${newUser.id}`, payload, config);

            // Refresh data
            if (newUser.role === 'formateur') {
                const fRes = await axios.get('http://localhost:5000/api/admin/formateurs', config);
                setFormateurs(fRes.data.formateurs || []);
            } else {
                setUsers(prev => prev.map(u => u.id === newUser.id ? { ...u, ...newUser } : u));
            }

            setIsModalOpen(false);
            setIsEditing(false);
            addNotification('Identity parameters updated.', 'success');
        } catch (error) {
            console.error('Error updating user', error);
            addNotification(error.response?.data?.message || 'Error updating identity', 'error');
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/admin/users/${userToDelete.id}`, config);

            if (userToDelete.role === 'formateur') {
                setFormateurs(prev => prev.filter(f => f.id !== userToDelete.id));
            } else {
                setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            }

            setUserToDelete(null);
            addNotification('Identity purged from network.', 'success');
        } catch (error) {
            console.error('Error deleting user', error);
            addNotification('Neural Link Failure: Error during identity deletion.', 'error');
        }
    };

    return (
        <div className="space-y-12 fade-up transition-colors duration-500">
            <div className="flex items-end justify-between border-b border-[var(--border-strong)] pb-12 transition-colors duration-500">
                <div className="space-y-4">
                    <h1 className="text-7xl font-black tracking-tighter text-[var(--primary)] uppercase italic transition-colors duration-500">Accounts</h1>
                    <p className="text-[var(--text-muted)] text-xs tracking-[0.4em] uppercase font-bold transition-colors duration-500">Network Access Management</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            className="btn-noir btn-outline px-6 py-3 flex items-center gap-2"
                        >
                            <Filter className="w-3 h-3" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">{streamFilter === 'ALL' ? 'ALL FILIERES' : `${streamFilter} FILIERE`}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 bg-[var(--background)] border border-[var(--border-strong)] z-50 shadow-2xl min-w-[200px] fade-up">
                                {uniqueStreams.map(stream => (
                                    <div
                                        key={stream}
                                        className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors hover:bg-[var(--surface-hover)] ${streamFilter === stream ? 'bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
                                        onClick={() => {
                                            setStreamFilter(stream);
                                            setIsFilterDropdownOpen(false);
                                        }}
                                    >
                                        {stream === 'ALL' ? 'ALL FILIERES' : `${stream} SQUADRONS`}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => {
                        setNewUser({ name: '', email: '', role: 'stagiaire', class_ids: [] });
                        setIsEditing(false);
                        setIsModalOpen(true);
                    }} className="btn-noir px-8 py-3">
                        <Plus className="w-3 h-3 mr-2 inline-block" />
                        <span>Add Identity</span>
                    </button>
                </div>
            </div>

            {/* STAGIAIRE SECTION */}
            <div className="flex gap-6 border-t border-[var(--border-strong)] pb-8 overflow-x-auto no-scrollbar transition-colors duration-500">
                {displayedClasses.map((cls, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedClass(cls.id)}
                        className={`min-w-[300px] flex-shrink-0 p-8 border transition-all duration-500 group cursor-pointer ${selectedClass === cls.id
                            ? 'border-[var(--primary)] bg-[var(--surface-hover)]'
                            : 'border-[var(--border-strong)] bg-[var(--surface)] hover:border-[var(--primary)]'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black tracking-[0.3em] text-[var(--primary)] uppercase">{cls.id}</span>
                            <span className={`px-3 py-1 border text-[9px] font-bold tracking-widest uppercase transition-colors duration-500 ${selectedClass === cls.id ? 'bg-[var(--primary)] text-[var(--primary-text)] border-[var(--primary)]' : 'bg-[var(--background)] text-[var(--primary)] border-[var(--border)] group-hover:border-[var(--primary)]'
                                }`}>
                                {selectedClass === cls.id ? 'ACTIVE' : 'STANDBY'}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black italic text-[var(--primary)] tracking-tighter mb-2 transition-colors duration-500 truncate">{cls.title}</h3>
                        <div className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest mt-6 pt-6 border-t border-[var(--border-strong)] transition-colors duration-500">
                            <span className="text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors">STREAM: <span className="text-[var(--primary)]">{cls.stream}</span></span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center pt-8 mb-8">
                <h2 className="text-6xl font-black italic tracking-tighter text-[var(--text-muted)] uppercase mr-6">STAGIAIRE</h2>
                <div className="flex-1 border-b border-[var(--border-strong)]"></div>
            </div>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black tracking-[0.5em] uppercase text-[var(--text-muted)] transition-colors duration-500">Identity Manifest</h3>
                    <div className="flex items-center border-b border-[var(--border)] w-80 group focus-within:border-[var(--primary)] transition-colors duration-500">
                        <Search className="w-3 h-3 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-500" />
                        <input
                            type="text"
                            placeholder="FIND IDENTIFIER..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-[10px] py-3 px-4 w-full tracking-widest focus:ring-0 text-[var(--primary)] placeholder-[var(--text-muted)]"
                        />
                    </div>
                </div>

                {!selectedClass ? (
                    <div className="border border-[var(--border-strong)] border-dashed py-24 flex flex-col items-center justify-center text-center opacity-50">
                        <span className="text-xs font-black tracking-[0.5em] uppercase text-[var(--primary)] mb-4">AWAITING SQUADRON SELECTION</span>
                        <p className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">Please select an operational cluster above to view its assigned identity manifest.</p>
                    </div>
                ) : (
                    <div className="border border-[var(--border-strong)] overflow-hidden bg-[var(--background)] transition-colors duration-500">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--surface)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest transition-colors duration-500">
                                    <th className="p-8">ID Token</th>
                                    <th className="p-8">Known Alias</th>
                                    <th className="p-8">Access Level</th>
                                    <th className="p-8">State</th>
                                    <th className="p-8">Last Ping</th>
                                    <th className="p-8 text-right">Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-strong)] transition-colors duration-500">
                                {displayedUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-16 text-center text-[10px] font-black tracking-[0.3em] uppercase text-[var(--text-muted)]">No matching identities found</td>
                                    </tr>
                                ) : (
                                    displayedUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-[var(--surface-hover)] transition-colors duration-500 group">
                                            <td className="p-8 text-[10px] font-black tracking-widest text-[var(--text-muted)]">
                                                {user.id}
                                            </td>
                                            <td className="p-8">
                                                <span className="text-xs font-bold tracking-widest text-[var(--primary)] uppercase italic transition-colors duration-500">{user.name}</span>
                                            </td>
                                            <td className="p-8">
                                                <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold bg-[var(--surface)] px-3 py-1 transition-colors duration-500">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <span className={`text-[9px] font-black tracking-[0.2em] px-3 py-1 border transition-colors duration-500 ${user.status === 'ACTIVE'
                                                    ? 'border-[var(--primary)] text-[var(--primary)]'
                                                    : 'border-[var(--border)] text-[var(--text-muted)]'
                                                    }`}>
                                                    {user.status || 'ACTIVE'}
                                                </span>
                                            </td>
                                            <td className="p-8 text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
                                                {user.lastLogin || 'Just now'}
                                            </td>
                                            <td className="p-8 text-right">
                                                <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEditClick(user)}
                                                        className="p-2 border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] text-[var(--text-muted)] transition-colors duration-500"
                                                    >
                                                        <Edit3 className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => setUserToDelete(user)}
                                                        className="p-2 border border-[var(--border)] hover:border-red-500 hover:text-red-500 text-[var(--text-muted)] transition-colors duration-500"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
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
            <div className="flex items-center pt-16 mb-8">
                <h2 className="text-6xl font-black italic tracking-tighter text-[var(--text-muted)] uppercase mr-6">FORMATEUR</h2>
                <div className="flex-1 border-b border-[var(--border-strong)]"></div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black tracking-[0.5em] uppercase text-[var(--text-muted)] transition-colors duration-500">Staff Manifest</h3>
                </div>

                <div className="border border-[var(--border-strong)] overflow-hidden bg-[var(--background)] transition-colors duration-500">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--surface)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest transition-colors duration-500">
                                <th className="p-8">Staff Token</th>
                                <th className="p-8">Known Alias</th>
                                <th className="p-8">Assigned Squadrons</th>
                                <th className="p-8">State</th>
                                <th className="p-8 text-right">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-strong)] transition-colors duration-500">
                            {formateurs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-16 text-center text-[10px] font-black tracking-[0.3em] uppercase text-[var(--text-muted)]">No active staff found</td>
                                </tr>
                            ) : (
                                formateurs.map((formateur) => {
                                    const assignedClasses = availableClasses
                                        .filter(cls => cls.lead && cls.lead.includes(formateur.name))
                                        .map(cls => cls.id);

                                    return (
                                        <tr key={formateur.id} className="hover:bg-[var(--surface-hover)] transition-colors duration-500 group">
                                            <td className="p-8 text-[10px] font-black tracking-widest text-[var(--text-muted)]">
                                                {formateur.id}
                                            </td>
                                            <td className="p-8">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold tracking-widest text-[var(--primary)] uppercase italic transition-colors duration-500">{formateur.name}</span>
                                                    <span className="text-[9px] font-bold tracking-widest text-[var(--text-muted)] uppercase mt-1 transition-colors duration-500">{formateur.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex flex-wrap gap-2">
                                                    {assignedClasses.length > 0 ? (
                                                        assignedClasses.map(clsId => (
                                                            <span key={clsId} className="px-3 py-1 bg-[var(--surface)] text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold border border-[var(--border)] transition-colors duration-500">
                                                                {clsId}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase italic">UNASSIGNED</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <span className={`text-[9px] font-black tracking-[0.2em] px-3 py-1 border transition-colors duration-500 border-[var(--primary)] text-[var(--primary)]`}>
                                                    ACTIVE
                                                </span>
                                            </td>
                                            <td className="p-8 text-right">
                                                <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEditClick(formateur)}
                                                        className="p-2 border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] text-[var(--text-muted)] transition-colors duration-500"
                                                    >
                                                        <Edit3 className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => setUserToDelete(formateur)}
                                                        className="p-2 border border-[var(--border)] hover:border-red-500 hover:text-red-500 text-[var(--text-muted)] transition-colors duration-500"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
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
            {userToDelete && (
                <div className="fixed inset-0 z-[10000] bg-[var(--background)]/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-500">
                    <div className="bg-[var(--background)] border border-[var(--border-strong)] w-full max-w-md p-10 relative fade-up">
                        <button
                            onClick={() => setUserToDelete(null)}
                            className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--primary)]"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-4 mb-8 text-red-500">
                            <AlertTriangle className="w-8 h-8" />
                            <h3 className="text-2xl font-black italic tracking-tighter uppercase">Purge Confirmation</h3>
                        </div>

                        <p className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase leading-relaxed mb-10">
                            You are about to purge <span className="text-[var(--primary)]">{userToDelete.name}</span> from the central registry. This operation is irreversible and will revoke all network access.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={handleDeleteUser}
                                className="flex-1 bg-red-500 text-[var(--background)] py-4 font-black tracking-[0.3em] text-[10px] uppercase hover:bg-red-600 transition-colors"
                            >
                                YES_PURGE
                            </button>
                            <button
                                onClick={() => setUserToDelete(null)}
                                className="flex-1 border border-[var(--border-strong)] text-[var(--text-muted)] py-4 font-black tracking-[0.3em] text-[10px] uppercase hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                            >
                                CANCEL_OP
                            </button>
                        </div>
                    </div>
                </div>
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
        </div>
    );
};

export default Accounts;
