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
            <div className={`bg-white rounded-[32px] w-full max-w-4xl shadow-[0_30px_100px_rgba(0,0,0,0.15)] relative overflow-hidden flex flex-col h-[75vh] max-h-[650px] ${isRtl ? 'text-right direction-rtl' : ''}`}>
                
                {/* 1. INTEGRATED IDENTITY HEADER */}
                <div className="bg-white p-8 border-b border-slate-50 flex justify-between items-center relative overflow-hidden">
                    
                    <div className={`flex items-center gap-5 relative z-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-2xl font-black italic text-red-500 shadow-sm">
                            {student.student_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col">
                            <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <h3 className="text-2xl font-black italic tracking-tight text-[var(--secondary)] uppercase leading-none">
                                    {student.student_name}
                                </h3>
                                <div className="px-3 py-1 bg-red-50 border border-red-100 rounded-lg text-[9px] font-black text-red-500 tracking-widest uppercase shadow-sm">
                                    {student.class_id}
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1.5">{t('common.matricule')}: {student.student_id}</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center hover:bg-red-50 rounded-2xl transition-all text-slate-300 hover:text-red-500 border border-transparent hover:border-red-100 relative z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* 2. LEFT PANE: CONTEXT & HISTORY */}
                    <div className="w-full md:w-[38%] border-r border-slate-50 bg-slate-50/30 p-8 overflow-y-auto ista-scrollbar">
                        <div className="space-y-8">
                            {/* Incident Summary */}
                            <div className="space-y-4">
                                <h4 className={`text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <Activity className="w-3.5 h-3.5 text-[var(--primary)]" /> {t('modals.penalty.incident_details')}
                                </h4>
                                <div className="space-y-3">
                                    {[
                                        { label: 'STATUS', value: student.status, color: 'text-red-500' },
                                        { label: 'MODULE', value: student.subject, color: 'text-[var(--secondary)]' },
                                        { label: 'SESSION', value: `${new Date(student.session_date).toLocaleDateString()} • ${student.session_time}`, color: 'text-slate-400' }
                                    ].map((item, idx) => (
                                        <div key={idx} className={`flex justify-between items-center py-2 border-b border-slate-100/50 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{item.label}</span>
                                            <span className={`text-[10px] font-black uppercase ${item.color}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Attendance Snapshot */}
                            <div className="space-y-4 pt-4">
                                <h4 className={`text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <History className="w-3.5 h-3.5 text-amber-500" /> {t('modals.penalty.history_title')}
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center group hover:border-red-100 transition-colors">
                                        <div className="text-xl font-black italic text-red-500 leading-none mb-1">{student.total_absences || '0'}</div>
                                        <div className="text-[7px] font-black text-slate-300 uppercase tracking-widest">{t('modals.penalty.total_absences')}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center group hover:border-[var(--primary)] transition-colors">
                                        <div className="text-xl font-black italic text-[var(--primary)] leading-none mb-1">{student.total_blames || '0'}</div>
                                        <div className="text-[7px] font-black text-slate-300 uppercase tracking-widest">{t('modals.penalty.sanctions')}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 3. RIGHT PANE: THE DECISION */}
                    <div className="flex-1 p-8 overflow-y-auto ista-scrollbar bg-white">
                        <form onSubmit={handleSubmit} className="space-y-8 h-full flex flex-col">
                            <div className="space-y-6 flex-1">
                                <div className="space-y-4">
                                    <h4 className={`text-[10px] font-black tracking-[0.2em] text-[var(--secondary)] uppercase flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <Gavel className="w-3.5 h-3.5 text-red-500" /> {t('modals.penalty.penalty_config')}
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {penaltyLevels.map((lvl) => (
                                            <div 
                                                key={lvl.value}
                                                onClick={() => setPenaltyData({ ...penaltyData, penalty: lvl.value })}
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${penaltyData.penalty === lvl.value ? `${lvl.border} ${lvl.bg} shadow-md scale-[1.01]` : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${penaltyData.penalty === lvl.value ? 'bg-white text-red-500 shadow-sm' : 'bg-slate-200 text-slate-400'}`}>
                                                        <lvl.icon className="w-4 h-4" />
                                                    </div>
                                                    <span className={`text-[10px] font-black tracking-tight ${penaltyData.penalty === lvl.value ? 'text-[var(--secondary)]' : 'text-slate-400'} uppercase`}>{lvl.label}</span>
                                                </div>
                                                {penaltyData.penalty === lvl.value && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[7px] font-black text-red-500 uppercase tracking-widest">SELECTED</span>
                                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className={`text-[8px] font-black tracking-[0.2em] text-slate-300 uppercase flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <FileText className="w-3 h-3 text-[var(--primary)]"/> {t('modals.identity.reason') || 'OBSERVATIONS & MOTIF'}
                                    </h4>
                                    <textarea
                                        required
                                        rows="4"
                                        value={penaltyData.reason}
                                        onChange={e => setPenaltyData({ ...penaltyData, reason: e.target.value.toUpperCase() })}
                                        placeholder="DÉTAILLEZ LE MOTIF DE CETTE SANCTION..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-[11px] font-bold text-[var(--secondary)] focus:border-red-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 uppercase italic"
                                    />
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="pt-6 border-t border-slate-50">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full py-4.5 rounded-2xl text-[10px] font-black tracking-[0.25em] uppercase transition-all flex items-center justify-center gap-3 shadow-xl ${submitting ? 'bg-slate-100 text-slate-400' : 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600 hover:shadow-red-500/40 hover:-translate-y-0.5 active:translate-y-0'} ${isRtl ? 'flex-row-reverse' : ''}`}
                                >
                                    {submitting ? (
                                        <>
                                            <Activity className="w-4 h-4 animate-spin" />
                                            VALIDATION...
                                        </>
                                    ) : (
                                        <>
                                            {t('modals.penalty.activate_penalty')}
                                            <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[7px] font-black text-slate-300 tracking-[0.4em] uppercase mt-4">OFFPT SMART ATTENDANCE • PROTOCOLE DISCIPLINAIRE</p>
                            </div>
                        </form>
                    </div>
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
