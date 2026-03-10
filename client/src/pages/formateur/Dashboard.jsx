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
    AlertCircle
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
                        subject: 'SÉANCE_EN_COURS',
                        room: 'SALLE_TP',
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
            subject: 'SÉANCE_EN_COURS',
            room: 'SALLE_TP',
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
            addNotification('Échec de la mise à jour manuelle.', 'error');
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

            addNotification(`Le rapport du groupe ${activeSession.class} a été archivé.`, 'success');
            setIsConfirming(false);
        } catch (error) {
            console.error('Submission failed', error);
            addNotification(error.response?.data?.message || 'Erreur lors de la soumission.', 'error');
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
        return <div className="flex items-center justify-center h-screen bg-[var(--background)] text-[var(--secondary)] font-bold italic tracking-widest uppercase animate-pulse">Initialisation du portail...</div>;
    }

    return (
        <div className="relative">
            <div className={`space-y-10 fade-up ${isConfirming ? 'blur-sm scale-[0.99] pointer-events-none' : ''} transition-all duration-500`}>
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[var(--border)] pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="bg-[var(--primary)] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                            <div className="flex items-center gap-2 text-[var(--text-muted)] font-bold text-[10px] tracking-widest bg-[var(--surface-hover)] px-3 py-1 rounded-full">
                                <Clock className="w-3 h-3 text-[var(--primary)]" />
                                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-6xl font-black tracking-tight text-[var(--secondary)] uppercase italic leading-[1.1]">
                                {activeSession ? `Séance : ${activeSession.class}` : `Bienvenue, Mr. ${user?.name}`}
                            </h1>
                            <div className="flex items-center gap-3 mt-4">
                                <p className="text-[var(--text-muted)] text-[11px] font-bold tracking-widest uppercase bg-white px-3 py-1.5 rounded-lg border border-[var(--border)] shadow-sm">
                                    {activeSession ? `${activeSession.subject} ᛫ Salle ${activeSession.room}` : 'Veuillez sélectionner un groupe pour commencer la séance.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative" ref={selectRef}>
                            <button
                                onClick={() => setIsSelectOpen(!isSelectOpen)}
                                className={`bg-white border rounded-xl ${isSelectOpen ? 'border-[var(--primary)] ring-4 ring-green-500/10' : 'border-[var(--border)]'} text-[var(--secondary)] px-6 py-4 text-[10px] font-black tracking-widest uppercase transition-all shadow-sm min-w-[280px] flex items-center justify-between group`}
                            >
                                <div className="flex items-center gap-3">
                                    <CalendarCheck className={`w-4 h-4 ${activeSession ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`} />
                                    <span>{activeSession ? `${activeSession.class}` : 'CHOISIR UN GROUPE'}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${isSelectOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isSelectOpen && (
                                <div className="absolute top-[calc(100%+8px)] right-0 w-full bg-white border border-[var(--border)] z-50 shadow-xl rounded-xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="max-h-[250px] overflow-y-auto">
                                        {classes.map(c => (
                                            <div
                                                key={c.id}
                                                onClick={() => { selectClass(c.id); setIsSelectOpen(false); }}
                                                className={`px-6 py-4 text-[10px] font-black tracking-widest uppercase cursor-pointer transition-all hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] ${activeSession?.class === c.id ? 'text-[var(--primary)] bg-green-50' : 'text-[var(--text-muted)]'}`}
                                            >
                                                <span>{c.id} - {c.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {activeSession && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsConfirming(true)}
                                    className="btn-ista btn-ista-outline px-6 py-4 flex items-center gap-2"
                                >
                                    <ClipboardCheck className="w-4 h-4" />
                                    <span className="text-[10px]">Valider la présence</span>
                                </button>
                                <button
                                    className="btn-ista px-6 py-4"
                                    onClick={() => navigate(`/scanner?classId=${activeSession.class}&mode=scann&subject=${encodeURIComponent(activeSession.subject)}&room=${encodeURIComponent(activeSession.room)}&formateurName=${encodeURIComponent(user?.name)}&time=${activeSession.time}`)}
                                    title="Lancer le Scanner"
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
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Stagiaires inscrits</p>
                    </div>
                    <div className="ista-card p-8 bg-white text-center shadow-sm border-b-4 border-b-[var(--primary)]">
                        <Activity className="w-6 h-6 text-[var(--primary)] mx-auto mb-3" />
                        <h2 className="text-4xl font-black text-[var(--primary)]">{stats.present.toString().padStart(2, '0')}</h2>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Présents</p>
                    </div>
                    <div className="ista-card p-8 bg-white text-center shadow-sm border-b-4 border-b-red-500">
                        <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-3" />
                        <h2 className="text-4xl font-black text-red-500">{stats.absent.toString().padStart(2, '0')}</h2>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Absents</p>
                    </div>
                </div>

                {/* List Section */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h3 className="text-xs font-black tracking-widest uppercase text-[var(--secondary)] flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></div>
                            Liste des Stagiaires
                        </h3>
                        <div className="flex items-center bg-white border border-[var(--border)] rounded-xl w-full md:w-80 px-4 group focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-green-500/5 transition-all shadow-sm">
                            <Search className="w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none text-[11px] py-4 px-4 w-full tracking-wider font-bold focus:ring-0 uppercase"
                            />
                        </div>
                    </div>

                    <div className="ista-panel overflow-hidden bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--surface-hover)] text-[var(--secondary)] text-[10px] font-black uppercase tracking-widest">
                                    <th className="p-6">Stagiaire</th>
                                    <th className="p-6">Email / Identifiant</th>
                                    <th className="p-6">Statut</th>
                                    <th className="p-6 text-right">Actions Manuelles</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {activeSession ? (
                                    filteredStudents.length > 0 ? filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-[var(--secondary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-sm ${student.status === 'ABSENT' ? 'opacity-50' : ''}`}>
                                                        {student.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-xs font-bold tracking-tight text-[var(--secondary)] uppercase ${student.status === 'ABSENT' ? 'opacity-40' : ''}`}>{student.name}</span>
                                                        <span className="text-[9px] text-[var(--text-muted)] font-mono">#{student.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-[var(--text-muted)] font-bold text-[10px] tracking-wider uppercase truncate max-w-[200px]">
                                                {student.email}
                                            </td>
                                            <td className="p-6">
                                                <span className={`badge ${student.status === 'PRESENT' ? 'badge-present' : 'badge-absent'}`}>
                                                    {student.status === 'PRESENT' ? 'PRÉSENT' : 'ABSENT'}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                                        className={`p-2 rounded-lg border transition-all ${student.status === 'PRESENT' ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]'}`}
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
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
                                                Aucun stagiaire trouvé dans ce groupe.
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Activity className="w-12 h-12 text-[var(--border)] animate-bounce" />
                                                <p className="text-[11px] font-black tracking-widest text-[var(--text-muted)] uppercase">
                                                    En attente de démarrage de séance
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

            {/* Class Dossier Modal */}
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
