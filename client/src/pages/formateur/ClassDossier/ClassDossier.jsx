import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, ArrowRight, PenTool, Users, Activity, Clock, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../../hooks/useNotification';
import reportService from '../../../services/reportService';
import attendanceService from '../../../services/attendanceService';
import './ClassDossier.css';

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
            const reportData = {
                report_code: `REP-${activeSession.group}-${new Date().toISOString().split('T')[0]}-${Date.now().toString().slice(-4)}`,
                group_id: activeSession.group,
                date: new Date().toISOString().split('T')[0],
                subject: activeSession.subject,
                heure: selectedSeance || activeSession.time,
                stagiaires: students.map(s => ({ id: s.id, status: s.status })),
                signature: signatureData
            };
            
            await reportService.submitReport(reportData);

            try {
                await attendanceService.clearCheckins(activeSession.group);
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
        <div className={`cd-wrapper ${isRtl ? 'rtl' : ''}`}>
            <div className="cd-container">

                {/* Header Section */}
                <div className={`cd-header ${isRtl ? 'rtl' : ''}`}>
                    <div className={`cd-header-titles ${isRtl ? 'rtl' : ''}`}>
                        <div className={`cd-header-title-row ${isRtl ? 'rtl' : ''}`}>
                            <div className="cd-title-indicator"></div>
                            <h3 className="cd-title">
                                {t('modals.dossier.title')}
                            </h3>
                        </div>
                        <p className="cd-subtitle">{t('modals.dossier.subtitle')}</p>
                    </div>

                    <div className="cd-header-controls">
                        <div className={`cd-unit-info ${isRtl ? 'rtl' : ''}`}>
                            <span className="cd-unit-label">{t('modals.dossier.unit_label')}</span>
                            <span className="cd-unit-value">
                                {activeSession?.group} — {activeSession?.subject}
                            </span>
                        </div>
                        <button
                            onClick={() => navigate('/formateur')}
                            className="cd-close-btn"
                            title={t('common.close') || 'FERMER'}
                        >
                            <X className="cd-close-icon" />
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="cd-content-scroll ista-scrollbar">
                    <div className={`cd-content-grid ${isRtl ? 'rtl' : ''}`}>
                        {/* Left: Students List */}
                        <div className="cd-students-section">
                            <div className={`cd-section-header ${isRtl ? 'rtl' : ''}`}>
                                <h3 className={`cd-section-title ${isRtl ? 'rtl' : ''}`}>
                                    <Users className="cd-section-icon" /> {t('modals.dossier.list_title')}
                                </h3>
                                <div className={`cd-enrollment-badge ${isRtl ? 'rtl' : ''}`}>
                                    <Activity className="cd-enrollment-icon" />
                                    <span className="cd-enrollment-text">
                                        {students.length} {t('modals.dossier.enrolled')}
                                    </span>
                                </div>
                            </div>

                            <div className="cd-students-list ista-scrollbar">
                                {students.length > 0 ? students.map((student) => (
                                    <div key={student.id} className={`cd-student-card group ${isRtl ? 'rtl' : ''}`}>
                                        <div className={`cd-student-info ${isRtl ? 'rtl' : ''}`}>
                                            <div className="cd-student-avatar">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className={`cd-student-details ${isRtl ? 'rtl' : ''}`}>
                                                <span className="cd-student-name">{student.name}</span>
                                                <span className="cd-student-id">{t('common.matricule')}: {student.id}</span>
                                            </div>
                                        </div>
                                        <div className={`cd-student-status ${
                                            student.status === 'PRESENT' ? 'present' : 
                                            student.status === 'LATE' ? 'late' : 'absent'
                                        }`}>
                                            {student.status === 'PRESENT' ? t('dashboard.present') : student.status === 'LATE' ? t('dashboard.late') : t('dashboard.absent')}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="cd-students-empty">
                                        <div className="cd-empty-icon-wrapper">
                                            <Users className="cd-empty-icon" />
                                        </div>
                                        <p className="cd-empty-text">{t('formateur.no_students')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Signature & Time */}
                        <div className="cd-signature-section">
                            <div>
                                <h3 className={`cd-section-title mb-6 ${isRtl ? 'rtl' : ''}`}>
                                    <PenTool className="cd-section-icon" /> {t('modals.dossier.signature_label')}
                                </h3>

                                <div className="cd-canvas-container group">
                                    <canvas
                                        ref={canvasRef}
                                        className="cd-canvas"
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseOut={stopDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchMove={draw}
                                        onTouchEnd={stopDrawing}
                                    />

                                    {!hasSignature && (
                                        <div className="cd-canvas-placeholder">
                                            <PenTool className="cd-canvas-placeholder-icon" />
                                            <p className="cd-canvas-placeholder-text">{t('modals.dossier.sign_here')}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={clearSignature}
                                        className={`cd-canvas-clear-btn ${isRtl ? 'rtl' : ''}`}
                                    >
                                        {t('modals.dossier.clear')}
                                    </button>
                                </div>
                            </div>

                            <div className={`cd-seance-wrapper ${isRtl ? 'rtl' : ''}`}>
                                <div className="cd-seance-inner">
                                    <label className={`cd-seance-label ${isRtl ? 'rtl' : ''}`}>
                                        <Clock className="cd-seance-label-icon" /> {t('modals.dossier.seance_header')}
                                    </label>
                                    <div 
                                        onClick={() => setIsSeanceOpen(!isSeanceOpen)}
                                        className={`cd-seance-selector ${isRtl ? 'rtl' : ''}`}
                                    >
                                        <span>{selectedSeance || 'SÉLECTIONNER SÉANCE'}</span>
                                        <ChevronDown className={`cd-seance-chevron ${isSeanceOpen ? 'open' : ''}`} />
                                    </div>
                                    {isSeanceOpen && (
                                        <div className="cd-seance-dropdown">
                                            {seanceSlots.map(slot => (
                                                <div 
                                                    key={slot}
                                                    onClick={() => { setSelectedSeance(slot); setIsSeanceOpen(false); }}
                                                    className={`cd-seance-option ${selectedSeance === slot ? 'selected' : ''} ${isRtl ? 'rtl' : ''}`}
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
                <div className="cd-footer">
                    <button
                        onClick={handleSubmitReport}
                        disabled={submitting || !hasSignature}
                        className={`cd-submit-btn ${!hasSignature ? 'disabled' : 'active'} ${isRtl ? 'rtl' : ''}`}
                    >
                        {submitting ? (
                            <>
                                <Activity className="cd-submit-spinner" />
                                {t('modals.dossier.validating')}
                            </>
                        ) : (
                            <>
                                {t('modals.dossier.submit')}
                                <ArrowRight className={`cd-submit-arrow ${isRtl ? 'rtl' : ''}`} />
                            </>
                        )}
                    </button>
                    <p className="cd-footer-branding">SYSTEME DE POINTAGE DIGITAL - OFPPT ISTA</p>
                </div>
            </div>
        </div>
    );
};

export default ClassDossier;
