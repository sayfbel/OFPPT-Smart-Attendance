import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, CheckCircle2, AlertTriangle, ArrowRight, PenTool, Hash, Users, Activity, XCircle, ShieldCheck, ClipboardCheck, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ClassDossierModal = ({ isOpen, onClose, activeSession, students, stats, onConfirm, submitting }) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        if (isOpen && activeSession?.time) {
            const [start, end] = activeSession.time.split(' - ');
            setStartTime(start || '');
            setEndTime(end || '');
        }
    }, [isOpen, activeSession]);

    useEffect(() => {
        if (isOpen && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            ctx.strokeStyle = '#005596';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }, [isOpen]);

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

    const handleVerify = () => {
        if (!hasSignature) {
            alert(t('modals.dossier.sig_req'));
            return;
        }
        const signatureData = canvasRef.current.toDataURL();
        onConfirm(signatureData, { startTime, endTime });
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`bg-white rounded-[40px] w-full max-w-6xl shadow-2xl relative overflow-hidden flex flex-col h-[90vh] max-h-[850px] ${isRtl ? 'text-right direction-rtl' : ''}`}>

                {/* Fixed Header Section */}
                <div className={`p-12 pb-8 border-b border-slate-50 flex justify-between items-start bg-white sticky top-0 z-30 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div>
                        <div className={`flex items-center gap-3 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></div>
                            <h3 className="text-3xl font-black italic tracking-tight text-[var(--secondary)] uppercase leading-none">
                                {t('modals.dossier.title')}
                            </h3>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{t('modals.dossier.subtitle')}</p>
                    </div>

                    <div className={`flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className={`hidden md:flex flex-col ${isRtl ? 'items-start' : 'items-end'}`}>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{t('modals.dossier.unit_label')}</span>
                            <span className="text-xs font-black italic text-[var(--primary)] uppercase">
                                {activeSession?.class} — {activeSession?.subject}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-300 hover:text-[var(--secondary)] border border-transparent hover:border-slate-100"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content Section */}
                <div className="flex-1 overflow-y-auto ista-scrollbar p-12 pt-8">
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

                            <div className="space-y-3 bg-slate-50/50 border border-slate-100 rounded-3xl p-6 max-h-[500px] overflow-y-auto ista-scrollbar">
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
                                            : 'bg-red-50 text-red-500 border-red-100'
                                            }`}>
                                            {student.status === 'PRESENT' ? t('dashboard.present') : t('dashboard.absent')}
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

                                <div className="relative bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] overflow-hidden h-[300px] group hover:border-[var(--primary)]/40 transition-all">
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
                                            <PenTool className="w-10 h-10 mb-4 text-[var(--secondary)]" />
                                            <p className="text-[10px] font-black tracking-[0.4em] uppercase text-[var(--secondary)]">{t('modals.dossier.sign_here')}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={clearSignature}
                                        className={`absolute bottom-6 z-20 text-[9px] font-black tracking-widest text-white uppercase px-6 py-3 bg-[var(--secondary)] rounded-xl shadow-lg hover:bg-black transition-all ${isRtl ? 'left-6' : 'right-6'}`}
                                    >
                                        {t('modals.dossier.clear')}
                                    </button>
                                </div>
                            </div>

                            <div className={`p-8 bg-slate-50 rounded-[32px] border border-slate-100 grid grid-cols-2 gap-8 ${isRtl ? 'direction-rtl' : ''}`}>
                                <div className="space-y-4">
                                    <label className={`text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <Clock className="w-3 h-3" /> {t('modals.dossier.start_time')}
                                    </label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className={`w-full bg-white border border-slate-100 rounded-2xl p-5 text-sm font-black text-[var(--primary)] focus:ring-4 focus:ring-green-500/5 focus:border-[var(--primary)] outline-none transition-all ${isRtl ? 'text-right' : ''}`}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className={`text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <Clock className="w-3 h-3" /> {t('modals.dossier.end_time')}
                                    </label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className={`w-full bg-white border border-slate-100 rounded-2xl p-5 text-sm font-black text-[var(--primary)] focus:ring-4 focus:ring-green-500/5 focus:border-[var(--primary)] outline-none transition-all ${isRtl ? 'text-right' : ''}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section Section */}
                <div className="p-12 border-t border-slate-50 bg-white">
                    <button
                        onClick={handleVerify}
                        disabled={submitting || !hasSignature}
                        className={`w-full py-6 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-4 shadow-2xl ${!hasSignature
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            : 'btn-ista hover:scale-[1.01] active:scale-[0.99] shadow-green-500/20'
                            } ${isRtl ? 'flex-row-reverse' : ''}`}
                    >
                        {submitting ? (
                            <>
                                <Activity className="w-5 h-5 animate-spin" />
                                {t('modals.dossier.validating')}
                            </>
                        ) : (
                            <>
                                {t('modals.dossier.submit')}
                                <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                            </>
                        )}
                    </button>
                    <p className="text-center mt-6 text-[8px] font-black text-slate-300 tracking-[0.5em] uppercase">SYSTEME DE POINTAGE DIGITAL - OFPPT ISTA</p>
                </div>
            </div>

            <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 4px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .ista-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--primary); }
            `}</style>
        </div>,
        document.body
    );
};

export default ClassDossierModal;
