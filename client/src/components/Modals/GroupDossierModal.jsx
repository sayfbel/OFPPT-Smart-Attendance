import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, CheckCircle2, AlertTriangle, ArrowRight, PenTool, Hash, Users, Activity, XCircle, ShieldCheck, ClipboardCheck, Clock, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../hooks/useNotification';
import './ClassDossierModal.css'; // Reusing ClassDossierModal styles
import '../../styles/admin-shared.css';

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
        <div className="dossier-modal-overlay">
            <div className={`dossier-modal-content ${isRtl ? 'rtl' : ''}`}>

                <div className="dossier-modal-header">
                    <div>
                        <div className={`dossier-modal-title-wrapper ${isRtl ? 'rtl' : ''}`}>
                            <div className="dossier-modal-title-indicator"></div>
                            <h3 className="dossier-modal-title">
                                {t('modals.dossier.title')}
                            </h3>
                        </div>
                        <p className={`dossier-modal-subtitle ${isRtl ? 'rtl' : ''}`}>{t('modals.dossier.subtitle')}</p>
                    </div>

                    <div className="dossier-modal-header-actions">
                        <div className={`dossier-modal-info ${isRtl ? 'rtl' : 'ltr'}`}>
                            <span className="dossier-modal-unit-label">{t('modals.dossier.unit_label')}</span>
                            <span className="dossier-modal-unit-value">
                                {activeSession?.group} — {activeSession?.subject}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="dossier-modal-close-btn"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="dossier-modal-body ista-scrollbar">
                    <div className="dossier-modal-grid">
                        <div className={`dossier-modal-section ${isRtl ? 'rtl-right' : 'ltr-left'}`}>
                            <div className={`dossier-modal-section-header ${isRtl ? 'rtl' : ''}`}>
                                <h3 className={`dossier-modal-section-title ${isRtl ? 'rtl' : ''}`}>
                                    <Users className="dossier-modal-section-icon" /> {t('modals.dossier.list_title')}
                                </h3>
                                <div className={`dossier-modal-count-badge ${isRtl ? 'rtl' : ''}`}>
                                    <Activity className="dossier-modal-count-icon" />
                                    <span className="dossier-modal-count-text">
                                        {students.length} {t('modals.dossier.enrolled')}
                                    </span>
                                </div>
                            </div>

                            <div className="dossier-modal-students-list ista-scrollbar">
                                {students.length > 0 ? students.map((student) => (
                                    <div key={student.id} className={`dossier-modal-student-card ${isRtl ? 'rtl' : ''}`}>
                                        <div className={`dossier-modal-student-info ${isRtl ? 'rtl' : ''}`}>
                                            <div className="dossier-modal-student-avatar">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className={`dossier-modal-student-details ${isRtl ? 'rtl' : ''}`}>
                                                <span className="dossier-modal-student-name">{student.name}</span>
                                                <span className="dossier-modal-student-id">{t('common.matricule')}: {student.id}</span>
                                            </div>
                                        </div>
                                        <div className={`dossier-modal-status-badge ${student.status === 'PRESENT'
                                            ? 'present'
                                            : student.status === 'LATE'
                                                ? 'late'
                                                : 'absent'
                                            }`}>
                                            {student.status === 'PRESENT' ? t('dashboard.present') : student.status === 'LATE' ? t('dashboard.late') : t('dashboard.absent')}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="dossier-modal-empty">
                                        <div className="dossier-modal-empty-icon-wrapper">
                                            <Users className="dossier-modal-empty-icon" />
                                        </div>
                                        <p className="dossier-modal-empty-text">{t('formateur.no_students')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`dossier-modal-section ${isRtl ? 'rtl-left' : 'ltr-right'}`}>
                            <div>
                                <h3 className={`dossier-modal-section-title mb-6 ${isRtl ? 'rtl' : ''}`}>
                                    <PenTool className="dossier-modal-section-icon" /> {t('modals.dossier.signature_label')}
                                </h3>

                                <div className="dossier-modal-signature-wrapper">
                                    <canvas
                                        ref={canvasRef}
                                        className="dossier-modal-canvas"
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseOut={stopDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchMove={draw}
                                        onTouchEnd={stopDrawing}
                                    />

                                    {!hasSignature && (
                                        <div className="dossier-modal-signature-placeholder">
                                            <PenTool className="dossier-modal-signature-icon" />
                                            <p className="dossier-modal-signature-text">{t('modals.dossier.sign_here')}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={clearSignature}
                                        className={`dossier-modal-clear-btn ${isRtl ? 'rtl' : 'ltr'}`}
                                    >
                                        {t('modals.dossier.clear')}
                                    </button>
                                </div>
                            </div>

                            <div className={`dossier-modal-seance-wrapper ${isRtl ? 'rtl' : ''}`}>
                                <div className="dossier-modal-seance-content">
                                    <label className={`dossier-modal-seance-label ${isRtl ? 'rtl' : ''}`}>
                                        <Clock className="dossier-modal-seance-icon" /> {t('modals.dossier.seance_header')}
                                    </label>
                                    <div 
                                        onClick={() => setIsSeanceOpen(!isSeanceOpen)}
                                        className={`dossier-modal-seance-dropdown-btn ${isRtl ? 'rtl' : ''}`}
                                    >
                                        <span>{selectedSeance || t('modals.dossier.select_seance')}</span>
                                        <ChevronDown className={`dossier-modal-chevron ${isSeanceOpen ? 'open' : ''}`} />
                                    </div>
                                    {isSeanceOpen && (
                                        <div className="dossier-modal-seance-dropdown-menu">
                                            {seanceSlots.map(t => (
                                                <div 
                                                    key={t}
                                                    onClick={() => { setSelectedSeance(t); setIsSeanceOpen(false); }}
                                                    className={`dossier-modal-seance-option ${selectedSeance === t ? 'selected' : 'unselected'} ${isRtl ? 'rtl' : ''}`}
                                                >
                                                    {t}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dossier-modal-footer">
                    <button
                        onClick={handleVerify}
                        disabled={submitting || !hasSignature}
                        className={`dossier-modal-submit-btn ${!hasSignature ? 'disabled' : 'active'} ${isRtl ? 'rtl' : ''}`}
                    >
                        {submitting ? (
                            <>
                                <Activity className="dossier-modal-submit-icon spin" />
                                {t('modals.dossier.validating')}
                            </>
                        ) : (
                            <>
                                {t('modals.dossier.submit')}
                                <ArrowRight className={`dossier-modal-submit-icon ${isRtl ? 'rtl' : ''}`} />
                            </>
                        )}
                    </button>
                    <p className="dossier-modal-footer-text">{t('modals.dossier.system_tag')}</p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default GroupDossierModal;
