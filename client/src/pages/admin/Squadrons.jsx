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
    const [classes, setClasses] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [newClass, setNewClass] = useState({ id: '', filiereId: '', optionId: '', lead: [], année_scolaire: '2025/2026', level: '1er' });

    const [flippedCardId, setFlippedCardId] = useState(null);
    const [editData, setEditData] = useState({ filiereId: '', optionId: '', lead: [], année_scolaire: '', level: '' });
    const [optionFilter, setOptionFilter] = useState('ALL');
    const [yearFilter, setYearFilter] = useState('ALL');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [isYearFilterDropdownOpen, setIsYearFilterDropdownOpen] = useState(false);
    const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);
    const [isLevelEditDropdownOpen, setIsLevelEditDropdownOpen] = useState(false);
    const [isFiliereEditDropdownOpen, setIsFiliereEditDropdownOpen] = useState(false);
    const [isOptionEditDropdownOpen, setIsOptionEditDropdownOpen] = useState(false);
    const [isFiliereEditAutre, setIsFiliereEditAutre] = useState(false);
    const [isOptionEditAutre, setIsOptionEditAutre] = useState(false);
    const [availableFilieres, setAvailableFilieres] = useState([]);
    const [availableOptions, setAvailableOptions] = useState([]);
    const [customFiliere, setCustomFiliere] = useState({ nom: '', niveau: 'TS' });
    const [customOption, setCustomOption] = useState({ nom: '', niveau: 'TS' });

    const [purgeInfo, setPurgeInfo] = useState({ isOpen: false, classId: '' });
    const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
    const [transitionData, setTransitionData] = useState({ currentYear: '2025/2026', nextYear: '2026/2027' });
    const [isTransitioning, setIsTransitioning] = useState(false);

    const levels = [
        { value: '1er', label: '1ER ANNÉE' },
        { value: '2eme', label: '2ÈME ANNÉE' },
        { value: '3eme', label: '3ÈME ANNÉE' }
    ];


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [scheduleRes, formateurRes, filiereRes, optionRes] = await Promise.all([
                    axios.get('/api/admin/schedule', config),
                    axios.get('/api/admin/formateurs', config),
                    axios.get('/api/admin/filieres', config),
                    axios.get('/api/admin/options', config)
                ]);

                setClasses(scheduleRes.data.classes || []);
                setFormateurs(formateurRes.data.formateurs || []);
                setAvailableFilieres(filiereRes.data.filieres || []);
                setAvailableOptions(optionRes.data.options || []);
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        };
        fetchData();
    }, []);


    const handleAddClass = async (e, customData = null) => {
        if (e && e.preventDefault) e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const dataToSubmit = customData || newClass;

            const payload = {
                ...dataToSubmit,
                lead: Array.isArray(dataToSubmit.lead) ? dataToSubmit.lead.join(', ') : dataToSubmit.lead
            };

            const res = await axios.post('/api/admin/classes', payload, config);

            setClasses([...classes, res.data.class]);
            setIsClassModalOpen(false);
            setNewClass({ id: '', filiereId: '', optionId: '', lead: [], année_scolaire: '2025/2026', level: '1er' });
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

            let finalEditData = { ...editData };

            // Handle Autre logic for edit
            if (isFiliereEditAutre && customFiliere.nom) {
                const resF = await axios.post('/api/admin/filieres', customFiliere, config);
                finalEditData.filiereId = resF.data.id;
                setAvailableFilieres(prev => [...prev, resF.data]);
                setIsFiliereEditAutre(false);
            }
            if (finalEditData.level === '1er') {
                finalEditData.optionId = null;
            } else if (isOptionEditAutre && customOption.nom && finalEditData.filiereId) {
                const resO = await axios.post('/api/admin/options', { ...customOption, filiereId: finalEditData.filiereId }, config);
                finalEditData.optionId = resO.data.id;
                setAvailableOptions(prev => [...prev, resO.data]);
                setIsOptionEditAutre(false);
            }


            const payload = {
                ...finalEditData,
                lead: Array.isArray(finalEditData.lead) ? finalEditData.lead.join(', ') : finalEditData.lead
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

    const handleTransition = async () => {
        setIsTransitioning(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post('/api/admin/classes/transition', transitionData, config);
            addNotification(res.data.message, 'success');
            setIsTransitionModalOpen(false);

            // Refresh classes
            const refreshRes = await axios.get('/api/admin/schedule', config);
            setClasses(refreshRes.data.classes || []);
        } catch (error) {
            console.error('Transition Error', error);
            addNotification(error.response?.data?.message || 'Échec de la transition annuelle.', 'error');
        } finally {
            setIsTransitioning(false);
        }
    };


    const handleFlip = (cls) => {
        if (flippedCardId === cls.id) {
            setFlippedCardId(null);
        } else {
            setFlippedCardId(cls.id);
            setEditData({
                id: cls.id,
                filiereId: cls.filiereId || '',
                optionId: cls.optionId || '',
                année_scolaire: cls.année_scolaire || '',
                level: cls.level || '1er',
                lead: cls.lead ? cls.lead.split(',').map(s => s.trim()) : []
            });
            setIsFiliereEditAutre(false);
            setIsOptionEditAutre(false);
            setCustomFiliere({ nom: '', niveau: 'TS' });
            setCustomOption({ nom: '', niveau: 'TS' });
            setIsEditDropdownOpen(false);
            setIsFiliereEditDropdownOpen(false);
            setIsOptionEditDropdownOpen(false);
            setIsLevelEditDropdownOpen(false);

        }
    };

    const uniqueOptions = ['ALL', ...new Set(classes.map(c => c.option).filter(Boolean))];
    const uniqueYears = ['ALL', ...new Set(classes.map(c => c.année_scolaire).filter(Boolean))];
    
    const filteredClasses = classes.filter(c => {
        const matchOption = optionFilter === 'ALL' || c.option === optionFilter;
        const matchYear = yearFilter === 'ALL' || c.année_scolaire === yearFilter;
        return matchOption && matchYear;
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
                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            className="bg-white border border-[var(--border)] px-6 py-4 rounded-xl flex items-center gap-4 hover:border-[var(--primary)] transition-all shadow-sm"
                        >
                            <Filter className="w-4 h-4 text-[var(--primary)]" />
                            <span className="text-[10px] font-black tracking-widest uppercase text-[var(--secondary)]">{optionFilter === 'ALL' ? 'TOUTES LES OPTIONS' : optionFilter}</span>
                            <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterDropdownOpen && (
                            <div className="absolute top-full right-0 mt-3 bg-white border border-[var(--border)] rounded-2xl z-50 shadow-2xl min-w-[240px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {uniqueOptions.map(option => (
                                    <div
                                        key={option}
                                        className={`px-6 py-4 cursor-pointer text-[10px] font-black tracking-widest uppercase transition-colors ${optionFilter === option ? 'bg-[var(--primary)] text-white' : 'text-[var(--secondary)] hover:bg-slate-50'}`}
                                        onClick={() => {
                                            setOptionFilter(option);
                                            setIsFilterDropdownOpen(false);
                                        }}
                                    >
                                        {option === 'ALL' ? 'TOUTES LES OPTIONS' : option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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
                                <div
                                    className="px-6 py-4 cursor-pointer text-[9px] font-black text-amber-600 uppercase border-t border-slate-50 bg-amber-50/50 hover:bg-amber-100 transition-all"
                                    onClick={() => {
                                        setIsTransitionModalOpen(true);
                                        setIsYearFilterDropdownOpen(false);
                                    }}
                                >
                                    + LANCER LA TRANSITION ANNUELLE
                                </div>
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
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black text-[var(--primary)] tracking-widest uppercase">{cls.id}</span>
                                            <div className="flex gap-2">
                                                <span className="text-[8px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded tracking-widest uppercase">{cls.level}</span>
                                                <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{cls.année_scolaire}</span>
                                            </div>
                                        </div>
                                        <h2 className="text-3xl font-black italic text-[var(--secondary)] tracking-tight leading-tight uppercase transition-colors duration-500 group-hover:text-[var(--primary)]">{cls.filiere}</h2>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black mb-auto mt-2 italic">{cls.option}</p>

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
                                                        <div className="flex items-center gap-3">
                                                            <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                                                            <span className="text-[10px] font-bold text-[var(--secondary)] uppercase tracking-tight truncate">
                                                                {availableFilieres.find(f => f.id === editData.filiereId)?.nom || 'SÉLECTIONNER...'}
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
                                                                        className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${editData.filiereId === f.id ? 'bg-green-50' : ''}`}
                                                                        onClick={() => {
                                                                            setEditData({ ...editData, filiereId: f.id, optionId: '' });
                                                                            setIsFiliereEditDropdownOpen(false);
                                                                        }}
                                                                    >
                                                                        <span className={`text-[10px] font-bold uppercase ${editData.filiereId === f.id ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>
                                                                            {f.nom}
                                                                        </span>
                                                                        {editData.filiereId === f.id && <div className="w-1 h-1 bg-[var(--primary)] rounded-full mr-2"></div>}
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

                                        {/* Niveau Selector (Previous Option Position) */}
                                        <div className="relative">
                                            <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Niveau</label>
                                            <div
                                                onClick={() => setIsLevelEditDropdownOpen(!isLevelEditDropdownOpen)}
                                                className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Layers className="w-4 h-4 text-[var(--primary)]" />
                                                    <span className="text-[10px] font-bold text-[var(--secondary)] uppercase tracking-tight">
                                                        {levels.find(l => l.value === (editData.level || '1er'))?.label}
                                                    </span>
                                                </div>
                                                <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform ${isLevelEditDropdownOpen ? 'rotate-180' : ''}`} />
                                            </div>

                                            {isLevelEditDropdownOpen && (
                                                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                    {levels.map((level) => (
                                                        <div
                                                            key={level.value}
                                                            className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${editData.level === level.value ? 'bg-green-50' : ''}`}
                                                            onClick={() => {
                                                                setEditData({ ...editData, level: level.value });
                                                                setIsLevelEditDropdownOpen(false);
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Layers className={`w-3.5 h-3.5 ${editData.level === level.value ? 'text-[var(--primary)]' : 'text-slate-300'}`} />
                                                                <span className={`text-[10px] font-bold uppercase ${editData.level === level.value ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>
                                                                    {level.label}
                                                                </span>
                                                            </div>
                                                            {editData.level === level.value && <div className="w-1 h-1 bg-[var(--primary)] rounded-full"></div>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>


                                    </div>

                                    <div>
                                        <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Année Scolaire</label>
                                        <input
                                            type="text"
                                            value={editData.année_scolaire}
                                            onChange={(e) => setEditData({ ...editData, année_scolaire: e.target.value })}
                                            className="w-full text-xs font-bold bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--secondary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                                        />
                                    </div>
                                    {/* Option Selector (Previous Niveau Position) */}
                                    <div className="relative">
                                        <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Option</label>
                                        {editData.level === '1er' ? (
                                            <div className="w-full bg-slate-100 border border-[var(--border)] rounded-xl px-4 py-3 flex items-center gap-3 opacity-75 cursor-not-allowed grayscale">
                                                <Hash className="w-4 h-4 text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">TRONC COMMUN (TR)</span>
                                            </div>
                                        ) : !isOptionEditAutre ? (
                                            <div className="space-y-2">
                                                <div
                                                    onClick={() => setIsOptionEditDropdownOpen(!isOptionEditDropdownOpen)}
                                                    className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-2.5 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Hash className="w-4 h-4 text-[var(--primary)]" />
                                                        <span className="text-[10px] font-bold text-[var(--secondary)] uppercase tracking-tight truncate">
                                                            {availableOptions.find(o => o.id === editData.optionId)?.nom || 'SÉLECTIONNER...'}
                                                        </span>
                                                    </div>
                                                    <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform ${isOptionEditDropdownOpen ? 'rotate-180' : ''}`} />
                                                </div>

                                                {isOptionEditDropdownOpen && (
                                                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                        <div className="max-h-40 overflow-y-auto ista-scrollbar">
                                                            {(editData.filiereId ? availableOptions.filter(o => o.filiereId === editData.filiereId) : availableOptions).map(opt => (
                                                                <div
                                                                    key={opt.id}
                                                                    className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${editData.optionId === opt.id ? 'bg-green-50' : ''}`}
                                                                    onClick={() => {
                                                                        setEditData({ ...editData, optionId: opt.id });
                                                                        setIsOptionEditDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    <span className={`text-[10px] font-bold uppercase ${editData.optionId === opt.id ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>
                                                                        {opt.nom}
                                                                    </span>
                                                                    {editData.optionId === opt.id && <div className="w-1 h-1 bg-[var(--primary)] rounded-full mr-2"></div>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div
                                                            className="px-4 py-3 cursor-pointer flex items-center justify-between transition-colors border-t border-slate-50 bg-slate-50/50 hover:bg-slate-100"
                                                            onClick={() => {
                                                                setIsOptionEditAutre(true);
                                                                setIsOptionEditDropdownOpen(false);
                                                            }}
                                                        >
                                                            <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-widest">AUTRE (NOUVEAU)</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    value={customOption.nom}
                                                    onChange={e => setCustomOption({ ...customOption, nom: e.target.value.toUpperCase() })}
                                                    placeholder="NOM DE L'OPTION..."
                                                    className="w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-[10px] font-bold text-[var(--secondary)] focus:ring-4 focus:ring-green-500/10 focus:border-[var(--primary)] outline-none transition-all"
                                                />
                                                <button
                                                    onClick={() => setIsOptionEditAutre(false)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-all text-slate-400"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
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
                classes={classes}
            />

            <ConfirmationModal
                isOpen={purgeInfo.isOpen}
                onClose={() => setPurgeInfo({ isOpen: false, classId: '' })}
                onConfirm={handlePurgeClass}
                title="Suppression du Groupe"
                message={`Êtes-vous sûr de vouloir supprimer le groupe ${purgeInfo.classId}? Cette action supprimera également toutes les séances associées dans l'emploi du temps.`}
            />

            {/* Transition Modal */}
            {isTransitionModalOpen && (
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-black italic text-[var(--secondary)] uppercase leading-none mb-2">Transition Annuelle</h3>
                                <p className="text-[9px] font-black text-slate-400 tracking-[0.3em] uppercase">Préparation de la nouvelle année scolaire</p>
                            </div>
                            <button onClick={() => setIsTransitionModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                                <X className="w-6 h-6 text-slate-300" />
                            </button>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ANNÉE ACTUELLE</label>
                                    <input
                                        type="text"
                                        value={transitionData.currentYear}
                                        onChange={e => setTransitionData({ ...transitionData, currentYear: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-[var(--secondary)] focus:border-[var(--primary)] outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NOUVELLE ANNÉE</label>
                                    <input
                                        type="text"
                                        value={transitionData.nextYear}
                                        onChange={e => setTransitionData({ ...transitionData, nextYear: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-[var(--secondary)] focus:border-[var(--primary)] outline-none"
                                    />
                                </div>
                            </div>
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4">
                                <AlertCircle className="w-8 h-8 text-amber-500 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-amber-700 uppercase">Attention - Transformation Critique</p>
                                    <p className="text-[9px] font-bold text-amber-600/80 leading-relaxed uppercase">
                                        Cette opération va dupliquer toutes les classes pour la nouvelle année,
                                        vider les listes de stagiaires, et augmenter le niveau (1er → 2eme).
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleTransition}
                            disabled={isTransitioning}
                            className="w-full btn-ista py-5 flex items-center justify-center gap-3 shadow-xl shadow-green-500/20"
                        >
                            {isTransitioning ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    TRAITEMENT EN COURS...
                                </>
                            ) : (
                                <>
                                    <Layers className="w-5 h-5" />
                                    EXÉCUTER LA TRANSITION
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
            <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 4px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>

    );
};

export default Squadrons;
