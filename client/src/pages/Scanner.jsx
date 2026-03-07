import React, { useEffect, useState, useRef } from 'react';
import { Shield, Camera, Cpu, Zap, X, Check, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

const Scanner = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [searchParams] = useSearchParams();
    const classId = searchParams.get('classId');
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

    // 1. Database Feed Polling (Signal Synchronization)
    useEffect(() => {
        if (!classId) return;

        const syncCheckins = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Fetch latest checkins from database
                const checkinRes = await axios.get(`/api/formateur/active-checkins/${classId}`, config);
                const currentIds = checkinRes.data.checkins || [];

                // Detect New Checkins (Trigger Popups)
                if (currentIds.length > prevCheckinsRef.current.length) {
                    const newId = currentIds.find(id => !prevCheckinsRef.current.includes(id));
                    const student = activeStudents.find(s => s.id === newId);

                    if (student) {
                        console.log(`[UI_FEED]: Node ${student.name} synchronized.`);
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

        // Faster polling for real-time feel with external scanner
        const interval = setInterval(syncCheckins, 1500);
        return () => clearInterval(interval);
    }, [classId, activeStudents]);

    // 2. Start External Python Bridge
    useEffect(() => {
        let isInstanceMounted = true;
        const startBridge = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Call backend to spawn scaning_qr.py
                await axios.post('/api/formateur/start-external-scanner', { classId }, config);
                console.log("[BRIDGE]: Neural scanner activated.");
            } catch (err) {
                if (isInstanceMounted) setError("EXTERNAL_BRIDGE_OFFLINE");
            }
        };

        if (classId) startBridge();

        return () => {
            isInstanceMounted = false;
            // Send shutdown signal to python bridge
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            axios.post('/api/formateur/stop-external-scanner', { classId }, config)
                .catch(e => console.error("Bridge Shutdown Error:", e));
        };
    }, [classId]);

    // 1. Initial Data Fetch
    useEffect(() => {
        const fetchMainData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`/api/formateur/users/by-class/${classId}`, config);
                setActiveStudents(res.data.users || []);
            } catch (err) {
                console.error("Manifest Load Error:", err);
            }
        };
        if (classId) fetchMainData();
    }, [classId]);

    const handleQRScan = async (qrContent) => {
        if (lastScan) return; // Wait for current feedback to clear

        try {
            // locally parse name to check if already scanned
            const parts = qrContent.split('|');
            const namePart = parts.find(p => p.startsWith('NAME:'));
            const groupPart = parts.find(p => p.startsWith('GROUP:'));
            const name = namePart ? namePart.split(':')[1] : "Unknown";
            const group = groupPart ? groupPart.split(':')[1] : "";

            if (group !== classId) {
                setLastScan({ name: `WRONG CLASS: ${group}`, success: false, time: new Date().toLocaleTimeString() });
                setTimeout(() => setLastScan(null), 3000);
                return;
            }

            const student = activeStudents.find(s => s.name === name);
            if (student && checkedInIds.includes(student.id)) {
                setLastScan({
                    name: name,
                    alreadyScanned: true,
                    success: true,
                    time: new Date().toLocaleTimeString()
                });
                setTimeout(() => setLastScan(null), 3000);
                return;
            }

            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post('/api/formateur/process-checkin-qr', {
                qrContent,
                classId
            }, config);

            if (student) {
                setCheckedInIds(prev => [...new Set([...prev, student.id])]);
            }

            setLastScan({
                name: res.data.name,
                alreadyScanned: false,
                time: new Date().toLocaleTimeString(),
                success: true
            });

            setTimeout(() => setLastScan(null), 3500);
        } catch (err) {
            setLastScan({
                name: err.response?.data?.message || "Invalid Token",
                time: new Date().toLocaleTimeString(),
                success: false
            });
            setTimeout(() => setLastScan(null), 3000);
        }
    };

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
                signature: "DIGITAL_AUTH_SCANNER" // Auto-signed by scanner portal
            };

            await axios.post('/api/formateur/submit-report', reportData, config);

            // SHUTDOWN_BRIDGE: Ensure Python scanner process and camera windows are closed
            try {
                await axios.post('/api/formateur/stop-external-scanner', { classId }, config);
            } catch (stopErr) {
                console.warn("[BRIDGE_STOP_SILENT]:", stopErr.message);
            }

            addNotification('SYSC_SCAN_COMPLETE: SQUADRON MANIFEST SYNCHRONIZED AND ARCHIVED.', 'success');
            navigate(`/formateur?selectedClass=${classId}`);
        } catch (err) {
            console.error("Submission error:", err);
            addNotification("UPLOAD FAILURE: Neural Link Desynced.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 lg:p-12 font-sans overflow-hidden transition-colors duration-700">
            {/* Project Style Noise & Texture */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 brightness-50 contrast-150">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            <div className="w-full max-w-5xl relative fade-up">
                {/* Minimalist Border Accent */}
                <div className="absolute -inset-[1px] bg-[var(--border-strong)] opacity-20 rounded-2xl"></div>

                <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-3xl">

                    {/* Noir Header Bar */}
                    <div className="bg-[var(--surface-hover)] px-8 py-6 flex items-center justify-between border-b border-[var(--border)]">
                        <div className="flex items-center gap-4">
                            <div className="p-2 border border-[var(--border-strong)] bg-[var(--background)]">
                                <Shield className="w-4 h-4 text-[var(--primary)]" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-[10px] font-black tracking-[0.6em] text-[var(--text-muted)] uppercase leading-none">Official Digital Archive</h2>
                                <h1 className="text-xl font-black text-[var(--text)] tracking-tighter uppercase mt-1 italic">OFFICIAL_CLASSIFIED_DOSSIER</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-3">
                                <span className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)] ${error ? 'bg-red-500' : 'bg-[var(--primary)]'}`}></span>
                                <span className="text-[9px] font-bold text-[var(--text-muted)] tracking-widest uppercase">Encryption_Active</span>
                            </div>
                            <button
                                onClick={handleExit}
                                className="p-2 hover:bg-red-500 hover:text-white transition-all border border-[var(--border)] text-[var(--text-muted)]"
                                title="Close Session"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2 bg-[var(--primary)] text-[var(--primary-text)] font-black text-[10px] tracking-widest uppercase hover:opacity-90 transition-all border border-[var(--border-strong)] disabled:opacity-50"
                                title="Confirm Session"
                            >
                                <Check className="w-3 h-3" />
                                <span>{submitting ? 'SYNCING...' : 'YES'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[var(--border)] bg-[var(--background)]">
                        <div className="p-6 border-r border-[var(--border)] flex flex-col gap-1 hover:bg-[var(--surface-hover)] transition-colors">
                            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Protocol</span>
                            <span className="text-xs font-black text-[var(--text)] uppercase tracking-tighter italic">NEURAL_OPTIC_V2</span>
                        </div>
                        <div className="p-6 border-r border-[var(--border)] flex flex-col gap-1 hover:bg-[var(--surface-hover)] transition-colors">
                            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Cluster_ID</span>
                            <span className="text-xs font-black text-[var(--primary)] uppercase tracking-tighter italic">{classId || 'NULL_PTR'}</span>
                        </div>
                        <div className="p-6 border-r border-[var(--border)] flex flex-col gap-1 hover:bg-[var(--surface-hover)] transition-colors">
                            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Signal_Count</span>
                            <span className="text-xs font-black text-[var(--text)] uppercase tracking-tighter italic">{checkedInIds.length} / {activeStudents.length}</span>
                        </div>
                        <div className="p-6 flex flex-col gap-1 hover:bg-[var(--surface-hover)] transition-colors">
                            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Latency</span>
                            <span className="text-xs font-black text-[var(--text)] uppercase tracking-tighter italic">0.42ms</span>
                        </div>
                    </div>

                    {/* Python External Stream Indicator Area */}
                    <div className="aspect-video relative bg-[var(--background)] overflow-hidden flex items-center justify-center border-y border-[var(--border)]">
                        {error ? (
                            <div className="flex flex-col items-center gap-4 text-red-500 opacity-60">
                                <AlertCircle className="w-12 h-12 animate-pulse" />
                                <span className="text-[10px] font-black tracking-[0.6em] uppercase italic">BRIDGE_OFFLINE</span>
                            </div>
                        ) : (
                            <>
                                {/* Retro Placeholder for the CV2 window */}
                                <div className="flex flex-col items-center gap-8 opacity-40">
                                    <div className="relative">
                                        <Camera className="w-24 h-24 text-[var(--primary)] animate-pulse" strokeWidth={0.5} />
                                        <div className="absolute inset-0 border border-[var(--primary)] scale-150 opacity-20 animate-spin-slow"></div>
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-[10px] font-black text-[var(--primary)] tracking-[1em] uppercase animate-pulse">EXTERNAL_SCANNER_ACTIVE</span>
                                        <span className="text-[8px] font-medium text-[var(--text-muted)] tracking-[0.4em] uppercase">CHECK_CV2_WINDOW_ON_HOST</span>
                                    </div>
                                </div>

                                {/* HUD Viewport Brackets */}
                                <div className="absolute top-10 left-10 w-16 h-16 border-t border-l border-[var(--border-strong)] pointer-events-none opacity-40"></div>
                                <div className="absolute top-10 right-10 w-16 h-16 border-t border-r border-[var(--border-strong)] pointer-events-none opacity-40"></div>
                                <div className="absolute bottom-10 left-10 w-16 h-16 border-b border-l border-[var(--border-strong)] pointer-events-none opacity-40"></div>
                                <div className="absolute bottom-10 right-10 w-16 h-16 border-b border-r border-[var(--border-strong)] pointer-events-none opacity-40"></div>

                                {/* Scanning Line */}
                                <div className="absolute inset-x-20 top-0 h-[1px] bg-[var(--primary)] opacity-30 shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-scan z-20 pointer-events-none"></div>

                                {/* Scan Result Feedback */}
                                {lastScan && (
                                    <div className={`absolute bottom-20 left-1/2 -translate-x-1/2 px-10 py-5 shadow-2xl border flex items-center gap-6 animate-in slide-in-from-bottom-5 duration-500 rounded-xl ${!lastScan.success ? 'bg-red-50 border-red-200' :
                                        lastScan.alreadyScanned ? 'bg-orange-50 border-orange-200' : 'bg-white border-green-200'
                                        }`}>
                                        {!lastScan.success ? (
                                            <AlertCircle className="w-8 h-8 text-red-500" />
                                        ) : lastScan.alreadyScanned ? (
                                            <AlertCircle className="w-8 h-8 text-orange-500" />
                                        ) : (
                                            <CheckCircle className="w-8 h-8 text-green-500" />
                                        )}

                                        <div className="flex flex-col">
                                            <span className={`text-lg font-black tracking-widest uppercase italic ${!lastScan.success ? 'text-red-600' :
                                                lastScan.alreadyScanned ? 'text-orange-600' : 'text-green-600'
                                                }`}>
                                                {!lastScan.success ? 'ERROR' : lastScan.alreadyScanned ? 'ALREADY SCANNED' : 'PRESENT'}
                                            </span>
                                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-1">
                                                {lastScan.name}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Interface Elements */}
                                <div className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none">
                                    <span className="px-6 py-2 bg-[var(--background)]/40 backdrop-blur-xl border border-[var(--border)] text-[9px] font-black text-[var(--text)] tracking-[0.5em] uppercase italic">Visual_Stream_Active</span>
                                </div>

                                <div className="absolute bottom-10 right-10 flex flex-col items-end gap-3 translate-x-2 text-[var(--text-muted)] pointer-events-none">
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="w-0.5 h-4 bg-[var(--primary)] opacity-40 animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
                                        ))}
                                    </div>
                                    <span className="text-[8px] font-black tracking-[0.3em] uppercase">Buffer_0x4F_TX</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer System Status */}
                    <div className="px-8 py-5 bg-[var(--surface-hover)] border-t border-[var(--border)] flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <Zap className="w-3 h-3 text-[var(--primary)]" />
                                <span className="text-[9px] font-black text-[var(--text-muted)] tracking-widest uppercase italic">Core_Integrity_Stable</span>
                            </div>
                            <div className="hidden md:flex items-center gap-3 border-l border-[var(--border)] pl-8">
                                <Cpu className="w-3 h-3 text-[var(--text-muted)]" />
                                <span className="text-[9px] font-black text-[var(--text-muted)] tracking-widest uppercase italic">A-100_Processing</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 overflow-hidden">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className={`h-1 w-1 rounded-full bg-[var(--primary)] ${i > 10 ? 'opacity-10' : 'opacity-40 animate-pulse'}`} style={{ animationDelay: `${i * 50}ms` }}></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-[var(--border-strong)]"></div>
                        <span className="text-[10px] font-black text-[var(--text-muted)] tracking-[0.6em] uppercase italic">Secure_Cryptographic_Bridge</span>
                    </div>
                    <span className="text-[10px] font-black text-[var(--text-muted)] tracking-widest italic uppercase opacity-40">© 2026 ISTA MIRLEFT</span>
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
                    animation: scan 4s cubic-bezier(0.19, 1, 0.22, 1) infinite;
                }
                .fade-up {
                    opacity: 0;
                    transform: translateY(30px);
                    animation: fadeUp 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                    animation-delay: 0.2s;
                }
                #reader > div {
                    border: none !important;
                }
                #reader video {
                    object-fit: cover !important;
                }
            `}</style>
        </div>
    );
};

export default Scanner;
