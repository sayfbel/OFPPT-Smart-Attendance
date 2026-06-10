import React from 'react';
import ReactDOM from 'react-dom';
import { X, ChevronDown, FileText, Calendar, User, MapPin, Clock, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSignatureDataURI } from '../../utils/signatureHelper';
import './RapportModal.css';

const RapportModal = ({ isOpen, onClose, rapport, onExportPDF, onExportExcel, isExporting }) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    if (!isOpen || !rapport) return null;

    return ReactDOM.createPortal(
        <div className="rapport-modal-overlay">
            <div className={`rapport-modal-content ${isRtl ? 'rtl' : ''}`}>
                <button
                    type="button"
                    onClick={onClose}
                    className={`rapport-modal-close-btn ${isRtl ? 'rtl' : ''}`}
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Side (Branding & Status) */}
                <div className="rapport-modal-info-panel ista-scrollbar">
                    <div className="rapport-modal-info-top">
                        <div className="rapport-modal-icon-wrapper">
                            <FileText className="rapport-modal-icon" />
                        </div>
                        <h2 className={`rapport-modal-title ${isRtl ? 'rtl' : ''}`}>
                            {t('modals.report.title')} <br /> <span className="rapport-modal-highlight">{t('modals.report.subtitle')}</span>
                        </h2>
                        <p className={`rapport-modal-subtitle ${isRtl ? 'rtl' : ''}`}>{t('modals.report.official')}</p>
                    </div>

                    <div className="rapport-modal-status-box">
                        <div className={`rapport-modal-status-item ${isRtl ? 'rtl' : ''}`}>
                            <p className="rapport-modal-status-label">{t('modals.report.doc_code')}</p>
                            <p className="rapport-modal-status-value">{rapport.id}</p>
                        </div>
                        <div className={`rapport-modal-status-item ${isRtl ? 'rtl' : ''}`}>
                            <p className="rapport-modal-status-label">{t('modals.report.status_label')}</p>
                            <div className={`rapport-modal-status-indicator ${isRtl ? 'rtl' : ''}`}>
                                <div className={`rapport-modal-dot ${rapport.status === 'VALIDATED' ? 'validated' : 'waiting'}`}></div>
                                <p className="rapport-modal-status-text">
                                    {rapport.status === 'VALIDATED' ? t('modals.report.status_validated') : t('modals.report.status_waiting')}
                                </p>
                            </div>
                        </div>
                        <div className={`rapport-modal-status-item ${isRtl ? 'rtl' : ''}`}>
                            <p className="rapport-modal-status-label">{t('modals.report.group_label')}</p>
                            <p className="rapport-modal-group-value">{rapport.group_id}</p>
                        </div>
                    </div>

                    <div className="rapport-modal-actions">
                        <div className="rapport-modal-actions-wrapper">
                            <p className={`rapport-modal-actions-label ${isRtl ? 'rtl' : ''}`}>{t('reports.export_button') || 'EXPORTER'}</p>
                            <button
                                onClick={onExportPDF}
                                disabled={isExporting}
                                className={`rapport-modal-export-btn ${isRtl ? 'rtl' : ''}`}
                            >
                                <span className="rapport-modal-export-text">FORMAT PDF</span>
                                <FileText className={`rapport-modal-export-icon ${isExporting ? 'bounce' : ''}`} />
                            </button>
                            <button
                                onClick={onExportExcel}
                                disabled={isExporting}
                                className={`rapport-modal-export-btn ${isRtl ? 'rtl' : ''}`}
                            >
                                <span className="rapport-modal-export-text">FORMAT EXCEL</span>
                                <FileText className={`rapport-modal-export-icon ${isExporting ? 'bounce' : ''}`} />
                            </button>
                        </div>
                        <p className={`rapport-modal-system-tag ${isRtl ? 'rtl' : ''}`}>ISTA_OFPPT_D.A.D_ARCHIVE_v3</p>
                    </div>
                </div>

                {/* Right Side (Content) */}
                <div className="rapport-modal-content-area">
                    {/* Fixed Header Section */}
                    <div className="rapport-modal-header">
                        <div>
                            <h3 className={`rapport-modal-header-title ${isRtl ? 'rtl' : ''}`}>{t('modals.report.details_title')}</h3>
                            <p className={`rapport-modal-header-subtitle ${isRtl ? 'rtl' : ''}`}>{t('modals.report.details_sub')}</p>
                        </div>
                    </div>

                    {/* Scrollable Content Section */}
                    <div className="rapport-modal-body ista-scrollbar">
                        {/* Header Info Grid */}
                        <div className="rapport-modal-grid">
                            <div className={`rapport-modal-info-block primary ${isRtl ? 'rtl' : ''}`}>
                                <p className="rapport-modal-info-label">{t('modals.report.module_label')}</p>
                                <p className="rapport-modal-info-value">{rapport.subject}</p>
                            </div>
                            <div className={`rapport-modal-info-block ${isRtl ? 'rtl' : ''}`}>
                                <p className="rapport-modal-info-label">{t('modals.report.formateur_label')}</p>
                                <p className="rapport-modal-info-value">{rapport.formateur}</p>
                            </div>
                            <div className={`rapport-modal-info-block ${isRtl ? 'rtl' : ''}`}>
                                <p className="rapport-modal-info-label">{t('modals.report.date_label')}</p>
                                <div className={`rapport-modal-info-flex ${isRtl ? 'rtl' : ''}`}>
                                    <Calendar className="rapport-modal-info-icon" />
                                    <p className="rapport-modal-info-text">{rapport.date}</p>
                                </div>
                            </div>
                            <div className={`rapport-modal-info-block ${isRtl ? 'rtl' : ''}`}>
                                <p className="rapport-modal-info-label">{t('modals.report.schedule_label')}</p>
                                <div className={`rapport-modal-schedule-flex ${isRtl ? 'rtl' : ''}`}>
                                    <div className={`rapport-modal-info-flex ${isRtl ? 'rtl' : ''}`}>
                                        <Clock className="rapport-modal-info-icon" />
                                        <p className="rapport-modal-info-text">{rapport.heure || 'N/A'}</p>
                                    </div>
                                    <div className={`rapport-modal-info-flex ${isRtl ? 'rtl' : ''}`}>
                                        <MapPin className="rapport-modal-info-icon" />
                                        <p className="rapport-modal-info-text">{rapport.salle || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Student List */}
                        <div className="rapport-modal-list-section">
                            <div className={`rapport-modal-list-header ${isRtl ? 'rtl' : ''}`}>
                                <label className={`rapport-modal-list-label ${isRtl ? 'rtl' : ''}`}>
                                    <Search className="rapport-modal-list-icon" />
                                    {t('modals.report.list_label')}
                                </label>
                                <span className="rapport-modal-list-count">
                                    {t('modals.report.present_count', { present: (rapport.total_group_students || (rapport.stagiaires || []).length) - (rapport.stagiaires || []).length, total: rapport.total_group_students || (rapport.stagiaires || []).length })}
                                </span>
                            </div>
                            <div className="rapport-modal-table-container">
                                <table className="rapport-modal-table">
                                    <thead>
                                        <tr>
                                            <th className={isRtl ? 'rtl' : ''}>{t('accounts.student_name')}</th>
                                            <th className={isRtl ? 'rtl' : ''}>{t('common.matricule')}</th>
                                            <th className={isRtl ? '' : 'rtl'}>Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(rapport.stagiaires || []).map((stagiaire, idx) => (
                                            <tr key={idx}>
                                                <td className={isRtl ? 'rtl' : ''}>
                                                    <span className="rapport-modal-table-name">{stagiaire.name}</span>
                                                </td>
                                                <td className={isRtl ? 'rtl' : ''}>
                                                    <span className="rapport-modal-table-id">{stagiaire.id}</span>
                                                </td>
                                                <td className={isRtl ? '' : 'rtl'}>
                                                    <span className={`rapport-modal-status-badge ${stagiaire.status === 'ABSENT' ? 'absent' : 'present'}`}>
                                                        {stagiaire.status === 'PRESENT' ? t('dashboard.present') : t('dashboard.absent')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Signature */}
                        <div className={`rapport-modal-signature-section ${isRtl ? 'rtl' : ''}`}>
                            <div className="rapport-modal-signature-container">
                                <label className="rapport-modal-signature-label">{t('modals.report.signature_label')}</label>
                                <div className="rapport-modal-signature-box">
                                    <div className="rapport-modal-signature-bg"></div>
                                    {rapport.signature ? (
                                        <img src={getSignatureDataURI(rapport.signature)} alt="Signature" className="rapport-modal-signature-img" />
                                    ) : (
                                        <span className="rapport-modal-signature-text">
                                            {rapport.formateur}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RapportModal;
