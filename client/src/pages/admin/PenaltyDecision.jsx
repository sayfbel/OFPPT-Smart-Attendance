import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Gavel, AlertCircle, FileText, ArrowRight, ShieldAlert, Activity, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';
import axios from 'axios';

const PenaltyDecision = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    
    // Fallback if accessed directly without state
    const student = location.state?.student || {
        student_id: 'DEMO001',
        student_name: 'ÉTUDIANT DE TEST',
        class_id: 'GROUPE TEST',
        subject: 'MODULE TEST',
        session_time: '08:30 - 11:00',
        session_date: new Date().toISOString(),
        status: 'ABSENT',
        total_absences: 3,
        total_blames: 1
    };

    const [submitting, setSubmitting] = useState(false);
    const [penaltyData, setPenaltyData] = useState({
        penalty: 'Blâme 1',
        reason: ''
    });

    const penaltyLevels = [
        { value: 'Blâme 1', label: 'DEGRÉ 1', fullLabel: 'BLÂME SIMPLE', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertCircle },
        { value: 'Blâme 2', label: 'DEGRÉ 2', fullLabel: 'MISE À PIED', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', icon: ShieldAlert },
        { value: 'Blâme 3', label: 'DEGRÉ 3', fullLabel: 'EXCLUSION', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', icon: Gavel },
    ];

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!penaltyData.reason.trim()) {
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
            addNotification(t('absence_registry.penalty_success') || "Sanction appliquée", "success");
            navigate('/admin/absence-registry');
        } catch (err) {
            console.error('Penalty submission failed', err);
            addNotification(t('absence_registry.penalty_error') || "Erreur lors de la sanction", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`fade-up max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ${isRtl ? 'text-right direction-rtl' : ''}`}>
            {/* Header / Nav */}
            <div className={`flex justify-between items-center mb-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <button 
                    onClick={() => navigate('/admin/absence-registry')}
                    className={`flex items-center gap-2 text-slate-500 hover:text-[var(--primary)] transition-colors group ${isRtl ? 'flex-row-reverse' : ''}`}
                >
                    <ChevronLeft className={`w-5 h-5 transition-transform group-hover:-translate-x-1 ${isRtl ? 'rotate-180' : ''}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">{t('common.back') || 'RETOUR AU REGISTRE'}</span>
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest">PROCÉDURE DISCIPLINAIRE</span>
                </div>
            </div>

            {/* Student Info */}
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 mb-8">
                <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                    <div className={isRtl ? 'text-right' : ''}>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tight mb-2">
                            {student.student_name}
                        </h1>
                        <div className={`flex items-center gap-4 text-sm font-bold text-slate-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <span className="bg-slate-100 px-3 py-1 rounded-lg">ID: {student.student_id}</span>
                            <span>•</span>
                            <span className="text-[var(--primary)]">{student.class_id}</span>
                        </div>
                    </div>
                    <div className={`bg-red-50 border border-red-100 px-6 py-4 rounded-2xl flex flex-col ${isRtl ? 'items-end text-right' : 'items-start text-left'}`}>
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">STATUT</span>
                        <span className="text-red-600 font-black text-sm uppercase tracking-wide">
                            {student.status} — ABSENCE NON JUSTIFIÉE
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Col: Context & Stats */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8">
                        <h4 className={`text-xs font-black text-slate-400 uppercase tracking-widest mb-6 ${isRtl ? 'text-right' : ''}`}>
                            CONTEXTE DE L'INCIDENT
                        </h4>
                        <div className="space-y-4">
                            {[
                                { label: 'GROUPE', value: student.class_id },
                                { label: 'MODULE', value: student.subject },
                                { label: 'SESSION', value: student.session_time },
                                { label: 'DATE', value: new Date(student.session_date).toLocaleDateString() }
                            ].map((item, i) => (
                                <div key={i} className={`flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</span>
                                    <span className="text-xs font-black text-slate-700">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8">
                        <h4 className={`text-xs font-black text-slate-400 uppercase tracking-widest mb-6 ${isRtl ? 'text-right' : ''}`}>
                            ANTÉCÉDENTS
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                                <p className="text-3xl font-black text-slate-700 mb-1">{student.total_absences || 0}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">ABSENCES</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                                <p className="text-3xl font-black text-red-500 mb-1">{student.total_blames || 0}</p>
                                <p className="text-[9px] font-bold text-red-400 uppercase">SANCTIONS</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center & Right Col: Selection and Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8">
                        <h4 className={`text-xs font-black text-slate-400 uppercase tracking-widest mb-6 ${isRtl ? 'text-right' : ''}`}>
                            SÉLECTION DE LA SANCTION
                        </h4>
                        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 ${isRtl ? 'dir-rtl' : ''}`}>
                            {penaltyLevels.map((lvl) => (
                                <button
                                    key={lvl.value}
                                    onClick={() => setPenaltyData({ ...penaltyData, penalty: lvl.value })}
                                    className={`relative p-6 rounded-2xl border-2 text-left transition-all overflow-hidden ${
                                        penaltyData.penalty === lvl.value 
                                        ? `${lvl.bg} ${lvl.border} ring-4 ring-opacity-20 ring-${lvl.color.split('-')[1]}-500 scale-[1.02] shadow-md` 
                                        : 'bg-white border-slate-100 hover:border-slate-300'
                                    }`}
                                >
                                    <lvl.icon className={`w-8 h-8 mb-4 ${penaltyData.penalty === lvl.value ? lvl.color : 'text-slate-300'}`} />
                                    <p className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${penaltyData.penalty === lvl.value ? 'text-slate-800' : 'text-slate-400'}`}>
                                        {lvl.label}
                                    </p>
                                    <p className={`text-sm font-black uppercase ${penaltyData.penalty === lvl.value ? lvl.color : 'text-slate-600'}`}>
                                        {lvl.fullLabel}
                                    </p>
                                    {penaltyData.penalty === lvl.value && (
                                        <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'}`}>
                                            <div className="w-3 h-3 rounded-full bg-current currentColor"></div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <h4 className={`text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ${isRtl ? 'text-right' : ''}`}>
                            MOTIF / RAPPORT
                        </h4>
                        <div className="relative mb-6">
                            <textarea
                                required
                                rows="5"
                                value={penaltyData.reason}
                                onChange={e => setPenaltyData({ ...penaltyData, reason: e.target.value.toUpperCase() })}
                                placeholder="DÉTAILLEZ LES MOTIFS ICI..."
                                className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[var(--primary)] focus:bg-white rounded-2xl p-6 text-sm font-bold text-slate-800 outline-none transition-all resize-none uppercase"
                            />
                            <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} opacity-10 pointer-events-none`}>
                                <FileText className="w-8 h-8" />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !penaltyData.reason.trim()}
                            className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                                submitting || !penaltyData.reason.trim()
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-[var(--primary)] text-white hover:shadow-lg hover:-translate-y-1 active:translate-y-0'
                            } ${isRtl ? 'flex-row-reverse' : ''}`}
                        >
                            {submitting ? (
                                <Activity className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>VALIDER LA SANCTION</span>
                                    <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default PenaltyDecision;
