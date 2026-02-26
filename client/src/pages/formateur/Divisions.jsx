import React, { useState, useEffect } from 'react';
import { Search, UserCheck, BookOpen, Layers, Filter, ChevronDown } from 'lucide-react';
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
                const res = await axios.get('http://localhost:5000/api/formateur/schedule', config);
                setAvailableClasses(res.data.classes || []);
                if (res.data.classes?.length > 0) {
                    setSelectedClass(res.data.classes[0].id);
                }
            } catch (error) {
                console.error('Error fetching classes', error);
                addNotification('Registry access failed.', 'error');
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
                const res = await axios.get(`http://localhost:5000/api/formateur/users/by-class/${selectedClass}`, config);
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
        return <div className="flex items-center justify-center h-screen bg-black text-white">ACCESSING REGISTRY...</div>;
    }

    return (
        <div className="space-y-12 fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--border-strong)] pb-12">
                <div className="space-y-4">
                    <p className="text-[var(--text-muted)] text-[10px] tracking-[0.5em] font-black uppercase">Supervised Cluster Registry</p>
                    <h1 className="text-7xl font-black tracking-tighter text-[var(--primary)] uppercase italic">Divisions</h1>
                </div>
                <div className="flex items-center border-b border-[var(--border-strong)] w-full md:w-80 group focus-within:border-[var(--primary)] transition-colors">
                    <Search className="w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="SEARCH NODES..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none text-[11px] py-4 px-6 w-full tracking-[0.2em] font-bold focus:ring-0 uppercase text-[var(--text)]"
                    />
                </div>
            </div>

            {/* Class Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {availableClasses.map((cls) => (
                    <div
                        key={cls.id}
                        onClick={() => setSelectedClass(cls.id)}
                        className={`p-8 border transition-all duration-500 group cursor-pointer relative overflow-hidden flex flex-col h-full ${selectedClass === cls.id
                                ? 'border-[var(--primary)] bg-[var(--surface-hover)]'
                                : 'border-[var(--border-strong)] bg-[var(--surface)] hover:border-[var(--primary)]'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className={`w-10 h-10 flex items-center justify-center border transition-colors ${selectedClass === cls.id ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-[var(--border-strong)] text-[var(--text-muted)]'
                                }`}>
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <span className={`text-[10px] font-black tracking-widest ${selectedClass === cls.id ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'
                                }`}>{cls.id}</span>
                        </div>

                        <h3 className="text-3xl font-black italic text-[var(--primary)] tracking-tighter mb-4 transition-colors relative z-10 truncate">
                            {cls.title}
                        </h3>

                        <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black mb-8 relative z-10">
                            {cls.stream}
                        </p>

                        <div className="mt-auto pt-6 border-t border-[var(--border-strong)] flex items-center justify-between relative z-10">
                            <span className="text-[9px] font-black tracking-[0.2em] text-[var(--text-muted)] uppercase">Status</span>
                            <span className={`text-[9px] font-black tracking-[0.2em] uppercase ${selectedClass === cls.id ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] opacity-50'
                                }`}>
                                {selectedClass === cls.id ? 'ACTIVE_CLUSTER' : 'STANDBY'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Student Table */}
            <div className="pt-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xs font-black tracking-[0.5em] uppercase text-[var(--primary)] flex items-center gap-4">
                        <Layers className="w-4 h-4" />
                        Student Manifest :: {selectedClass}
                    </h2>
                </div>

                <div className="border border-[var(--border-strong)] bg-[var(--background)] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--surface)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest border-b border-[var(--border-strong)]">
                                <th className="p-8">Node Identifier</th>
                                <th className="p-8">Communication Key</th>
                                <th className="p-8">Status</th>
                                <th className="p-8 text-right">Registry</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-strong)]">
                            {displayedUsers.length > 0 ? displayedUsers.map((student) => (
                                <tr key={student.id} className="hover:bg-[var(--surface)] transition-colors group">
                                    <td className="p-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-[var(--surface-hover)] border border-[var(--border-strong)] flex items-center justify-center text-[11px] font-black group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-text)] group-hover:border-[var(--primary)] transition-all">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold tracking-widest text-[var(--primary)] uppercase italic group-hover:translate-x-1 transition-transform">{student.name}</span>
                                                <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest mt-1">ID: {student.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase transition-colors group-hover:text-[var(--text)]">{student.email}</span>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_8px_var(--primary)]"></div>
                                            <span className="text-[9px] font-black tracking-[0.2em] text-[var(--primary)] uppercase">VERIFIED</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="text-[9px] font-bold text-[var(--text-muted)] tracking-widest uppercase transition-colors group-hover:text-[var(--primary)]">
                                            {student.lastLogin}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center opacity-30 italic text-xs tracking-widest grayscale font-black uppercase">
                                        No telemetry found for selected cluster.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Divisions;
