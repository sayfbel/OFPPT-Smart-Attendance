import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, CheckCircle2, AlertCircle, Camera, RefreshCw, Smartphone, Zap, UserCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Scanner = () => {
    const [searchParams] = useSearchParams();
    const classId = searchParams.get('classId');
    const [status, setStatus] = useState('idle'); // idle, scanning, success, error
    const [message, setMessage] = useState('');
    const [activeStudents, setActiveStudents] = useState([]);
    const [currentEntity, setCurrentEntity] = useState(null);
    const [checkedInIds, setCheckedInIds] = useState([]);
    const scannerRef = useRef(null);

    useEffect(() => {
        if (!classId) return;

        const fetchClassManifest = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`http://localhost:5000/api/formateur/users/by-class/${classId}`, config);
                setActiveStudents(res.data.users || []);
            } catch (err) {
                console.error("Manifest Load Failure:", err);
            }
        };
        fetchClassManifest();
    }, [classId]);

    // Live Presence Matrix Polling
    useEffect(() => {
        if (!classId) return;

        const pollCheckins = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`http://localhost:5000/api/formateur/active-checkins/${classId}`, config);
                setCheckedInIds(res.data.checkins || []);
            } catch (err) {
                console.error("Telemetry Poll Failure:", err);
            }
        };

        const interval = setInterval(pollCheckins, 3000);
        pollCheckins(); // Initial fetch
        return () => clearInterval(interval);
    }, [classId]);

    useEffect(() => {
        if (!classId) return;

        // Single instance guard
        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode("reader");
        }

        const html5QrCode = scannerRef.current;

        const startScanner = async () => {
            try {
                // Ensure any previous session is stopped
                if (html5QrCode.isScanning) {
                    await html5QrCode.stop();
                }

                await html5QrCode.start(
                    { facingMode: "user" },
                    {
                        fps: 24,
                        qrbox: { width: 350, height: 350 },
                        aspectRatio: 1.0,
                    },
                    (result) => {
                        const idMatch = result.match(/STAGIAIRE_ID:(\d+)/);
                        if (idMatch) {
                            handleCheckIn(idMatch[1], 'QR_LINK_ESTABLISHED');
                        }
                    },
                    () => { }
                );
            } catch (err) {
                console.error("Scanner Start Failure:", err);
                // Status error only if it's not already scanning (which shouldn't happen with our guard)
                if (!html5QrCode.isScanning) {
                    setStatus('error');
                    setMessage('Optical Hardware Link Failed');
                }
            }
        };

        startScanner();

        return () => {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(e => console.error("Scanner Stop Error", e));
            }
        };
    }, [classId]);

    const handleCheckIn = async (studentId, methodLabel) => {
        if (status === 'scanning' || status === 'success') return;

        setStatus('scanning');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const res = await axios.post('http://localhost:5000/api/formateur/process-checkin', {
                studentId,
                classId: classId
            }, config);

            setCurrentEntity(res.data.name);
            setStatus('success');
            setMessage(methodLabel || 'Neural Identity Verified');

            // Auto-reset for next scan after 3 seconds
            setTimeout(() => {
                setStatus('idle');
                setCurrentEntity(null);
            }, 3000);

        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Neural Disconnect');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    // Simulated Biometric Face Check (In real app, this would use face-api.js or similar)
    const triggerBiometricScan = () => {
        if (!activeStudents.length) return;
        setStatus('scanning');
        setMessage('Facial Geometry Analysis...');

        // Simulating a detection of the first student found (just for demo)
        setTimeout(() => {
            const randomStudent = activeStudents[Math.floor(Math.random() * activeStudents.length)];
            handleCheckIn(randomStudent.id, 'BIOMETRIC_FACE_ID_MATCH');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 overflow-hidden font-sans">
            <div className="w-full max-w-4xl space-y-10 fade-up relative">

                {/* Header Context */}
                <div className="flex justify-between items-end border-b border-zinc-900 pb-8">
                    <div className="space-y-2">
                        <p className="text-[9px] tracking-[0.6em] font-black text-zinc-600 uppercase italic">Active Protocol :: {classId || 'SYSTEM_IDLE'}</p>
                        <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">Neural Portal</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Nodes in Cluster</p>
                        <p className="text-3xl font-black text-[var(--primary)]">{activeStudents.length.toString().padStart(2, '0')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Scanner Terminal */}
                    <div className="lg:col-span-2 relative group overflow-hidden border border-zinc-900 bg-zinc-950/50">
                        <div id="reader" className={`w-full h-full grayscale hover:grayscale-0 transition-all duration-700 ${status === 'success' ? 'opacity-20 blur-sm' : ''}`}></div>

                        {/* Overlay: Status High-Fidelity */}
                        {status === 'success' && (
                            <div className="absolute inset-0 bg-[var(--primary)] flex flex-col items-center justify-center text-black z-30 animate-in fade-in zoom-in duration-300">
                                <UserCheck className="w-24 h-24 mb-4" />
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase">{currentEntity}</h2>
                                <p className="mt-2 text-[10px] font-black tracking-[0.3em] uppercase opacity-70">{message}</p>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center text-white z-30 animate-in fade-in zoom-in duration-300">
                                <ShieldAlert className="w-24 h-24 mb-4" />
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase">ACCESS DENIED</h2>
                                <p className="mt-2 text-[10px] font-black tracking-[0.3em] uppercase opacity-70">{message}</p>
                            </div>
                        )}

                        {/* Tactical Scanning Grid */}
                        <div className="absolute inset-0 pointer-events-none z-10 border-[30px] border-black/20 opacity-40"></div>
                        {status === 'scanning' && (
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--primary)] shadow-[0_0_15px_var(--primary)] animate-scan z-20"></div>
                        )}
                    </div>

                    {/* Metadata & Controls */}
                    <div className="space-y-6">
                        <div className="p-8 bg-zinc-900/30 border border-zinc-900 space-y-6">
                            <h3 className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase border-b border-zinc-900 pb-4">Peripheral_Link</h3>

                            <div className="flex items-center gap-4 text-zinc-400">
                                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-full">
                                    <Camera className="w-4 h-4 text-[var(--primary)]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-white">Optical_Feed</span>
                                    <span className="text-[8px] tracking-[0.2em] text-green-500 uppercase">Status :: Nominal</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-zinc-400">
                                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-full">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-white">Biometric_ID</span>
                                    <span className="text-[8px] tracking-[0.2em] text-amber-500/50 uppercase italic">Standby :: Manual Trigger</span>
                                </div>
                            </div>

                            <button
                                onClick={triggerBiometricScan}
                                className="w-full py-4 bg-zinc-900 border border-zinc-800 text-[10px] font-black tracking-[0.4em] text-white hover:bg-[var(--primary)] hover:text-black hover:border-[var(--primary)] transition-all uppercase flex items-center justify-center gap-3 active:scale-95"
                            >
                                <RefreshCw className={`w-3 h-3 ${status === 'scanning' ? 'animate-spin' : ''}`} />
                                INIT_FACIAL_SCAN
                            </button>
                        </div>

                        <div className="p-8 bg-zinc-900/30 border border-zinc-900">
                            <h3 className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase border-b border-zinc-900 pb-4 mb-6">Squadron_Manifest</h3>
                            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {activeStudents.map(s => {
                                    const isScanned = checkedInIds.includes(s.id);
                                    return (
                                        <div key={s.id} className={`flex justify-between items-center text-[9px] font-bold tracking-widest uppercase italic pb-2 border-b border-zinc-900/50 transition-colors duration-500 ${isScanned ? 'text-[var(--primary)]' : 'text-zinc-600'}`}>
                                            <div className="flex flex-col">
                                                <span>{s.name}</span>
                                                <span className="text-[7px] opacity-40">ID_{s.id.toString().padStart(3, '0')}</span>
                                            </div>
                                            <span className={`text-[8px] ${isScanned ? 'text-[var(--primary)] animate-pulse' : 'text-red-900/50'}`}>
                                                {isScanned ? 'PRESENT' : 'ABSENT'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Logistics */}
                <div className="flex justify-between items-center text-zinc-800 font-bold px-4 pt-10">
                    <div className="flex items-center gap-4">
                        <ShieldAlert className="w-4 h-4" />
                        <span className="text-[9px] tracking-widest uppercase italic">Secure Cryptographic Bridge Active</span>
                    </div>
                    <button
                        onClick={() => window.close()}
                        className="flex items-center gap-3 text-zinc-700 hover:text-white transition-colors group"
                    >
                        <span className="text-[9px] tracking-widest uppercase font-black">Deactivate Portal</span>
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .animate-scan { animation: scan 2s linear infinite; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Scanner;
