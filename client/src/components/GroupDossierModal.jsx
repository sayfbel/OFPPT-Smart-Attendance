import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, CheckCircle2, AlertTriangle, ArrowRight, PenTool, Hash, Users, Activity, XCircle, ShieldCheck, ClipboardCheck, Clock, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../context/NotificationContext';

const GroupDossierModal = ({ isOpen, onClose, activeSession, students, stats, onConfirm, submitting }) => {
    const { addNotification } = useNotification();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [selectedSeance, setSelectedSeance] = useState('');
    const [isSeanceOpen, setIsSeanceOpen] = useState(false);

    const seanceSlots = [
        '08:30-11:00',
        '11:00-13:30',
        '13:30-16:00',
        '16:00-18:30'
    ];

    useEffect(() => {
        if (isOpen && activeSession?.time) {
            setSelectedSeance(activeSession.time || '');
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
            addNotification(t('modals.dossier.sig_req'), 'error');
            return;
        }
        const signatureData = canvasRef.current.toDataURL();
        onConfirm(signatureData, { selectedSeance });
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`bg-white rounded-[32px] w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col h-[85vh] max-h-[700px] ${isRtl ? 'text-right direction-rtl' : ''}`}>

                {/* Fixed Header Section */}
                <div className={`p-8 pb-5 border-b border-slate-50 flex justify-between items-start bg-white sticky top-0 z-30`}>
                    <div className={isRtl ? 'text-right' : ''}>
                        <div className={`flex items-center gap-2 mb-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <div className="w-1 h-5 bg-[var(--primary)] rounded-full"></div>
                            <h3 className="text-xl font-black italic tracking-tight text-[var(--secondary)] uppercase leading-none">
                                {t('modals.dossier.title')}
                            </h3>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">{t('modals.dossier.subtitle')}</p>
                    </div>

                    <div className={`flex items-center gap-4`}>
                        <div className={`hidden md:flex flex-col ${isRtl ? 'items-start' : 'items-end'}`}>
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-0.5">{t('modals.dossier.unit_label')}</span>
                            <span className="text-[10px] font-black italic text-[var(--primary)] uppercase">
                                {activeSession?.group} — {activeSession?.subject}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-300 hover:text-[var(--secondary)] border border-transparent hover:border-slate-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Fixed Content Section */}
                <div className="flex-1 p-8 pt-6 overflow-hidden">
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 h-full ${isRtl ? 'direction-rtl' : ''}`}>
                        {/* Left: Students List (Flexible & Scrollable) */}
                        <div className={`flex flex-col h-full space-y-4 overflow-hidden ${isRtl ? 'order-1 lg:order-2' : ''}`}>
                            <div className={`flex items-center justify-between flex-shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <h3 className={`text-[10px] font-black tracking-widest text-[var(--secondary)] uppercase flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <Users className="w-3 h-3 text-[var(--primary)]" /> {t('modals.dossier.list_title')}
                                </h3>
                                <div className={`flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-lg border border-green-100 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <Activity className="w-2.5 h-2.5 text-[var(--primary)]" />
                                    <span className="text-[8px] font-bold text-[var(--primary)] tracking-widest uppercase">
                                        {students.length} {t('modals.dossier.enrolled')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-2xl p-4 overflow-y-auto ista-scrollbar space-y-2.5">
                                {students.length > 0 ? students.map((student) => (
                                    <div key={student.id} className={`flex justify-between items-center p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-[var(--primary)]/40 hover:shadow-md transition-all group ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-[10px] font-black text-[var(--secondary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className={`flex flex-col ${isRtl ? 'text-right' : ''}`}>
                                                <span className="text-[11px] font-bold tracking-tight text-[var(--secondary)] uppercase group-hover:text-[var(--primary)] transition-colors">{student.name}</span>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{t('common.matricule')}: {student.id}</span>
                                            </div>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black tracking-widest uppercase border ${student.status === 'PRESENT'
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
                        <div className={`flex flex-col justify-between h-full space-y-6 ${isRtl ? 'order-2 lg:order-1' : ''}`}>
                            <div className="space-y-6 flex-1 flex flex-col">
                                {/* Séance Selection */}
                                <div className={`p-6 bg-slate-50 rounded-[28px] border border-slate-100 flex items-center justify-center ${isRtl ? 'direction-rtl' : ''}`}>
                                    <div className="space-y-3 relative w-full">
                                        <label className={`text-[9px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <Clock className="w-2.5 h-2.5" /> {t('modals.dossier.seance_header')}
                                        </label>
                                        <div 
                                            onClick={() => setIsSeanceOpen(!isSeanceOpen)}
                                            className={`w-full bg-white border border-slate-100 rounded-xl p-4 text-xs font-black text-[var(--primary)] flex justify-between items-center cursor-pointer hover:border-[var(--primary)] transition-all ${isRtl ? 'flex-row-reverse' : ''}`}
                                        >
                                            <span>{selectedSeance || t('modals.dossier.select_seance')}</span>
                                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isSeanceOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                        {isSeanceOpen && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                {seanceSlots.map(t => (
                                                    <div 
                                                        key={t}
                                                        onClick={() => { setSelectedSeance(t); setIsSeanceOpen(false); }}
                                                        className={`px-5 py-3 text-[9px] font-black tracking-widest uppercase cursor-pointer transition-all hover:bg-green-50 hover:text-[var(--primary)] ${selectedSeance === t ? 'text-[var(--primary)] bg-green-50' : 'text-slate-400'} ${isRtl ? 'text-right' : ''}`}
                                                    >
                                                        {t}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Signature Block */}
                                <div className="flex-1 flex flex-col min-h-0">
                                    <h3 className={`text-[10px] font-black tracking-widest text-[var(--secondary)] uppercase flex items-center gap-2 mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <PenTool className="w-3 h-3 text-[var(--primary)]" /> {t('modals.dossier.signature_label')}
                                    </h3>

                                    <div className="relative flex-1 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[28px] overflow-hidden group hover:border-[var(--primary)]/40 transition-all min-h-[150px]">
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
                                                <PenTool className="w-6 h-6 mb-2 text-[var(--secondary)]" />
                                                <p className="text-[8px] font-black tracking-[0.4em] uppercase text-[var(--secondary)]">{t('modals.dossier.sign_here')}</p>
                                            </div>
                                        )}

                                        <button
                                            onClick={clearSignature}
                                            className={`absolute bottom-3 z-20 text-[7px] font-black tracking-widest text-white uppercase px-3 py-2 bg-[var(--secondary)] rounded-lg shadow-lg hover:bg-black transition-all ${isRtl ? 'left-3' : 'right-3'}`}
                                        >
                                            {t('modals.dossier.clear')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section Section */}
                <div className="p-8 border-t border-slate-50 bg-white">
                    <button
                        onClick={handleVerify}
                        disabled={submitting || !hasSignature}
                        className={`w-full py-4 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 shadow-2xl ${!hasSignature
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            : 'btn-ista hover:scale-[1.01] active:scale-[0.99] shadow-green-500/20'
                            } ${isRtl ? 'flex-row-reverse' : ''}`}
                    >
                        {submitting ? (
                            <>
                                <Activity className="w-4 h-4 animate-spin" />
                                {t('modals.dossier.validating')}
                            </>
                        ) : (
                            <>
                                {t('modals.dossier.submit')}
                                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                            </>
                        )}
                    </button>
                    <p className="text-center mt-4 text-[7px] font-black text-slate-300 tracking-[0.5em] uppercase">{t('modals.dossier.system_tag')}</p>
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

export default GroupDossierModal;
