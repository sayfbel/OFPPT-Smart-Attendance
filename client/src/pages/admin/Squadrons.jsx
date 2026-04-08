import React, { useState, useEffect } from 'react';
import { Search, Plus, BookOpen, Layers, Save, X, Filter, ChevronDown, Edit3, Trash2, CheckSquare, Square, Users, Hash, AlertCircle } from 'lucide-react';
import axios from 'axios';
import GroupModal from '../../components/GroupModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useNotification } from '../../context/NotificationContext';
import { useTranslation } from 'react-i18next';


const Squadrons = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const { addNotification } = useNotification();
    const [groups, setGroups] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [newGroup, setNewGroup] = useState({ id: '', filiereId: '', lead: [], année_scolaire: '2025/2026', salleIds: [] });
    const [flippedCardId, setFlippedCardId] = useState(null);
    const [editData, setEditData] = useState({ filiereId: '', lead: [], année_scolaire: '', salleIds: [] });
    const [yearFilter, setYearFilter] = useState('ALL');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [isYearFilterDropdownOpen, setIsYearFilterDropdownOpen] = useState(false);
    const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);

    const [isFiliereEditDropdownOpen, setIsFiliereEditDropdownOpen] = useState(false);
    const [isFiliereEditAutre, setIsFiliereEditAutre] = useState(false);
    const [isAnneeEditDropdownOpen, setIsAnneeEditDropdownOpen] = useState(false);
    const [isSalleEditDropdownOpen, setIsSalleEditDropdownOpen] = useState(false);
    const [availableSalles, setAvailableSalles] = useState([]);

    const anneesScolaires = ['2023/2024', '2024/2025', '2025/2026', '2026/2027', '2027/2028'];
    const [availableFilieres, setAvailableFilieres] = useState([]);
    const [customFiliere, setCustomFiliere] = useState({ nom: '' });
    const [purgeInfo, setPurgeInfo] = useState({ isOpen: false, groupId: '' });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [groupsRes, formateurRes, filiereRes, sallesRes] = await Promise.all([
                axios.get(`/api/admin/groups?_t=${new Date().getTime()}`, config),
                axios.get(`/api/admin/formateurs?_t=${new Date().getTime()}`, config),
                axios.get(`/api/admin/filieres?_t=${new Date().getTime()}`, config),
                axios.get(`/api/admin/salles?_t=${new Date().getTime()}`, config)
            ]);
 
            setGroups(groupsRes.data.groups || []);
            setFormateurs(formateurRes.data.formateurs || []);
            setAvailableFilieres(filiereRes.data.filieres || []);
            setAvailableSalles(sallesRes.data.salles || []);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleAddGroup = async (e, customData = null) => {
        if (e && e.preventDefault) e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const dataToSubmit = customData || newGroup;

            const payload = {
                ...dataToSubmit,
                lead: Array.isArray(dataToSubmit.lead) ? dataToSubmit.lead.join(', ') : dataToSubmit.lead
            };

            await axios.post('/api/admin/groups', payload, config);
            await fetchData();
            setIsGroupModalOpen(false);
            setNewGroup({ id: '', filiereId: '', lead: [], année_scolaire: '2025/2026' });
            addNotification('Groupe créé et déployé avec succès.', 'success');
        } catch (error) {
            console.error('Error creating group', error);
            addNotification(error.response?.data?.message || 'Erreur lors de la configuration du groupe', 'error');
        }
    };

    const handleUpdateGroup = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            let finalEditData = { ...editData };

            // Handle Autre logic for edit
            if (isFiliereEditAutre && customFiliere.nom) {
                const resF = await axios.post('/api/admin/filieres', customFiliere, config);
                finalEditData.filiereId = resF.data.id;
                setAvailableFilieres(prev => [...prev, resF.data]);
                setIsFiliereEditAutre(false);
            }



            const payload = {
                ...finalEditData,
                lead: Array.isArray(finalEditData.lead) ? finalEditData.lead.join(', ') : finalEditData.lead
            };

            await axios.put(`/api/admin/groups/${id}`, payload, config);
            await fetchData();
            setFlippedCardId(null);
            addNotification('Informations du groupe mises à jour.', 'success');
        } catch (error) {
            console.error('Error updating group', error);
            addNotification(error.response?.data?.message || 'Erreur lors de la mise à jour', 'error');
        }
    };

    const handlePurgeGroup = async () => {
        const id = purgeInfo.groupId;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`/api/admin/groups/${id}`, config);
            setGroups(prev => prev.filter(g => g.id !== id));
            addNotification('Groupe supprimé du système.', 'success');
            setPurgeInfo({ isOpen: false, groupId: '' });
        } catch (error) {
            console.error('Error deleting group', error);
            addNotification('Échec de la suppression: Erreur serveur.', 'error');
            setPurgeInfo({ isOpen: false, groupId: '' });
        }
    };




    const handleFlip = (grp) => {
        if (flippedCardId === grp.id) {
            setFlippedCardId(null);
        } else {
            setFlippedCardId(grp.id);
            // Ensure lead is treated as an array and handle null/undefined
            const leadArray = Array.isArray(grp.lead) 
                ? grp.lead 
                : (grp.lead ? String(grp.lead).split(',').map(s => s.trim()) : []);
                
            setEditData({
                id: grp.id,
                filiereId: grp.filiereId || grp.filiereid || '',
                année_scolaire: grp.année_scolaire || grp.annee_scolaire || '',
                salleIds: grp.salleIds || [],
                lead: leadArray
            });
            setIsFiliereEditAutre(false);
            setCustomFiliere({ nom: '' });
            setIsEditDropdownOpen(false);
            setIsFiliereEditDropdownOpen(false);
            setIsAnneeEditDropdownOpen(false);
            setIsSalleEditDropdownOpen(false);
        }
    };

    const uniqueYears = ['ALL', ...new Set(groups.map(g => g.année_scolaire).filter(Boolean))];
    
    const filteredGroups = groups.filter(g => {
        const matchYear = yearFilter === 'ALL' || g.année_scolaire === yearFilter;
        return matchYear;
    });

    return (
        <div className={`space-y-12 fade-up transition-all duration-500 ${isRtl ? 'text-right' : ''}`}>
            <div className={`flex flex-col md:flex-row items-start md:items-end justify-between border-b border-[var(--border)] pb-8 lg:pb-12 gap-6 lg:gap-8 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-[0.9]">
                        {t('groups.title')}
                    </h1>
                    <div className={`flex items-center gap-3 text-[var(--primary)] text-[9px] lg:text-xs tracking-[0.4em] uppercase font-black ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></div>
                        {t('groups.subtitle')}
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-end">


                    <div className="relative">
                        <button
                            onClick={() => setIsYearFilterDropdownOpen(!isYearFilterDropdownOpen)}
                            className="bg-white border border-[var(--border)] px-6 py-4 rounded-xl flex items-center gap-4 hover:border-amber-500 hover:text-amber-500 transition-all shadow-sm"
                        >
                            <Layers className="w-4 h-4 text-amber-500" />
                            <span className="text-[10px] font-black tracking-widest uppercase text-[var(--secondary)]">{yearFilter === 'ALL' ? 'TOUTES LES ANNÉES' : yearFilter}</span>
                            <ChevronDown className={`w-4 h-4 text-amber-500 transition-transform ${isYearFilterDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isYearFilterDropdownOpen && (
                            <div className="absolute top-full right-0 mt-3 bg-white border border-[var(--border)] rounded-2xl z-50 shadow-2xl min-w-[240px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {uniqueYears.map(year => (
                                    <div
                                        key={year}
                                        className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors ${yearFilter === year ? 'bg-amber-500 text-white' : 'text-[var(--secondary)] hover:bg-slate-50'}`}
                                        onClick={() => {
                                            setYearFilter(year);
                                            setIsYearFilterDropdownOpen(false);
                                        }}
                                    >
                                        {year === 'ALL' ? 'TOUTES LES ANNÉES' : year}
                                    </div>
                                ))}

                            </div>
                        )}
                    </div>

                    <button onClick={() => setIsGroupModalOpen(true)} className="btn-ista px-8 py-4 flex items-center gap-3">
                        <Plus className="w-5 h-5" />
                        <span>CRÉER UN GROUPE</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGroups.map((grp) => (
                    <div key={grp.id} className="perspective-1000 h-[420px]">
                        <div className={`card-inner ${flippedCardId === grp.id ? 'card-flipped' : ''}`}>
                            {/* Front Side */}
                            <div className="card-front rounded-3xl border border-[var(--border)] bg-white p-10 shadow-sm hover:shadow-xl hover:border-[var(--primary)]/30 transition-all duration-500 group relative overflow-hidden h-full flex flex-col">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 opacity-50 rounded-bl-[100px] transform translate-x-16 -translate-y-16 group-hover:bg-green-50 transition-all duration-500"></div>

                                <div className="flex justify-between items-start mb-8 relative">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500 border border-slate-100 group-hover:border-[var(--primary)]">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleFlip(grp)}
                                            className="p-3 bg-white rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] text-slate-400 transition-all shadow-sm"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPurgeInfo({ isOpen: true, groupId: grp.id });
                                            }}
                                            className="p-3 bg-white rounded-xl border border-[var(--border)] hover:border-red-500 hover:text-red-500 text-slate-400 transition-all shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="space-y-1">
                                        <h2 className="text-4xl md:text-5xl font-black italic text-[var(--primary)] tracking-tighter leading-[0.8] mb-2 uppercase">
                                            {grp.id}
                                        </h2>
                                        <div className="text-sm md:text-md font-black italic text-[var(--primary)] tracking-tight leading-tight uppercase line-clamp-2 opacity-90">
                                            {grp.filiere}
                                        </div>

                                        <div className="text-[20px] font-black italic text-[var(--secondary)] tracking-tight leading-tight uppercase mt-4 flex items-center gap-2">
                                            {grp.année_scolaire}
                                            {grp.salle_nom && (
                                                <>
                                                    <span className="text-[var(--primary)] opacity-30">•</span>
                                                    <span className="text-amber-500">{grp.salle_nom}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-50 pt-8">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1">Stagiaires</p>
                                            <p className="text-2xl font-black text-[var(--secondary)] transition-colors duration-500">
                                                {grp.students !== undefined && grp.students !== null ? grp.students : '0'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1">Formateur(s)</p>
                                            <p className="text-xs font-bold text-[var(--secondary)] truncate">{grp.formateur || grp.lead}</p>
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
                                    <div className="space-y-4">
                                        {/* Filière Selector */}
                                        <div className="relative">
                                            <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Filière</label>
                                            {!isFiliereEditAutre ? (
                                                <div className="space-y-2">
                                                    <div
                                                        onClick={() => setIsFiliereEditDropdownOpen(!isFiliereEditDropdownOpen)}
                                                        className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <BookOpen className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                                                            <span className="text-[10px] font-bold text-[var(--secondary)] uppercase tracking-tight truncate-text flex-1">
                                                                 {availableFilieres.find(f => Number(f.id) === Number(editData.filiereId))?.nom || 'SÉLECTIONNER...'}
                                                            </span>
                                                        </div>
                                                        <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform ${isFiliereEditDropdownOpen ? 'rotate-180' : ''}`} />
                                                    </div>

                                                    {isFiliereEditDropdownOpen && (
                                                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                            <div className="max-h-40 overflow-y-auto ista-scrollbar">
                                                                {availableFilieres.map(f => (
                                                                    <div
                                                                        key={f.id}
                                                                         className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${Number(editData.filiereId) === Number(f.id) ? 'bg-green-50' : ''}`}
                                                                         onClick={() => {
                                                                             setEditData({ ...editData, filiereId: f.id });
                                                                             setIsFiliereEditDropdownOpen(false);
                                                                         }}
                                                                     >
                                                                         <span className={`text-[10px] font-bold uppercase ${Number(editData.filiereId) === Number(f.id) ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>
                                                                             {f.nom}
                                                                         </span>
                                                                         {Number(editData.filiereId) === Number(f.id) && <div className="w-1 h-1 bg-[var(--primary)] rounded-full mr-2"></div>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div
                                                                className="px-4 py-3 cursor-pointer flex items-center justify-between transition-colors border-t border-slate-50 bg-slate-50/50 hover:bg-slate-100"
                                                                onClick={() => {
                                                                    setIsFiliereEditAutre(true);
                                                                    setIsFiliereEditDropdownOpen(false);
                                                                }}
                                                            >
                                                                <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-widest">AUTRE (PERSONNALISÉ)</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        autoFocus
                                                        value={customFiliere.nom}
                                                        onChange={e => setCustomFiliere({ ...customFiliere, nom: e.target.value.toUpperCase() })}
                                                        placeholder="NOM DE LA FILIÈRE..."
                                                        className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-[10px] font-bold text-[var(--secondary)] focus:ring-4 focus:ring-green-500/10 focus:border-[var(--primary)] outline-none transition-all"
                                                    />
                                                    <button
                                                        onClick={() => setIsFiliereEditAutre(false)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-all text-slate-400"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>




                                    </div>

                                    <div className="relative">
                                        <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Année Scolaire</label>
                                        <div
                                            onClick={() => setIsAnneeEditDropdownOpen(!isAnneeEditDropdownOpen)}
                                            className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                                                <span className="text-[10px] font-bold text-[var(--secondary)] uppercase tracking-tight">
                                                    {editData.année_scolaire || 'SÉLECTIONNER...'}
                                                </span>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform ${isAnneeEditDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>

                                        {isAnneeEditDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                {anneesScolaires.map((annee) => (
                                                    <div
                                                        key={annee}
                                                        className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${editData.année_scolaire === annee ? 'bg-green-50' : ''}`}
                                                        onClick={() => {
                                                            setEditData({ ...editData, année_scolaire: annee });
                                                            setIsAnneeEditDropdownOpen(false);
                                                        }}
                                                    >
                                                        <span className={`text-[10px] font-bold uppercase ${editData.année_scolaire === annee ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>
                                                            {annee}
                                                        </span>
                                                        {editData.année_scolaire === annee && <div className="w-1 h-1 bg-[var(--primary)] rounded-full"></div>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>


                                    <div className="relative">
                                        <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Salle d'assignation</label>
                                        <div
                                            onClick={() => setIsSalleEditDropdownOpen(!isSalleEditDropdownOpen)}
                                            className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Layers className="w-4 h-4 text-[var(--primary)]" />
                                                <span className="text-[10px] font-bold text-[var(--secondary)] uppercase tracking-tight">
                                            {editData.salleIds?.length > 0
                                                ? availableSalles.filter(s => editData.salleIds.includes(s.id)).map(s => s.nom).join(', ')
                                                : 'SÉLECTIONNER...'}
                                        </span>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform ${isSalleEditDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>

                                        {isSalleEditDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                <div
                                                    className="px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors"
                                                    onClick={() => {
                                                        setEditData({ ...editData, salleIds: [] });
                                                    }}
                                                >
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">DÉSÉLECTIONNER TOUT</span>
                                                </div>
                                                {availableSalles.map((s) => {
                                                    const isSelected = editData.salleIds?.includes(s.id);
                                                    return (
                                                        <div
                                                            key={s.id}
                                                            className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${isSelected ? 'bg-green-50' : ''}`}
                                                            onClick={() => {
                                                                const currentIds = Array.isArray(editData.salleIds) ? editData.salleIds : [];
                                                                const nextIds = isSelected 
                                                                    ? currentIds.filter(id => id !== s.id)
                                                                    : [...currentIds, s.id];
                                                                setEditData({ ...editData, salleIds: nextIds });
                                                            }}
                                                        >
                                                            <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>
                                                                {s.nom}
                                                            </span>
                                                            {isSelected ? <CheckSquare className="w-4 h-4 text-[var(--primary)]" /> : <Square className="w-4 h-4 text-slate-200" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
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
                                    onClick={() => handleUpdateGroup(grp.id)}
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
                    onClick={() => setIsGroupModalOpen(true)}
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
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                newGroup={newGroup}
                setNewGroup={setNewGroup}
                handleAddGroup={handleAddGroup}
                formateurs={formateurs}
                groups={groups}
            />

            <ConfirmationModal
                isOpen={purgeInfo.isOpen}
                onClose={() => setPurgeInfo({ isOpen: false, groupId: '' })}
                onConfirm={handlePurgeGroup}
                title="Suppression du Groupe"
                message={`Êtes-vous sûr de vouloir supprimer le groupe ${purgeInfo.groupId}? Cette action supprimera également toutes les séances associées dans l'emploi du temps.`}
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
