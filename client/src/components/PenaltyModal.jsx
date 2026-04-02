import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Gavel, AlertCircle, FileText, User, Hash, Briefcase, Calendar, Clock, ArrowRight, ShieldAlert, History, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PenaltyModal = ({ isOpen, onClose, student, onConfirm, submitting }) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [penaltyData, setPenaltyData] = useState({
        penalty: 'Blâme 1',
        reason: ''
    });

    if (!isOpen || !student) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(penaltyData);
    };

    const penaltyLevels = [
        { value: 'Blâme 1', label: 'BLÂME 1', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', icon: AlertCircle },
        { value: 'Blâme 2', label: 'BLÂME 2 (MISE À PIED)', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', icon: ShieldAlert },
        { value: 'Blâme 3', label: 'BLÂME 3 (EXCLUSION)', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', icon: Gavel },
    ];

    const currentLevel = penaltyLevels.find(p => p.value === penaltyData.penalty);

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`bg-white rounded-[40px] w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col h-[85vh] max-h-[750px] ${isRtl ? 'text-right direction-rtl' : ''}`}>
                
                {/* Header Style like ClassDossierModal */}
                <div className={`p-10 pb-8 border-b border-slate-50 flex justify-between items-start bg-white sticky top-0 z-30 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div>
                        <div className={`flex items-center gap-3 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <div className="w-1.5 h-6 bg-red-500 rounded-full"></div>
                            <h3 className="text-3xl font-black italic tracking-tight text-[var(--secondary)] uppercase leading-none">
                                DÉCISION DISCIPLINAIRE
                            </h3>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase italic">Protocole de gestion des sanctions — ISTA Digital</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-red-50 rounded-2xl transition-all text-slate-300 hover:text-red-500 border border-transparent hover:border-red-100"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto ista-scrollbar p-10 pt-8">
                    <form onSubmit={handleSubmit} className="h-full flex flex-col">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1">
                            
                            {/* Left: Student Context */}
                            <div className={`space-y-8 ${isRtl ? 'order-1 lg:order-2' : ''}`}>
                                <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <h3 className={`text-xs font-black tracking-widest text-[var(--secondary)] uppercase flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <User className="w-4 h-4 text-red-500" /> PROFIL DU STAGIAIRE
                                    </h3>
                                    <div className="px-4 py-1.5 bg-red-50 rounded-lg border border-red-100">
                                        <span className="text-[9px] font-black text-red-500 tracking-widest uppercase">DOSSIER ACTIF</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50/50 border border-slate-100 rounded-[32px] p-8 space-y-8">
                                    <div className={`flex items-center gap-6 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                                        <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center text-2xl font-black italic text-red-500 border border-red-50">
                                            {student.student_name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black italic text-[var(--secondary)] uppercase tracking-tight leading-none">{student.student_name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">MATRICULE: {student.student_id}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-1 shadow-sm">
                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Groupe</p>
                                            <p className="text-sm font-black italic text-[var(--secondary)] uppercase">{student.class_id}</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-1 shadow-sm">
                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Type d'Infraction</p>
                                            <p className="text-sm font-black italic text-red-500 uppercase">{student.status === 'ABSENT' ? 'ABSENCE' : 'RETARD'}</p>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100/50">
                                        <div className={`flex items-center gap-3 mb-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <Activity className="w-4 h-4 text-red-500" />
                                            <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">Détails de l'incident</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-slate-400 uppercase font-bold">Module:</span>
                                                <span className="text-[var(--secondary)] font-black uppercase text-right">{student.subject}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-slate-400 uppercase font-bold">Date séance:</span>
                                                <span className="text-[var(--secondary)] font-black uppercase text-right">{new Date(student.session_date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-slate-400 uppercase font-bold">Heure:</span>
                                                <span className="text-[var(--secondary)] font-black uppercase text-right">{student.session_time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Penalty Decisions */}
                            <div className={`space-y-8 ${isRtl ? 'order-2 lg:order-1' : ''}`}>
                                <h3 className={`text-xs font-black tracking-widest text-[var(--secondary)] uppercase flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <Gavel className="w-4 h-4 text-red-500" /> CONFIGURATION DE LA SANCTION
                                </h3>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Niveau de Sanction</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {penaltyLevels.map((lvl) => (
                                                <div 
                                                    key={lvl.value}
                                                    onClick={() => setPenaltyData({ ...penaltyData, penalty: lvl.value })}
                                                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${penaltyData.penalty === lvl.value ? `${lvl.border} ${lvl.bg} shadow-lg scale-[1.02]` : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${penaltyData.penalty === lvl.value ? 'bg-white text-red-500 shadow-sm' : 'bg-slate-200 text-slate-400'}`}>
                                                            <lvl.icon className="w-5 h-5" />
                                                        </div>
                                                        <span className={`text-xs font-black tracking-tight ${penaltyData.penalty === lvl.value ? 'text-[var(--secondary)]' : 'text-slate-400'} uppercase`}>{lvl.label}</span>
                                                    </div>
                                                    {penaltyData.penalty === lvl.value && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className={`text-[9px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <FileText className="w-3 h-3"/> {t('modals.identity.reason') || 'Observations & Motif'}
                                        </label>
                                        <textarea
                                            required
                                            rows="5"
                                            value={penaltyData.reason}
                                            onChange={e => setPenaltyData({ ...penaltyData, reason: e.target.value.toUpperCase() })}
                                            placeholder="PRÉCISEZ LES CIRCONSTANCES OU LA DÉCISION..."
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-sm font-bold text-[var(--secondary)] focus:border-red-500 focus:ring-4 focus:ring-red-500/5 outline-none transition-all placeholder:text-slate-300 uppercase italic"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col gap-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-6 rounded-3xl text-[11px] font-black tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-4 shadow-2xl ${submitting ? 'bg-slate-100 text-slate-400' : 'bg-red-500 text-white shadow-red-500/30 hover:bg-red-600 hover:scale-[1.01] active:scale-[0.99]'} ${isRtl ? 'flex-row-reverse' : ''}`}
                            >
                                {submitting ? (
                                    <>
                                        <Activity className="w-5 h-5 animate-spin" />
                                        SYNCHRONISATION...
                                    </>
                                ) : (
                                    <>
                                        ACTIVER LA SANCTION
                                        <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[8px] font-black text-slate-300 tracking-[0.5em] uppercase">REGISTRE DISCIPLINAIRE CENTRALISÉ ISTA</p>
                        </div>
                    </form>
                </div>

                <style>{`
                    .ista-scrollbar::-webkit-scrollbar { width: 4px; }
                    .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .ista-scrollbar::-webkit-scrollbar-thumb { background: #fee2e2; border-radius: 10px; }
                    .ista-scrollbar::-webkit-scrollbar-thumb:hover { background: #fca5a5; }
                `}</style>
            </div>
        </div>,
        document.body
    );
};

export default PenaltyModal;
