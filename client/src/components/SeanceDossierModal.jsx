import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ChevronRight, X, ChevronDown, CheckSquare, Square, Calendar, Clock, BookOpen, User, MapPin, Save, Plus } from 'lucide-react';

const SeanceDossierModal = ({ isOpen, onClose, targetSeance, handleUpdateSeance, handleCreateSeance, availableClasses = [], formateurs = [] }) => {
    const timeSlots = ['08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];
    const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];

    const [isStartDropdownOpen, setIsStartDropdownOpen] = useState(false);
    const [isEndDropdownOpen, setIsEndDropdownOpen] = useState(false);
    const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
    const [isFormateurDropdownOpen, setIsFormateurDropdownOpen] = useState(false);
    const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);

    const [seanceEdit, setSeanceEdit] = useState({
        id: '',
        subject: '',
        room: '',
        formateur_id: '',
        formateur_name: '',
        class_id: '',
        day: 'LUNDI',
        startTime: '08:30',
        endTime: '10:30'
    });

    const isCreation = !targetSeance?.id;

    useEffect(() => {
        if (targetSeance) {
            let start = '08:30';
            let end = '10:30';
            if (targetSeance.time && targetSeance.time.includes('-')) {
                const parts = targetSeance.time.split('-');
                start = parts[0].trim();
                end = parts[1].trim();
            }

            const matchingFormateur = formateurs.find(f => f.name === targetSeance.formateur);

            setSeanceEdit({
                id: targetSeance.id || '',
                subject: targetSeance.subject || '',
                room: targetSeance.room || '',
                formateur_id: matchingFormateur?.id || '',
                formateur_name: targetSeance.formateur || '',
                class_id: targetSeance.class || '',
                day: targetSeance.day || 'LUNDI',
                startTime: start,
                endTime: end
            });
        } else {
            setSeanceEdit({
                id: '',
                subject: '',
                room: '',
                formateur_id: '',
                formateur_name: '',
                class_id: '',
                day: 'LUNDI',
                startTime: '08:30',
                endTime: '10:30'
            });
        }
    }, [targetSeance, formateurs]);

    if (!isOpen) return null;

    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...seanceEdit,
            time: `${seanceEdit.startTime} - ${seanceEdit.endTime}`
        };

        if (isCreation) {
            handleCreateSeance(payload);
        } else {
            handleUpdateSeance(payload);
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-6xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-[90vh] max-h-[850px]">

                {/* Left Panel (Summary) */}
                <div className="w-full md:w-[35%] bg-gradient-to-br from-[var(--secondary)] to-[#003d6b] text-white p-12 flex flex-col">
                    <div className="mb-auto">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 mb-8">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-5xl font-black italic tracking-tighter leading-[0.9] mb-4">
                            SÉANCE <br /> <span className="text-[var(--primary)]">{isCreation ? 'NOUVELLE' : 'MODIFIER'}</span>
                        </h2>
                        <p className="text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase">Service de Planification ISTA</p>
                    </div>

                    <div className="space-y-8 mt-12 bg-black/10 p-8 rounded-3xl border border-white/5">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white/40 tracking-widest uppercase">GROUPE CIBLE</p>
                            <p className="text-xl font-black italic uppercase tracking-tight text-[var(--primary)]">{seanceEdit.class_id || 'EN ATTENTE...'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white/40 tracking-widest uppercase">HORAIRE PRÉVU</p>
                            <p className="text-sm font-bold uppercase tracking-tight">
                                {seanceEdit.day} • {seanceEdit.startTime} - {seanceEdit.endTime}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white/40 tracking-widest uppercase">STATUT OPÉRATIONNEL</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest">{isCreation ? 'CRÉATION EN COURS' : 'MODIFICATION'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto hidden md:block">
                        <p className="text-[8px] font-bold text-white/30 tracking-[0.4em] uppercase">ISTA_TIMETABLE_ENGINE_v3</p>
                    </div>
                </div>

                {/* Right Panel (Form) */}
                <div className="flex-1 bg-white flex flex-col relative overflow-hidden">
                    {/* Fixed Header */}
                    <div className="p-12 pb-8 border-b border-slate-50 flex justify-between items-start sticky top-0 bg-white z-30">
                        <div>
                            <h3 className="text-3xl font-black italic tracking-tight text-[var(--secondary)] uppercase mb-2 leading-none">Paramètres de la Séance</h3>
                            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Définissez les détails du cours pour l'emploi du temps.</p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-300 hover:text-[var(--secondary)]"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto ista-scrollbar p-12 pt-8">
                        <form onSubmit={onSubmit} className="space-y-10 flex-1 flex flex-col pb-12">
                            <div className="space-y-8">
                                {/* Groupe & Jour */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="relative space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                            <BookOpen className="w-3 h-3" />
                                            Groupe (Section)
                                        </label>
                                        <div
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                            onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                                        >
                                            <span className={`text-sm font-bold uppercase truncate ${seanceEdit.class_id ? 'text-[var(--secondary)]' : 'text-slate-300'}`}>
                                                {seanceEdit.class_id || 'SÉLECTIONNER UN GROUPE...'}
                                            </span>
                                            <ChevronDown className={`w-5 h-5 text-[var(--primary)] transition-transform ${isClassDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                        {isClassDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto ista-scrollbar animate-in fade-in zoom-in-95 duration-200">
                                                {availableClasses.map(cls => (
                                                    <div
                                                        key={cls.id}
                                                        className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${seanceEdit.class_id === cls.id ? 'bg-green-50' : ''}`}
                                                        onClick={() => { setSeanceEdit({ ...seanceEdit, class_id: cls.id }); setIsClassDropdownOpen(false); }}
                                                    >
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${seanceEdit.class_id === cls.id ? 'text-[var(--primary)]' : 'text-slate-400'}`}>{cls.id}</span>
                                                        {seanceEdit.class_id === cls.id && <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></div>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                            <Calendar className="w-3 h-3" />
                                            Jour de la Semaine
                                        </label>
                                        <div
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                            onClick={() => setIsDayDropdownOpen(!isDayDropdownOpen)}
                                        >
                                            <span className="text-sm font-bold text-[var(--secondary)] uppercase">
                                                {seanceEdit.day}
                                            </span>
                                            <ChevronDown className={`w-5 h-5 text-[var(--primary)] transition-transform ${isDayDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                        {isDayDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                                                {days.map(day => (
                                                    <div
                                                        key={day}
                                                        className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${seanceEdit.day === day ? 'bg-green-50' : ''}`}
                                                        onClick={() => { setSeanceEdit({ ...seanceEdit, day }); setIsDayDropdownOpen(false); }}
                                                    >
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${seanceEdit.day === day ? 'text-[var(--primary)]' : 'text-slate-400'}`}>{day}</span>
                                                        {seanceEdit.day === day && <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></div>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Module */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                        <Plus className="w-3 h-3" />
                                        Module / Discipline
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={seanceEdit.subject}
                                        onChange={e => setSeanceEdit({ ...seanceEdit, subject: e.target.value })}
                                        placeholder="Nom du module..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-[var(--secondary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-green-500/5 outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>

                                {/* Formateur */}
                                <div className="relative space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                        <User className="w-3 h-3" />
                                        Formateur Responsable
                                    </label>
                                    <div
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                        onClick={() => setIsFormateurDropdownOpen(!isFormateurDropdownOpen)}
                                    >
                                        <span className={`text-sm font-bold uppercase truncate ${seanceEdit.formateur_id ? 'text-[var(--secondary)]' : 'text-slate-300'}`}>
                                            {seanceEdit.formateur_name || 'SÉLECTIONNER UN FORMATEUR...'}
                                        </span>
                                        <ChevronDown className={`w-5 h-5 text-[var(--primary)] transition-transform ${isFormateurDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {isFormateurDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto ista-scrollbar animate-in fade-in zoom-in-95 duration-200">
                                            {formateurs.map(f => (
                                                <div
                                                    key={f.id}
                                                    className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${seanceEdit.formateur_id === f.id ? 'bg-green-50' : ''}`}
                                                    onClick={() => {
                                                        setSeanceEdit({ ...seanceEdit, formateur_id: f.id, formateur_name: f.name });
                                                        setIsFormateurDropdownOpen(false);
                                                    }}
                                                >
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${seanceEdit.formateur_id === f.id ? 'text-[var(--primary)]' : 'text-slate-400'}`}>{f.name}</span>
                                                    {seanceEdit.formateur_id === f.id && <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></div>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Salle */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                        <MapPin className="w-3 h-3" />
                                        Salle de Cours
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={seanceEdit.room}
                                        onChange={e => setSeanceEdit({ ...seanceEdit, room: e.target.value.toUpperCase() })}
                                        placeholder="Numéro ou Nom de la salle..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-[var(--secondary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-green-500/5 outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>

                                {/* Horaires */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="relative space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                            <Clock className="w-3 h-3" />
                                            Heure de Début
                                        </label>
                                        <div
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                            onClick={() => { setIsStartDropdownOpen(!isStartDropdownOpen); setIsEndDropdownOpen(false); }}
                                        >
                                            <span className="text-sm font-bold text-[var(--secondary)] uppercase">
                                                {seanceEdit.startTime}
                                            </span>
                                            <ChevronDown className={`w-5 h-5 text-[var(--primary)] transition-transform ${isStartDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                        {isStartDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto ista-scrollbar animate-in fade-in zoom-in-95 duration-200">
                                                {timeSlots.map((time) => (
                                                    <div
                                                        key={time}
                                                        className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${seanceEdit.startTime === time ? 'bg-green-50' : ''}`}
                                                        onClick={() => {
                                                            setSeanceEdit({ ...seanceEdit, startTime: time });
                                                            setIsStartDropdownOpen(false);
                                                        }}
                                                    >
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${seanceEdit.startTime === time ? 'text-[var(--primary)]' : 'text-slate-400'}`}>{time}</span>
                                                        {seanceEdit.startTime === time && <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></div>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                            <Clock className="w-3 h-3" />
                                            Heure de Fin
                                        </label>
                                        <div
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all"
                                            onClick={() => { setIsEndDropdownOpen(!isEndDropdownOpen); setIsStartDropdownOpen(false); }}
                                        >
                                            <span className="text-sm font-bold text-[var(--secondary)] uppercase">
                                                {seanceEdit.endTime}
                                            </span>
                                            <ChevronDown className={`w-5 h-5 text-[var(--primary)] transition-transform ${isEndDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                        {isEndDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto ista-scrollbar animate-in fade-in zoom-in-95 duration-200">
                                                {timeSlots.map((time) => (
                                                    <div
                                                        key={time}
                                                        className={`px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${seanceEdit.endTime === time ? 'bg-green-50' : ''}`}
                                                        onClick={() => {
                                                            setSeanceEdit({ ...seanceEdit, endTime: time });
                                                            setIsEndDropdownOpen(false);
                                                        }}
                                                    >
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${seanceEdit.endTime === time ? 'text-[var(--primary)]' : 'text-slate-400'}`}>{time}</span>
                                                        {seanceEdit.endTime === time && <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></div>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="pt-12">
                                    <button
                                        type="submit"
                                        className="w-full btn-ista py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all"
                                    >
                                        {isCreation ? <Plus className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                                        <span>{isCreation ? 'Initialiser la séance' : 'Mettre à jour la séance'}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 4px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>,
        document.body
    );
};

export default SeanceDossierModal;
