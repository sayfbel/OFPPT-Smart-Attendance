import React, { useState, useEffect } from 'react';
import { Search, UserCheck, BookOpen, Layers, Filter, ChevronDown, User, Mail, Activity } from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';

const Divisions = () => {
    const { addNotification } = useNotification();
    const [availableClasses, setAvailableClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('/api/formateur/schedule', config);
                setAvailableClasses(res.data.classes || []);
                if (res.data.classes?.length > 0) {
                    setSelectedClass(res.data.classes[0].id);
                }
            } catch (error) {
                console.error('Error fetching classes', error);
                addNotification('Échec de la récupération des groupes.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, [addNotification]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!selectedClass) return;
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`/api/formateur/users/by-class/${selectedClass}`, config);
                setUsers(res.data.users || []);
            } catch (error) {
                console.error('Error fetching users', error);
                setUsers([]);
            }
        };
        fetchUsers();
    }, [selectedClass]);

    const displayedUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-[var(--primary)] rounded-full animate-spin mb-6"></div>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">Chargement du Registre...</span>
            </div>
        );
    }

    return (
        <div className="space-y-12 fade-up transition-all duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-slate-100 pb-12 gap-8">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-none">Groupes</h1>
                    <p className="text-[var(--text-muted)] text-xs tracking-[0.4em] uppercase font-black">Registre des Groupes Supervisés</p>
                </div>
                <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl w-full md:w-80 group focus-within:border-[var(--primary)] transition-all px-5">
                    <Search className="w-4 h-4 text-slate-300 group-focus-within:text-[var(--primary)] transition-colors" />
                    <input
                        type="text"
                        placeholder="RECHERCHER UN STAGIAIRE..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none text-[11px] font-bold py-4 px-4 w-full tracking-widest focus:ring-0 text-[var(--secondary)] placeholder-slate-300 uppercase"
                    />
                </div>
            </div>

            {/* Class Selection Grid */}
            <div className="flex gap-6 overflow-x-auto ista-scrollbar pb-6 pt-2">
                {availableClasses.map((cls) => (
                    <div
                        key={cls.id}
                        onClick={() => setSelectedClass(cls.id)}
                        className={`min-w-[280px] flex-shrink-0 p-8 rounded-3xl border transition-all duration-500 group cursor-pointer relative overflow-hidden flex flex-col ${selectedClass === cls.id
                            ? 'border-[var(--primary)] bg-green-50/30 ring-4 ring-green-500/5 shadow-xl shadow-green-500/5'
                            : 'border-slate-100 bg-white hover:border-[var(--primary)]/30 hover:shadow-lg'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${selectedClass === cls.id ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg shadow-green-500/20' : 'bg-slate-50 border-slate-100 text-slate-400'
                                }`}>
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] font-black tracking-widest uppercase ${selectedClass === cls.id ? 'text-[var(--primary)]' : 'text-slate-400'
                                }`}>{cls.id}</span>
                        </div>

                        <h3 className="text-2xl font-black italic text-[var(--secondary)] tracking-tight mb-2 transition-colors relative z-10 truncate group-hover:text-[var(--primary)]">
                            {cls.title}
                        </h3>

                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-8 relative z-10 italic">
                            {cls.stream}
                        </p>

                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                            <span className="text-[9px] font-black tracking-widest text-slate-300 uppercase">État</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${selectedClass === cls.id ? 'bg-[var(--primary)] animate-pulse' : 'bg-slate-200'}`}></div>
                                <span className={`text-[9px] font-black tracking-widest uppercase ${selectedClass === cls.id ? 'text-[var(--primary)]' : 'text-slate-400'
                                    }`}>
                                    {selectedClass === cls.id ? 'GROUPE SÉLECTIONNÉ' : 'EN ATTENTE'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Student Table */}
            <div className="pt-8">
                <div className="flex items-center gap-6 mb-8">
                    <h2 className="text-4xl font-black italic tracking-tighter text-[var(--secondary)] uppercase">Stagiaires</h2>
                    <span className="px-4 py-1.5 bg-[var(--primary)] text-white text-[9px] font-black rounded-lg shadow-lg shadow-green-500/20 uppercase tracking-widest">
                        Manifeste : {selectedClass}
                    </span>
                    <div className="flex-1 border-b border-slate-100"></div>
                </div>

                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden transition-all duration-500">
                    <div className="overflow-x-auto ista-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-100">
                                    <th className="py-6 px-8">Stagiaire</th>
                                    <th className="py-6 px-4">E-mail</th>
                                    <th className="py-6 px-4 text-center">Status</th>
                                    <th className="py-6 px-8 text-right">Dernière Connexion</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {displayedUsers.length > 0 ? displayedUsers.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[11px] font-black text-[var(--secondary)] group-hover:bg-[var(--primary)] group-hover:text-white group-hover:border-[var(--primary)] transition-all shadow-sm">
                                                    {student.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black italic text-[var(--secondary)] uppercase tracking-tight group-hover:text-[var(--primary)] transition-colors">{student.name}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">MATRICULE: {student.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-2 text-slate-400 group-hover:text-[var(--secondary)] transition-colors">
                                                <Mail className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-bold tracking-widest uppercase">{student.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="px-3 py-1 bg-green-50 text-[9px] font-black text-[var(--primary)] border border-green-500/10 rounded-lg flex items-center gap-2">
                                                    <Activity className="w-3 h-3" />
                                                    VÉRIFIÉ
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <span className="text-[10px] font-bold text-slate-300 uppercase italic transition-colors group-hover:text-slate-500">
                                                {student.lastLogin || 'Donnée indisponible'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="py-32 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                                    <Search className="w-8 h-8 text-slate-200" />
                                                </div>
                                                <p className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase italic">
                                                    Aucune donnée trouvée pour ce groupe.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Divisions;
