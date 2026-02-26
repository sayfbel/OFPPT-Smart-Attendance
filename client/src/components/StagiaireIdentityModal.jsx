import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Download, Shield, Cpu, ExternalLink, QrCode, ChevronRight, Loader2, Scan, Camera, Zap } from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

const StagiaireIdentityModal = ({ isOpen, onClose, profile, onUpdate }) => {
    const cardRef = useRef(null);
    const videoRef = useRef(null);
    const { addNotification } = useNotification();
    const [isEngineReady, setIsEngineReady] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanLoading, setScanLoading] = useState(false);

    // Dynamic Engine Loader (Bypassing local install restrictions)
    useEffect(() => {
        if (!isOpen) return;

        const loadScript = (url) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        const initEngines = async () => {
            try {
                if (!window.html2canvas) {
                    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
                }
                if (!window.jspdf) {
                    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
                }
                setIsEngineReady(true);
            } catch (err) {
                console.error("Neural PDF Logic Failure:", err);
            }
        };

        initEngines();
    }, [isOpen]);

    if (!isOpen || !profile) return null;

    const handleStartScan = async () => {
        setIsScanning(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera Access Denied:", err);
            addNotification("Neural hardware link failed.", "error");
            setIsScanning(false);
        }
    };

    const stopScan = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsScanning(false);
    };

    const handleCapture = async () => {
        if (!videoRef.current) return;
        setScanLoading(true);

        try {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            const base64Image = canvas.toDataURL('image/jpeg', 0.8);

            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put('http://localhost:5000/api/stagiaire/profile', { image: base64Image }, config);

            addNotification("Biometric scan verified.", "success");
            onUpdate();
            stopScan();
        } catch (err) {
            console.error("Biometric Capture Failure:", err);
            addNotification("Sync failure during scan.", "error");
        } finally {
            setScanLoading(false);
        }
    };

    const handleExport = async () => {
        if (!isEngineReady || isExporting) return;

        setIsExporting(true);
        try {
            const card = cardRef.current;
            const canvas = await window.html2canvas(card, {
                scale: 3, // High resolution
                useCORS: true,
                backgroundColor: '#050505'
            });

            const imgData = canvas.toDataURL('image/png');

            // PDF Initialization (jspdf uses umd format in CDN)
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [158.6, 101.6] // ID Card proportions in mm
            });

            pdf.addImage(imgData, 'PNG', 0, 0, 158.6, 101.6);
            pdf.save(`IDENTITY_CARD_${profile.name.replace(/\s+/g, '_').toUpperCase()}.pdf`);
        } catch (error) {
            console.error("Export Protocol Failure:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`STAGIAIRE_ID:${profile.id}|EMAIL:${profile.email}|NAME:${profile.name}`)}`;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-[var(--background)] flex items-center justify-center p-4 sm:p-8 overflow-y-auto w-full h-full">
            <div className="bg-[var(--background)] w-full max-w-7xl flex flex-col md:flex-row relative fade-up my-auto h-[85vh] min-h-[700px]">

                {/* Tactical Brace Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[var(--primary)] -translate-x-4 -translate-y-4"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--primary)] translate-x-4 -translate-y-4"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--primary)] -translate-x-4 translate-y-4"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[var(--primary)] translate-x-4 translate-y-4"></div>

                {/* Info Panel Profile */}
                <div className="w-full md:w-[450px] border-r border-[var(--border-strong)] p-12 flex flex-col relative bg-[var(--surface)]/10">
                    <div className="mb-12">
                        <span className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-[var(--primary)] uppercase mb-4">
                            <div className="w-2 h-2 bg-[var(--primary)]"></div>
                            PERSONNEL DOSSIER
                        </span>
                        <h2 className="text-7xl font-black italic tracking-tighter text-[var(--primary)] leading-[0.9]">
                            ENTITY<br />MANIFEST
                        </h2>
                    </div>

                    <div className="space-y-6 mt-auto">
                        <div>
                            <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">SYSTEM_ID</label>
                            <div className="px-5 py-5 bg-[var(--background)] border border-[var(--border-strong)] flex items-center">
                                <span className="text-xl font-black italic text-[var(--primary)] tracking-tighter uppercase whitespace-nowrap">
                                    NODE_TAG :: #00{profile.id}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">CLASSIFICATION</label>
                            <div className="px-5 py-5 bg-[var(--background)] border border-[var(--border-strong)]">
                                <span className="text-sm font-black tracking-widest text-[var(--primary)] uppercase">
                                    {profile.class_id || 'SYSTEM_UNASSIGNED'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[8px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-3 text-left">OPERATIONAL_STATUS</label>
                            <div className="px-5 py-5 bg-[var(--background)] border border-[var(--border-strong)] flex items-center gap-3 text-[var(--primary)]">
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-xs font-black tracking-widest uppercase italic">ACTIVE_SIGNAL_STABLE</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 font-mono text-[8px] text-[var(--text-muted)] tracking-[0.2em] uppercase opacity-40 space-y-1 block text-left">
                        <p>DATA_LINK: ESTABLISHED</p>
                        <p>CLEARANCE: CADET_02</p>
                        <p>HQ: ANALYTICS_CORE</p>
                    </div>
                </div>

                {/* Visual Identity Section */}
                <div className="flex-1 p-16 flex flex-col relative overflow-y-auto items-center justify-center bg-[var(--background)]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-8 right-8 p-3 bg-[var(--surface)] border border-[var(--border-strong)] hover:border-[var(--primary)] transition-colors text-[var(--text-muted)] hover:text-[var(--primary)] z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="w-full max-w-xl mb-12">
                        <h3 className="text-3xl font-black italic tracking-tighter text-[var(--primary)] uppercase mb-3">
                            {isScanning ? 'INITIALIZING_NEURAL_SCAN' : 'IDENTITY CARD PREVIEW'}
                        </h3>
                        <p className="text-[10px] font-bold tracking-[0.3em] text-[var(--text-muted)] uppercase leading-relaxed">
                            {isScanning ? 'Maintain eye contact with the optical sensor. Verification required.' : 'Verified visual identification grid for external authentication protocols.'}
                        </p>
                    </div>

                    {isScanning ? (
                        /* SCANNING VIEWPORT */
                        <div className="w-full max-w-[500px] h-[320px] bg-black border-2 border-[var(--primary)] relative overflow-hidden group shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)] md:scale-110">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover grayscale brightness-125 contrast-125"
                            />
                            {/* Scanning Overlays */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary)] animate-scan shadow-[0_0_15px_var(--primary)]"></div>
                                <div className="absolute inset-0 border-[40px] border-black/40"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[var(--primary)]/30 rounded-full"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-[var(--primary)] border-dashed rounded-full animate-spin-slow"></div>
                            </div>
                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-[var(--primary)] animate-pulse"></div>
                                <span className="text-[8px] font-black tracking-widest text-[var(--primary)] uppercase">LIVE_FEED :: OPTICAL_MOD_01</span>
                            </div>
                        </div>
                    ) : (
                        /* IDENTITY CARD PREVIEW */
                        <div
                            ref={cardRef}
                            className="w-full max-w-[500px] h-[320px] bg-[#050505] border border-[var(--border-strong)] relative overflow-hidden group shadow-2xl scale-100 md:scale-110"
                        >
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)]"></div>
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent absolute top-1/3"></div>
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent absolute top-2/3"></div>
                            </div>

                            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--primary)] opacity-40"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--primary)] opacity-40"></div>

                            <div className="p-6 border-b border-[var(--border-strong)] flex justify-between items-start relative z-10">
                                <div className="space-y-1">
                                    <p className="text-[var(--primary)] text-[7px] font-black tracking-[0.5em] uppercase">Office de la Formation Professionnelle</p>
                                    <h3 className="text-white text-lg font-black italic tracking-tighter leading-none uppercase">Neural Identity Card</h3>
                                </div>
                                <Shield className="w-6 h-6 text-[var(--primary)] opacity-40" />
                            </div>

                            <div className="px-8 py-6 flex gap-8 relative z-10 h-[calc(100%-80px)]">
                                <div className="flex flex-col justify-between h-full py-2">
                                    <div className="w-28 h-28 bg-[var(--surface)] border border-[var(--border-strong)] flex items-center justify-center relative transition-colors overflow-hidden">
                                        {profile.image ? (
                                            <img src={profile.image} alt="Identity" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-4xl font-black text-[var(--primary)] italic">
                                                {profile.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-2 -right-2 bg-[var(--primary)] p-1 text-[var(--background)]">
                                            <Cpu className="w-3 h-3" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[var(--text-muted)] text-[6px] font-black tracking-[0.3em] uppercase">CREDENTIAL_STATUS</p>
                                        <p className="text-[var(--primary)] text-[9px] font-black tracking-widest uppercase italic border-l-2 border-[var(--primary)] pl-2">SECURE_ACTIVE</p>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col justify-between h-full py-2">
                                    <div className="space-y-1">
                                        <p className="text-[var(--text-muted)] text-[7px] font-black tracking-[0.3em] uppercase">Verified Name</p>
                                        <h4 className="text-2xl font-black italic text-white tracking-tighter uppercase leading-none">{profile.name}</h4>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 pt-4 border-t border-[var(--border-strong)]/40 w-full">
                                        <div>
                                            <p className="text-[var(--text-muted)] text-[6px] font-black tracking-[0.3em] uppercase mb-1">Squadron_Link</p>
                                            <p className="text-[11px] font-black text-white tracking-widest uppercase">{profile.class_id}</p>
                                        </div>
                                        <div>
                                            <p className="text-[var(--text-muted)] text-[6px] font-black tracking-[0.3em] uppercase mb-1">Comm_Registry</p>
                                            <p className="text-[11px] font-black text-white tracking-widest uppercase">SYSTM_REF_#00{profile.id}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-end items-center h-full pb-2">
                                    <div className="p-1.5 bg-white rounded-[2px] shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
                                        <img src={qrUrl} alt="Neural Link QR" className="w-[65px] h-[65px] block" />
                                    </div>
                                    <p className="text-[var(--text-muted)] font-mono text-[5px] tracking-[0.5em] uppercase mt-2">AUTH_LINKED</p>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--surface-hover)] to-[var(--primary)] opacity-50"></div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-20 w-full max-w-xl flex justify-end gap-6">
                        {isScanning ? (
                            <div className="flex gap-4">
                                <button
                                    onClick={stopScan}
                                    className="px-10 py-5 font-black tracking-[0.4em] text-[11px] bg-transparent text-red-500 border border-red-500/30 hover:bg-red-500/10 uppercase transition-all"
                                >
                                    ABORT_SCAN
                                </button>
                                <button
                                    onClick={handleCapture}
                                    disabled={scanLoading}
                                    className="px-14 py-5 font-black tracking-[0.4em] text-[11px] bg-[var(--primary)] text-[var(--background)] border border-[var(--primary)] hover:bg-white hover:text-black uppercase transition-all flex items-center gap-3"
                                >
                                    {scanLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                    {scanLoading ? 'ENCODING_BIOMETRICS...' : 'CAPTURE_SIGNATURE'}
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={handleStartScan}
                                    title="SCAN_FACIAL_BIOMETRICS"
                                    className="p-5 bg-transparent text-[var(--primary)] border border-[var(--primary)]/30 hover:border-[var(--primary)] transition-all flex items-center justify-center group"
                                >
                                    <Scan className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                                <button
                                    onClick={handleExport}
                                    disabled={!isEngineReady || isExporting}
                                    title="CONFIRM_EXPORT_REQUEST"
                                    className={`p-5 transition-all border border-[var(--primary)] flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] active:scale-95 disabled:opacity-50 ${isExporting ? 'bg-white text-black' : 'bg-[var(--primary)] text-[var(--background)] hover:bg-white hover:text-black'}`}
                                >
                                    {isExporting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Download className="w-5 h-5" />
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default StagiaireIdentityModal;
