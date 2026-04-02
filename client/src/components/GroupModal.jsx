import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, CheckSquare, Square, ChevronDown, BookOpen, UserCheck, Hash, Layers, ArrowLeft, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import { useTranslation } from 'react-i18next';
import ConfirmationModal from './ConfirmationModal';

const GroupModal = ({ isOpen, onClose, newClass, setNewClass, handleAddClass, formateurs = [], classes = [], isEditing = false }) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

<<<<<<< HEAD
    const [isAnneeDropdownOpen, setIsAnneeDropdownOpen] = useState(false);
    const [isFiliereDropdownOpen, setIsFiliereDropdownOpen] = useState(false);
    const [isFormateurDropdownOpen, setIsFormateurDropdownOpen] = useState(false);
    const [isFiliereAutre, setIsFiliereAutre] = useState(false);
=======
    const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
    const [isAnneeDropdownOpen, setIsAnneeDropdownOpen] = useState(false);
    const [isFiliereDropdownOpen, setIsFiliereDropdownOpen] = useState(false);
    const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);
    const [isFormateurDropdownOpen, setIsFormateurDropdownOpen] = useState(false);
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
    const [deleteModalInfo, setDeleteModalInfo] = useState({ isOpen: false, type: '', id: null, message: '' });

    
    // API Data
    const [availableFilieres, setAvailableFilieres] = useState([]);
<<<<<<< HEAD
    const [loading, setLoading] = useState(false);

    // Custom Input Mode (Alternative to selecting from API)
    const [customFiliere, setCustomFiliere] = useState({ nom: '', niveau: 'TS' });

    const anneesScolaires = ['2023/2024', '2024/2025', '2025/2026', '2026/2027', '2027/2028'];


