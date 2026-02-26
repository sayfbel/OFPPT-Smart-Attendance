import React, { useState, useEffect } from 'react';
import { Search, Plus, BookOpen, Layers, Save, X, Filter, ChevronDown, Edit3, Trash2 } from 'lucide-react';
import axios from 'axios';
import ClassDossierModal from '../../components/ClassDossierModal';
import { useNotification } from '../../context/NotificationContext';

const Squadrons = () => {
    const { addNotification } = useNotification();
    const [classes, setClasses] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [newClass, setNewClass] = useState({ id: '', title: '', stream: '', lead: [] });

    const [flippedCardId, setFlippedCardId] = useState(null);
    const [editData, setEditData] = useState({ title: '', stream: '', lead: [] });
    const [streamFilter, setStreamFilter] = useState('ALL');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('http://localhost:5000/api/admin/schedule', config);
                setClasses(res.data.classes || []);

                const formateurRes = await axios.get('http://localhost:5000/api/admin/formateurs', config);
                setFormateurs(formateurRes.data.formateurs || []);
            } catch (error) {
                console.error('Error fetching classes or formateurs', error);
            }
        };
        fetchClasses();
    }, []);

    const handleAddClass = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                ...newClass,
                lead: Array.isArray(newClass.lead) ? newClass.lead.join(', ') : newClass.lead
            };

            const res = await axios.post('http://localhost:5000/api/admin/classes', payload, config);

            setClasses([...classes, res.data.class]);
            setIsClassModalOpen(false);
            setNewClass({ id: '', title: '', stream: '', lead: [] });
            addNotification('Squadron designated and deployed successfully.', 'success');
        } catch (error) {
            console.error('Error creating class', error);
            addNotification(error.response?.data?.message || 'Error configuring class', 'error');
        }
    };

    const handleUpdateClass = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                ...editData,
                lead: Array.isArray(editData.lead) ? editData.lead.join(', ') : editData.lead
            };

            const res = await axios.put(`http://localhost:5000/api/admin/classes/${id}`, payload, config);

            setClasses(classes.map(c => c.id === id ? res.data.class : c));
            setFlippedCardId(null);
            addNotification('Squadron telemetry updated.', 'success');
        } catch (error) {
            console.error('Error updating class', error);
            addNotification(error.response?.data?.message || 'Error updating squadron', 'error');
        }
    };

    const handlePurgeClass = async (id) => {
        if (!window.confirm(`ARE YOU SURE YOU WANT TO PURGE SQUADRON ${id}? THIS WILL DELETE ALL ASSOCIATED SCHEDULE ENTRIES.`)) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/admin/classes/${id}`, config);
            setClasses(prev => prev.filter(c => c.id !== id));
            addNotification('Squadron purged from network.', 'success');
        } catch (error) {
            console.error('Error deleting class', error);
            addNotification('Neural Link Failure: Error during squadron deletion.', 'error');
        }
    };

    const handleFlip = (cls) => {
        if (flippedCardId === cls.id) {
            setFlippedCardId(null);
        } else {
            setFlippedCardId(cls.id);
            setEditData({
                title: cls.title || cls.name || '',
                stream: cls.stream || '',
                lead: cls.lead ? cls.lead.split(',').map(s => s.trim()) : []
            });
            setIsEditDropdownOpen(false);
        }
    };

    const uniqueStreams = ['ALL', ...new Set(classes.map(c => c.stream).filter(Boolean))];
    const filteredClasses = streamFilter === 'ALL' ? classes : classes.filter(c => c.stream === streamFilter);

    return (
        <div className="space-y-12 fade-up transition-colors duration-500">
            <div className="flex items-end justify-between border-b border-[var(--border-strong)] pb-12 transition-colors duration-500">
                <div className="space-y-4">
                    <h1 className="text-7xl font-black tracking-tighter text-[var(--primary)] uppercase italic transition-colors duration-500">Squadrons</h1>
                    <p className="text-[var(--text-muted)] text-xs tracking-[0.4em] uppercase font-bold transition-colors duration-500">Educational Divisions & Clusters</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            className="btn-noir btn-outline px-6 py-3 flex items-center gap-2"
                        >
                            <Filter className="w-3 h-3" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">{streamFilter === 'ALL' ? 'ALL STREAMS' : streamFilter}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 bg-[var(--background)] border border-[var(--border-strong)] z-50 shadow-2xl min-w-[200px] fade-up">
                                {uniqueStreams.map(stream => (
                                    <div
                                        key={stream}
                                        className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors hover:bg-[var(--surface-hover)] ${streamFilter === stream ? 'bg-[var(--primary)] text-[var(--background)]' : 'text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
                                        onClick={() => {
                                            setStreamFilter(stream);
                                            setIsFilterDropdownOpen(false);
                                        }}
                                    >
                                        {stream === 'ALL' ? 'ALL STREAMS' : stream}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button onClick={() => setIsClassModalOpen(true)} className="btn-noir px-8 py-3">
                        <Plus className="w-3 h-3 mr-2 inline-block" />
                        <span>Create Squadron</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredClasses.map((cls) => (
                    <div key={cls.id} className="perspective-1000 h-[400px]">
                        <div className={`card-inner ${flippedCardId === cls.id ? 'card-flipped' : ''}`}>
                            {/* Front Side */}
                            <div className="card-front border border-[var(--border-strong)] bg-[var(--background)] p-10 hover:border-[var(--primary)] transition-colors duration-500 group relative overflow-hidden h-full flex flex-col">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--surface)] opacity-50 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform"></div>

                                <div className="flex justify-between items-start mb-8 relative">
                                    <div className="w-12 h-12 bg-[var(--primary)] text-[var(--primary-text)] flex items-center justify-center transition-colors duration-500">
                                        <BookOpen className="w-5 h-5 flex-shrink-0" />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleFlip(cls)}
                                            className="p-2 bg-[var(--background)] border border-[var(--border-strong)] hover:border-[var(--primary)] hover:text-[var(--primary)] text-[var(--text-muted)] transition-colors"
                                        >
                                            <Edit3 className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePurgeClass(cls.id);
                                            }}
                                            className="p-2 bg-[var(--background)] border border-[var(--border-strong)] hover:border-red-500 hover:text-red-500 text-[var(--text-muted)] transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                <div onClick={() => handleFlip(cls)} className="cursor-pointer flex-1 flex flex-col">
                                    <h2 className="text-4xl font-black italic text-[var(--primary)] mb-2 transition-colors duration-500">{cls.title || cls.name}</h2>
                                    <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold mb-8 transition-colors duration-500">{cls.stream}</p>

                                    <div className="mt-auto flex justify-between items-center border-t border-[var(--border-strong)] pt-6 transition-colors duration-500">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-1 transition-colors duration-500">Node Count</p>
                                            <p className="text-xl font-black text-[var(--primary)] transition-colors duration-500">
                                                {cls.students !== undefined && cls.students !== null ? cls.students : '0'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-1 transition-colors duration-500">Supervisor</p>
                                            <p className="text-sm font-bold text-gray-500 transition-colors duration-500">{cls.formateur || cls.lead}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Back Side (Update Form) */}
                            <div className="card-back p-10 flex flex-col h-full bg-[var(--surface)]">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-black tracking-widest text-[var(--primary)] text-left uppercase">Update Registry</span>
                                    <button onClick={() => setFlippedCardId(null)} className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-6 flex-1 text-left">
                                    <div>
                                        <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={editData.title}
                                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                            className="w-full text-xs font-bold tracking-widest uppercase border-b border-[var(--border-strong)] bg-transparent py-2 focus:border-[var(--primary)] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">Stream / Filière</label>
                                        <input
                                            type="text"
                                            value={editData.stream}
                                            onChange={(e) => setEditData({ ...editData, stream: e.target.value })}
                                            className="w-full text-xs font-bold tracking-widest uppercase border-b border-[var(--border-strong)] bg-transparent py-2 focus:border-[var(--primary)] outline-none"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">Supervisors</label>
                                        <div
                                            onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
                                            className="w-full bg-transparent border-b border-[var(--border-strong)] py-2 flex justify-between items-center cursor-pointer group/lead"
                                        >
                                            <span className={`text-[10px] font-bold tracking-widest uppercase truncate ${editData.lead.length > 0 ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
                                                {editData.lead.length > 0 ? editData.lead.join(', ') : 'SELECT SUPERVISORS...'}
                                            </span>
                                            <ChevronDown className={`w-3 h-3 text-[var(--primary)] transition-transform ${isEditDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>

                                        {isEditDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full mt-1 bg-[var(--background)] border border-[var(--border-strong)] z-50 shadow-2xl max-h-32 overflow-y-auto custom-scrollbar">
                                                {formateurs.map((f) => {
                                                    const isSelected = editData.lead.includes(f.name);
                                                    return (
                                                        <div
                                                            key={f.id}
                                                            className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors hover:bg-[var(--surface-hover)] ${isSelected ? 'bg-[var(--surface-hover)]' : ''}`}
                                                            onClick={() => {
                                                                const newLead = isSelected
                                                                    ? editData.lead.filter(l => l !== f.name)
                                                                    : [...editData.lead, f.name];
                                                                setEditData({ ...editData, lead: newLead });
                                                            }}
                                                        >
                                                            <span className={`text-[9px] font-black tracking-widest uppercase ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>{f.name}</span>
                                                            {isSelected ? <CheckSquare className="w-3 h-3 text-[var(--primary)]" /> : <Square className="w-3 h-3 text-[var(--border-strong)]" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleUpdateClass(cls.id)}
                                    className="btn-noir w-full py-4 mt-8 flex items-center justify-center gap-2 group"
                                >
                                    <Save className="w-3 h-3 transition-transform group-hover:scale-110" />
                                    <span>Sync Changes</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create New Card */}
                <div
                    onClick={() => setIsClassModalOpen(true)}
                    className="border border-[var(--border-strong)] border-dashed bg-transparent p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[var(--surface)] hover:border-solid transition-all duration-500 group h-[400px]"
                >
                    <div className="w-16 h-16 rounded-full border border-[var(--border)] flex items-center justify-center mb-6 group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-text)] transition-colors duration-500">
                        <Plus className="w-6 h-6 text-[var(--text-muted)] group-hover:text-[var(--primary-text)] transition-colors duration-500" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-widest text-[var(--primary)] mb-2 transition-colors duration-500">Initialize Cluster</h3>
                    <p className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase transition-colors duration-500">Deploy new division</p>
                </div>
            </div>

            <ClassDossierModal
                isOpen={isClassModalOpen}
                onClose={() => setIsClassModalOpen(false)}
                newClass={newClass}
                setNewClass={setNewClass}
                handleAddClass={handleAddClass}
                formateurs={formateurs}
            />
        </div>
    );
};

export default Squadrons;
