import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Gavel, AlertCircle, FileText, ArrowRight, ShieldAlert, Activity, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';
import axios from 'axios';

const PenaltyDecision = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    
    const { student } = state || {};
    const [submitting, setSubmitting] = useState(false);
    const [penaltyData, setPenaltyData] = useState({
        penalty: 'Blâme 1',
        reason: ''
    });

    useEffect(() => {
        if (!state || !student) {
            navigate('/admin/absence-registry');
            return;
        }
    }, [state, student, navigate]);

    const penaltyLevels = [
        { value: 'Blâme 1', label: 'DEGRÉ 1', fullLabel: 'BLÂME SIMPLE', color: 'text-amber-500', bg: 'bg-amber-50/50', border: 'border-amber-200', icon: AlertCircle },
        { value: 'Blâme 2', label: 'DEGRÉ 2', fullLabel: 'MISE À PIED', color: 'text-orange-500', bg: 'bg-orange-50/50', border: 'border-orange-200', icon: ShieldAlert },
        { value: 'Blâme 3', label: 'DEGRÉ 3', fullLabel: 'EXCLUSION', color: 'text-red-500', bg: 'bg-red-50/50', border: 'border-red-200', icon: Gavel },
    ];

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!penaltyData.reason) {
            addNotification(t('modals.penalty.reason_required') || "MOTIF REQUIS", "error");
            return;
        }
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/admin/discipline', {
                stagiaireId: student.student_id,
                penalty: penaltyData.penalty,
                reason: penaltyData.reason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addNotification(t('absence_registry.penalty_success'), "success");
            navigate('/admin/absence-registry');
        } catch (err) {
            console.error('Penalty submission failed', err);
            addNotification(t('absence_registry.penalty_error'), "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (!student) return null;

    return (
        <div className={`fade-up max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right direction-rtl' : ''}`}>
            {/* 1. MINIMALIST BREADCRUMB/CLOSE */}
            <div className={`flex justify-between items-center mb-12 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <button 
                    onClick={() => navigate('/admin/absence-registry')}
                    className={`flex items-center gap-2 text-slate-400 hover:text-[var(--primary)] transition-colors group ${isRtl ? 'flex-row-reverse' : ''}`}
                >
                    <ChevronLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isRtl ? 'rotate-180' : ''}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('common.back') || 'RETOUR AU REGISTRE'}</span>
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">PROCÉDURE DISCIPLINAIRE EN COURS</span>
                </div>
            </div>

            {/* 2. THE BIG HEADER (EDITORIAL STYLE) */}
            <div className={`border-b-4 border-slate-900 pb-10 mb-16 flex flex-col md:flex-row justify-between items-end gap-8 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                <div className={isRtl ? 'text-right' : ''}>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase text-slate-900 leading-[0.8] mb-4">
                        {student.student_name}
                    </h1>
                    <div className={`flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <span className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">MATRICULE: {student.student_id}</span>
                        <div className="h-4 w-[1px] bg-slate-200"></div>
                        <span className="text-sm font-black text-[var(--primary)] uppercase tracking-[0.3em]">{student.class_id}</span>
                    </div>
                </div>
                <div className={`flex flex-col ${isRtl ? 'items-start text-left' : 'items-end text-right'}`}>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-2">STATUT DE L'INCIDENT</p>
                    <div className="px-6 py-2 bg-red-50 border border-red-100 text-red-500 font-black text-xs uppercase tracking-widest">
                        {student.status} — ABSENCE NON JUSTIFIÉE
                    </div>
                </div>
            </div>

            {/* 3. TACTICAL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* LEFT: CONTEXT & STATS (3 cols) */}
                <div className="lg:col-span-3 space-y-12">
                    <section>
                        <h4 className={`text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-8 border-b border-slate-100 pb-4 ${isRtl ? 'text-right' : ''}`}>
                            CONTEXTE
                        </h4>
                        <div className="space-y-6">
                            {[
                                { label: 'GROUPE', value: student.class_id },
                                { label: 'MODULE', value: student.subject },
                                { label: 'SESSION', value: student.session_time },
                                { label: 'DATE', value: new Date(student.session_date).toLocaleDateString() }
                            ].map((item, i) => (
                                <div key={i} className={isRtl ? 'text-right' : ''}>
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className="text-xs font-black text-slate-600 uppercase tracking-tight">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h4 className={`text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-8 border-b border-slate-100 pb-4 ${isRtl ? 'text-right' : ''}`}>
                            ANTÉCÉDENTS
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-6 text-center">
                                <p className="text-2xl font-black text-slate-900 leading-none mb-1">{student.total_absences || 0}</p>
                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">TOTAL ABSENCES</p>
                            </div>
                            <div className="bg-slate-50 p-6 text-center">
                                <p className="text-2xl font-black text-red-500 leading-none mb-1">{student.total_blames || 0}</p>
                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">SANCTIONS</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* CENTER: SELECTION (5 cols) */}
                <div className="lg:col-span-5 border-x border-slate-50 px-0 lg:px-12">
                    <h4 className={`text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-8 border-b border-slate-100 pb-4 ${isRtl ? 'text-right' : ''}`}>
                        SÉLECTION DE LA SANCTION
                    </h4>
                    <div className="space-y-4">
                        {penaltyLevels.map((lvl) => (
                            <button
                                key={lvl.value}
                                onClick={() => setPenaltyData({ ...penaltyData, penalty: lvl.value })}
                                className={`w-full p-8 transition-all flex items-center justify-between group ${
                                    penaltyData.penalty === lvl.value 
                                    ? `${lvl.bg} border-2 ${lvl.border} shadow-xl scale-[1.02]` 
                                    : 'bg-white border-2 border-slate-50 hover:border-slate-200'
                                } ${isRtl ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-12 h-12 flex items-center justify-center transition-colors ${penaltyData.penalty === lvl.value ? 'text-slate-900' : 'text-slate-200'}`}>
                                        <lvl.icon className="w-8 h-8" />
                                    </div>
                                    <div className={isRtl ? 'text-right' : 'text-left'}>
                                        <p className={`text-[10px] font-black tracking-widest ${penaltyData.penalty === lvl.value ? 'text-slate-900' : 'text-slate-300'} uppercase`}>{lvl.label}</p>
                                        <p className={`text-sm font-black italic tracking-tight ${penaltyData.penalty === lvl.value ? lvl.color : 'text-slate-400'} uppercase`}>{lvl.fullLabel}</p>
                                    </div>
                                </div>
                                {penaltyData.penalty === lvl.value && (
                                    <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                                        <ArrowRight className={`w-3 h-3 text-white ${isRtl ? 'rotate-180' : ''}`} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT: OFFICIAL RECORD (4 cols) */}
                <div className="lg:col-span-4 flex flex-col h-full">
                    <h4 className={`text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-8 border-b border-slate-100 pb-4 ${isRtl ? 'text-right' : ''}`}>
                        RAPPORT OFFICIEL
                    </h4>
                    <div className="flex-1 flex flex-col gap-8">
                        <div className="relative group">
                            <textarea
                                required
                                rows="6"
                                value={penaltyData.reason}
                                onChange={e => setPenaltyData({ ...penaltyData, reason: e.target.value.toUpperCase() })}
                                placeholder="DÉTAILLEZ LES MOTIFS ET LES CIRCONSTANCES ICI..."
                                className="w-full bg-slate-50 p-8 text-sm font-bold text-slate-900 focus:bg-white border-b-2 border-transparent focus:border-red-500 outline-none transition-all placeholder:text-slate-200 uppercase italic"
                            />
                            <div className="absolute top-4 right-4 opacity-10 group-focus-within:opacity-30 transition-opacity">
                                <FileText className="w-12 h-12" />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !penaltyData.reason}
                            className={`w-full py-10 transition-all flex items-center justify-center gap-6 shadow-2xl ${
                                submitting || !penaltyData.reason
                                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                : 'bg-red-500 text-white hover:bg-black hover:-translate-y-1 active:translate-y-0'
                            } ${isRtl ? 'flex-row-reverse' : ''}`}
                        >
                            {submitting ? (
                                <Activity className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <span className="text-sm font-black uppercase tracking-[0.6em]">VALIDER LE PROCÈS-VERBAL</span>
                                    <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                                </>
                            )}
                        </button>
                        
                        <p className="text-[7px] font-black text-slate-300 tracking-[0.6em] uppercase text-center mt-auto">
                            ISTA DIGITAL • PROTOCOLE AUTOMATISÉ № {Math.floor(Math.random() * 900000 + 100000)}
                        </p>
                    </div>
                </div>

            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
            `}</style>
        </div>
    );
};

export default PenaltyDecision;
