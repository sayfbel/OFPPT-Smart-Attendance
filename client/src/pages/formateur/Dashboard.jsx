import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
    Zap,
    Scan,
    Contact,
    ChevronDown
} from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { Html5Qrcode } from 'html5-qrcode';
import ClassDossierModal from '../../components/ClassDossierModal';

const FormateurDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addNotification } = useNotification();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [schedule, setSchedule] = useState([]);
    const [classes, setClasses] = useState([]);
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
                const res = await axios.get('/api/formateur/schedule', config);
                const fetchedSchedule = res.data.schedule || [];
                setSchedule(fetchedSchedule);
                setClasses(res.data.classes || []);

                // Auto-select class from URL if present
                const selectedClassId = searchParams.get('selectedClass');
                if (selectedClassId) {
                    // We need to pass the schedule directly because state update is async
                    const session = fetchedSchedule.find(s => s.class === selectedClassId) || {
                        class: selectedClassId,
                        subject: 'NEURAL_SESSION',
                        room: 'LAB_DYNAMIC',
                        time: `${new Date().getHours()}:00 - ${new Date().getHours() + 2}:00`
                    };
                    setActiveSession({ ...session, class: selectedClassId });

                    // Fetch students for the class
                    const sRes = await axios.get(`/api/formateur/users/by-class/${selectedClassId}`, config);
                    setStudents((sRes.data.users || []).map(u => ({ ...u, status: 'ABSENT' })));
                }

            } catch (error) {
                console.error('Error fetching schedule data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchScheduleData();
    }, [searchParams]);

    const selectClass = (classId) => {
        if (!classId) {
            setActiveSession(null);
            setStudents([]);
            return;
        }

        // Try to find a scheduled session for this class to get more details
        const session = schedule.find(s => s.class === classId) || {
            class: classId,
            subject: 'NEURAL_SESSION',
            room: 'LAB_DYNAMIC',
            time: `${new Date().getHours()}:00 - ${new Date().getHours() + 2}:00`
        };

        setActiveSession({
            ...session,
            class: classId // ensure class property is correctly set
        });
        fetchStudents(classId);
    };

    const fetchStudents = async (classId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`/api/formateur/users/by-class/${classId}`, config);
            const fetchedUsers = res.data.users || [];
            // Initialize all as ABSENT by default
            setStudents(fetchedUsers.map(u => ({ ...u, status: 'ABSENT' })));

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
                const res = await axios.get(`/api/formateur/active-checkins/${activeSession.class}`, config);
                const checkedInIds = res.data.checkins || [];

                setStudents(prev => prev.map(s =>
                    checkedInIds.includes(s.id) ? { ...s, status: 'PRESENT' } : { ...s, status: 'ABSENT' }
                ));

            } catch (err) {
                console.error("Polling Error:", err);
            }
        };

        const interval = setInterval(pollCheckins, 1000);
        return () => clearInterval(interval);
    }, [activeSession]);

    const handleStatusChange = async (studentId, status) => {
        // Optimistic UI update
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('/api/formateur/update-checkin-status', {
                studentId,
                classId: activeSession.class,
                status
            }, config);
        } catch (error) {
            console.error('Manual Override Failed', error);
            // Optionally revert UI on error? But teacher might be frustrated. 
            // Better to show error.
            addNotification('Manual Sync Failed: Link Interrupted.', 'error');
        }
    };

    const handleSubmitReport = async (signatureData, meta = {}) => {
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
                heure: meta.startTime && meta.endTime ? `${meta.startTime} - ${meta.endTime}` : activeSession.time,
                stagiaires: students.map(s => ({ id: s.id, status: s.status })),
                signature: signatureData
            };

            await axios.post('/api/formateur/submit-report', reportData, config);

            // Clear active checkins after success
            try {
                await axios.post('/api/formateur/clear-checkins', { classId: activeSession.class }, config);
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
        return <div className="flex items-center justify-center h-screen bg-[var(--background)] text-[var(--text)] italic tracking-widest font-black uppercase text-xl">Synchronizing Neural Links...</div>;
    }

    return (
        <div className="relative">
            <div className={`space-y-16 fade-up ${isConfirming ? 'blur-sm scale-[0.99] pointer-events-none' : ''} transition-all duration-700`}>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--border-strong)] pb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <p className="text-[var(--text-muted)] text-[10px] tracking-[0.5em] font-black uppercase">
                                {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
                            </p>
                            <div className="px-3 py-1 bg-[var(--surface)] border border-[var(--border-strong)] flex items-center gap-2">
                                <Clock className="w-3 h-3 text-[var(--primary)]" />
                                <span className="text-[10px] font-bold text-[var(--primary)] tracking-widest">
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-7xl font-black tracking-tighter text-[var(--primary)] uppercase italic leading-none">
                                {activeSession ? `Session :: ${activeSession.class}` : `FORMATEUR : ${user?.name || 'NODE'}`}
                            </h1>
                            <p className="text-[var(--text-muted)] text-xs font-bold tracking-[0.3em] uppercase mt-4">
                                {activeSession ? `${activeSession.subject} @ ${activeSession.room}` : 'Awaiting tactical deployment. Manual selection required.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative" ref={selectRef}>
                            <button
                                onClick={() => setIsSelectOpen(!isSelectOpen)}
                                className={`bg-[var(--surface)] border ${isSelectOpen ? 'border-[var(--primary)] shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]' : 'border-[var(--border-strong)]'} text-[var(--primary)] px-6 py-4 text-[10px] font-black tracking-widest uppercase outline-none focus:border-[var(--primary)] transition-all cursor-pointer min-w-[260px] flex items-center justify-between group`}
                            >
                                <div className="flex items-center gap-3 truncate">
                                    <div className={`w-1 h-3 ${activeSession ? 'bg-[var(--primary)]' : 'bg-[var(--border-strong)]'} transition-colors`}></div>
                                    <span className="truncate">
                                        {activeSession ? `${activeSession.class} - SQUADRON` : 'SELECT_CLUSTER'}
                                    </span>
                                </div>
                                <ChevronDown className={`w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-transform duration-500 ${isSelectOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isSelectOpen && (
                                <div className="absolute top-[calc(100%+8px)] right-0 w-full bg-[var(--surface)] border border-[var(--border-strong)] z-50 shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200">
                                    <div
                                        onClick={() => { selectClass(''); setIsSelectOpen(false); }}
                                        className="px-6 py-4 text-[9px] font-black tracking-widest uppercase text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-red-500 cursor-pointer transition-all border-b border-[var(--border)] italic"
                                    >
                                        // RESET_TELEMETRY
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {classes.map(c => (
                                            <div
                                                key={c.id}
                                                onClick={() => { selectClass(c.id); setIsSelectOpen(false); }}
                                                className={`px-6 py-4 text-[10px] font-black tracking-widest uppercase cursor-pointer transition-all border-l-2 hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] ${activeSession?.class === c.id ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--surface-hover)]' : 'border-transparent text-[var(--text-muted)] hover:border-[var(--primary)]'}`}
                                            >
                                                <div className="flex flex-col">
                                                    <span>{c.id} - {c.title}</span>
                                                    <span className="text-[8px] opacity-40 mt-1 tracking-[0.2em]">{c.stream}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {activeSession && (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsConfirming(true)}
                                    className="btn-noir btn-outline px-8 py-3 group hover:border-[var(--primary)]"
                                >
                                    <ClipboardCheck className="w-3 h-3 mr-2 group-hover:text-[var(--primary-text)] transition-colors" />
                                    <span className="group-hover:text-[var(--primary-text)] transition-colors text-[10px]">Confirm Cluster</span>
                                </button>
                                <button
                                    className="btn-noir px-8 py-3 flex items-center justify-center"
                                    onClick={() => navigate(`/scanner?classId=${activeSession.class}&mode=scann&subject=${encodeURIComponent(activeSession.subject)}&room=${encodeURIComponent(activeSession.room)}&formateurName=${encodeURIComponent(user?.name)}&time=${activeSession.time}`)}
                                    title="Face Scan"
                                >
                                    <Scan className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
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

            {/* Class Dossier Modal (Confirm Cluster Replacement) */}
            <ClassDossierModal
                isOpen={isConfirming}
                onClose={() => setIsConfirming(false)}
                activeSession={activeSession}
                students={students}
                stats={stats}
                onConfirm={handleSubmitReport}
                submitting={submitting}
            />
        </div>
    );
};

export default FormateurDashboard;
