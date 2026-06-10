import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Calendar,
    ChevronDown,
    Clock
} from 'lucide-react';
import { useNotification } from '../../../hooks/useNotification';
import { useTranslation } from 'react-i18next';
import { CustomDatePicker } from '../../../components/Forms';
import reportService from '../../../services/reportService';
import studentService from '../../../services/studentService';
import './AbsenceRegistry.css';
import '../../../styles/admin-shared.css';

const AbsenceRegistry = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const groupFilter = queryParams.get('group');

    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const [registry, setRegistry] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterJustified, setFilterJustified] = useState('ALL');

    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isJustifOpen, setIsJustifOpen] = useState(false);

    const [availableGroups, setAvailableGroups] = useState([]);
    const [availableFilieres, setAvailableFilieres] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(groupFilter || 'all');
    const [selectedDate, setSelectedDate] = useState('');

    const statusOptions = [
        { value: 'ALL', label: t('absence_registry.filter_status') },
        { value: 'ABSENT', label: t('absence_registry.filter_absences') },
        { value: 'LATE', label: t('absence_registry.filter_lates') },
        { value: 'PRESENT', label: t('absence_registry.filter_presences') }
    ];

    const justifOptions = [
        { value: 'ALL', label: t('absence_registry.filter_all_justif') },
        { value: 'JUSTIFIED', label: t('absence_registry.filter_justified') },
        { value: 'PENDING', label: t('absence_registry.filter_not_justified') },
        { value: 'ABSENCE', label: t('absence_registry.filter_pending') }
    ];

    const fetchRegistry = async () => {
        try {
            const [registryRes, groupsRes, filieresRes] = await Promise.all([
                reportService.getAbsenceRegistry(),
                studentService.getGroups(),
                studentService.getFilieres()
            ]);
            setRegistry(registryRes.registry || []);
            setAvailableGroups(groupsRes.groups || []);
            setAvailableFilieres(filieresRes.filieres || []);
        } catch (err) {
            console.error("FETCH REGISTRY ERROR:", err);
            addNotification(t('absence_registry.sync_error'), "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistry();
    }, []);

    useEffect(() => {
        if (groupFilter) setSelectedGroup(groupFilter);
    }, [groupFilter]);

    useEffect(() => {
        const handleClickOutside = () => {
            setIsStatusOpen(false);
            setIsJustifOpen(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleJustify = async (recordId, currentJustification) => {
        try {
            const newJustified = currentJustification === 'JUSTIFIÉ' ? 'ABSENCE' : 'JUSTIFIÉ';
            await reportService.justifyAbsence(recordId, newJustified === 'JUSTIFIÉ');
            setRegistry(prev => prev.map(r => r.record_id === recordId ? { ...r, justified: newJustified } : r));
            addNotification(newJustified === 'JUSTIFIÉ' ? t('absence_registry.justif_success') : t('absence_registry.justif_removed'), "success");
        } catch (err) {
            addNotification(t('absence_registry.justif_error'), "error");
        }
    };


    const filteredRegistry = registry.filter(item => {
        const matchesSearch = item.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.student_id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
        const matchesJustified = filterJustified === 'ALL' || 
                                (filterJustified === 'JUSTIFIED' && item.justified === 'JUSTIFIÉ') || 
                                (filterJustified === 'PENDING' && item.justified === 'NON JUSTIFIÉ') ||
                                (filterJustified === 'ABSENCE' && item.justified === 'ABSENCE');
        const matchesGroup = selectedGroup === 'all' || item.class_id === selectedGroup;
        
        let itemDateStr = '';
        if (item.session_date) {
            const d = new Date(item.session_date);
            if (!isNaN(d.getTime())) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                itemDateStr = `${year}-${month}-${day}`;
            }
        }
        const matchesDate = !selectedDate || itemDateStr === selectedDate;
        
        return matchesSearch && matchesStatus && matchesJustified && matchesGroup && matchesDate;
    });

    if (loading) {
        return <div className="registry-loading">{t('absence_registry.sync')}</div>;
    }

    return (
        <div className={`registry-container ${isRtl ? 'rtl' : ''}`}>
            
            <div className={`admin-header-row ${isRtl ? 'rtl' : ''}`}>
                <div className={`admin-header-text ${isRtl ? 'rtl' : ''}`}>
                    <h1 className="admin-page-title">
                        {t('absence_registry.title')}
                    </h1>
                    <p className="admin-page-subtitle">
                        {t('absence_registry.subtitle')}
                    </p>
                </div>

                <div className="registry-actions-group">
                    <CustomDatePicker
                        selectedDate={selectedDate}
                        onChange={setSelectedDate}
                        placeholder={t('absence_registry.filter_date') || 'FILTRER PAR DATE'}
                    />

                    <div className={`registry-search-wrapper ${isRtl ? 'rtl' : ''}`}>
                        <svg className="registry-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder={t('absence_registry.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`registry-search-input ${isRtl ? 'rtl' : ''}`}
                        />
                    </div>

                    <div className="registry-dropdown-wrapper" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => { setIsStatusOpen(!isStatusOpen); setIsJustifOpen(false); }}
                            className={`registry-dropdown-btn ${isStatusOpen ? 'open' : ''}`}
                        >
                            <span>{statusOptions.find(o => o.value === filterStatus)?.label}</span>
                            <ChevronDown className={`registry-dropdown-chevron ${isStatusOpen ? 'open' : ''}`} />
                        </button>
                        {isStatusOpen && (
                            <div className="registry-dropdown-menu">
                                {statusOptions.map(opt => (
                                    <div 
                                        key={opt.value}
                                        onClick={() => { setFilterStatus(opt.value); setIsStatusOpen(false); }}
                                        className={`registry-dropdown-item ${filterStatus === opt.value ? 'active' : 'inactive'}`}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="registry-dropdown-wrapper" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => { setIsJustifOpen(!isJustifOpen); setIsStatusOpen(false); }}
                            className={`registry-dropdown-btn ${isJustifOpen ? 'open' : ''}`}
                        >
                            <span>{justifOptions.find(o => o.value === filterJustified)?.label}</span>
                            <ChevronDown className={`registry-dropdown-chevron ${isJustifOpen ? 'open' : ''}`} />
                        </button>
                        {isJustifOpen && (
                            <div className="registry-dropdown-menu">
                                {justifOptions.map(opt => (
                                    <div 
                                        key={opt.value}
                                        onClick={() => { setFilterJustified(opt.value); setIsJustifOpen(false); }}
                                        className={`registry-dropdown-item ${filterJustified === opt.value ? 'active' : 'inactive'}`}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="admin-group-cards-row ista-scrollbar">
                <div
                    onClick={() => setSelectedGroup('all')}
                    className={`admin-group-card ${selectedGroup === 'all' ? 'active' : 'inactive'}`}
                >
                    <div className={`admin-group-card-header ${isRtl ? 'rtl' : ''}`}>
                        <span className={`admin-group-card-id ${selectedGroup === 'all' ? 'active' : 'inactive'} ${isRtl ? 'rtl' : ''}`}>
                            {t('reports.all_groups')}
                        </span>
                        <div className={`admin-group-card-indicator ${selectedGroup === 'all' ? 'active' : 'inactive'}`}></div>
                    </div>
                    <h3 className={`admin-group-card-title ${isRtl ? 'rtl' : ''}`}>
                        {t('reports.all_groups')}
                    </h3>
                    <p className={`admin-group-card-subtitle ${isRtl ? 'rtl' : ''}`}>
                        {t('absence_registry.title')}: <span className="admin-group-card-highlight">
                            {registry.length} {t('absence_registry.filter_absences')}
                        </span>
                    </p>
                </div>

                {availableGroups.length > 0 ? (
                    availableGroups.map((grp) => {
                            const grpAbsenceCount = registry.filter(item => item.class_id === grp.id).length;
                            return (
                                <div
                                    key={grp.id}
                                    onClick={() => setSelectedGroup(grp.id)}
                                    className={`admin-group-card ${selectedGroup === grp.id ? 'active' : 'inactive'}`}
                                >
                                    <div className={`admin-group-card-header ${isRtl ? 'rtl' : ''}`}>
                                        <span className={`admin-group-card-id ${selectedGroup === grp.id ? 'active' : 'inactive'} ${isRtl ? 'rtl' : ''}`}>
                                            {(grp.id || '').split('-')[0].trim()}
                                        </span>
                                        <div className={`admin-group-card-indicator ${selectedGroup === grp.id ? 'active' : 'inactive'}`}></div>
                                    </div>
                                    <h3 className={`admin-group-card-title ${isRtl ? 'rtl' : ''}`}>
                                        {grp.id}
                                    </h3>
                                    <p className={`admin-group-card-subtitle ${isRtl ? 'rtl' : ''}`}>
                                        {t('accounts.col_filiere')}: <span className="admin-group-card-highlight">
                                            {grp.filiere || 'GESTION DES ENTREPRISES'}
                                        </span>
                                        <span className="admin-group-card-dot">•</span>
                                        <span className="admin-group-card-count error">{grpAbsenceCount}</span>
                                    </p>
                                </div>
                            );
                        })
                ) : (
                    <div className="admin-no-groups">
                        <p className="admin-no-groups-text">{t('accounts.no_groups_available')}</p>
                    </div>
                )}
            </div>

            <div className="admin-table-container">
                <div className="admin-table-wrapper ista-scrollbar">
                    <table className={`admin-table ${isRtl ? 'rtl' : ''}`}>
                        <thead>
                            <tr className="admin-thead-tr">
                                <th className="admin-th">{t('absence_registry.col_student')}</th>
                                <th className="admin-th-center">{t('absence_registry.col_session')}</th>
                                <th className="admin-th-center">{t('absence_registry.col_status')}</th>
                                <th className="admin-th-center">{t('absence_registry.col_reported_by')}</th>
                                <th className={`admin-th ${isRtl ? 'rtl' : 'ltr'}`}>{t('absence_registry.col_actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="admin-tbody">
                            {filteredRegistry.map((item) => (
                                <tr key={item.record_id} className="admin-tr group">
                                    <td className="admin-td">
                                        <div className="registry-student-cell">
                                            <div className="registry-student-avatar">
                                                {item.student_name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="registry-student-info">
                                                <Link to={`/admin/student/${item.student_id}`} className="registry-student-name">{item.student_name}</Link>
                                                <span className="registry-student-meta">ID: {item.student_id} / GROUP: {item.class_id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="admin-td">
                                        <div className="registry-session-cell">
                                            <span className="registry-session-subject">{item.subject}</span>
                                            <div className="registry-session-datetime">
                                                <svg className="registry-datetime-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(item.session_date).toLocaleDateString('fr-FR')} 
                                                <span className="registry-datetime-dot">•</span>
                                                <svg className="registry-datetime-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {item.session_time}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="admin-td">
                                        <div className="registry-status-cell">
                                            {item.justified === 'JUSTIFIÉ' ? (
                                                <span className="registry-status-badge justified">
                                                    {t('absence_registry.status_justified')}
                                                </span>
                                            ) : item.justified === 'NON JUSTIFIÉ' ? (
                                                <span className="registry-status-badge not-justified">
                                                    {t('absence_registry.status_not_justified')}
                                                </span>
                                            ) : (
                                                <span className="registry-status-badge absence">
                                                    {t('absence_registry.status_absence')}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="admin-td">
                                        <div className="registry-reported-cell">
                                            <span className="registry-reported-name">{item.formateur_name}</span>
                                            <span className="registry-reported-label">FORMATEUR</span>
                                        </div>
                                    </td>
                                    <td className={`admin-td ${isRtl ? 'rtl' : 'ltr'}`}>
                                        {item.status !== 'PRESENT' && (
                                            <div className={`registry-actions-cell ${isRtl ? 'rtl' : ''}`}>
                                                <button 
                                                    onClick={() => handleJustify(item.record_id, item.justified)}
                                                    className={`registry-btn-action ${item.justified === 'JUSTIFIÉ' ? 'cancel-justify' : 'justify'}`}
                                                >
                                                    {item.justified === 'JUSTIFIÉ' ? t('absence_registry.btn_cancel_justif') : t('absence_registry.btn_justify')}
                                                </button>
                                                <button 
                                                    onClick={() => navigate('/admin/penalty-decision', { state: { student: item } })}
                                                    className="registry-btn-action sanction"
                                                >
                                                    {t('absence_registry.btn_sanction')}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AbsenceRegistry;