=======
    const [availableOptions, setAvailableOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Custom Input Mode (Alternative to selecting from API)
    const [isFiliereAutre, setIsFiliereAutre] = useState(false);
    const [isOptionAutre, setIsOptionAutre] = useState(false);
    const [customFiliere, setCustomFiliere] = useState({ nom: '', niveau: 'TS' });
    const [customOption, setCustomOption] = useState({ nom: '', niveau: 'TS' });

    const anneesScolaires = ['2023/2024', '2024/2025', '2025/2026', '2026/2027', '2027/2028'];

    const levels = [
        { value: '1er', label: '1ER ANNÉE' },
        { value: '2eme', label: '2ÈME ANNÉE' },
        { value: '3eme', label: '3ÈME ANNÉE' }
    ];
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

    useEffect(() => {
        if (isOpen) {
            fetchInfrastructure();
        }
    }, [isOpen]);

<<<<<<< HEAD
=======
    useEffect(() => {
        if (isFiliereAutre) {
            setIsOptionAutre(true);
        } else if (newClass.filiereId) {
            const optionsFound = availableOptions.filter(o => o.filiereId === newClass.filiereId);
            if (optionsFound.length === 0) {
                setIsOptionAutre(true);
            }
        }
    }, [newClass.filiereId, isFiliereAutre, availableOptions]);
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

    const fetchInfrastructure = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
<<<<<<< HEAD
            const [fRes] = await Promise.all([
                axios.get('/api/admin/filieres', config)
            ]);
            
            setAvailableFilieres(fRes.data.filieres || []);
=======
            const [fRes, oRes] = await Promise.all([
                axios.get('/api/admin/filieres', config),
                axios.get('/api/admin/options', config)
            ]);
            
            setAvailableFilieres(fRes.data.filieres || []);
            setAvailableOptions(oRes.data.options || []);
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
        } catch (error) {
            console.error('Error fetching infrastructure:', error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        const { type, id } = deleteModalInfo;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
<<<<<<< HEAD
            if (type === 'filiere') {
                await axios.delete(`/api/admin/filieres/${id}`, config);
                setAvailableFilieres(prev => prev.filter(f => f.id !== id));
                if (newClass.filiereId === id) setNewClass(prev => ({ ...prev, filiereId: '' }));
=======
            if (type === 'option') {
                await axios.delete(`/api/admin/options/${id}`, config);
                setAvailableOptions(prev => prev.filter(o => o.id !== id));
                if (newClass.optionId === id) setNewClass(prev => ({ ...prev, optionId: '' }));
            } else if (type === 'filiere') {
                await axios.delete(`/api/admin/filieres/${id}`, config);
                setAvailableFilieres(prev => prev.filter(f => f.id !== id));
                if (newClass.filiereId === id) setNewClass(prev => ({ ...prev, filiereId: '', optionId: '' }));
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
            }
        } catch (error) {
            console.error('Error deleting:', error);
            alert(`Erreur: La ${type} est probablement liée à un groupe ou une autre entité.`);
        } finally {
            setDeleteModalInfo({ isOpen: false, type: '', id: null, message: '' });
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let finalClassData = { ...newClass };
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            if (isFiliereAutre && customFiliere.nom) {
                const resF = await axios.post('/api/admin/filieres', customFiliere, config);
                finalClassData.filiereId = resF.data.id;
                setAvailableFilieres(prev => [...prev, resF.data]);
                setIsFiliereAutre(false);
            }
<<<<<<< HEAD
=======
            if (isOptionAutre && customOption.nom && finalClassData.filiereId) {
                const resO = await axios.post('/api/admin/options', { ...customOption, filiereId: finalClassData.filiereId }, config);
                finalClassData.optionId = resO.data.id;
                setAvailableOptions(prev => [...prev, resO.data]);
                setIsOptionAutre(false);
            }
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
            if (!finalClassData.filiereId && !isFiliereAutre) {
                alert("Veuillez sélectionner une filière.");
                return;
            }
<<<<<<< HEAD
=======
            if (finalClassData.level === '1er') {
                finalClassData.optionId = null;
            } else if (!finalClassData.optionId && !isOptionAutre) {
                alert("Veuillez sélectionner une option.");
                return;
            }
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e


            await handleAddClass(null, finalClassData);

        } catch (error) {
            console.error('Error during creation:', error);
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    const selectedFiliereNom = availableFilieres.find(f => f.id === newClass.filiereId)?.nom;
=======
    const filteredOptions = newClass.filiereId ? availableOptions.filter(o => o.filiereId === newClass.filiereId) : availableOptions;
    const selectedFiliereNom = availableFilieres.find(f => f.id === newClass.filiereId)?.nom;
    const selectedOptionNom = availableOptions.find(o => o.id === newClass.optionId)?.nom;
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col">

                {/* Header */}
                <div className={`p-8 border-b border-[var(--border)] bg-gradient-to-r from-[var(--secondary)] to-[#003d6b] text-white ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                    <button onClick={onClose} className={`absolute top-6 p-2 hover:bg-white/10 rounded-full transition-all ${isRtl ? 'left-6' : 'right-6'}`}>
                        <X className="w-6 h-6" />
                    </button>
                    <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase italic leading-none mb-1">
                                {isEditing ? t('groups.update_title') : t('groups.init_title')}
                            </h2>
                            <p className="text-[10px] font-bold text-white/60 tracking-widest uppercase">
                                {t('groups.init_subtitle')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleFormSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[var(--text-muted)] uppercase">CODE DU GROUPE</label>
                            <input
                                type="text"
                                required
                                value={newClass.id}
                                onChange={e => setNewClass({ ...newClass, id: e.target.value.toUpperCase() })}
                                placeholder="EX: DEV101"
                                className="w-full bg-slate-50 border border-[var(--border)] rounded-xl p-4 text-sm font-bold text-[var(--secondary)] focus:ring-4 focus:ring-green-500/10 focus:border-[var(--primary)] outline-none transition-all"
                            />
                        </div>
<<<<<<< HEAD
                        <div className="space-y-2">
=======
                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-black tracking-widest text-[var(--text-muted)] uppercase">NIVEAU DE FORMATION</label>
                            <div
                                onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                                className="w-full bg-slate-50 border border-[var(--border)] rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <Layers className="w-4 h-4 text-[var(--primary)]" />
                                    <span className="text-sm font-bold text-[var(--secondary)] uppercase tracking-tight">
                                        {levels.find(l => l.value === (newClass.level || '1er'))?.label}
                                    </span>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-[var(--primary)] transition-transform ${isLevelDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {isLevelDropdownOpen && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    {levels.map((level) => (
                                        <div
                                            key={level.value}
                                            className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${newClass.level === level.value ? 'bg-green-50' : ''}`}
                                            onClick={() => {
                                                setNewClass({ ...newClass, level: level.value });
                                                setIsLevelDropdownOpen(false);
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Layers className={`w-4 h-4 ${newClass.level === level.value ? 'text-[var(--primary)]' : 'text-slate-300'}`} />
                                                <span className={`text-xs font-bold uppercase ${newClass.level === level.value ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>
                                                    {level.label}
                                                </span>
                                            </div>
                                            {newClass.level === level.value && <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></div>}
                                        </div>
                                    ))}
                                </div>
                            )}
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
                        </div>


                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-black tracking-widest text-[var(--text-muted)] uppercase">FILIÈRE</label>
                            {!isFiliereAutre ? (
                                <div className="space-y-2">
                                    <div
                                        onClick={() => setIsFiliereDropdownOpen(!isFiliereDropdownOpen)}
                                        className="w-full bg-slate-50 border border-[var(--border)] rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                    >
<<<<<<< HEAD
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <BookOpen className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                                            <span className="text-sm font-bold text-[var(--secondary)] uppercase tracking-tight truncate-text flex-1">
=======
                                        <div className="flex items-center gap-3">
                                            <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                                            <span className="text-sm font-bold text-[var(--secondary)] uppercase tracking-tight">
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
                                                {selectedFiliereNom || 'SÉLECTIONNER...'}
                                            </span>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-[var(--primary)] transition-transform ${isFiliereDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {isFiliereDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            {availableFilieres.map(f => (
                                                <div
                                                    key={f.id}
                                                    className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${newClass.filiereId === f.id ? 'bg-green-50' : ''}`}
                                                    onClick={() => {
<<<<<<< HEAD
                                                        setNewClass({ ...newClass, filiereId: f.id });
                                                        setIsFiliereDropdownOpen(false);
                                                    }}
                                                >
                                                    <span className={`text-xs font-bold uppercase truncate-text flex-1 ${newClass.filiereId === f.id ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>
=======
                                                        setNewClass({ ...newClass, filiereId: f.id, optionId: '' });
                                                        setIsFiliereDropdownOpen(false);
                                                    }}
                                                >
                                                    <span className={`text-xs font-bold uppercase ${newClass.filiereId === f.id ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
                                                        {f.nom}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        {newClass.filiereId === f.id && <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full mr-2"></div>}
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeleteModalInfo({ 
                                                                    isOpen: true, 
                                                                    type: 'filiere', 
                                                                    id: f.id, 
                                                                    message: "Voulez-vous vraiment supprimer cette filière et toutes ses options associées ?" 
                                                                });
                                                            }}
                                                            className="p-1.5 hover:bg-red-100 rounded-lg text-red-400 hover:text-red-500 transition-all opacity-50 hover:opacity-100"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <div
                                                className="px-6 py-4 cursor-pointer flex items-center justify-between transition-colors border-t border-slate-50 bg-slate-50/50 hover:bg-slate-100"
                                                onClick={() => {
                                                    setIsFiliereAutre(true);
                                                    setIsFiliereDropdownOpen(false);
                                                }}
                                            >
                                                <span className="text-xs font-black text-[var(--primary)] uppercase tracking-widest">AUTRE (PERSONNALISÉ)</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="relative">
                                    <input
                                        type="text"
                                        autoFocus
                                        required
                                        value={customFiliere.nom}
                                        onChange={e => setCustomFiliere({ ...customFiliere, nom: e.target.value.toUpperCase() })}
                                        placeholder="NOM DE LA FILIÈRE..."
                                        className="w-full bg-slate-50 border border-[var(--border)] rounded-xl p-4 pr-12 text-sm font-bold text-[var(--secondary)] focus:ring-4 focus:ring-green-500/10 focus:border-[var(--primary)] outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsFiliereAutre(false)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-full transition-all text-slate-400"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
<<<<<<< HEAD
=======
                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-black tracking-widest text-[var(--text-muted)] uppercase">OPTION</label>
                            {newClass.level === '1er' ? (
                                <div className="w-full bg-slate-100 border border-[var(--border)] rounded-xl p-4 flex items-center gap-3 opacity-75 cursor-not-allowed grayscale">
                                    <Hash className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-tight">TRONC COMMUN (TR)</span>
                                </div>
                            ) : !isOptionAutre ? (
                                <div className="space-y-2">
                                    <div
                                        onClick={() => setIsOptionDropdownOpen(!isOptionDropdownOpen)}
                                        className="w-full bg-slate-50 border border-[var(--border)] rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Hash className="w-4 h-4 text-[var(--primary)]" />
                                            <span className="text-sm font-bold text-[var(--secondary)] uppercase tracking-tight">
                                                {selectedOptionNom || 'SÉLECTIONNER...'}
                                            </span>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-[var(--primary)] transition-transform ${isOptionDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {isOptionDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            {filteredOptions.map(opt => (
                                                <div
                                                    key={opt.id}
                                                    className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${newClass.optionId === opt.id ? 'bg-green-50' : ''}`}
                                                    onClick={() => {
                                                        const updates = { optionId: opt.id };
                                                        if (opt.filiereId) updates.filiereId = opt.filiereId;
                                                        setNewClass({ ...newClass, ...updates });
                                                        setIsOptionDropdownOpen(false);
                                                    }}
                                                >
                                                    <span className={`text-xs font-bold uppercase ${newClass.optionId === opt.id ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>
                                                        {opt.nom}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        {newClass.optionId === opt.id && <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full mr-2"></div>}
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeleteModalInfo({ 
                                                                    isOpen: true, 
                                                                    type: 'option', 
                                                                    id: opt.id, 
                                                                    message: "Voulez-vous vraiment supprimer cette option ?" 
                                                                });
                                                            }}
                                                            className="p-1.5 hover:bg-red-100 rounded-lg text-red-400 hover:text-red-500 transition-all opacity-50 hover:opacity-100"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <div
                                                className="px-6 py-4 cursor-pointer flex items-center justify-between transition-colors border-t border-slate-50 bg-slate-50/50 hover:bg-slate-100"
                                                onClick={() => {
                                                    setIsOptionAutre(true);
                                                    setIsOptionDropdownOpen(false);
                                                }}
                                            >
                                                <span className="text-xs font-black text-[var(--primary)] uppercase tracking-widest">AUTRE (NOUVEAU)</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="relative">
                                    <input
                                        type="text"
                                        autoFocus
                                        required
                                        value={customOption.nom}
                                        onChange={e => setCustomOption({ ...customOption, nom: e.target.value.toUpperCase() })}
                                        placeholder="NOM DE L'OPTION..."
                                        className="w-full bg-slate-50 border border-[var(--border)] rounded-xl p-4 pr-12 text-sm font-bold text-[var(--secondary)] focus:ring-4 focus:ring-green-500/10 focus:border-[var(--primary)] outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsOptionAutre(false)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-full transition-all text-slate-400"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 relative">
                                <label className="text-[10px] font-black tracking-widest text-[var(--text-muted)] uppercase">ANNÉE SCOLAIRE</label>
                                <div
                                    onClick={() => setIsAnneeDropdownOpen(!isAnneeDropdownOpen)}
                                    className="w-full bg-slate-50 border border-[var(--border)] rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                                        <span className="text-sm font-bold text-[var(--secondary)] uppercase tracking-tight">
                                            {newClass.année_scolaire || 'SÉLECTIONNER...'}
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-[var(--primary)] transition-transform ${isAnneeDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>

                                {isAnneeDropdownOpen && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        {anneesScolaires.map((annee) => (
                                            <div
                                                key={annee}
                                                className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${newClass.année_scolaire === annee ? 'bg-green-50' : ''}`}
                                                onClick={() => {
                                                    setNewClass({ ...newClass, année_scolaire: annee });
                                                    setIsAnneeDropdownOpen(false);
                                                }}
                                            >
                                                <span className={`text-xs font-bold uppercase ${newClass.année_scolaire === annee ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>
                                                    {annee}
                                                </span>
                                                {newClass.année_scolaire === annee && <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></div>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2 relative">
                                <label className="text-[10px] font-black tracking-widest text-[var(--text-muted)] uppercase">FORMATEURS / RESPONSABLES</label>
                                <div
                                    onClick={() => setIsFormateurDropdownOpen(!isFormateurDropdownOpen)}
                                    className="w-full bg-slate-50 border border-[var(--border)] rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <UserCheck className="w-4 h-4 text-[var(--primary)]" />
<<<<<<< HEAD
                                        <span className={`text-sm font-bold uppercase truncate-text flex-1 ${newClass.lead?.length > 0 ? 'text-[var(--secondary)]' : 'text-slate-400'}`}>
=======
                                        <span className={`text-sm font-bold uppercase truncate ${newClass.lead?.length > 0 ? 'text-[var(--secondary)]' : 'text-slate-400'}`}>
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
                                            {newClass.lead?.length > 0 ? newClass.lead.join(', ') : 'SÉLECTIONNER...'}
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-[var(--primary)] transition-transform ${isFormateurDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>

                                {isFormateurDropdownOpen && (
                                    <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto ista-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        {formateurs.map((f) => {
                                            const isSelected = newClass.lead?.includes(f.name);
                                            return (
                                                <div
                                                    key={f.id}
                                                    className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${isSelected ? 'bg-green-50' : ''}`}
                                                    onClick={() => {
                                                        const currentLeads = Array.isArray(newClass.lead) ? newClass.lead : [];
                                                        const newLead = isSelected
                                                            ? currentLeads.filter(l => l !== f.name)
                                                            : [...currentLeads, f.name];
                                                        setNewClass({ ...newClass, lead: newLead });
                                                    }}
                                                >
<<<<<<< HEAD
                                                    <span className={`text-xs font-bold uppercase truncate-text flex-1 ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>{f.name}</span>
=======
                                                    <span className={`text-xs font-bold uppercase ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`}>{f.name}</span>
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
                                                    {isSelected ? <CheckSquare className="w-4 h-4 text-[var(--primary)]" /> : <Square className="w-4 h-4 text-slate-200" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>




                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full btn-ista py-5 rounded-xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all"
                        >
                            <UserCheck className="w-5 h-5" />
                            Créer le Groupe
                        </button>
                    </div>
                </form>

            </div>

            <ConfirmationModal
                isOpen={deleteModalInfo.isOpen}
                onClose={() => setDeleteModalInfo({ isOpen: false, type: '', id: null, message: '' })}
                onConfirm={confirmDelete}
                title={`SUPPRESSION ${deleteModalInfo.type === 'option' ? "D'OPTION" : 'DE FILIÈRE'}`}
                message={deleteModalInfo.message}
            />

            <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 4px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>,
        document.body
    );
};

export default GroupModal;
