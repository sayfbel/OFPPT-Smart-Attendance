import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, CheckCircle2, Camera, RefreshCw, Zap, UserCheck, ShieldAlert, Play, AlertCircle, ClipboardCheck, PenTool, Loader2, Scan, Contact } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import ClassDossierModal from '../components/ClassDossierModal';
import { useNavigate } from 'react-router-dom';

const Scanner = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const classId = searchParams.get('classId');
    const [mode, setMode] = useState(searchParams.get('mode') || 'scann');
    const subject = searchParams.get('subject');
    const room = searchParams.get('room');
    const formateurName = searchParams.get('formateurName');
    const sessionTime = searchParams.get('time');

    // Core state
    const [status, setStatus] = useState('idle'); // idle, scanning, success, error, warning
    const [message, setMessage] = useState('');
    const [activeStudents, setActiveStudents] = useState([]);
    const [currentEntity, setCurrentEntity] = useState(null);
    const [checkedInIds, setCheckedInIds] = useState([]);

    // Scanner Refs
    const scannerRef = useRef(null);
    const videoRef = useRef(null);
    const [camActive, setCamActive] = useState(false);

    // Face Recognition States
    const [faceModelsLoaded, setFaceModelsLoaded] = useState(false);
    const [scanState, setScanState] = useState('idle'); // 'idle', 'loading', 'scanning', 'success', 'error'
    const [scanMessageDetails, setScanMessageDetails] = useState('');
    const [globalFaceSignatures, setGlobalFaceSignatures] = useState([]);
    const [recognizedStudent, setRecognizedStudent] = useState(null);

    // Unused tracking parameters kept for compatibility if needed.
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    // Refs for stable callbacks & hardware safety
    const studentsRef = useRef(activeStudents);
    const checkedInRef = useRef(checkedInIds);
    const transitioningRef = useRef(false);

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

    // Removed the Live Presence Poll as it was overwriting purely manual UI toggles every 3 seconds

    // Check-in Handler
    const handleCheckIn = useCallback(async (studentId, methodLabel, studentObj) => {
        if (status === 'success') return; // Prevent overlapping authentications

        // Check if already checked in to show specific message
        if (checkedInIds.includes(Number(studentId))) {
            setStatus('warning');
            setMessage('Entity Already Synchronized');
            setTimeout(() => setStatus('idle'), 3000);
            return;
        }

        setStatus('scanning');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const res = await axios.post('http://localhost:5000/api/formateur/process-checkin', {
                studentId,
                classId: classId
            }, config);

            setCurrentEntity(studentObj || { name: res.data.name });
            setStatus('success');
            setMessage(methodLabel || 'Neural Identity Verified');

            // Force immediate UI update for manifest
            setCheckedInIds(prev => [...new Set([...prev, Number(studentId)])]);

            // Auto-reset for next scan
            setTimeout(() => {
                setStatus('idle');
                setCurrentEntity(null);
            }, 3000);

        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Neural Disconnect');
            setTimeout(() => setStatus('idle'), 3000);
        }
    }, [classId, status]);

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

    // ---------------------------------------------------------
    // HARDWARE MANAGEMENT (Unified QR/Face)
    // ---------------------------------------------------------
    useEffect(() => {
        if (!classId) return;

        const syncHardware = async () => {
            if (transitioningRef.current) return;
            transitioningRef.current = true;

            try {
                // 1. Cleanup existing hardware
                setScanState('idle');
                setCamActive(false);
                setRecognizedStudent(null);

                // Stop Webcam (Face)
                if (videoRef.current && videoRef.current.srcObject) {
                    const tracks = videoRef.current.srcObject.getTracks();
                    tracks.forEach(t => t.stop());
                    videoRef.current.srcObject = null;
                }

                // Stop Scanner (QR)
                if (scannerRef.current) {
                    try {
                        if (scannerRef.current.isScanning) {
                            await scannerRef.current.stop();
                        }
                    } catch (e) { }
                }

                // 2. Startup new hardware based on mode
                if (mode === 'card') {
                    if (!scannerRef.current) {
                        try {
                            scannerRef.current = new Html5Qrcode("reader");
                        } catch (e) {
                            // Element might not be in DOM yet, which is fine
                            return;
                        }
                    }
                    const html5QrCode = scannerRef.current;
                    const config = { fps: 24, qrbox: { width: 350, height: 350 }, aspectRatio: 1.0 };

                    await html5QrCode.start(
                        { facingMode: "user" },
                        config,
                        (result) => {
                            const idMatch = result.match(/STAGIAIRE_ID:(\d+)/);
                            if (idMatch) {
                                const sId = Number(idMatch[1]);
                                // Check if already scanned to avoid redundant API hits
                                if (checkedInRef.current.includes(sId)) {
                                    setStatus('warning');
                                    setMessage('Entity Already Synchronized');
                                    setTimeout(() => setStatus('idle'), 3000);
                                    return;
                                }

                                const found = studentsRef.current.find(s => s.id === sId);
                                handleCheckIn(sId, 'QR_LINK_ESTABLISHED', found);
                            }
                        },
                        () => { }
                    );
                } else {
                    // Face mode initializes manually via 'START SCANNING' btn
                }
            } catch (err) {
                console.error("Hardware Transition Failure:", err);
            } finally {
                transitioningRef.current = false;
            }
        };

        syncHardware();

        return () => {
            // Unmount cleanup
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(() => { });
            }
        };
    }, [classId, mode]); // Only re-run when mode or class changes.

    // Start Webcam Feed & Setup Face Models
    const startCamScan = async () => {
        setScanState('loading');
        setScanMessageDetails('INITIALIZING MODELS & SQUADRON SIGNATURES...');

        try {
            if (!faceModelsLoaded) {
                await faceapi.nets.tinyFaceDetector.loadFromUri('https://vladmandic.github.io/face-api/model/');
                await faceapi.nets.faceLandmark68Net.loadFromUri('https://vladmandic.github.io/face-api/model/');
                await faceapi.nets.faceRecognitionNet.loadFromUri('https://vladmandic.github.io/face-api/model/');

                // Fetch all students to cross-reference
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/formateur/all-students-faceids', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const allStudents = res.data.users;
                const signatures = [];
                for (const st of allStudents) {
                    if (st.face_id && st.face_id !== 'none') {
                        try {
                            let facePath = st.face_id;
                            try {
                                const parsed = JSON.parse(st.face_id);
                                facePath = parsed.front || parsed[0] || st.face_id;
                            } catch (e) { }

                            const imgUrl = facePath.startsWith('http')
                                ? facePath
                                : `http://localhost:5000${facePath.startsWith('/') ? facePath : '/uploads/faceids/' + facePath}`;

                            const img = await faceapi.fetchImage(imgUrl);
                            const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
                            if (detection) {
                                signatures.push({
                                    descriptor: detection.descriptor,
                                    id: st.id,
                                    name: st.name,
                                    class_id: st.class_id
                                });
                            }
                        } catch (e) { }
                    }
                }
                setGlobalFaceSignatures(signatures);
                setFaceModelsLoaded(true);
            }

            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCamActive(true);
            setScanState('scanning');
            setScanMessageDetails('SCANNING...');
        } catch (err) {
            console.error("Camera Access Denied:", err);
            setStatus('error');
            setScanState('error');
            setScanMessageDetails('OPTICAL HARDWARE LINK FAILED');
        }
    };

    // Main Scanning Loop
    useEffect(() => {
        if (camActive && scanState === 'scanning' && videoRef.current) {
            const intervalId = setInterval(async () => {
                if (videoRef.current && videoRef.current.readyState === 4) {
                    const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

                    if (!detection) {
                        setScanState('error');
                        setScanMessageDetails('No one in the screen');
                        return;
                    }

                    if (globalFaceSignatures.length > 0) {
                        let bestMatch = null;
                        let lowestDistance = 0.5; // Stricter threshold for error checking
                        for (const sig of globalFaceSignatures) {
                            const dist = faceapi.euclideanDistance(detection.descriptor, sig.descriptor);
                            if (dist < lowestDistance) {
                                lowestDistance = dist;
                                bestMatch = sig;
                            }
                        }

                        if (bestMatch) {
                            // We have a recognised face! Is it in this class?
                            if (bestMatch.class_id === classId) {
                                // NEW: Check if already present in this session
                                if (checkedInRef.current.includes(bestMatch.id)) {
                                    setScanState('warning');
                                    setRecognizedStudent(bestMatch);
                                    setScanMessageDetails(`STAGIAIRE ALREADY SCANNED: ${bestMatch.name}`);
                                    clearInterval(intervalId);

                                    setTimeout(() => {
                                        setScanState('scanning');
                                        setScanMessageDetails('SCANNING...');
                                        setRecognizedStudent(null);
                                    }, 3000);
                                    return;
                                }

                                // SECURE REGISTRY LOGGING
                                handleCheckIn(bestMatch.id, "NEURAL_IDENTITY_VERIFIED", bestMatch);
                                setScanState('success');
                                setRecognizedStudent(bestMatch);
                                setScanMessageDetails(`IDENTITY VERIFIED: ${bestMatch.name}`);
                                clearInterval(intervalId); // Stop scanning frame

                                // Auto-reset after a moment to allow scanning next person
                                setTimeout(() => {
                                    setScanState('scanning');
                                    setScanMessageDetails('SCANNING...');
                                    setRecognizedStudent(null);
                                }, 3000);
                            } else {
                                setScanState('error');
                                setScanMessageDetails(`This stagiaire is not in the class ${classId}`);
                            }
                        } else {
                            // Face detected but not in OFPPT database
                            setScanState('error');
                            setScanMessageDetails('This stagiaire have not in the Ofppt');
                        }
                    } else {
                        // DB empty, cannot match
                        setScanState('error');
                        setScanMessageDetails('No reference signatures found');
                    }
                }
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [camActive, scanState, globalFaceSignatures, classId, handleCheckIn, checkedInIds]);

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
                        {subject && room ? (
                            <p className="text-[var(--text-muted)] text-[10px] font-bold tracking-[0.3em] uppercase mt-4">
                                {decodeURIComponent(subject)} @ {decodeURIComponent(room)}
                            </p>
                        ) : (
                            <p className="text-[var(--text-muted)] text-[10px] font-bold tracking-[0.3em] uppercase mt-4">
                                Manual Session Overview
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase">Nodes in Cluster</p>
                        <p className="text-3xl font-black text-[var(--text)]">{activeStudents.length.toString().padStart(2, '0')}</p>
                    </div>
                </div>

                {/* Live Scanner Card (Visual Only) */}
                <div className="bg-[var(--surface)] border border-[var(--border-strong)] p-8 relative mb-10 w-full rounded-none fade-up hover:shadow-xl transition-shadow">
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[var(--primary)] -translate-x-2 -translate-y-2 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--primary)] translate-x-2 -translate-y-2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--primary)] -translate-x-2 translate-y-2 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[var(--primary)] translate-x-2 translate-y-2 pointer-events-none"></div>

                    <h3 className="text-[10px] font-black tracking-[0.4em] text-[var(--text)] uppercase border-b border-[var(--border-strong)] pb-4 mb-6 flex items-center gap-3">
                        <div className="flex items-center gap-2 mr-4">
                            <button
                                onClick={() => setMode('scann')}
                                className={`p-2 transition-all border ${mode === 'scann' ? 'bg-[var(--primary)] text-[var(--primary-text)] border-[var(--primary)]' : 'bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)]'}`}
                                title="Face Scan Mode"
                            >
                                <Scan className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => setMode('card')}
                                className={`p-2 transition-all border ${mode === 'card' ? 'bg-[var(--primary)] text-[var(--primary-text)] border-[var(--primary)]' : 'bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)]'}`}
                                title="Card Scan Mode"
                            >
                                <Contact className="w-3 h-3" />
                            </button>
                        </div>
                        <Camera className="w-4 h-4 text-[var(--text)]" />
                        Optical Matrix :: LIVE FEED
                    </h3>

                    <div className="relative overflow-hidden bg-[var(--background)] aspect-[16/9] md:aspect-[21/9] w-full border border-[var(--border-strong)] flex items-center justify-center">
                        {/* Inner Corner Accents */}
                        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[var(--primary)] z-10 pointer-events-none"></div>
                        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[var(--primary)] z-10 pointer-events-none"></div>
                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[var(--primary)] z-10 pointer-events-none"></div>
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[var(--primary)] z-10 pointer-events-none"></div>

                        {mode === 'card' && (
                            <div id="reader" className="w-full h-full object-cover"></div>
                        )}

                        {/* UI Overlays */}
                        {scanState === 'idle' && (
                            <button
                                onClick={startCamScan}
                                className="absolute z-20 px-8 py-4 bg-[var(--surface)] border border-[var(--text)] text-[var(--text)] text-[10px] font-black tracking-[0.4em] hover:bg-[var(--text)] hover:text-[var(--surface)] transition-all uppercase flex items-center justify-center gap-3 active:scale-95 group shadow-lg"
                            >
                                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                                START SCANNING
                            </button>
                        )}

                        {scanState === 'loading' && (
                            <div className="absolute z-20 flex flex-col items-center gap-4 text-[var(--text)]">
                                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                                <span className="text-[10px] font-black tracking-[0.4em] uppercase">{scanMessageDetails}</span>
                            </div>
                        )}

                        {scanState === 'success' && recognizedStudent && (
                            <div className="absolute inset-0 z-30 bg-[var(--surface)] flex flex-col items-center justify-center animate-in fade-in duration-300">
                                <div className="w-20 h-20 bg-[var(--primary)] rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[var(--primary)]/30 animate-in zoom-in spin-in-12">
                                    <CheckCircle2 className="w-10 h-10 text-[var(--primary-text)]" />
                                </div>
                                <h2 className="text-3xl font-black italic tracking-tighter text-[var(--text)] uppercase">{recognizedStudent.name}</h2>
                                <p className="text-[10px] font-bold text-[var(--text-muted)] tracking-[0.3em] uppercase mt-2">IDENTITY SECURED</p>
                            </div>
                        )}

                        {scanState === 'warning' && recognizedStudent && (
                            <div className="absolute inset-0 z-30 bg-amber-500/10 flex flex-col items-center justify-center animate-in fade-in duration-300">
                                <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-amber-500/30 animate-in zoom-in">
                                    <AlertCircle className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-black italic tracking-tighter text-amber-500 uppercase">{recognizedStudent.name}</h2>
                                <p className="text-[10px] font-bold text-amber-600 tracking-[0.3em] uppercase mt-2">ALREADY SCANNED</p>
                            </div>
                        )}

                        {scanState === 'error' && (
                            <div className="absolute inset-0 z-30 bg-[var(--background)]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in">
                                <div className="bg-[var(--surface)] border-2 border-red-500 p-8 flex flex-col items-center gap-6 shadow-2xl max-w-sm w-full fade-up">
                                    <div className="flex flex-col items-center gap-3 text-red-500">
                                        <AlertCircle className="w-12 h-12 flex-shrink-0 mb-2" />
                                        <span className="text-[12px] font-black tracking-widest uppercase text-center">{scanMessageDetails}</span>
                                    </div>
                                    <div className="flex w-full gap-3 mt-4">
                                        <button
                                            onClick={() => {
                                                setScanState('idle');
                                                setCamActive(false);
                                                if (videoRef.current && videoRef.current.srcObject) {
                                                    const tracks = videoRef.current.srcObject.getTracks();
                                                    tracks.forEach(track => track.stop());
                                                }
                                            }}
                                            className="flex-1 px-4 py-4 bg-[var(--surface-hover)] text-[var(--text-muted)] border border-[var(--border)] text-[10px] font-black tracking-[0.2em] hover:bg-[var(--surface)] transition-all uppercase flex items-center justify-center gap-2 active:scale-95 group"
                                        >
                                            <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            STOP
                                        </button>

                                        <button
                                            onClick={() => {
                                                setScanState('scanning');
                                                setScanMessageDetails('SCANNING...');
                                            }}
                                            className="flex-[2] px-6 py-4 bg-red-600 border border-red-600 text-white text-[10px] font-black tracking-[0.2em] hover:bg-red-700 hover:border-red-700 transition-all uppercase flex items-center justify-center gap-2 active:scale-95 shadow-lg group"
                                        >
                                            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                            CONTINUE SCANNING
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Scanning Animation */}
                        {mode === 'scann' && scanState === 'scanning' && camActive && (
                            <div className="scan-line-light"></div>
                        )}

                        {mode === 'scann' && (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover transition-all duration-700 opacity-100 scale-100 ${(!camActive || scanState === 'success') ? 'hidden' : 'block'}`}
                            />
                        )}
                    </div>
                </div>

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
                                            setCheckedInIds(prev => prev.filter(id => id !== s.id));
                                        } else {
                                            setCheckedInIds(prev => [...prev, s.id]);
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
                                        <div className={`px-4 py-2 rounded-lg text-[9px] font-black tracking-[0.2em] uppercase transition-all flex items-center gap-2 ${isScanned ? 'bg-[var(--primary)] text-[var(--primary-text)]' : 'bg-[var(--surface-hover)] text-[var(--text-muted)]'} `}>
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
                
                @keyframes scanLineLight {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                
                .scan-line-light {
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: white;
                    box-shadow: 0 0 10px 3px rgba(255, 255, 255, 0.9), 0 0 20px 6px rgba(255, 255, 255, 0.5);
                    animation: scanLineLight 2.5s ease-in-out infinite alternate;
                    z-index: 25;
                }
            `}</style>
        </div >
    );
};

export default Scanner;
