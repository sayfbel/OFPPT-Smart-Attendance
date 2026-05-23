import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, CheckCircle2, AlertTriangle, ArrowRight, PenTool, Hash, Users, Activity, XCircle, ShieldCheck, ClipboardCheck, Clock, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';
import axios from 'axios';

const ClassDossier = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    
    // Fallback if state is missing
    const { activeSession, students: initialStudents, stats: initialStats } = state || {};

    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [selectedSeance, setSelectedSeance] = useState('');
    const [isSeanceOpen, setIsSeanceOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [students, setStudents] = useState(initialStudents || []);

    const seanceSlots = [
        '08:30-11:00',
        '11:00-13:30',
        '13:30-16:00',
        '16:00-18:30'
    ];

    useEffect(() => {
        if (!state) {
            navigate('/formateur');
            return;
        }
        if (activeSession?.time) {
            setSelectedSeance(activeSession.time || '');
        }
    }, [state, activeSession, navigate]);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            ctx.strokeStyle = '#005596';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }, []);

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = (e.clientX || (e.touches && e.touches[0].clientX));
        const clientY = (e.clientY || (e.touches && e.touches[0].clientY));
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        setIsDrawing(true);
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        setHasSignature(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(x, y);
        ctx.stroke();
        if (e.touches) e.preventDefault();
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    const handleSubmitReport = async () => {
        if (!hasSignature) {
            addNotification(t('modals.dossier.sig_req'), 'error');
            return;
        }

        setSubmitting(true);
        try {
            const signatureData = canvasRef.current.toDataURL();
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const reportData = {
                report_code: `REP-${activeSession.group}-${new Date().toISOString().split('T')[0]}-${Date.now().toString().slice(-4)}`,
                group_id: activeSession.group,
                date: new Date().toISOString().split('T')[0],
                subject: activeSession.subject,
                heure: selectedSeance || activeSession.time,
                stagiaires: students.map(s => ({ id: s.id, status: s.status })),
                signature: signatureData
            };

            await axios.post('/api/formateur/submit-report', reportData, config);

            try {
                await axios.post('/api/formateur/clear-checkins', { groupId: activeSession.group }, config);
            } catch (err) { console.error("Clear Checkins Error:", err); }

            addNotification(t('formateur.report_success', { group: activeSession.group }), 'success');
            navigate('/formateur');
        } catch (error) {
            console.error('Submission failed', error);
            addNotification(error.response?.data?.message || t('formateur.report_error'), 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const stats = {
        total: students.length,
        present: students.filter(s => s.status === 'PRESENT').length,
        absent: students.filter(s => s.status === 'ABSENT').length,
        late: students.filter(s => s.status === 'LATE').length
    };

    return (
        <div className={`fade-up ${isRtl ? 'text-right direction-rtl' : ''}`}>
            <div className="flex flex-col min-h-screen">

                {/* Header Section */}
                <div className={`pb-10 border-b border-slate-100 flex justify-between items-start bg-[var(--background)] sticky top-0 z-30`}>
                    <div className={isRtl ? 'text-right' : ''}>
                        <div className={`flex items-center gap-3 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></div>
                            <h3 className="text-3xl font-black italic tracking-tight text-[var(--secondary)] uppercase leading-none">
                                {t('modals.dossier.title')}
                            </h3>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{t('modals.dossier.subtitle')}</p>
                    </div>

                    <div className={`flex items-center gap-6`}>
                        <div className={`hidden md:flex flex-col ${isRtl ? 'items-start' : 'items-end'}`}>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{t('modals.dossier.unit_label')}</span>
                            <span className="text-xs font-black italic text-[var(--primary)] uppercase">
                                {activeSession?.group} — {activeSession?.subject}
                            </span>
                        </div>
                        <button
                            onClick={() => navigate('/formateur')}
                            className="p-3 hover:bg-red-50 rounded-2xl transition-all text-slate-300 hover:text-red-500 border border-transparent hover:border-red-100"
                            title={t('common.close') || 'FERMER'}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto ista-scrollbar py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left: Students List */}
                        <div className={`space-y-8 ${isRtl ? 'order-1 lg:order-2' : ''}`}>
                            <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <h3 className={`text-xs font-black tracking-widest text-[var(--secondary)] uppercase flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <Users className="w-4 h-4 text-[var(--primary)]" /> {t('modals.dossier.list_title')}
                                </h3>
                                <div className={`flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-100 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <Activity className="w-3 h-3 text-[var(--primary)]" />
                                    <span className="text-[9px] font-bold text-[var(--primary)] tracking-widest uppercase">
                                        {students.length} {t('modals.dossier.enrolled')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 bg-slate-50/50 border border-slate-100 rounded-3xl p-6 max-h-[600px] overflow-y-auto ista-scrollbar">
                                {students.length > 0 ? students.map((student) => (
                                    <div key={student.id} className={`flex justify-between items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-[var(--primary)]/40 hover:shadow-md transition-all group ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[12px] font-black text-[var(--secondary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className={`flex flex-col ${isRtl ? 'text-right' : ''}`}>
                                                <span className="text-sm font-bold tracking-tight text-[var(--secondary)] uppercase group-hover:text-[var(--primary)] transition-colors">{student.name}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t('common.matricule')}: {student.id}</span>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase border ${student.status === 'PRESENT'
                                            ? 'bg-green-50 text-[var(--primary)] border-green-100'
                                            : student.status === 'LATE'
                                                ? 'bg-amber-50 text-amber-500 border-amber-100'
                                                : 'bg-red-50 text-red-500 border-red-100'
                                            }`}>
                                            {student.status === 'PRESENT' ? t('dashboard.present') : student.status === 'LATE' ? t('dashboard.late') : t('dashboard.absent')}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-24 text-center">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                                            <Users className="w-6 h-6 text-slate-300" />
                                        </div>
                                        <p className="text-[10px] font-black tracking-widest uppercase text-slate-300">{t('formateur.no_students')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Signature & Time */}
                        <div className={`space-y-10 ${isRtl ? 'order-2 lg:order-1' : ''}`}>
                            <div>
                                <h3 className={`text-xs font-black tracking-widest text-[var(--secondary)] uppercase flex items-center gap-3 mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <PenTool className="w-4 h-4 text-[var(--primary)]" /> {t('modals.dossier.signature_label')}
                                </h3>

                                <div className="relative bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] overflow-hidden h-[350px] group hover:border-[var(--primary)]/40 transition-all shadow-inner">
                                    <canvas
                                        ref={canvasRef}
                                        className="relative z-10 w-full h-full cursor-crosshair touch-none"
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseOut={stopDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchMove={draw}
                                        onTouchEnd={stopDrawing}
                                    />

                                    {!hasSignature && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                                            <PenTool className="w-12 h-12 mb-4 text-[var(--secondary)]" />
                                            <p className="text-[11px] font-black tracking-[0.5em] uppercase text-[var(--secondary)]">{t('modals.dossier.sign_here')}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={clearSignature}
                                        className={`absolute bottom-8 z-20 text-[10px] font-black tracking-widest text-white uppercase px-8 py-4 bg-[var(--secondary)] rounded-2xl shadow-2xl hover:bg-black transition-all ${isRtl ? 'left-8' : 'right-8'}`}
                                    >
                                        {t('modals.dossier.clear')}
                                    </button>
                                </div>
                            </div>

                            <div className={`p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 flex items-center justify-center ${isRtl ? 'direction-rtl' : ''}`}>
                                <div className="space-y-5 relative w-full">
                                    <label className={`text-[11px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <Clock className="w-4 h-4" /> {t('modals.dossier.seance_header')}
                                    </label>
                                    <div 
                                        onClick={() => setIsSeanceOpen(!isSeanceOpen)}
                                        className={`w-full bg-white border border-slate-100 rounded-2xl p-6 text-sm font-black text-[var(--primary)] flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all shadow-sm ${isRtl ? 'flex-row-reverse' : ''}`}
                                    >
                                        <span>{selectedSeance || 'SÉLECTIONNER SÉANCE'}</span>
                                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isSeanceOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    {isSeanceOpen && (
                                        <div className="absolute bottom-full left-0 w-full mb-3 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                                            {seanceSlots.map(slot => (
                                                <div 
                                                    key={slot}
                                                    onClick={() => { setSelectedSeance(slot); setIsSeanceOpen(false); }}
                                                    className={`px-8 py-5 text-[11px] font-black tracking-widest uppercase cursor-pointer transition-all hover:bg-green-50 hover:text-[var(--primary)] ${selectedSeance === slot ? 'text-[var(--primary)] bg-green-50' : 'text-slate-400'} ${isRtl ? 'text-right' : ''}`}
                                                >
                                                    {slot}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="py-10 border-t border-slate-100 bg-[var(--background)]">
                    <button
                        onClick={handleSubmitReport}
                        disabled={submitting || !hasSignature}
                        className={`w-full py-7 rounded-[24px] text-[12px] font-black tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-5 shadow-[0_20px_50px_rgba(34,197,94,0.15)] ${!hasSignature
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            : 'bg-[var(--primary)] text-white hover:bg-green-600 hover:scale-[1.005] active:scale-[0.99] shadow-green-500/20'
                            } ${isRtl ? 'flex-row-reverse' : ''}`}
                    >
                        {submitting ? (
                            <>
                                <Activity className="w-6 h-6 animate-spin" />
                                {t('modals.dossier.validating')}
                            </>
                        ) : (
                            <>
                                {t('modals.dossier.submit')}
                                <ArrowRight className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} />
                            </>
                        )}
                    </button>
                    <p className="text-center mt-8 text-[9px] font-black text-slate-300 tracking-[0.6em] uppercase">SYSTEME DE POINTAGE DIGITAL - OFPPT ISTA</p>
                </div>
            </div>

            <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 6px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
                .ista-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
            `}</style>
            </div>
    );
};

export default ClassDossier;
