import React, { useEffect, useState, useRef } from 'react';
import { Shield, Camera, Cpu, Zap, X, Check, Search, AlertCircle, CheckCircle, Smartphone } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useTranslation } from 'react-i18next';

const Scanner = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [searchParams] = useSearchParams();
    const groupId = searchParams.get('groupId');
    const subject = searchParams.get('subject');
    const room = searchParams.get('room');
    const formateurName = searchParams.get('formateurName');
    const sessionTime = searchParams.get('time');

    const [activeStudents, setActiveStudents] = useState([]);
    const [checkedInIds, setCheckedInIds] = useState([]);
    const [lastScan, setLastScan] = useState(null);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const prevCheckinsRef = useRef([]);

    // 1. Sync Checkins
    useEffect(() => {
        if (!groupId) return;

        const syncCheckins = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const checkinRes = await axios.get(`/api/formateur/active-checkins/${groupId}`, config);
                
                // The API returns [{ student_id, status }]. We need an array of string IDs for 'PRESENT' students.
                const currentIds = (checkinRes.data.checkins || [])
                    .filter(c => c.status === 'PRESENT' || c.status === undefined)
                    .map(c => c.student_id !== undefined ? c.student_id : c);

                if (currentIds.length > prevCheckinsRef.current.length) {
                    const newId = currentIds.find(id => !prevCheckinsRef.current.includes(id));
                    const student = activeStudents.find(s => s.id === newId);

                    if (student) {
                        setLastScan({
                            name: student.name,
                            alreadyScanned: false,
                            time: new Date().toLocaleTimeString(),
                            success: true
                        });
                        setTimeout(() => setLastScan(null), 3500);
                    }
                }

                setCheckedInIds(currentIds);
                prevCheckinsRef.current = currentIds;
            } catch (err) {
                console.error("Signal Sync Failure:", err);
            }
        };

        const interval = setInterval(syncCheckins, 1500);
        return () => clearInterval(interval);
    }, [groupId, activeStudents]);

    // 2. Start HTML5 QR Scanner
    useEffect(() => {
        let scanner = null;
        let isInstanceMounted = true;

        if (groupId) {
            scanner = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );

            scanner.render(async (decodedText) => {
                // on scan success
                if (submitting) return; // Ignore scans while submitting report
                
                try {
                    const token = localStorage.getItem('token');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    
                    const res = await axios.post('/api/formateur/process-checkin-qr', { 
                        qrContent: decodedText, 
                        groupId 
                    }, config);

                    if (isInstanceMounted) {
                        setLastScan({
                            name: res.data.name || decodedText,
                            alreadyScanned: false,
                            time: new Date().toLocaleTimeString(),
                            success: true
                        });
                        setTimeout(() => setLastScan(null), 3500);
                        addNotification(t('scanner.success_msg', 'QR Code scanné avec succès'), 'success');
                    }
                } catch (err) {
                    if (err.response?.status === 403 || err.response?.status === 404) {
                        addNotification(err.response?.data?.message || 'Erreur lors du scan', 'error');
                    }
                }
            }, (errorMessage) => {
                // Ignore general scan errors (happens every frame when no QR is visible)
            });
        }

        return () => {
            isInstanceMounted = false;
            if (scanner) {
                scanner.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
            }
        };
    }, [groupId]);

    // 3. Initial Data
    useEffect(() => {
        const fetchMainData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`/api/formateur/users/by-group/${groupId}`, config);
                setActiveStudents(res.data.users || []);
            } catch (err) {
                console.error("Manifest Load Error:", err);
            }
        };
        if (groupId) fetchMainData();
    }, [groupId]);

    const handleExit = () => {
        navigate('/formateur');
    };

    const handleConfirm = async () => {
        if (submitting) return;
        setLastScan(null);
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const reportData = {
                report_code: `REP-${groupId}-${new Date().toISOString().split('T')[0]}-${Date.now().toString().slice(-4)}`,
                group_id: groupId,
                date: new Date().toISOString().split('T')[0],
                subject: decodeURIComponent(subject || 'COURS'),
                heure: sessionTime || new Date().toLocaleTimeString(),
                stagiaires: activeStudents.map(s => ({
                    id: s.id,
                    status: checkedInIds.includes(s.id) ? 'PRESENT' : 'ABSENT'
                })),
                signature: "SCANNER_AUTO_ISTA"
            };

            await axios.post('/api/formateur/submit-report', reportData, config);

            addNotification(t('scanner.success_msg'), 'success');
            navigate(`/formateur?selectedGroup=${groupId}`);
        } catch (err) {
            console.error("Submission error:", err);
            addNotification(t('scanner.save_error'), "error");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleManualStatus = async (studentId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'PRESENT' ? 'ABSENT' : 'PRESENT';
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            await axios.post('/api/formateur/active-checkins/update', {
                studentId,
                groupId,
                status: newStatus
            }, config);

            // Optimistically update
            if (newStatus === 'PRESENT') {
                setCheckedInIds(prev => {
                    if (!prev.includes(studentId)) return [...prev, studentId];
                    return prev;
                });
            } else {
                setCheckedInIds(prev => prev.filter(id => id !== studentId));
            }
        } catch (err) {
            console.error("Manual toggle failed:", err);
            addNotification("Erreur lors de la mise à jour", "error");
        }
    };

    const checkedInStudents = activeStudents.filter(s => checkedInIds.includes(s.id));

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4 lg:p-8 font-sans overflow-hidden transition-all duration-500">
            <div className="w-full max-w-6xl relative fade-up">
                <div className="relative bg-white border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl">

                    {/* Header Bar */}
                    <div className="bg-gradient-to-r from-[var(--secondary)] to-[#003d6b] px-10 py-8 flex items-center justify-between text-white">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-[10px] font-black tracking-widest text-white/60 uppercase leading-none mb-1">{t('scanner.digital_tag')}</h2>
                                <h1 className="text-2xl font-black tracking-tight uppercase italic leading-none">{t('scanner.title')}</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleExit}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10"
                                title={t('scanner.exit_tooltip')}
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={submitting}
                                className="flex items-center gap-3 px-8 py-3 bg-[var(--primary)] text-white font-black text-xs tracking-widest uppercase hover:bg-green-700 transition-all rounded-xl shadow-lg disabled:opacity-50"
                            >
                                <Check className="w-4 h-4" />
                                <span>{submitting ? t('scanner.validating') : t('scanner.finish_button')}</span>
                            </button>
                        </div>
                    </div>

                    {/* Info Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-50 border-b border-[var(--border)]">
                        <div className="p-6 border-r border-[var(--border)] flex flex-col gap-1">
                            <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">{t('scanner.group_label')}</span>
                            <span className="text-sm font-black text-[var(--secondary)] uppercase italic">{groupId || '---'}</span>
                        </div>
                        <div className="p-6 border-r border-[var(--border)] flex flex-col gap-1">
                            <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">{t('scanner.session_label')}</span>
                            <span className="text-sm font-black text-[var(--primary)] uppercase italic truncate">{decodeURIComponent(subject || 'COURS')}</span>
                        </div>
                        <div className="p-6 border-r border-[var(--border)] flex flex-col gap-1">
                            <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">{t('scanner.attendance_label')}</span>
                            <span className="text-sm font-black text-[var(--secondary)] italic">{checkedInIds.length} / {activeStudents.length}</span>
                        </div>
                        <div className="p-6 flex flex-col gap-1">
                            <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">STATUT</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></div>
                                <span className="text-sm font-black text-[var(--primary)] uppercase italic">{t('dashboard.status_active')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Viewport Area */}
                    <div className="relative bg-slate-900 overflow-hidden flex flex-col items-center justify-center p-4 min-h-[400px]">
                        {error ? (
                            <div className="flex flex-col items-center gap-4 text-red-400">
                                <AlertCircle className="w-16 h-16 animate-pulse" />
                                <span className="text-xs font-black tracking-widest uppercase italic border border-red-400/30 px-6 py-2 rounded-lg">{t('scanner.offline')}</span>
                            </div>
                        ) : (
                            <>
                                <div id="qr-reader" className="w-full max-w-md mx-auto bg-black rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl"></div>

                                {/* Result Overlay */}
                                {lastScan && (
                                    <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-12 py-6 shadow-2xl border-2 flex items-center gap-6 animate-in slide-in-from-bottom-10 duration-500 rounded-3xl backdrop-blur-xl z-50 ${!lastScan.success ? 'bg-red-500/90 border-red-400' :
                                        lastScan.alreadyScanned ? 'bg-amber-500/90 border-amber-400' : 'bg-green-500/90 border-green-400'
                                        }`}>
                                        <div className="bg-white rounded-full p-2">
                                            {!lastScan.success ? (
                                                <AlertCircle className="w-8 h-8 text-red-500" />
                                            ) : lastScan.alreadyScanned ? (
                                                <AlertCircle className="w-8 h-8 text-amber-500" />
                                            ) : (
                                                <CheckCircle className="w-8 h-8 text-green-500" />
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">
                                                {!lastScan.success ? t('scanner.error_label') : lastScan.alreadyScanned ? t('scanner.already_scanned') : t('dashboard.present')}
                                            </span>
                                            <span className="text-[12px] font-bold text-white/80 uppercase tracking-widest mt-1">
                                                {lastScan.name}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Detailed Students Table */}
                    <div className="bg-white border-t border-[var(--border)]">
                        <div className="px-8 py-4 bg-slate-50 border-b border-[var(--border)] flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Liste des Stagiaires ({checkedInStudents.length} / {activeStudents.length} Présents)</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {activeStudents.length === 0 ? (
                                <div className="text-center text-slate-400 py-6 text-sm italic">{t('scanner.no_scans', 'Aucun étudiant trouvé...')}</div>
                            ) : (
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 sticky top-0 border-b border-[var(--border)] z-10">
                                        <tr>
                                            <th className="px-6 py-3 font-bold">NOM</th>
                                            <th className="px-6 py-3 font-bold">Email / ID</th>
                                            <th className="px-6 py-3 font-bold text-center">État</th>
                                            <th className="px-6 py-3 font-bold text-center">ACTIONS MANUELLES</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {activeStudents.map(student => {
                                            const isPresent = checkedInIds.includes(student.id);
                                            return (
                                                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-3 font-bold text-slate-800">{student.name}</td>
                                                    <td className="px-6 py-3 text-slate-500 text-xs">{student.id}</td>
                                                    <td className="px-6 py-3 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest ${isPresent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {isPresent ? 'PRÉSENT' : 'ABSENT'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-center">
                                                        <button 
                                                            onClick={() => toggleManualStatus(student.id, isPresent ? 'PRESENT' : 'ABSENT')}
                                                            disabled={submitting}
                                                            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${isPresent ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'}`}
                                                        >
                                                            {isPresent ? 'Marquer Absent' : 'Marquer Présent'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="px-8 py-4 bg-slate-50 border-t border-[var(--border)] flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{t('scanner.server_status')}</span>
                            </div>
                            <div className="hidden md:flex items-center gap-3 pl-8 border-l border-[var(--border)]">
                                <Smartphone className="w-4 h-4 text-[var(--text-muted)]" />
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{t('scanner.interface_tag')}</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest italic">{t('scanner.campus')}</div>
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-center opacity-40">
                    <p className="text-[10px] font-black text-[var(--secondary)] tracking-[0.4em] uppercase">
                        {t('scanner.automated')}
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 10%; opacity: 0; }
                    20% { opacity: 0.8; }
                    80% { opacity: 0.8; }
                    100% { top: 90%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                .fade-up {
                    opacity: 0;
                    transform: translateY(30px);
                    animation: fadeUp 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }
                @keyframes fadeUp {
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Scanner;
