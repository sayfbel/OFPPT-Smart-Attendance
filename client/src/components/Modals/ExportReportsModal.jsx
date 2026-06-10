import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, FileText, Calendar, User, Download, Filter, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CustomDatePicker } from '../Forms';
import './ExportReportsModal.css';

const ExportReportsModal = ({ isOpen, onClose, onExport, allReports, availableGroups }) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [exportType, setExportType] = useState('ALL'); // ALL, WEEKLY, FORMATEUR, CUSTOM
    const [selectedFormateur, setSelectedFormateur] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('ALL');

    const [isFormateurDropdownOpen, setIsFormateurDropdownOpen] = useState(false);
    const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsFormateurDropdownOpen(false);
                setIsGroupDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const availableFormateurs = [...new Set(allReports.map(r => r.formateur))].filter(Boolean).sort();

    const handleExportClick = () => {
        let filteredReports = [...allReports];

        // 1. Filter by Type
        if (exportType === 'WEEKLY') {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            filteredReports = filteredReports.filter(r => r.date && new Date(r.date) >= lastWeek);
        } else if (exportType === 'CUSTOM') {
            if (startDate) {
                filteredReports = filteredReports.filter(r => r.date >= startDate);
            }
            if (endDate) {
                filteredReports = filteredReports.filter(r => r.date <= endDate);
            }
        }

        // 2. Filter by Formateur
        if (exportType === 'FORMATEUR' && selectedFormateur !== 'ALL') {
            filteredReports = filteredReports.filter(r => r.formateur === selectedFormateur);
        }

        // 3. Filter by Group
        if (selectedGroup !== 'ALL') {
            filteredReports = filteredReports.filter(r => r.group_id === selectedGroup);
        }

        onExport(filteredReports, {
            type: exportType,
            formateur: selectedFormateur,
            startDate,
            endDate,
            group: selectedGroup
        });
    };

    return ReactDOM.createPortal(
        <div className="export-reports-modal-overlay">
            <div className={`export-reports-modal-content ${isRtl ? 'rtl' : ''}`}>
                <button
                    type="button"
                    onClick={onClose}
                    className={`export-reports-modal-close-btn ${isRtl ? 'rtl' : ''}`}
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Side: Illustration & Title */}
                <div className="export-reports-modal-info-panel">
                    <div>
                        <div className="export-reports-modal-icon-wrapper">
                            <Download className="export-reports-modal-icon" />
                        </div>
                        <h2 className={`export-reports-modal-title ${isRtl ? 'rtl' : ''}`}>
                            {t('reports.export_title')} <br /> <span className="export-reports-modal-highlight">{t('reports.export_presence')}</span>
                        </h2>
                        <p className={`export-reports-modal-subtitle ${isRtl ? 'rtl' : ''}`}>
                            {t('reports.export_subtitle_modal')}
                        </p>
                    </div>

                    <div className="export-reports-modal-steps-box">
                        <div className={`export-reports-modal-step ${isRtl ? 'rtl' : ''}`}>
                            <CheckCircle2 className="export-reports-modal-step-icon" />
                            <span className="export-reports-modal-step-text">{t('reports.export_step1')}</span>
                        </div>
                        <div className={`export-reports-modal-step ${isRtl ? 'rtl' : ''}`}>
                            <CheckCircle2 className="export-reports-modal-step-icon" />
                            <span className="export-reports-modal-step-text">{t('reports.export_step2')}</span>
                        </div>
                        <div className={`export-reports-modal-step ${isRtl ? 'rtl' : ''}`}>
                            <div className="export-reports-modal-step-circle"></div>
                            <span className="export-reports-modal-step-text">{t('reports.export_step3')}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Configuration */}
                <div ref={dropdownRef} className="export-reports-modal-config-area ista-scrollbar">
                    <div className={`export-reports-modal-header-section ${isRtl ? 'rtl' : ''}`}>
                        <h3 className="export-reports-modal-section-title">{t('reports.export_config_title')}</h3>
                        <div className={`export-reports-modal-section-divider ${isRtl ? 'rtl' : ''}`}></div>
                    </div>

                    <div className="export-reports-modal-config-container">
                        {/* Type Selection */}
                        <div className="export-reports-modal-field">
                            <label className={`export-reports-modal-label ${isRtl ? 'rtl' : ''}`}>
                                <Filter className="export-reports-modal-label-icon" />
                                {t('reports.export_select_type')}
                            </label>
                            <div className="export-reports-modal-type-grid">
                                {[
                                    { id: 'ALL', icon: FileText, label: t('reports.all_data') },
                                    { id: 'WEEKLY', icon: Clock, label: t('reports.weekly') },
                                    { id: 'FORMATEUR', icon: User, label: t('reports.by_formateur') },
                                    { id: 'CUSTOM', icon: Calendar, label: t('reports.custom_range') }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setExportType(type.id)}
                                        className={`export-reports-modal-type-btn ${exportType === type.id ? 'active' : ''} ${isRtl ? 'rtl' : ''}`}
                                    >
                                        <type.icon className="export-reports-modal-type-icon" />
                                        <span className="export-reports-modal-type-text">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Conditional Filters */}
                        <div className="export-reports-modal-dynamic-filters">
                            {exportType === 'FORMATEUR' && (
                                <div className="export-reports-modal-field">
                                    <label className={`export-reports-modal-label ${isRtl ? 'rtl' : ''}`}>{t('reports.select_formateur')}</label>
                                    <button
                                        onClick={() => setIsFormateurDropdownOpen(!isFormateurDropdownOpen)}
                                        className={`export-reports-modal-dropdown-toggle ${isRtl ? 'rtl' : ''}`}
                                    >
                                        <span className="export-reports-modal-dropdown-text">
                                            {selectedFormateur === 'ALL' ? t('reports.all_formateurs') : selectedFormateur}
                                        </span>
                                        <ChevronRight className={`export-reports-modal-chevron ${isFormateurDropdownOpen ? 'open' : ''} ${isRtl ? 'rtl' : ''}`} />
                                    </button>

                                    {isFormateurDropdownOpen && (
                                        <div className="export-reports-modal-dropdown-menu ista-scrollbar">
                                            <div
                                                className={`export-reports-modal-dropdown-item ${selectedFormateur === 'ALL' ? 'selected' : 'unselected'} ${isRtl ? 'rtl' : ''}`}
                                                onClick={() => { setSelectedFormateur('ALL'); setIsFormateurDropdownOpen(false); }}
                                            >
                                                {t('reports.all_formateurs')}
                                            </div>
                                            {availableFormateurs.map(f => (
                                                <div
                                                    key={f}
                                                    className={`export-reports-modal-dropdown-item ${selectedFormateur === f ? 'selected' : 'unselected'} ${isRtl ? 'rtl' : ''}`}
                                                    onClick={() => { setSelectedFormateur(f); setIsFormateurDropdownOpen(false); }}
                                                >
                                                    {f}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {exportType === 'CUSTOM' && (
                                <div className="export-reports-modal-date-grid">
                                    <div className="export-reports-modal-date-field">
                                        <label className={`export-reports-modal-label ${isRtl ? 'rtl' : ''}`}>{t('reports.start_date')}</label>
                                        <CustomDatePicker selectedDate={startDate} onChange={setStartDate} />
                                    </div>
                                    <div className="export-reports-modal-date-field">
                                        <label className={`export-reports-modal-label ${isRtl ? 'rtl' : ''}`}>{t('reports.end_date')}</label>
                                        <CustomDatePicker selectedDate={endDate} onChange={setEndDate} />
                                    </div>
                                </div>
                            )}

                            <div className="export-reports-modal-field">
                                <label className={`export-reports-modal-label ${isRtl ? 'rtl' : ''}`}>{t('reports.group_filter')}</label>
                                <button
                                    onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                                    className={`export-reports-modal-dropdown-toggle ${isRtl ? 'rtl' : ''}`}
                                >
                                    <span className="export-reports-modal-dropdown-text">
                                        {selectedGroup === 'ALL' ? t('reports.all_groups') : selectedGroup}
                                    </span>
                                    <ChevronRight className={`export-reports-modal-chevron ${isGroupDropdownOpen ? 'open' : ''} ${isRtl ? 'rtl' : ''}`} />
                                </button>

                                {isGroupDropdownOpen && (
                                    <div className="export-reports-modal-dropdown-menu ista-scrollbar">
                                        <div
                                            className={`export-reports-modal-dropdown-item ${selectedGroup === 'ALL' ? 'selected' : 'unselected'} ${isRtl ? 'rtl' : ''}`}
                                            onClick={() => { setSelectedGroup('ALL'); setIsGroupDropdownOpen(false); }}
                                        >
                                            {t('reports.all_groups')}
                                        </div>
                                        {availableGroups.map(grp => (
                                            <div
                                                key={grp.id}
                                                className={`export-reports-modal-dropdown-item ${selectedGroup === grp.id ? 'selected' : 'unselected'} ${isRtl ? 'rtl' : ''}`}
                                                onClick={() => { setSelectedGroup(grp.id); setIsGroupDropdownOpen(false); }}
                                            >
                                                {grp.id}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="export-reports-modal-submit-container">
                            <button
                                onClick={handleExportClick}
                                className={`btn-ista export-reports-modal-submit-btn ${isRtl ? 'rtl' : ''}`}
                            >
                                <span className="export-reports-modal-submit-text">{t('reports.generate_pdf', 'Générer le Rapport PDF')}</span>
                                <ChevronRight className={`export-reports-modal-submit-arrow ${isRtl ? 'rtl' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ExportReportsModal;
