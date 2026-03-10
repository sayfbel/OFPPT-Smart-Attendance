import React, { useState, useEffect } from 'react';
import { Search, Plus, BookOpen, Layers, Save, X, Filter, ChevronDown, Edit3, Trash2, CheckSquare, Square, Users } from 'lucide-react';
import axios from 'axios';
import GroupModal from '../../components/GroupModal';
import ConfirmationModal from '../../components/ConfirmationModal';
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
    const [purgeInfo, setPurgeInfo] = useState({ isOpen: false, classId: '' });


    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('/api/admin/schedule', config);
                setClasses(res.data.classes || []);

                const formateurRes = await axios.get('/api/admin/formateurs', config);
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

            const res = await axios.post('/api/admin/classes', payload, config);

            setClasses([...classes, res.data.class]);
            setIsClassModalOpen(false);
            setNewClass({ id: '', title: '', stream: '', lead: [] });
            addNotification('Groupe créé et déployé avec succès.', 'success');
        } catch (error) {
            console.error('Error creating class', error);
            addNotification(error.response?.data?.message || 'Erreur lors de la configuration du groupe', 'error');
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

            const res = await axios.put(`/api/admin/classes/${id}`, payload, config);

            setClasses(classes.map(c => c.id === id ? res.data.class : c));
            setFlippedCardId(null);
            addNotification('Informations du groupe mises à jour.', 'success');
        } catch (error) {
            console.error('Error updating class', error);
            addNotification(error.response?.data?.message || 'Erreur lors de la mise à jour', 'error');
        }
    };

    const handlePurgeClass = async () => {
        const id = purgeInfo.classId;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`/api/admin/classes/${id}`, config);
            setClasses(prev => prev.filter(c => c.id !== id));
            addNotification('Groupe supprimé du système.', 'success');
            setPurgeInfo({ isOpen: false, classId: '' });
        } catch (error) {
            console.error('Error deleting class', error);
            addNotification('Échec de la suppression: Erreur serveur.', 'error');
            setPurgeInfo({ isOpen: false, classId: '' });
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
        <div className="space-y-12 fade-up transition-all duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-[var(--border)] pb-8 lg:pb-12 gap-6 lg:gap-8">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-[0.9]">Groupes</h1>
                    <div className="flex items-center gap-3 text-[var(--primary)] text-[9px] lg:text-xs tracking-[0.4em] uppercase font-black">
                        <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></div>
                        Filières et Divisions ISTA
                    </div>
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
                            <div className="absolute top-full right-0 mt-3 bg-white border border-[var(--border)] rounded-2xl z-50 shadow-2xl min-w-[240px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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

                    <button onClick={() => setIsClassModalOpen(true)} className="btn-ista px-8 py-4 flex items-center gap-3">
                        <Plus className="w-5 h-5" />
                        <span>CRÉER UN GROUPE</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredClasses.map((cls) => (
                    <div key={cls.id} className="perspective-1000 h-[420px]">
                        <div className={`card-inner ${flippedCardId === cls.id ? 'card-flipped' : ''}`}>
                            {/* Front Side */}
                            <div className="card-front rounded-3xl border border-[var(--border)] bg-white p-10 shadow-sm hover:shadow-xl hover:border-[var(--primary)]/30 transition-all duration-500 group relative overflow-hidden h-full flex flex-col">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 opacity-50 rounded-bl-[100px] transform translate-x-16 -translate-y-16 group-hover:bg-green-50 transition-all duration-500"></div>

                                <div className="flex justify-between items-start mb-8 relative">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500 border border-slate-100 group-hover:border-[var(--primary)]">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleFlip(cls)}
                                            className="p-3 bg-white rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] text-slate-400 transition-all shadow-sm"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPurgeInfo({ isOpen: true, classId: cls.id });
                                            }}
                                            className="p-3 bg-white rounded-xl border border-[var(--border)] hover:border-red-500 hover:text-red-500 text-slate-400 transition-all shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <div className="mb-2">
                                        <span className="text-[10px] font-black text-[var(--primary)] tracking-widest uppercase">{cls.id}</span>
                                        <h2 className="text-3xl font-black italic text-[var(--secondary)] tracking-tight leading-tight uppercase transition-colors duration-500 group-hover:text-[var(--primary)]">{cls.title || cls.name}</h2>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black mb-auto mt-2 italic">{cls.stream}</p>

                                    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-50 pt-8">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1">Stagiaires</p>
                                            <p className="text-2xl font-black text-[var(--secondary)] transition-colors duration-500">
                                                {cls.students !== undefined && cls.students !== null ? cls.students : '0'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1">Formateur(s)</p>
                                            <p className="text-xs font-bold text-[var(--secondary)] truncate">{cls.formateur || cls.lead}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Back Side (Update Form) */}
                            <div className="card-back rounded-3xl border border-[var(--border)] bg-slate-50 p-10 flex flex-col h-full shadow-2xl">
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-[10px] font-black tracking-widest text-[var(--secondary)] text-left uppercase">Mise à jour du Groupe</span>
                                    <button onClick={() => setFlippedCardId(null)} className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-[var(--secondary)]">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6 flex-1 text-left overflow-y-auto ista-scrollbar pr-2">
                                    <div>
                                        <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Titre du Groupe</label>
                                        <input
                                            type="text"
                                            value={editData.title}
                                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                            className="w-full text-xs font-bold bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--secondary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Filière</label>
                                        <input
                                            type="text"
                                            value={editData.stream}
                                            onChange={(e) => setEditData({ ...editData, stream: e.target.value })}
                                            className="w-full text-xs font-bold bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--secondary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Formateurs</label>
                                        <div
                                            onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
                                            className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                        >
                                            <span className={`text-[10px] font-bold tracking-widest uppercase truncate ${editData.lead.length > 0 ? 'text-[var(--secondary)]' : 'text-slate-400'}`}>
                                                {editData.lead.length > 0 ? editData.lead.join(', ') : 'SÉLECTIONNER...'}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform ${isEditDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>

                                        {isEditDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-[var(--border)] rounded-xl z-50 shadow-2xl max-h-40 overflow-y-auto ista-scrollbar">
                                                {formateurs.map((f) => {
                                                    const isSelected = editData.lead.includes(f.name);
                                                    return (
                                                        <div
                                                            key={f.id}
                                                            className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors hover:bg-slate-50 ${isSelected ? 'bg-green-50' : ''}`}
                                                            onClick={() => {
                                                                const newLead = isSelected
                                                                    ? editData.lead.filter(l => l !== f.name)
                                                                    : [...editData.lead, f.name];
                                                                setEditData({ ...editData, lead: newLead });
                                                            }}
                                                        >
                                                            <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>{f.name}</span>
                                                            {isSelected ? <CheckSquare className="w-4 h-4 text-[var(--primary)]" /> : <Square className="w-4 h-4 text-slate-200" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleUpdateClass(cls.id)}
                                    className="btn-ista w-full py-4 mt-8 flex items-center justify-center gap-3 shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>ENREGISTRER</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create New Card */}
                <div
                    onClick={() => setIsClassModalOpen(true)}
                    className="border-2 border-dashed border-slate-200 bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-[var(--primary)]/30 transition-all duration-500 group h-[420px]"
                >
                    <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center mb-6 group-hover:bg-[var(--primary)] group-hover:border-[var(--primary)] transition-all duration-500">
                        <Plus className="w-10 h-10 text-slate-300 group-hover:text-white transition-all duration-500" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-[var(--secondary)] mb-2 group-hover:text-[var(--primary)] transition-all">Initialiser un Groupe</h3>
                    <p className="text-[10px] tracking-[0.2em] text-slate-400 uppercase font-black">Ajouter une nouvelle division</p>
                </div>
            </div>

            <GroupModal
                isOpen={isClassModalOpen}
                onClose={() => setIsClassModalOpen(false)}
                newClass={newClass}
                setNewClass={setNewClass}
                handleAddClass={handleAddClass}
                formateurs={formateurs}
            />

            <ConfirmationModal
                isOpen={purgeInfo.isOpen}
                onClose={() => setPurgeInfo({ isOpen: false, classId: '' })}
                onConfirm={handlePurgeClass}
                title="Suppression du Groupe"
                message={`Êtes-vous sûr de vouloir supprimer le groupe ${purgeInfo.classId}? Cette action supprimera également toutes les séances associées dans l'emploi du temps.`}
            />
            <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 4px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>

    );
};

export default Squadrons;
