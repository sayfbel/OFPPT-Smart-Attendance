import React, { useState, useEffect } from 'react';
import { Search, FileText, Download, AlertTriangle, ChevronDown, CheckSquare, Square } from 'lucide-react';
import { CustomDatePicker } from '../../../components/Forms';
import { RapportModal } from '../../../components/Modals';
import { useTranslation } from 'react-i18next';
import { getSignatureDataURI } from '../../../utils/signatureHelper';
import { exportElementToPDF } from '../../../utils/pdfUtils';
import { exportDataToExcel, loadXLSX } from '../../../utils/excelUtils';
import { formatDate } from '../../../utils/dateUtils';
import studentService from '../../../services/studentService';
import reportService from '../../../services/reportService';
import './Rapports.css';
import '../../../styles/admin-shared.css';

const Rapports = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const [selectedDate, setSelectedDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [availableGroups, setAvailableGroups] = useState([]);
    const [groupFilter, setGroupFilter] = useState('ALL');
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [selectedRapport, setSelectedRapport] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [allReports, setAllReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await studentService.getGroups();
                setAvailableGroups(res.groups || []);
            } catch (error) {
                console.error('Error fetching groups', error);
            }
        };
        fetchGroups();

        const fetchReports = async () => {
            try {
                const res = await reportService.getAdminReports();
                const mappedReports = (res.reports || []).map(r => {
                    return {
                        ...r,
                        date: formatDate(r.date),
                        id: r.report_code,
                        db_id: r.id,
                        formateur: r.formateur_name,
                        salle: r.salle_name
                    };
                });
                setAllReports(mappedReports);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reports', error);
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const displayedAbsences = allReports.filter(record => {
        const matchesDate = !selectedDate || record.date === selectedDate;
        const matchesGroup = groupFilter === 'ALL' || record.group_id === groupFilter;
        const matchesSearch = !searchQuery ||
            (record.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.formateur?.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesDate && matchesSearch && matchesGroup;
    });

    const toggleSelectAll = () => {
        if (selectedRecords.length === displayedAbsences.length && displayedAbsences.length > 0) {
            setSelectedRecords([]);
        } else {
            setSelectedRecords(displayedAbsences.map(r => r.id));
        }
    };

    const toggleSelectRecord = (id) => {
        if (selectedRecords.includes(id)) {
            setSelectedRecords(selectedRecords.filter(rId => rId !== id));
        } else {
            setSelectedRecords([...selectedRecords, id]);
        }
    };

    const handleExportPDF = (ids = selectedRecords) => {
        const targetIds = Array.isArray(ids) ? ids : selectedRecords;
        if (targetIds.length === 0) return;
        setIsExporting(true);
        executeExportPDF(targetIds);
    };

    const executeExportPDF = async (targetIds) => {
        for (const recordId of targetIds) {
            const element = document.getElementById(`pdf-export-${recordId}`);
            if (element) {
                element.style.display = 'block';
                await new Promise(resolve => setTimeout(resolve, 150));
                await exportElementToPDF(element, `Rapport_ISTA_${recordId}.pdf`);
                element.style.display = 'none';
            }
        }
        setIsExporting(false);
        if (targetIds === selectedRecords) {
            setSelectedRecords([]);
        }
    };

    const handleExportExcel = (ids = selectedRecords) => {
        const targetIds = Array.isArray(ids) ? ids : selectedRecords;
        if (targetIds.length === 0) return;
        setIsExporting(true);
        loadXLSX().then(() => {
            executeExportExcel(targetIds);
        });
    };

    const executeExportExcel = async (targetIds) => {
        try {
            for (const recordId of targetIds) {
                const rapport = displayedAbsences.find(r => r.id === recordId);
                if (!rapport) continue;

                const absents = (rapport.stagiaires || []).filter(s => s.status === 'ABSENT');
                const total = rapport.total_group_students || (rapport.stagiaires || []).length;
                const taux = total > 0 ? Math.round((absents.length / total) * 100) : 0;

                const ws_data = [
                    [t('reports.export_title')],
                    [t('reports.export_subtitle', 'Modèle professionnel (version modernisée)')],
                    [],
                    [t('reports.col_group'), rapport.group_id],
                    [t('reports.export_salle', 'Salle'), rapport.salle || 'N/A'],
                    [t('reports.col_date'), rapport.date],
                    [t('reports.export_time', 'Horaire'), rapport.heure || 'N/A'],
                    [t('reports.col_formateur'), rapport.formateur],
                    [],
                    [t('reports.export_total', 'Nombre total'), total],
                    [t('reports.export_absents_count', 'Absents'), absents.length],
                    [t('reports.col_absent_rate'), `${taux}%`],
                    [],
                    [t('reports.export_num', 'N°'), t('reports.export_student'), t('reports.export_id'), t('reports.export_status')],
                    ...absents.map((s, i) => [i + 1, s.name, s.id, t('reports.absent_label')])
                ];

                const colWidths = [
                    { wch: 15 },
                    { wch: 30 },
                    { wch: 20 },
                    { wch: 15 }
                ];

                await exportDataToExcel(ws_data, `Rapport_ISTA_${recordId}.xlsx`, colWidths);
            }
        } catch (error) {
            console.error("Export Excel error", error);
        }
        setIsExporting(false);
        if (targetIds === selectedRecords) {
            setSelectedRecords([]);
        }
    };

    return (
        <div className={`rapports-container ${isRtl ? 'rtl' : ''}`}>
            
            <div className={`rapports-header ${isRtl ? 'rtl' : ''}`}>
                <div className="rapports-title-wrapper">
                    <h1 className="rapports-title">
                        {t('reports.title')}
                    </h1>
                    <p className="rapports-subtitle">
                        {t('reports.subtitle')}
                    </p>
                </div>
            </div>

            <div className="rapports-group-cards-row ista-scrollbar">
                <div
                    onClick={() => setGroupFilter('ALL')}
                    className={`rapports-group-card ${groupFilter === 'ALL' ? 'active' : 'inactive'}`}
                >
                    <div className={`rapports-card-header ${isRtl ? 'rtl' : ''}`}>
                        <span className={`rapports-card-id ${groupFilter === 'ALL' ? 'active' : 'inactive'} ${isRtl ? 'rtl' : ''}`}>
                            {t('reports.all_groups')}
                        </span>
                        <div className={`rapports-card-indicator ${groupFilter === 'ALL' ? 'active' : 'inactive'}`}></div>
                    </div>
                    <h3 className={`rapports-card-title ${isRtl ? 'rtl' : ''}`}>
                        {t('reports.all_groups')}
                    </h3>
                    <p className={`rapports-card-subtitle ${isRtl ? 'rtl' : ''}`}>
                        {t('reports.title')}: <span className="rapports-card-highlight">
                            {allReports.length} {t('reports.export_button')}s
                        </span>
                    </p>
                </div>

                {availableGroups.length > 0 ? (
                    availableGroups.map((grp) => {
                        const grpReportsCount = allReports.filter(r => r.group_id === grp.id).length;
                        return (
                            <div
                                key={grp.id}
                                onClick={() => setGroupFilter(grp.id)}
                                className={`rapports-group-card ${groupFilter === grp.id ? 'active' : 'inactive'}`}
                            >
                                <div className={`rapports-card-header ${isRtl ? 'rtl' : ''}`}>
                                    <span className={`rapports-card-id ${groupFilter === grp.id ? 'active' : 'inactive'} ${isRtl ? 'rtl' : ''}`}>
                                        {(grp.id || '').split('-')[0].trim()}
                                    </span>
                                    <div className={`rapports-card-indicator ${groupFilter === grp.id ? 'active' : 'inactive'}`}></div>
                                </div>
                                <h3 className={`rapports-card-title ${isRtl ? 'rtl' : ''}`}>
                                    {grp.id}
                               </h3>
                                <p className={`rapports-card-subtitle ${isRtl ? 'rtl' : ''}`}>
                                    {t('accounts.col_filiere')}: <span className="rapports-card-highlight">
                                        {grp.filiere || 'GESTION DES ENTREPRISES'}
                                    </span>
                                    <span className="rapports-card-dot">•</span>
                                    <span className="rapports-card-count">{grpReportsCount}</span>
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <div className="rapports-no-groups">
                        <p className="rapports-no-groups-text">{t('accounts.no_groups_available')}</p>
                    </div>
                )}
            </div>

            <div className={`rapports-filters-bar ${isRtl ? 'rtl' : ''}`}>
                <div className={`rapports-filters-left ${isRtl ? 'rtl' : ''}`}>
                    <h3 className="rapports-filters-title">{t('reports.list_title')}</h3>
                    <div className="rapports-filters-divider"></div>
                    <div className={`rapports-search-wrapper ${isRtl ? 'rtl' : ''}`}>
                        <Search className="rapports-search-icon" />
                        <input
                            type="text"
                            placeholder={t('reports.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`rapports-search-input ${isRtl ? 'rtl' : ''}`}
                        />
                    </div>
                </div>
                <div className={`rapports-filters-right ${isRtl ? 'rtl' : ''}`}>
                    <CustomDatePicker
                        selectedDate={selectedDate}
                        onChange={setSelectedDate}
                        placeholder={t('reports.filter_date')}
                    />
                    
                    <div className="rapports-export-wrapper">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            disabled={isExporting || selectedRecords.length === 0}
                            className={`btn-ista rapports-export-btn ${selectedRecords.length === 0 ? 'disabled' : 'active'}`}
                        >
                            <Download className={`rapports-export-icon ${isExporting ? 'animating' : ''}`} />
                            <span className="rapports-export-text">
                                {isExporting 
                                    ? t('reports.exporting', 'EXPORTATION...') 
                                    : (selectedRecords.length > 0 
                                        ? `${t('reports.export_btn', 'EXPORTER')} (${selectedRecords.length})` 
                                        : t('reports.export_btn', 'EXPORTER'))}
                            </span>
                            <ChevronDown className="rapports-export-chevron" />
                        </button>

                        {showExportMenu && selectedRecords.length > 0 && (
                            <div className="rapports-export-menu">
                                <button 
                                    onClick={() => { setShowExportMenu(false); handleExportPDF(); }}
                                    className="rapports-export-option border-b"
                                >
                                    {t('reports.format_pdf', 'Format PDF')}
                                </button>
                                <button 
                                    onClick={() => { setShowExportMenu(false); handleExportExcel(); }}
                                    className="rapports-export-option"
                                >
                                    {t('reports.format_excel', 'Format EXCEL')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="rapports-table-container">
                {loading ? (
                    <div className="rapports-loading-state">
                        <div className="rapports-spinner"></div>
                        <span className="rapports-loading-text">{t('reports.loading')}</span>
                    </div>
                ) : displayedAbsences.length === 0 ? (
                    <div className="rapports-empty-state">
                        <div className="rapports-empty-icon-wrapper">
                            <AlertTriangle className="rapports-empty-icon" />
                        </div>
                        <span className="rapports-empty-title">{t('reports.not_found')}</span>
                        <p className="rapports-empty-subtitle">{t('reports.adjust_filters')}</p>
                    </div>
                ) : (
                    <div className="rapports-table-wrapper ista-scrollbar">
                        <table className={`rapports-table ${isRtl ? 'rtl' : ''}`}>
                            <thead>
                                <tr className="rapports-thead-tr">
                                    <th className="rapports-th-select">
                                        <div onClick={toggleSelectAll} className="rapports-select-box">
                                            {selectedRecords.length === displayedAbsences.length && displayedAbsences.length > 0 ? (
                                                <CheckSquare className="rapports-icon-selected" />
                                            ) : (
                                                <Square className="rapports-icon-unselected" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="rapports-th">{t('reports.col_date')}</th>
                                    <th className="rapports-th">{t('reports.col_formateur')}</th>
                                    <th className="rapports-th">{t('reports.col_subject')}</th>
                                    <th className="rapports-th">{t('reports.col_group')}</th>
                                    <th className="rapports-th">{t('reports.col_absent_rate')}</th>
                                    <th className={`rapports-th-actions ${isRtl ? 'rtl' : 'ltr'}`}>{t('reports.col_actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="rapports-tbody">
                                {displayedAbsences.map((record) => (
                                    <tr key={record.id} className="rapports-tr group">
                                        <td className="rapports-td-select">
                                            <div onClick={() => toggleSelectRecord(record.id)} className="rapports-select-box">
                                                {selectedRecords.includes(record.id) ? (
                                                    <CheckSquare className="rapports-icon-selected" />
                                                ) : (
                                                    <Square className="rapports-icon-unselected" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="rapports-td">
                                            <span className="rapports-td-date">{record.date}</span>
                                        </td>
                                        <td className="rapports-td">
                                            <span className="rapports-td-formateur">{record.formateur}</span>
                                        </td>
                                        <td className="rapports-td">
                                            <span className="rapports-td-subject" title={record.subject}>
                                                {record.subject}
                                            </span>
                                        </td>
                                        <td className="rapports-td">
                                            <span className="rapports-badge">
                                                {record.group_id}
                                            </span>
                                        </td>
                                        <td className="rapports-td">
                                            <div className="rapports-rate-wrapper">
                                                <span className="rapports-rate-val">
                                                    {(record.stagiaires || []).filter(s => s.status === 'ABSENT').length} / {record.total_group_students || (record.stagiaires || []).length}
                                                </span>
                                                <span className="rapports-rate-lbl">{t('reports.absent_label')}</span>
                                            </div>
                                        </td>
                                        <td className={`rapports-td-actions ${isRtl ? 'rtl' : 'ltr'}`}>
                                            <button
                                                onClick={() => setSelectedRapport(record)}
                                                className="rapports-btn-view"
                                            >
                                                <FileText className="rapports-btn-view-icon" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <RapportModal
                isOpen={!!selectedRapport}
                onClose={() => setSelectedRapport(null)}
                rapport={selectedRapport}
                onExportPDF={() => handleExportPDF([selectedRapport.id])}
                onExportExcel={() => handleExportExcel([selectedRapport.id])}
                isExporting={isExporting}
            />

            <div className="absolute left-[-9999px] top-[-9999px] w-0 h-0 overflow-hidden">
                {displayedAbsences.map(rapport => {
                    const absents = (rapport.stagiaires || []).filter(s => s.status === 'ABSENT');
                    const total = (rapport.stagiaires || []).length;
                    const taux = total > 0 ? Math.round((absents.length / total) * 100) : 0;

                    return (
                    <div
                        key={`export-${rapport.id}`}
                        id={`pdf-export-${rapport.id}`}
                        dir={isRtl ? 'rtl' : 'ltr'}
                        style={{ display: 'none', width: '210mm', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Helvetica, Arial, sans-serif', overflow: 'visible' }}
                        className="rapports-pdf-container"
                    >
                        <div className="rapports-pdf-wrapper">
                            <h1 className="rapports-pdf-title">{t('reports.export_title')}</h1>
                            <h2 className="rapports-pdf-subtitle">{t('reports.export_subtitle', 'Modèle professionnel (version modernisée)')}</h2>

                            <div className="rapports-pdf-info-section">
                                <table className="rapports-pdf-table-info main">
                                    <tbody>
                                        <tr>
                                            <td className="rapports-pdf-td-label w-33">{t('reports.col_group')}</td>
                                            <td className="rapports-pdf-td-value">{rapport.group_id}</td>
                                        </tr>
                                        <tr>
                                            <td className="rapports-pdf-td-label">{t('reports.export_salle', 'Salle')}</td>
                                            <td className="rapports-pdf-td-value">{rapport.salle || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td className="rapports-pdf-td-label">{t('reports.col_date')}</td>
                                            <td className="rapports-pdf-td-value">{rapport.date}</td>
                                        </tr>
                                        <tr>
                                            <td className="rapports-pdf-td-label">{t('reports.export_time', 'Horaire')}</td>
                                            <td className="rapports-pdf-td-value">{rapport.heure || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td className="rapports-pdf-td-label">{t('reports.col_formateur')}</td>
                                            <td className="rapports-pdf-td-value">{rapport.formateur}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table className="rapports-pdf-table-info secondary">
                                    <tbody>
                                        <tr>
                                            <td className="rapports-pdf-td-label w-50">{t('reports.export_total', 'Nombre total')}</td>
                                            <td className="rapports-pdf-td-value">{total}</td>
                                        </tr>
                                        <tr>
                                            <td className="rapports-pdf-td-label">{t('reports.export_absents_count', 'Absents')}</td>
                                            <td className="rapports-pdf-td-value">{absents.length}</td>
                                        </tr>
                                        <tr>
                                            <td className="rapports-pdf-td-label">{t('reports.col_absent_rate')}</td>
                                            <td className="rapports-pdf-td-value">{taux}%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="rapports-pdf-students-section">
                                <table className="rapports-pdf-table-students">
                                    <thead>
                                        <tr>
                                            <th className="rapports-pdf-th-num">{t('reports.export_num', 'N°')}</th>
                                            <th className="rapports-pdf-th-name">{t('reports.export_student')}</th>
                                            <th className="rapports-pdf-th-id">{t('reports.export_id')}</th>
                                            <th className="rapports-pdf-th-status">{t('reports.export_status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {absents.map((stagiaire, idx) => (
                                            <tr key={idx}>
                                                <td className="rapports-pdf-td">{idx + 1}</td>
                                                <td className="rapports-pdf-td">{stagiaire.name}</td>
                                                <td className="rapports-pdf-td">{stagiaire.id}</td>
                                                <td className="rapports-pdf-td">{t('reports.absent_label')}</td>
                                            </tr>
                                        ))}
                                        {absents.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="rapports-pdf-td-empty">{t('reports.no_absences_found')}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="rapports-pdf-signature-section">
                                <h3 className="rapports-pdf-signature-label">{t('reports.signature_label', 'Signature du formateur')}</h3>
                                {rapport.signature ? (
                                    <div className="rapports-pdf-signature-image-wrapper">
                                        <img 
                                            src={getSignatureDataURI(rapport.signature)} 
                                            alt="Signature" 
                                            className="rapports-pdf-signature-image"
                                        />
                                    </div>
                                ) : (
                                    <div className="rapports-pdf-signature-placeholder"></div>
                                )}
                            </div>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
};

export default Rapports;
