import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, CheckCircle2, UserCheck, ShieldAlert, AlertCircle, ClipboardCheck, PenTool, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ClassDossierModal from '../components/ClassDossierModal';
import { useNavigate } from 'react-router-dom';

const Scanner = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const classId = searchParams.get('classId');
    const subject = searchParams.get('subject');
    const room = searchParams.get('room');
    const formateurName = searchParams.get('formateurName');
    const sessionTime = searchParams.get('time');

    // Core state
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [activeStudents, setActiveStudents] = useState([]);
    const [checkedInIds, setCheckedInIds] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    // Refs for stable callbacks
    const studentsRef = useRef(activeStudents);
    const checkedInRef = useRef(checkedInIds);

    useEffect(() => { studentsRef.current = activeStudents; }, [activeStudents]);
    useEffect(() => { checkedInRef.current = checkedInIds; }, [checkedInIds]);

    // Initialization & Data Fetching
    useEffect(() => {
        if (!classId) return;

        const fetchClassManifest = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`http://localhost:5000/api/formateur/users/by-class/${classId}`, config);
                setActiveStudents(res.data.users || []);

                // Also fetch active checkins to populate checkedInIds
                const checkinRes = await axios.get(`http://localhost:5000/api/formateur/active-checkins/${classId}`, config);
                setCheckedInIds(checkinRes.data.checkins || []);
            } catch (err) {
                console.error("Manifest Load Failure:", err);
            }
        };
        fetchClassManifest();
    }, [classId]);

    // Check-in Handler
    const handleCheckIn = useCallback(async (studentId, studentObj) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('http://localhost:5000/api/formateur/process-checkin', {
                studentId,
                classId: classId
            }, config);

            setCheckedInIds(prev => [...new Set([...prev, Number(studentId)])]);
        } catch (err) {
            console.error("Check-in failure:", err);
        }
    }, [classId]);

    const handleCheckOut = useCallback(async (studentId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Note: Add endpoint if needed for individual checkout, or just local state
            await axios.post('http://localhost:5000/api/formateur/clear-checkins', { classId, studentId }, config);
            setCheckedInIds(prev => prev.filter(id => id !== Number(studentId)));
        } catch (err) {
            console.error("Check-out failure:", err);
        }
    }, [classId]);

    const handleSubmitReport = async (signatureData) => {
        if (isSubmitting || !activeStudents.length) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const reportData = {
                report_code: `REP-${classId}-${new Date().toISOString().split('T')[0]}-${Date.now().toString().slice(-4)}`,
                class_id: classId,
                date: new Date().toISOString().split('T')[0],
                subject: decodeURIComponent(subject || 'UNSPECIFIED'),
                salle: decodeURIComponent(room || 'DYNAMIC'),
                heure: sessionTime || new Date().toLocaleTimeString(),
                stagiaires: activeStudents.map(s => ({
                    id: s.id,
                    status: checkedInIds.includes(s.id) ? 'PRESENT' : 'ABSENT'
                })),
                signature: signatureData
            };

            await axios.post('http://localhost:5000/api/formateur/submit-report', reportData, config);

            // Clear checkins
            try {
                await axios.post('http://localhost:5000/api/formateur/clear-checkins', { classId }, config);
            } catch (e) { }

            // Success state
            setStatus('success');
            setMessage('SESSION CLUSTER FINALIZED');
            setIsConfirming(false);

            setTimeout(() => {
                navigate('/formateur');
            }, 2000);
        } catch (err) {
            console.error("Report submission failed:", err);
            setStatus('error');
            setMessage('DEPLOYMENT FAILURE');
            setTimeout(() => setStatus('idle'), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Scanning hardware logic removed

    // ---------------------------------------------------------
    // RENDER FACTORIES
    // ---------------------------------------------------------

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col items-center p-8 overflow-y-auto font-sans text-[var(--text)] transition-colors duration-500">
            <div className="w-full max-w-5xl space-y-10 animate-in fade-in slide-in-from-bottom-5 relative pt-10">

                {/* Header Context */}
                <div className="flex justify-between items-end border-b border-[var(--border-strong)] pb-8">
                    <div className="flex flex-col">
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-[var(--text)] uppercase italic leading-none">
                            Session :: {classId || 'IDLE'}
                        </h1>
                        <div className="flex items-center gap-6 mt-4">
                            {subject && room && (
                                <p className="text-[var(--text-muted)] text-[10px] font-bold tracking-[0.2em] uppercase">
                                    {decodeURIComponent(subject)} @ {decodeURIComponent(room)}
                                </p>
                            )}
                            <button
                                onClick={async () => {
                                    if (!window.confirm("ARE YOU SURE YOU WANT TO RESET THIS SESSION'S ATTENDANCE? THIS WILL MARK ALL STUDENTS AS ABSENT.")) return;
                                    try {
                                        const token = localStorage.getItem('token');
                                        const config = { headers: { Authorization: `Bearer ${token}` } };
                                        await axios.post('http://localhost:5000/api/formateur/clear-checkins', { classId }, config);
                                        setCheckedInIds([]);
                                        setStatus('warning');
                                        setMessage('MATRIX_RESET_SUCCESSFUL');
                                        setTimeout(() => setStatus('idle'), 3000);
                                    } catch (err) {
                                        console.error("Reset Failure:", err);
                                    }
                                }}
                                className="text-[9px] font-black tracking-[0.2em] text-red-500 uppercase hover:text-white transition-colors border border-red-500/20 px-3 py-1 bg-red-500/5"
                            >
                                [RESET_SESSION]
                            </button>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase">Nodes in Cluster</p>
                        <p className="text-3xl font-black text-[var(--text)]">{activeStudents.length.toString().padStart(2, '0')}</p>
                    </div>
                </div>

                {/* Attendance Interface */}

                {/* Stagers Table List */}
                <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl overflow-hidden p-8 shadow-xl relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 blur-[120px] pointer-events-none"></div>

                    <h3 className="text-[10px] font-black tracking-[0.4em] text-[var(--text)] uppercase border-b border-[var(--border-strong)] pb-4 mb-6 flex items-center gap-3">
                        <UserCheck className="w-4 h-4 text-[var(--text)]" />
                        Squadron_Manifest
                    </h3>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                        {activeStudents.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-[var(--text-muted)] gap-4 opacity-50">
                                <ShieldAlert className="w-12 h-12" />
                                <span className="text-[10px] font-black tracking-widest uppercase">No Users Enrolled</span>
                            </div>
                        ) : (
                            activeStudents.map(s => {
                                const isScanned = checkedInIds.includes(s.id);
                                return (
                                    <div key={s.id} onClick={() => {
                                        if (isScanned) {
                                            handleCheckOut(s.id);
                                        } else {
                                            handleCheckIn(s.id);
                                        }
                                    }} className={`flex justify-between items-center p-4 rounded-xl cursor-pointer group transition-all duration-300 ${isScanned ? 'bg-[var(--primary)]/10 border border-[var(--primary)]/30' : 'bg-[var(--background)] border border-[var(--border-strong)] hover:border-[var(--primary)]/40'}`}>
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-full bg-[var(--surface-hover)] flex items-center justify-center border border-[var(--border)]">
                                                <span className={`text-lg font-black uppercase ${isScanned ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>{s.name.charAt(0)}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-black tracking-widest uppercase italic transition-colors ${isScanned ? 'text-[var(--primary)]' : 'text-[var(--text)] group-hover:text-[var(--primary)]'}`}>
                                                    {s.name}
                                                </span>
                                                <span className="text-[8px] font-bold text-[var(--text-muted)] mt-1 tracking-[0.2em]">ID_{s.id.toString().padStart(3, '0')}</span>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg text-[9px] font-black tracking-[0.2em] uppercase transition-all flex items-center gap-2 ${isScanned ? 'bg-[var(--primary)] text-[var(--primary-text)] shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'bg-red-500/10 text-red-500 border border-red-500/30'} `}>
                                            {isScanned ? (
                                                <><CheckCircle2 className="w-3 h-3" /> PRESENT</>
                                            ) : (
                                                <><AlertCircle className="w-3 h-3" /> ABSENT</>
                                            )}
                                        </div>

                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="mt-8 pt-8 border-t border-[var(--border-strong)] flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <PenTool className="w-4 h-4 text-[var(--text-muted)]" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest leading-none">Supervisor</span>
                                <span className="text-[12px] font-black text-[var(--text)] uppercase italic tracking-wider mt-1">{formateurName || 'Neural Node'}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsConfirming(true)}
                            disabled={isSubmitting || activeStudents.length === 0}
                            className="px-12 py-5 bg-[var(--primary)] text-[var(--primary-text)] border border-[var(--primary)] text-[10px] font-black tracking-[0.4em] hover:bg-[var(--surface)] hover:text-[var(--primary)] transition-all uppercase flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group w-full lg:w-auto"
                        >
                            <ClipboardCheck className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                            {isSubmitting ? 'SYNCING...' : 'Confirm Cluster'}
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center text-[var(--text-muted)] font-bold px-4 pt-10 pb-20 transition-colors">
                    <div className="flex items-center gap-4">
                        <ShieldAlert className="w-4 h-4" />
                        <span className="text-[9px] tracking-widest uppercase italic text-[var(--text-muted)]">Secure Cryptographic Bridge Active</span>
                    </div>
                    <button onClick={() => window.close()} className="flex items-center gap-3 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors group">
                        <span className="text-[9px] tracking-widest uppercase font-black">Deactivate Portal</span>
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                <ClassDossierModal
                    isOpen={isConfirming}
                    onClose={() => setIsConfirming(false)}
                    activeSession={{ class: classId, subject: decodeURIComponent(subject), room: decodeURIComponent(room) }}
                    students={activeStudents.map(s => ({ ...s, status: checkedInIds.includes(s.id) ? 'PRESENT' : 'ABSENT' }))}
                    stats={{
                        total: activeStudents.length,
                        present: checkedInIds.length,
                        absent: activeStudents.length - checkedInIds.length
                    }}
                    onConfirm={handleSubmitReport}
                    submitting={isSubmitting}
                />
            </div >

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 10px; }
            `}</style>

        </div >
    );
};

export default Scanner;
