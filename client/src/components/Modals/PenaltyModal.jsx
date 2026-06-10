import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Gavel, AlertCircle, FileText, User, Hash, Briefcase, Calendar, Clock, ArrowRight, ShieldAlert, History, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './PenaltyModal.css';

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
        <div className="penalty-modal-overlay">
            <div className={`penalty-modal-content ${isRtl ? 'rtl' : ''}`}>
                
                {/* 1. INTEGRATED IDENTITY HEADER */}
                <div className="penalty-modal-header">
                    <div className={`penalty-modal-header-info ${isRtl ? 'rtl' : ''}`}>
                        <div className="penalty-modal-avatar">
                            {student.student_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="penalty-modal-header-text-container">
                            <div className={`penalty-modal-header-title-flex ${isRtl ? 'rtl' : ''}`}>
                                <h3 className="penalty-modal-title">
                                    {student.student_name}
                                </h3>
                                <div className="penalty-modal-class-badge">
                                    {student.class_id}
                                </div>
                            </div>
                            <p className="penalty-modal-matricule">{t('common.matricule')}: {student.student_id}</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="penalty-modal-close-btn"
                    >
                        <X className="penalty-modal-close-icon" />
                    </button>
                </div>

                <div className="penalty-modal-body">
                    {/* 2. LEFT PANE: CONTEXT & HISTORY */}
                    <div className={`penalty-modal-left-pane ista-scrollbar ${isRtl ? 'rtl' : ''}`}>
                        <div>
                            {/* Incident Summary */}
                            <div>
                                <h4 className={`penalty-modal-section-title ${isRtl ? 'rtl' : ''}`}>
                                    <Activity className="penalty-modal-section-icon primary" /> {t('modals.penalty.incident_details')}
                                </h4>
                                <div className="penalty-modal-detail-list">
                                    {[
                                        { label: 'STATUS', value: student.status, color: 'text-red-500' },
                                        { label: 'MODULE', value: student.subject, color: 'text-[var(--secondary)]' },
                                        { label: 'SESSION', value: `${new Date(student.session_date).toLocaleDateString()} • ${student.session_time}`, color: 'text-slate-400' }
                                    ].map((item, idx) => (
                                        <div key={idx} className={`penalty-modal-detail-item ${isRtl ? 'rtl' : ''}`}>
                                            <span className="penalty-modal-detail-label">{item.label}</span>
                                            <span className={`penalty-modal-detail-value ${item.color}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Attendance Snapshot */}
                            <div className="pt-8">
                                <h4 className={`penalty-modal-section-title ${isRtl ? 'rtl' : ''}`}>
                                    <History className="penalty-modal-section-icon amber" /> {t('modals.penalty.history_title')}
                                </h4>
                                <div className="penalty-modal-stats-grid">
                                    <div className="penalty-modal-stat-card red">
                                        <div className="penalty-modal-stat-value red">{student.total_absences || '0'}</div>
                                        <div className="penalty-modal-stat-label">{t('modals.penalty.total_absences')}</div>
                                    </div>
                                    <div className="penalty-modal-stat-card primary">
                                        <div className="penalty-modal-stat-value primary">{student.total_blames || '0'}</div>
                                        <div className="penalty-modal-stat-label">{t('modals.penalty.sanctions')}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 3. RIGHT PANE: THE DECISION */}
                    <div className="penalty-modal-right-pane ista-scrollbar">
                        <form onSubmit={handleSubmit} className="penalty-modal-form">
                            <div className="penalty-modal-form-content">
                                <div>
                                    <h4 className={`penalty-modal-section-title ${isRtl ? 'rtl' : ''}`}>
                                        <Gavel className="penalty-modal-section-icon red" /> {t('modals.penalty.penalty_config')}
                                    </h4>
                                    <div className="penalty-modal-levels-grid">
                                        {penaltyLevels.map((lvl) => (
                                            <div 
                                                key={lvl.value}
                                                onClick={() => setPenaltyData({ ...penaltyData, penalty: lvl.value })}
                                                className={`penalty-modal-level-btn ${penaltyData.penalty === lvl.value ? 'selected' : ''} ${isRtl ? 'rtl' : ''}`}
                                            >
                                                <div className={`penalty-modal-level-info ${isRtl ? 'rtl' : ''}`}>
                                                    <div className="penalty-modal-level-icon-wrapper">
                                                        <lvl.icon className="penalty-modal-section-icon" />
                                                    </div>
                                                    <span className="penalty-modal-level-label">{lvl.label}</span>
                                                </div>
                                                {penaltyData.penalty === lvl.value && (
                                                    <div className={`penalty-modal-level-indicator ${isRtl ? 'rtl' : ''}`}>
                                                        <span className="penalty-modal-level-indicator-text">SELECTED</span>
                                                        <div className="penalty-modal-level-indicator-dot"></div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="penalty-modal-textarea-container">
                                    <h4 className={`penalty-modal-textarea-label ${isRtl ? 'rtl' : ''}`}>
                                        <FileText className="penalty-modal-section-icon primary"/> {t('modals.identity.reason') || 'OBSERVATIONS & MOTIF'}
                                    </h4>
                                    <textarea
                                        required
                                        rows="4"
                                        value={penaltyData.reason}
                                        onChange={e => setPenaltyData({ ...penaltyData, reason: e.target.value.toUpperCase() })}
                                        placeholder="DÉTAILLEZ LE MOTIF DE CETTE SANCTION..."
                                        className={`penalty-modal-textarea ${isRtl ? 'rtl' : ''}`}
                                    />
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="penalty-modal-footer">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`penalty-modal-submit-btn ${isRtl ? 'rtl' : ''}`}
                                >
                                    {submitting ? (
                                        <>
                                            <Activity className="penalty-modal-submit-icon rotate spin" />
                                            VALIDATION...
                                        </>
                                    ) : (
                                        <>
                                            {t('modals.penalty.activate_penalty')}
                                            <ArrowRight className={`penalty-modal-submit-icon ${isRtl ? 'rotate' : ''}`} />
                                        </>
                                    )}
                                </button>
                                <p className="penalty-modal-footer-tag">OFFPT SMART ATTENDANCE • PROTOCOLE DISCIPLINAIRE</p>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default PenaltyModal;
