import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { useTranslation } from 'react-i18next';
import GroupDossierModal from '../../components/GroupDossierModal';

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
                const token = localStorage.getItem('token');
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('/api/formateur/groups', config);
                setGroups(res.data.groups || []);

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
            setUsers([]);
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
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const [sRes, checkinsRes] = await Promise.all([
                axios.get(`/api/formateur/users/by-group/${groupId}`, config),
                axios.get(`/api/formateur/active-checkins/${groupId}`, config)
            ]);
            
            const checkinsList = checkinsRes.data.checkins || [];
            const checkinsMap = {};
            checkinsList.forEach(c => { checkinsMap[c.student_id] = c.status; });

            const fetchedUsers = sRes.data.users || [];
            setStudents(fetchedUsers.map(u => ({ 
                ...u, 
                status: checkinsMap[u.id] || 'ABSENT' 
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
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`/api/formateur/active-checkins/${activeSession.group}`, config);
                const checkinsList = res.data.checkins || [];
                const checkinsMap = {};
                checkinsList.forEach(c => { checkinsMap[c.student_id] = c.status; });

                setStudents(prev => prev.map(s => ({
                    ...s,
                    status: checkinsMap[s.id] || 'ABSENT'
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
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('/api/formateur/update-checkin-status', {
                studentId,
                groupId: activeSession.group,
                status
            }, config);
        } catch (error) {
            console.error('Manual Override Failed', error);
            addNotification(t('formateur.update_fail'), 'error');
        }
    };

    const handleSubmitReport = async (signatureData, meta = {}) => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const reportData = {
                report_code: `REP-${activeSession.group}-${new Date().toISOString().split('T')[0]}-${Date.now().toString().slice(-4)}`,
                group_id: activeSession.group,
                date: new Date().toISOString().split('T')[0],
                subject: activeSession.subject,
                heure: meta.selectedSeance || activeSession.time,
                stagiaires: students.map(s => ({ id: s.id, status: s.status })),
                signature: signatureData
            };

            await axios.post('/api/formateur/submit-report', reportData, config);

            try {
                await axios.post('/api/formateur/clear-checkins', { groupId: activeSession.group }, config);
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
        return <div className="flex items-center justify-center h-screen bg-[var(--background)] text-[var(--secondary)] font-bold italic tracking-widest uppercase animate-pulse">
            {t('formateur.initializing')}
        </div>;
    }

    return (
        <div className={`relative ${isRtl ? 'text-right' : ''}`}>
            <div className={`space-y-10 fade-up ${isConfirming ? 'blur-sm scale-[0.99] pointer-events-none' : ''} transition-all duration-500`}>
                {/* Header Section */}
                <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[var(--border)] pb-10 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="space-y-4">
                        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <span className="bg-[var(--primary)] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                {currentTime.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                            <div className={`flex items-center gap-2 text-[var(--text-muted)] font-bold text-[10px] tracking-widest bg-[var(--surface-hover)] px-3 py-1 rounded-full ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <Clock className="w-3 h-3 text-[var(--primary)]" />
                                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-[var(--secondary)] uppercase italic leading-[1.1]">
                                {activeSession ? t('formateur.session', { group: activeSession.group }) : t('formateur.welcome', { name: user?.name })}
                            </h1>
                            <div className={`flex items-center gap-3 mt-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <p className="text-[var(--text-muted)] text-[11px] font-bold tracking-widest uppercase bg-white px-3 py-1.5 rounded-lg border border-[var(--border)] shadow-sm">
                                    {activeSession ? `${activeSession.subject} ᛫ ${t('modals.dossier.room_label')} ${activeSession.room}` : t('formateur.select_prompt')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`flex flex-col sm:flex-row items-center gap-3 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
                        <div className="relative w-full sm:w-auto" ref={selectRef}>
                            <button
                                onClick={() => setIsSelectOpen(!isSelectOpen)}
                                className={`bg-white border rounded-xl ${isSelectOpen ? 'border-[var(--primary)] ring-4 ring-green-500/10' : 'border-[var(--border)]'} text-[var(--secondary)] px-6 py-4 text-[10px] font-black tracking-widest uppercase transition-all shadow-sm w-full sm:min-w-[280px] flex items-center justify-between group ${isRtl ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <CalendarCheck className={`w-4 h-4 ${activeSession ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`} />
                                    <span>{activeSession ? `${activeSession.group}` : t('formateur.select_group')}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${isSelectOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isSelectOpen && (
                                <div className="absolute top-[calc(100%+8px)] right-0 w-full bg-white border border-[var(--border)] z-50 shadow-xl rounded-xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="max-h-[250px] overflow-y-auto ista-scrollbar">
                                        {groups.map(g => (
                                            <div
                                                key={g.id}
                                                onClick={() => { handleSessionSelect(g.id); setIsSelectOpen(false); }}
                                                className={`px-6 py-4 text-[10px] font-black tracking-widest uppercase cursor-pointer transition-all hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] ${activeSession?.group === g.id ? 'text-[var(--primary)] bg-green-50' : 'text-[var(--text-muted)]'} ${isRtl ? 'text-right' : ''}`}
                                            >
                                                <span>{g.id}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {activeSession && (
                            <div className={`flex gap-3 w-full sm:w-auto ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <button
                                    onClick={() => setIsConfirming(true)}
                                    className="flex-1 sm:flex-none btn-ista btn-ista-outline px-6 py-4 flex items-center justify-center gap-2"
                                >
                                    <ClipboardCheck className="w-4 h-4" />
                                    <span className="text-[10px]">{t('formateur.validate_attendance')}</span>
                                </button>
                                <button
                                    className="btn-ista px-6 py-4 flex items-center justify-center"
                                    onClick={() => navigate(`/scanner?groupId=${activeSession.group}&mode=scann&subject=${encodeURIComponent(activeSession.subject)}&room=${encodeURIComponent(activeSession.room)}&formateurName=${encodeURIComponent(user?.name)}&time=${activeSession.time}`)}
                                    title={t('formateur.scanner_tooltip')}
                                >
                                    <Scan className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="ista-card p-8 bg-white text-center shadow-sm">
                        <Users className="w-6 h-6 text-[var(--secondary)] mx-auto mb-3" />
                        <h2 className="text-4xl font-black text-[var(--secondary)]">{stats.total.toString().padStart(2, '0')}</h2>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">{t('formateur.enrolled_students')}</p>
                    </div>
                    <div className="ista-card p-8 bg-white text-center shadow-sm border-b-4 border-b-[var(--primary)]">
                        <Activity className="w-6 h-6 text-[var(--primary)] mx-auto mb-3" />
                        <h2 className="text-4xl font-black text-[var(--primary)]">{stats.present.toString().padStart(2, '0')}</h2>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">{t('dashboard.present')}</p>
                    </div>
                    <div className="ista-card p-8 bg-white text-center shadow-sm border-b-4 border-b-red-500">
                        <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-3" />
                        <h2 className="text-4xl font-black text-red-500">{stats.absent.toString().padStart(2, '0')}</h2>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">{t('dashboard.absent')}</p>
                    </div>
                    <div className="ista-card p-8 bg-white text-center shadow-sm border-b-4 border-b-amber-500">
                        <Watch className="w-6 h-6 text-amber-500 mx-auto mb-3" />
                        <h2 className="text-4xl font-black text-amber-500">{stats.late?.toString().padStart(2, '0') || '00'}</h2>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">RETARD</p>
                    </div>
                </div>

                {/* List Section */}
                <div className="space-y-6">
                    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                        <h3 className={`text-xs font-black tracking-widest uppercase text-[var(--secondary)] flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></div>
                            {t('formateur.list_title')}
                        </h3>
                        <div className={`flex items-center bg-white border border-[var(--border)] rounded-xl w-full md:w-80 px-4 group focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-green-500/5 transition-all shadow-sm ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <Search className="w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="text"
                                placeholder={t('formateur.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`bg-transparent border-none text-[11px] py-4 px-4 w-full tracking-wider font-bold focus:ring-0 uppercase ${isRtl ? 'text-right' : ''}`}
                            />
                        </div>
                    </div>

                    <div className="ista-panel overflow-hidden bg-white">
                        <div className="overflow-x-auto ista-scrollbar">
                            <table className={`w-full text-left border-collapse min-w-[700px] ${isRtl ? 'text-right' : ''}`}>
                                <thead>
                                    <tr className="bg-[var(--surface-hover)] text-[var(--secondary)] text-[10px] font-black uppercase tracking-widest">
                                        <th className="p-6">{t('accounts.student_name')}</th>
                                        <th className="p-6">Email / ID</th>
                                        <th className="p-6">{t('divisions.state')}</th>
                                        <th className={`p-6 ${isRtl ? 'text-left' : 'text-right'}`}>{t('formateur.manual_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {activeSession ? (
                                        filteredStudents.length > 0 ? filteredStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="p-6">
                                                    <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                        <div className={`w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-[var(--secondary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-sm ${student.status === 'PRESENT' ? '' : 'grayscale opacity-50'}`}>
                                                            {student.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div className={`flex flex-col ${isRtl ? 'text-right' : ''}`}>
                                                            <span className={`text-xs font-bold tracking-tight text-[var(--secondary)] uppercase ${student.status === 'PRESENT' ? '' : 'opacity-40'}`}>{student.name}</span>
                                                            <span className="text-[9px] text-[var(--text-muted)] font-mono">#{student.id}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={`p-6 text-[var(--text-muted)] font-bold text-[10px] tracking-wider uppercase truncate max-w-[200px] ${isRtl ? 'text-right font-mono' : ''}`}>
                                                    {student.email}
                                                </td>
                                                <td className="p-6">
                                                    <span className={`badge ${student.status === 'PRESENT' ? 'badge-present' : student.status === 'LATE' ? 'bg-amber-50 text-amber-500 border-amber-100' : 'badge-absent'}`}>
                                                        {student.status === 'PRESENT' ? t('dashboard.present') : student.status === 'LATE' ? 'RETARD' : t('dashboard.absent')}
                                                    </span>
                                                </td>
                                                <td className={`p-6 ${isRtl ? 'text-left' : 'text-right'}`}>
                                                    <div className={`flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isRtl ? 'justify-start' : 'justify-end'}`}>
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                                            className={`p-2 rounded-lg border transition-all ${student.status === 'PRESENT' ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]'}`}
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'LATE')}
                                                            className={`p-2 rounded-lg border transition-all ${student.status === 'LATE' ? 'bg-amber-500 border-amber-500 text-white' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-amber-500 hover:text-amber-500'}`}
                                                        >
                                                            <Watch className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                                            className={`p-2 rounded-lg border transition-all ${student.status === 'ABSENT' ? 'bg-red-500 border-red-500 text-white' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-red-500 hover:text-red-500'}`}
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="p-20 text-center opacity-30 italic text-xs tracking-widest font-black uppercase text-[var(--text-muted)]">
                                                    {t('formateur.no_students')}
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-32 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <Activity className="w-12 h-12 text-[var(--border)] animate-bounce" />
                                                    <p className="text-[11px] font-black tracking-widest text-[var(--text-muted)] uppercase">
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

            {/* Group Dossier Modal */}
            <GroupDossierModal
                isOpen={isConfirming}
                onClose={() => setIsConfirming(false)}
                activeSession={activeSession}
                students={students}
                stats={stats}
                onConfirm={handleSubmitReport}
                submitting={submitting}
            />
            <style>{`
                .ista-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .ista-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .ista-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default FormateurDashboard;
