import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import {
    CheckCircle2,
    XCircle,
    ClipboardCheck,
    Search,
    Clock,
    Users,
    Activity,
    Scan,
    ChevronDown,
    CalendarCheck,
    AlertCircle,
    Watch
} from 'lucide-react';
import attendanceService from '../../../services/attendanceService';
import studentService from '../../../services/studentService';
import reportService from '../../../services/reportService';
import { useNotification } from '../../../hooks/useNotification';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';
import '../../../styles/admin-shared.css';

const FormateurDashboard = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addNotification } = useNotification();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [groups, setGroups] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const selectRef = useRef(null);

    // Clock effect
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Handle Click Outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsSelectOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch Schedule and Classes
    useEffect(() => {
        const fetchScheduleData = async () => {
            try {
                const groupsData = await studentService.getFormateurGroups();
                setGroups(groupsData.groups || []);

                // Auto-select group from URL if present
                const selectedGroupId = searchParams.get('selectedGroup');
                if (selectedGroupId) {
                    const session = {
                        group: selectedGroupId,
                        subject: 'SESSION',
                        room: 'ROOM',
                        time: '08:30-11:00'
                    };
                    setActiveSession({ ...session, group: selectedGroupId });

                    fetchStudents(selectedGroupId);
                }
            } catch (err) {
                console.error("Fetch Data Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchScheduleData();
    }, [searchParams]);

    const handleSessionSelect = (groupId) => {
        if (!groupId) {
            setActiveSession(null);
            setStudents([]);
            return;
        }

        const session = {
            group: groupId,
            subject: 'SESSION',
            room: 'ROOM',
            time: '08:30-11:00'
        };

        setActiveSession({
            ...session,
            group: groupId
        });
        fetchStudents(groupId);
    };

    const fetchStudents = async (groupId) => {
        try {
            const [sData, checkinsData] = await Promise.all([
                studentService.getFormateurUsersByGroup(groupId),
                attendanceService.getActiveCheckins(groupId)
            ]);
            
            const checkinsList = checkinsData.checkins || [];
            const checkinsMap = {};
            checkinsList.forEach(c => { checkinsMap[c.student_id] = c.status; });

            const fetchedUsers = sData.users || [];
            setStudents(fetchedUsers.map(u => ({ 
                ...u, 
                status: checkinsMap[u.id] || 'PRESENT' 
            })));
        } catch (error) {
            console.error('Error fetching session students', error);
        }
    };

    // Poll for Live Check-ins
    useEffect(() => {
        if (!activeSession) return;

        const pollCheckins = async () => {
            try {
                const checkinsData = await attendanceService.getActiveCheckins(activeSession.group);
                const checkinsList = checkinsData.checkins || [];
                const checkinsMap = {};
                checkinsList.forEach(c => { checkinsMap[c.student_id] = c.status; });

                setStudents(prev => prev.map(s => ({
                    ...s,
                    status: checkinsMap[s.id] || 'PRESENT'
                })));

            } catch (err) {
                console.error("Polling Error:", err);
            }
        };

        const interval = setInterval(pollCheckins, 1000);
        return () => clearInterval(interval);
    }, [activeSession]);

    const handleStatusChange = async (studentId, status) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));

        try {
            await attendanceService.updateCheckinStatus(studentId, activeSession.group, status);
        } catch (error) {
            console.error('Manual Override Failed', error);
            addNotification(t('formateur.update_fail'), 'error');
        }
    };

    const handleSubmitReport = async (signatureData, meta = {}) => {
        setSubmitting(true);
        try {
            const reportData = {
                report_code: `REP-${activeSession.group}-${new Date().toISOString().split('T')[0]}-${Date.now().toString().slice(-4)}`,
                group_id: activeSession.group,
                date: new Date().toISOString().split('T')[0],
                subject: activeSession.subject,
                heure: meta.selectedSeance || activeSession.time,
                stagiaires: students.map(s => ({ id: s.id, status: s.status })),
                signature: signatureData
            };

            await reportService.submitReport(reportData);

            try {
                await attendanceService.clearCheckins(activeSession.group);
            } catch (err) { console.error("Clear Checkins Error:", err); }

            addNotification(t('formateur.report_success', { group: activeSession.group }), 'success');
            setIsConfirming(false);
        } catch (error) {
            console.error('Submission failed', error);
            addNotification(error.response?.data?.message || t('formateur.report_error'), 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: students.length,
        present: students.filter(s => s.status === 'PRESENT').length,
        absent: students.filter(s => s.status === 'ABSENT').length,
        late: students.filter(s => s.status === 'LATE').length
    };


    if (loading) {
        return <div className="fd-loading-state">
            {t('formateur.initializing')}
        </div>;
    }

    return (
        <div className={`fd-container ${isRtl ? 'rtl' : 'ltr'}`}>
            <div className="fd-content-wrapper">
                {/* Header Section */}
                <div className={`fd-header ${isRtl ? 'rtl' : ''}`}>
                    <div className="fd-header-titles">
                        <div className={`fd-time-badges ${isRtl ? 'rtl' : ''}`}>
                            <span className="fd-date-badge">
                                {currentTime.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                            <div className={`fd-clock-badge ${isRtl ? 'rtl' : ''}`}>
                                <Clock className="fd-clock-icon" />
                                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                        <div className="fd-title-wrapper">
                            <h1 className="fd-title">
                                {activeSession ? t('formateur.session', { group: activeSession.group }) : t('formateur.welcome', { name: user?.name })}
                            </h1>
                            <div className={`fd-subtitle-container ${isRtl ? 'rtl' : ''}`}>
                                <p className="fd-subtitle">
                                    {activeSession ? `${activeSession.subject} ᛫ ${t('modals.dossier.room_label')} ${activeSession.room}` : t('formateur.select_prompt')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`fd-controls ${isRtl ? 'rtl' : ''}`}>
                        <div className="fd-select-wrapper" ref={selectRef}>
                            <button
                                onClick={() => setIsSelectOpen(!isSelectOpen)}
                                className={`fd-select-btn ${isSelectOpen ? 'open' : ''} ${isRtl ? 'rtl' : ''}`}
                            >
                                <div className={`fd-select-btn-content ${isRtl ? 'rtl' : ''}`}>
                                    <CalendarCheck className={`fd-select-icon ${activeSession ? 'active' : ''}`} />
                                    <span>{activeSession ? `${activeSession.group}` : t('formateur.select_group')}</span>
                                </div>
                                <ChevronDown className={`fd-select-chevron ${isSelectOpen ? 'rotated' : ''}`} />
                            </button>

                            {isSelectOpen && (
                                <div className="fd-select-dropdown">
                                    <div className="fd-select-dropdown-inner">
                                        {groups.map(g => (
                                            <div
                                                key={g.id}
                                                onClick={() => { handleSessionSelect(g.id); setIsSelectOpen(false); }}
                                                className={`fd-select-option ${activeSession?.group === g.id ? 'active' : ''} ${isRtl ? 'rtl' : ''}`}
                                            >
                                                <span>{g.id}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {activeSession && (
                            <div className={`fd-action-btns ${isRtl ? 'rtl' : ''}`}>
                                <button
                                    onClick={() => navigate('/formateur/dossier', { state: { activeSession, students, stats } })}
                                    className="btn-ista btn-ista-outline fd-validate-btn"
                                >
                                    <ClipboardCheck className="fd-validate-icon" />
                                    <span>{t('formateur.validate_attendance')}</span>
                                </button>
                                <button
                                    className="btn-ista fd-scanner-btn"
                                    onClick={() => navigate(`/scanner?groupId=${activeSession.group}&mode=scann&subject=${encodeURIComponent(activeSession.subject)}&room=${encodeURIComponent(activeSession.room)}&formateurName=${encodeURIComponent(user?.name)}&time=${activeSession.time}`)}
                                    title={t('formateur.scanner_tooltip')}
                                >
                                    <Scan className="fd-scanner-icon" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="fd-stats-grid">
                    <div className="ista-card fd-stat-card fd-stat-card-total">
                        <Users className="fd-stat-icon fd-stat-icon-total" />
                        <h2 className="fd-stat-value fd-stat-value-total">{stats.total.toString().padStart(2, '0')}</h2>
                        <p className="fd-stat-label">{t('formateur.enrolled_students')}</p>
                    </div>
                    <div className="ista-card fd-stat-card fd-stat-card-present">
                        <Activity className="fd-stat-icon fd-stat-icon-present" />
                        <h2 className="fd-stat-value fd-stat-value-present">{stats.present.toString().padStart(2, '0')}</h2>
                        <p className="fd-stat-label">{t('dashboard.present')}</p>
                    </div>
                    <div className="ista-card fd-stat-card fd-stat-card-absent">
                        <AlertCircle className="fd-stat-icon fd-stat-icon-absent" />
                        <h2 className="fd-stat-value fd-stat-value-absent">{stats.absent.toString().padStart(2, '0')}</h2>
                        <p className="fd-stat-label">{t('dashboard.absent')}</p>
                    </div>
                    <div className="ista-card fd-stat-card fd-stat-card-late">
                        <Watch className="fd-stat-icon fd-stat-icon-late" />
                        <h2 className="fd-stat-value fd-stat-value-late">{stats.late?.toString().padStart(2, '0') || '00'}</h2>
                        <p className="fd-stat-label">{t('dashboard.late')}</p>
                    </div>
                </div>

                {/* List Section */}
                <div className="fd-list-section">
                    <div className={`fd-list-header ${isRtl ? 'rtl' : ''}`}>
                        <h3 className={`fd-list-title ${isRtl ? 'rtl' : ''}`}>
                            <div className="fd-list-title-indicator"></div>
                            {t('formateur.list_title')}
                        </h3>
                        <div className={`fd-search-wrapper ${isRtl ? 'rtl' : ''}`}>
                            <Search className="fd-search-icon" />
                            <input
                                type="text"
                                placeholder={t('formateur.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`fd-search-input ${isRtl ? 'rtl' : ''}`}
                            />
                        </div>
                    </div>

                    <div className="ista-panel fd-table-container">
                        <div className="fd-table-wrapper ista-scrollbar">
                            <table className={`fd-table ${isRtl ? 'rtl' : ''}`}>
                                <thead>
                                    <tr className="fd-thead-tr">
                                        <th className="fd-th">{t('accounts.student_name')}</th>
                                        <th className="fd-th">{t('common.email_id')}</th>
                                        <th className="fd-th">{t('divisions.state')}</th>
                                        <th className={`fd-th ${isRtl ? 'rtl' : 'ltr'}`}>{t('formateur.manual_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="fd-tbody">
                                    {activeSession ? (
                                        filteredStudents.length > 0 ? filteredStudents.map((student) => (
                                            <tr key={student.id} className="fd-tr group">
                                                <td className="fd-td">
                                                    <div className={`fd-td-user ${isRtl ? 'rtl' : ''}`}>
                                                        <div className={`fd-td-avatar ${student.status === 'PRESENT' ? 'active' : 'inactive'}`}>
                                                            {student.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div className={`fd-td-user-info ${isRtl ? 'rtl' : ''}`}>
                                                            <Link to={`/admin/student/${student.id}`} className={`fd-td-name ${student.status === 'PRESENT' ? 'active' : 'inactive'}`}>{student.name}</Link>
                                                            <span className="fd-td-id">#{student.id}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={`fd-td fd-td-email ${isRtl ? 'rtl' : ''}`}>
                                                    {student.email}
                                                </td>
                                                <td className="fd-td">
                                                    <span className={`badge ${student.status === 'PRESENT' ? 'badge-present' : student.status === 'LATE' ? 'badge-late' : 'badge-absent'}`}>
                                                        {student.status === 'PRESENT' ? t('dashboard.present') : student.status === 'LATE' ? t('dashboard.late') : t('dashboard.absent')}
                                                    </span>
                                                </td>
                                                <td className={`fd-td ${isRtl ? 'rtl' : 'ltr'}`}>
                                                    <div className={`fd-td-actions ${isRtl ? 'rtl' : 'ltr'}`}>
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                                            className={`fd-action-btn fd-btn-present ${student.status === 'PRESENT' ? 'active' : ''}`}
                                                        >
                                                            <CheckCircle2 className="fd-action-btn-icon" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'LATE')}
                                                            className={`fd-action-btn fd-btn-late ${student.status === 'LATE' ? 'active' : ''}`}
                                                        >
                                                            <Watch className="fd-action-btn-icon" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                                            className={`fd-action-btn fd-btn-absent ${student.status === 'ABSENT' ? 'active' : ''}`}
                                                        >
                                                            <XCircle className="fd-action-btn-icon" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="fd-td-empty">
                                                    {t('formateur.no_students')}
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="fd-td-waiting">
                                                <div className="fd-waiting-content">
                                                    <Activity className="fd-waiting-icon" />
                                                    <p className="fd-waiting-text">
                                                        {t('formateur.waiting_session')}
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
        </div>
    );
};

export default FormateurDashboard;
