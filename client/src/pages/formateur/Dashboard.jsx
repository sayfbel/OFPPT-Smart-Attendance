import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    CheckCircle2,
    XCircle,
    ClipboardCheck,
    Search,
    ArrowRight,
    Clock,
    Activity,
    Users,
    AlertTriangle,
    Check,
    Camera,
    Zap
} from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { Html5Qrcode } from 'html5-qrcode';

const FormateurDashboard = () => {
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [schedule, setSchedule] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Clock effect
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Schedule
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('http://localhost:5000/api/formateur/schedule', config);
                setSchedule(res.data.schedule || []);
            } catch (error) {
                console.error('Error fetching schedule', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    // Determine Active Session
    useEffect(() => {
        if (schedule.length === 0) return;

        const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const currentDayName = dayNames[currentTime.getDay()];
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        const active = schedule.find(s => {
            if (s.day !== currentDayName) return false;
            const [startStr, endStr] = s.time.split(' - ');
            const [startH, startM] = startStr.split(':').map(Number);
            const [endH, endM] = endStr.split(':').map(Number);
            const startInMinutes = startH * 60 + startM;
            const endInMinutes = endH * 60 + endM;

            return currentTimeInMinutes >= startInMinutes && currentTimeInMinutes < endInMinutes;
        });

        if (active && active.id !== activeSession?.id) {
            setActiveSession(active);
            fetchStudents(active.class);
        } else if (!active) {
            setActiveSession(null);
            setStudents([]);
        }
    }, [currentTime, schedule]);

    const fetchStudents = async (classId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`http://localhost:5000/api/formateur/users/by-class/${classId}`, config);
            const fetchedUsers = res.data.users || [];
            // Initialize all as PRESENT
            setStudents(fetchedUsers.map(u => ({ ...u, status: 'PRESENT' })));
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
                const res = await axios.get(`http://localhost:5000/api/formateur/active-checkins/${activeSession.class}`, config);
                const checkedInIds = res.data.checkins || [];

                if (checkedInIds.length > 0) {
                    setStudents(prev => prev.map(s =>
                        checkedInIds.includes(s.id) ? { ...s, status: 'PRESENT' } : s
                    ));
                }
            } catch (err) {
                console.error("Polling Error:", err);
            }
        };

        const interval = setInterval(pollCheckins, 3000);
        return () => clearInterval(interval);
    }, [activeSession]);

    const handleStatusChange = (studentId, status) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
    };

    const handleSubmitReport = async () => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const reportData = {
                report_code: `REP-${activeSession.class}-${new Date().toISOString().split('T')[0]}-${Date.now().toString().slice(-4)}`,
                class_id: activeSession.class,
                date: new Date().toISOString().split('T')[0],
                subject: activeSession.subject,
                salle: activeSession.room,
                heure: activeSession.time,
                stagiaires: students.map(s => ({ id: s.id, status: s.status }))
            };

            await axios.post('http://localhost:5000/api/formateur/submit-report', reportData, config);

            // Clear active checkins after success
            try {
                await axios.post('http://localhost:5000/api/formateur/clear-checkins', { classId: activeSession.class }, config);
            } catch (err) { console.error("Clear Checkins Error:", err); }

            addNotification(`Cluster ${activeSession.class} confirmed and archived.`, 'success');
            setIsConfirming(false);
        } catch (error) {
            console.error('Submission failed', error);
            addNotification(error.response?.data?.message || 'Neural Link Timeout: Submission failed.', 'error');
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
        absent: students.filter(s => s.status === 'ABSENT').length
    };


    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-black text-white italic tracking-widest font-black uppercase text-xl">Synchronizing Neural Links...</div>;
    }

    return (
        <div className="relative">
            <div className={`space-y-16 fade-up ${isConfirming ? 'blur-sm scale-[0.99] pointer-events-none' : ''} transition-all duration-700`}>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--border-strong)] pb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <p className="text-[var(--text-muted)] text-[10px] tracking-[0.5em] font-black uppercase">Live Division Monitor</p>
                            <div className="px-3 py-1 bg-[var(--surface)] border border-[var(--border-strong)] flex items-center gap-2">
                                <Clock className="w-3 h-3 text-[var(--primary)]" />
                                <span className="text-[10px] font-bold text-[var(--primary)] tracking-widest">
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-7xl font-black tracking-tighter text-[var(--primary)] uppercase italic leading-none">
                                {activeSession ? `Session :: ${activeSession.class}` : 'IDLE :: STANDBY'}
                            </h1>
                            <p className="text-[var(--text-muted)] text-xs font-bold tracking-[0.3em] uppercase mt-4">
                                {activeSession ? `${activeSession.subject} @ ${activeSession.room}` : 'Waiting for scheduled deployment.'}
                            </p>
                        </div>
                    </div>

                    {activeSession && (
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsConfirming(true)}
                                className="btn-noir btn-outline px-8 py-3 group hover:border-[var(--primary)]"
                            >
                                <ClipboardCheck className="w-3 h-3 mr-2 group-hover:text-[var(--primary)] transition-colors" />
                                <span className="group-hover:text-[var(--primary)] transition-colors">Confirm Cluster</span>
                            </button>
                            <button
                                className="btn-noir px-8 py-3"
                                onClick={() => window.open(`/scanner?classId=${activeSession.class}`, '_blank')}
                            >
                                <span>Activate Portal</span>
                                <ArrowRight className="w-3 h-3 ml-2" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Live Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border-strong)] border border-[var(--border-strong)]">
                    <div className="bg-[var(--background)] p-12 text-center group hover:bg-[var(--surface-hover)] transition-colors">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                            <Users className="w-3 h-3" /> Network Nodes
                        </p>
                        <h2 className="text-6xl font-black text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{stats.total.toString().padStart(2, '0')}</h2>
                    </div>
                    <div className="bg-[var(--background)] p-12 text-center group hover:bg-[var(--surface-hover)] transition-colors">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                            <Activity className="w-3 h-3" /> Active Signal
                        </p>
                        <h2 className="text-6xl font-black text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{stats.present.toString().padStart(2, '0')}</h2>
                    </div>
                    <div className="bg-[var(--background)] p-12 text-center group hover:bg-[var(--surface-hover)] transition-colors">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                            <XCircle className="w-3 h-3" /> Void State
                        </p>
                        <h2 className="text-6xl font-black text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{stats.absent.toString().padStart(2, '0')}</h2>
                    </div>
                </div>

                {/* List Section */}
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h3 className="text-xs font-black tracking-[0.5em] uppercase text-[var(--text-muted)]">Live Node Manifest</h3>
                        <div className="flex items-center border-b border-[var(--border-strong)] w-full md:w-80 group focus-within:border-[var(--primary)] transition-colors">
                            <Search className="w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="text"
                                placeholder="FIND ENTITY..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none text-[11px] py-4 px-6 w-full tracking-[0.2em] font-bold focus:ring-0 uppercase text-[var(--text)]"
                            />
                        </div>
                    </div>

                    <div className="border border-[var(--border-strong)] bg-[var(--background)] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--surface)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest border-b border-[var(--border-strong)]">
                                    <th className="p-8">Entity Name</th>
                                    <th className="p-8">Communication</th>
                                    <th className="p-8">Sync Status</th>
                                    <th className="p-8 text-right">Overrides</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-strong)]">
                                {activeSession ? (
                                    filteredStudents.length > 0 ? filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-[var(--surface)] transition-colors group">
                                            <td className="p-8">
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-12 h-12 bg-[var(--surface-hover)] border border-[var(--border-strong)] flex items-center justify-center text-[11px] font-black group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-text)] group-hover:border-[var(--primary)] transition-all ${student.status === 'ABSENT' ? 'opacity-30' : ''}`}>
                                                        {student.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-xs font-bold tracking-widest text-[var(--text)] uppercase italic group-hover:text-[var(--primary)] transition-colors ${student.status === 'ABSENT' ? 'opacity-30' : ''}`}>{student.name}</span>
                                                        <span className="text-[9px] text-[var(--text-muted)] mt-1 tracking-widest uppercase font-black">ID_REF: {student.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8 text-[var(--text-muted)] font-mono text-[10px] tracking-widest uppercase group-hover:text-[var(--text)] transition-colors">
                                                {student.email}
                                            </td>
                                            <td className="p-8">
                                                <span className={`text-[9px] font-black tracking-[0.2em] px-4 py-1.5 border transition-all duration-500 ${student.status === 'PRESENT'
                                                    ? 'border-[var(--primary)] text-[var(--primary)] shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]'
                                                    : 'border-red-900 text-red-500 bg-red-950/20 grayscale-0 opacity-100'
                                                    }`}>
                                                    {student.status || 'OFFLINE'}
                                                </span>
                                            </td>
                                            <td className="p-8 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                                        className={`p-2.5 border transition-colors ${student.status === 'PRESENT' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-[var(--border-strong)] text-[var(--text-muted)] hover:border-[var(--primary)]'}`}
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                                        className={`p-2.5 border transition-colors ${student.status === 'ABSENT' ? 'border-red-500 text-red-500' : 'border-[var(--border-strong)] text-[var(--text-muted)] hover:border-red-500'}`}
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="p-20 text-center opacity-30 italic text-xs tracking-widest grayscale font-black uppercase">
                                                No active student telemetry detected for this cluster.
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-32 text-center group">
                                            <div className="flex flex-col items-center gap-6">
                                                <Activity className="w-12 h-12 text-[var(--border-strong)] animate-pulse" />
                                                <p className="text-[10px] font-black tracking-[0.5em] text-[var(--text-muted)] uppercase">
                                                    NETWORK_IDLE :: Standing by for scheduled seance
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {activeSession && (
                        <div className="text-center pt-8 border-t border-[var(--border-strong)] border-dashed mt-12">
                            <p className="text-[10px] font-black tracking-[0.5em] text-[var(--text-muted)] hover:text-[var(--primary)] cursor-pointer transition-colors uppercase">
                                Access Full Manifest :: 001-FF Registry
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {isConfirming && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-[var(--background)] border border-[var(--border-strong)] w-full max-w-2xl p-16 space-y-12 relative overflow-hidden group">
                        {/* Decorative Background Element */}
                        <div className="absolute -right-24 -top-24 w-64 h-64 bg-[var(--primary)] opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.05] transition-opacity duration-1000"></div>

                        <div className="flex items-center gap-8 border-b border-[var(--border-strong)] pb-12 relative z-10">
                            <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 animate-pulse">
                                <AlertTriangle className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[var(--text-muted)] text-[10px] tracking-[0.5em] font-black uppercase">Official Confirmation Required</p>
                                <h2 className="text-5xl font-black tracking-tighter text-[var(--text)] uppercase italic">Confirm Cluster?</h2>
                            </div>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <p className="text-[var(--text-muted)] text-xs font-bold leading-relaxed tracking-widest uppercase italic border-l-2 border-[var(--primary)] pl-8">
                                By proceeding, you verify that the current <span className="text-[var(--primary)] font-black">Node Manifest</span> accurately represents the attendance status (Presence/Absence) for squadron <span className="text-[var(--primary)] font-black">{activeSession?.class}</span>. This action will archive an official registry entry for the <span className="text-[var(--primary)] font-black">{activeSession?.subject}</span> deployment.
                            </p>

                            <div className="grid grid-cols-2 gap-8 text-center pt-8 border-t border-[var(--border-strong)]">
                                <div className="space-y-2">
                                    <p className="text-[var(--text-muted)] text-[9px] font-black tracking-widest uppercase italic">Present Nodes</p>
                                    <p className="text-4xl font-black text-[var(--primary)]">{stats.present}</p>
                                </div>
                                <div className="space-y-2 border-l border-[var(--border-strong)]">
                                    <p className="text-[var(--text-muted)] text-[9px] font-black tracking-widest uppercase italic">Void State</p>
                                    <p className="text-4xl font-black text-red-500">{stats.absent}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-12 relative z-10">
                            <button
                                onClick={() => setIsConfirming(false)}
                                className="flex-1 py-6 border border-[var(--border-strong)] text-[11px] font-black tracking-[0.4em] uppercase text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-all"
                            >
                                ABORT_SYSTEM
                            </button>
                            <button
                                onClick={handleSubmitReport}
                                disabled={submitting}
                                className="flex-1 py-6 bg-[var(--primary)] text-[var(--background)] text-[11px] font-black tracking-[0.4em] uppercase hover:opacity-90 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                            >
                                {submitting ? 'SYNCHRONIZING...' : (
                                    <>
                                        VERIFY_CLUSTERS
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Background Code Decor */}
                        <div className="absolute bottom-4 right-8 font-mono text-[8px] text-[var(--border-strong)] opacity-20 hidden md:block select-none">
                            ARCHIVE_SEQ_00{Date.now().toString().slice(-4)} // CONFIRMED_BY_{user?.name?.toUpperCase()?.replace(' ', '_')}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormateurDashboard;
