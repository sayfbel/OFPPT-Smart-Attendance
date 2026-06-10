import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Mail, Activity } from 'lucide-react';
import { useNotification } from '../../../hooks/useNotification';
import { useTranslation } from 'react-i18next';
import studentService from '../../../services/studentService';
import './Divisions.css';

const Divisions = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const { addNotification } = useNotification();
    const [availableGroups, setAvailableGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const resData = await studentService.getFormateurGroups();
                setAvailableGroups(resData.groups || []);
                if (resData.groups?.length > 0) {
                    setSelectedGroup(resData.groups[0].id);
                }
            } catch (error) {
                console.error('Error fetching groups', error);
                addNotification(t('divisions.error_fetch'), 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, [addNotification, t]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!selectedGroup) return;
            try {
                const resData = await studentService.getFormateurUsersByGroup(selectedGroup);
                setUsers(resData.users || []);
            } catch (error) {
                console.error('Error fetching users', error);
                setUsers([]);
            }
        };
        fetchUsers();
    }, [selectedGroup]);

    const displayedUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className={`divs-loading-container ${isRtl ? 'rtl' : ''}`}>
                <div className="divs-loading-spinner"></div>
                <span className="divs-loading-text">{t('divisions.loading')}</span>
            </div>
        );
    }

    return (
        <div className={`divs-container ${isRtl ? 'rtl' : ''}`}>
            <div className={`divs-header ${isRtl ? 'rtl' : ''}`}>
                <div className="divs-title-wrapper">
                    <h1 className="divs-title">
                        {t('divisions.title')}
                    </h1>
                    <p className="divs-subtitle">
                        {t('divisions.subtitle')}
                    </p>
                </div>
                <div className={`divs-search-box ${isRtl ? 'rtl' : ''}`}>
                    <Search className="divs-search-icon" />
                    <input
                        type="text"
                        placeholder={t('divisions.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`divs-search-input ${isRtl ? 'rtl' : ''}`}
                    />
                </div>
            </div>

            <div className={`divs-groups-scroll ista-scrollbar ${isRtl ? 'rtl' : ''}`}>
                {availableGroups.map((grp) => (
                    <div
                        key={grp.id}
                        onClick={() => setSelectedGroup(grp.id)}
                        className={`divs-group-card ${selectedGroup === grp.id ? 'selected' : ''}`}
                    >
                        <div className={`divs-card-header ${isRtl ? 'rtl' : ''}`}>
                            <div className={`divs-card-icon-wrapper ${selectedGroup === grp.id ? 'selected' : ''}`}>
                                <BookOpen className="divs-card-icon" />
                            </div>
                            <span className={`divs-card-badge ${selectedGroup === grp.id ? 'selected' : ''}`}>{grp.id}</span>
                        </div>

                        <h3 className={`divs-card-title ${isRtl ? 'rtl' : ''}`}>
                            {grp.id}
                        </h3>

                        <p className={`divs-card-filiere ${isRtl ? 'rtl' : ''}`}>
                            {grp.filiere}
                        </p>

                        <div className={`divs-card-footer ${isRtl ? 'rtl' : ''}`}>
                            <span className="divs-card-footer-label">{t('divisions.state')}</span>
                            <div className={`divs-card-status ${isRtl ? 'rtl' : ''}`}>
                                <div className={`divs-card-status-dot ${selectedGroup === grp.id ? 'selected' : ''}`}></div>
                                <span className={`divs-card-status-text ${selectedGroup === grp.id ? 'selected' : ''}`}>
                                    {selectedGroup === grp.id ? t('divisions.selected') : t('divisions.waiting')}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Student Table */}
            <div className={`divs-table-section ${isRtl ? 'rtl' : ''}`}>
                <div className={`divs-table-header ${isRtl ? 'rtl' : ''}`}>
                    <h2 className="divs-table-title">{t('nav.members')}</h2>
                    <span className="divs-table-badge">
                        {t('divisions.manifest')} : {selectedGroup}
                    </span>
                    <div className="divs-table-divider"></div>
                </div>

                <div className="divs-table-container">
                    <div className="divs-table-wrapper ista-scrollbar">
                        <table className={`divs-table ${isRtl ? 'rtl' : ''}`}>
                            <thead>
                                <tr className="divs-thead-tr">
                                    <th className="divs-th">{t('accounts.student_name')}</th>
                                    <th className="divs-th">{t('accounts.student_email')}</th>
                                    <th className="divs-th divs-th-center">{t('divisions.state')}</th>
                                    <th className={`divs-th ${isRtl ? 'rtl' : 'ltr'}`}>{t('common.last_login')}</th>
                                </tr>
                            </thead>
                            <tbody className="divs-tbody">
                                {displayedUsers.length > 0 ? displayedUsers.map((student) => (
                                    <tr key={student.id} className="divs-tr group">
                                        <td className="divs-td">
                                            <div className={`divs-td-user ${isRtl ? 'rtl' : ''}`}>
                                                <div className="divs-td-avatar">
                                                    {student.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className={`divs-td-user-info ${isRtl ? 'rtl' : ''}`}>
                                                    <Link to={`/admin/student/${student.id}`} className="divs-td-name">{student.name}</Link>
                                                    <span className="divs-td-id">{t('common.matricule')}: {student.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="divs-td">
                                            <div className={`divs-td-email-wrapper ${isRtl ? 'rtl' : ''}`}>
                                                <Mail className="divs-td-email-icon" />
                                                <span className={`divs-td-email ${isRtl ? 'rtl' : ''}`}>{student.email}</span>
                                            </div>
                                        </td>
                                        <td className="divs-td">
                                            <div className="divs-td-state-wrapper">
                                                <div className="divs-verified-badge">
                                                    <Activity className="divs-verified-icon" />
                                                    {t('common.verified')}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`divs-td ${isRtl ? 'rtl' : 'ltr'}`}>
                                            <span className="divs-td-lastlogin">
                                                {student.lastLogin || t('divisions.last_login_data')}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="divs-td-empty">
                                            <div className="divs-empty-content">
                                                <div className="divs-empty-icon-wrapper">
                                                    <Search className="divs-empty-icon" />
                                                </div>
                                                <p className="divs-empty-text">
                                                    {t('common.no_data')}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Divisions;
