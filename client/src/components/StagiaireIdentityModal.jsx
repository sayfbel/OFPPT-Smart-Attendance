import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { X, Download, Shield, Cpu, ExternalLink, QrCode, ChevronRight, Loader2, Scan, Camera, Zap, Check } from 'lucide-react';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal';
import { useNotification } from '../context/NotificationContext';


const StagiaireIdentityModal = ({ isOpen, onClose, profile, onUpdate }) => {
    const cardRef = useRef(null);
    const videoRef = useRef(null);
    const { addNotification } = useNotification();
    const [isEngineReady, setIsEngineReady] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanLoading, setScanLoading] = useState(false);
    const [scanStep, setScanStep] = useState('FRONT'); // FRONT
    const [capturedFaces, setCapturedFaces] = useState({ front: null });
    const [isLocked, setIsLocked] = useState(false);
    const [lockProgress, setLockProgress] = useState(0);
    const [signalValid, setSignalValid] = useState(false);
    const [isCalibrating, setIsCalibrating] = useState(false);
    const [currentPose, setCurrentPose] = useState(null); // { direction, yawRatio }
    const [isCentered, setIsCentered] = useState(false);
    const [stepConfirmed, setStepConfirmed] = useState(false);
    const [isConfirmingUpdate, setIsConfirmingUpdate] = useState(false);


    const faceMeshRef = useRef(null);
    const canvasRef = useRef(null);
    const requestRef = useRef();

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        return `http://localhost:5000${path}`;
    };

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
                if (!window.html2canvas) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
                if (!window.jspdf) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

                // Load AI Face Tracking Engines
                if (!window.FaceMesh) {
                    await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js');
                }

                if (window.FaceMesh && !faceMeshRef.current) {
                    const faceMesh = new window.FaceMesh({
                        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
                    });

                    faceMesh.setOptions({
                        maxNumFaces: 1,
                        refineLandmarks: true,
                        minDetectionConfidence: 0.6,
                        minTrackingConfidence: 0.6
                    });

                    faceMesh.onResults(onResults);
                    faceMeshRef.current = faceMesh;
                }

                setIsEngineReady(true);
            } catch (err) {
                console.error("Neural AI Engine Failure:", err);
            }
        };

        initEngines();
    }, [isOpen]);

    const onResults = (results) => {
        if (!canvasRef.current || !videoRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];

            // 1. Calculate Pose
            const nose = landmarks[1];
            const l_cheek = landmarks[234];
            const r_cheek = landmarks[454];
            const top = landmarks[10];
            const chin = landmarks[152];

            const d_left = Math.abs(nose.x - l_cheek.x);
            const d_right = Math.abs(nose.x - r_cheek.x);
            const yaw = d_left / (d_right + 0.001);

            let direction = "Center";
            // yaw = d_left (camera left) / d_right (camera right)
            if (yaw < 0.65) direction = "Left";
            else if (yaw > 1.45) direction = "Right";

            setCurrentPose({ direction, yaw });

            // 2. Check Centering (Relaxed Grid)
            const noseX = nose.x;
            const noseY = nose.y;
            const centered = noseX > 0.25 && noseX < 0.75 && noseY > 0.15 && noseY < 0.85;
            setIsCentered(centered);

            // 3. Draw HUD Tracking Points
            ctx.fillStyle = centered ? '#3b82f6' : '#ef4444';
            ctx.beginPath();
            ctx.arc(nose.x * canvas.width, nose.y * canvas.height, 4, 0, 2 * Math.PI);
            ctx.fill();

            // Draw eye landmarks for "Person Presence" visual
            [33, 263].forEach(idx => {
                const landmark = landmarks[idx];
                ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
                ctx.beginPath();
                ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 2, 0, 2 * Math.PI);
                ctx.fill();
            });
        } else {
            setCurrentPose(null);
            setIsCentered(false);
        }
    };

    const captureFrame = useCallback(async () => {
        if (videoRef.current && isScanning && faceMeshRef.current) {
            if (videoRef.current.readyState >= 2) {
                await faceMeshRef.current.send({ image: videoRef.current });
            }
        }
        requestRef.current = requestAnimationFrame(captureFrame);
    }, [isScanning]);

    useEffect(() => {
        if (isScanning) {
            requestRef.current = requestAnimationFrame(captureFrame);
        } else {
            cancelAnimationFrame(requestRef.current);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isScanning, captureFrame]);

    const validateOpticalSignal = () => {
        if (!videoRef.current || videoRef.current.readyState < 2) return false;
        try {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = 100; canvas.height = 100;
            const ctx = canvas.getContext('2d');
            const sx = Math.max(0, video.videoWidth / 2 - 50);
            const sy = Math.max(0, video.videoHeight / 2 - 50);
            ctx.drawImage(video, sx, sy, 100, 100, 0, 0, 100, 100);
            const data = ctx.getImageData(0, 0, 100, 100).data;

            let skinPixels = 0;
            let lumSum = 0;
            let variance = 0;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                const lum = (r + g + b) / 3;
                lumSum += lum;

                // Broad presence detection logic
                if (r > g && r > 40 && (r - g) > 5) skinPixels++;
            }

            const avgLum = lumSum / (data.length / 4);
            const skinRatio = skinPixels / (data.length / 4);

            for (let i = 0; i < data.length; i += 4) {
                const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
                variance += Math.pow(lum - avgLum, 2);
            }
            const stdDev = Math.sqrt(variance / (data.length / 4));

            // AI-POSE VALIDATION (HIGH-QUALITY FRONT ONLY):
            const poseMatch = currentPose && (
                (scanStep === 'FRONT' && currentPose.direction === 'Center')
            );

            // Stricter requirements: Need good lighting (avgLum > 25) and sharp focus (stdDev > 8)
            return stdDev > 8 && avgLum > 25 && isCentered && poseMatch;
        } catch (e) { return false; }
    };

    // Simulated Neural Verification Loop (Automatic Capture)
    useEffect(() => {
        if (!isScanning || scanLoading || isCalibrating) {
            setIsLocked(false);
            setLockProgress(0);
            return;
        }

        const interval = setInterval(() => {
            const hasSignal = validateOpticalSignal();
            setSignalValid(hasSignal);

            if (!hasSignal) {
                setLockProgress(prev => Math.max(0, prev - 15)); // Rapid decay if signal lost
                return;
            }

            setLockProgress(prev => {
                const next = prev + Math.floor(Math.random() * 12) + 4;
                if (next >= 100) {
                    clearInterval(interval);
                    setIsLocked(true);
                    return 100;
                }
                return next;
            });
        }, 300);

        return () => clearInterval(interval);
    }, [isScanning, scanStep, scanLoading]);

    // Trigger capture automatically when signal is locked
    useEffect(() => {
        if (isLocked && !scanLoading) {
            const timer = setTimeout(() => {
                handleCapture();
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isLocked, scanLoading]);

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
        setScanStep('FRONT');
        setCapturedFaces({ front: null });
        setIsLocked(false);
        setLockProgress(0);
    };

    const handleCapture = async () => {
        if (!videoRef.current || scanLoading) return;

        setStepConfirmed(true);
        setScanLoading(true);
        setIsLocked(false);
        setLockProgress(0);

        // Flash confirmation
        setTimeout(() => setStepConfirmed(false), 1000);

        try {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            const base64Image = canvas.toDataURL('image/jpeg', 0.9); // higher quality
            const currentStep = scanStep;
            const nextStepMap = { 'FRONT': 'COMPLETE' };
            const nextStep = nextStepMap[currentStep];

            // Use functional update to ensure we have the absolute latest state of all faces
            setCapturedFaces(prev => {
                const updated = { ...prev, [currentStep.toLowerCase()]: base64Image };

                // If this was the final angle, trigger the sync protocol
                if (nextStep === 'COMPLETE') {
                    const syncFinalFaces = async () => {
                        try {
                            const token = localStorage.getItem('token');
                            const config = { headers: { Authorization: `Bearer ${token}` } };
                            await axios.put('http://localhost:5000/api/stagiaire/face-id', { faces: updated }, config);
                            addNotification("Biometric Neural Link Synchronized.", "success");
                            onUpdate();
                            stopScan();
                        } catch (err) {
                            console.error("Sync Failure:", err);
                            addNotification("Neural sync aborted.", "error");
                        }
                    };
                    syncFinalFaces();
                }
                return updated;
            });

            if (nextStep !== 'COMPLETE') {
                setIsCalibrating(true);
                setScanStep(nextStep);
                addNotification(`Angle ${currentStep} captured. Rotate to ${nextStep}.`, "success");

                // 1.5s Re-calibration window
                setTimeout(() => {
                    setIsCalibrating(false);
                }, 1500);
            }

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
                scale: 4, // Ultra high resolution for print
                useCORS: true,
                backgroundColor: '#050505'
            });


            const imgData = canvas.toDataURL('image/png');

            const { jsPDF } = window.jspdf;
            const pdfWidth = 85.6;
            const pdfHeight = 54;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [pdfWidth, pdfHeight]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`IDENTITY_CARD_${profile.name.replace(/\s+/g, '_').toUpperCase()}.pdf`);


            // NEW: Save to Server Neural Vault
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/stagiaire/card', { cardImage: imgData }, config);
            addNotification("Identity Card archived in server vault.", "success");
        } catch (error) {
            console.error("Export Protocol Failure:", error);
            addNotification("Archive failure.", "error");
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
                            {isScanning ? `NEURAL_SCAN :: ${scanStep}` : 'IDENTITY CARD PREVIEW'}
                        </h3>
                        <p className="text-[10px] font-bold tracking-[0.3em] text-[var(--text-muted)] uppercase leading-relaxed">
                            {isScanning ? `POSITION YOUR FACE: [${scanStep}]. Verification in progress.` : 'Verified visual identification grid for external authentication protocols.'}
                        </p>
                    </div>

                    {isScanning ? (
                        /* SCANNING VIEWPORT */
                        <div className="w-full max-w-[500px] h-[320px] bg-black border-2 border-[var(--primary)] relative overflow-hidden group shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)] md:scale-110">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover brightness-110 contrast-110"
                            />

                            <canvas
                                ref={canvasRef}
                                className="absolute inset-0 w-full h-full pointer-events-none z-20"
                            />

                            {/* Tracking Circle HUD */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 rounded-full z-10 transition-all duration-500 pointer-events-none ${isCentered ? 'border-blue-500/50 scale-100 shadow-[0_0_50px_rgba(59,130,246,0.3)]' : 'border-red-500/30 scale-95'}`}>
                                <div className={`absolute inset-0 rounded-full border border-white/10 ${isCentered ? 'animate-ping' : ''}`}></div>
                            </div>

                            {/* Neural Progress Tracker */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30">
                                {['FRONT'].map((step) => {
                                    const isCompleted = (step === 'FRONT' && capturedFaces.front);
                                    const isActive = scanStep === step;

                                    return (
                                        <div key={step} className="flex flex-col items-center gap-2">
                                            <div className={`w-20 h-1 ${isCompleted ? 'bg-[var(--primary)]' : isActive ? 'bg-amber-500 animate-pulse' : 'bg-white/10'}`}></div>
                                            <span className={`text-[9px] font-black tracking-widest ${isActive ? 'text-amber-500 scale-110' : 'text-white/40'} transition-all`}>HIGH_RES_IDENTIFICATION</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Directional Overlay Guide */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                <div className="relative w-48 h-48">
                                    {/* Scan Frame */}
                                    <div className={`absolute inset-0 border border-[var(--primary)]/30 rounded-full transition-all duration-700 ${scanStep === 'FRONT' ? 'scale-100 opacity-100' : 'scale-90 opacity-20'}`}></div>

                                    {/* Signal Analysis Ring */}
                                    <div className="absolute inset-[-10px] border-t-2 border-r-2 border-amber-500/40 rounded-full animate-spin transition-opacity duration-500" style={{ opacity: isScanning ? 1 : 0 }}></div>
                                    <div className="absolute inset-[-20px] border-b-2 border-l-2 border-[var(--primary)]/20 rounded-full animate-spin-slow transition-opacity duration-500" style={{ opacity: isScanning ? 1 : 0 }}></div>

                                    {/* Lock Indicator */}
                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500 ${isLocked ? 'scale-110 opacity-100' : 'scale-100 opacity-40'}`}>
                                        <div className={`w-8 h-8 rounded-full border-2 border-dashed animate-spin-slow mb-2 ${isLocked ? 'border-[var(--primary)]' : 'border-amber-500'}`}></div>
                                        <span className={`text-[8px] font-black tracking-[0.2em] ${isLocked ? 'text-[var(--primary)]' : 'text-amber-500'}`}>
                                            {isLocked ? 'SIGNAL_LOCKED' : 'ANALYZING...'}
                                        </span>
                                    </div>



                                    {/* 3D Ghost Guidance HUD */}
                                    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center -translate-y-[10%]">
                                        <div className={`w-40 h-56 border-2 border-dashed rounded-[40%] transition-all duration-700 flex items-center justify-center ${signalValid ? 'border-blue-500 scale-110 bg-blue-500/10' : 'border-white/20 scale-100'}`}>
                                            <div className={`w-2 h-2 rounded-full ${signalValid ? 'bg-blue-500 shadow-[0_0_15px_#3b82f6]' : 'bg-white/20'}`}></div>
                                        </div>
                                    </div>

                                    {/* Confirmation Flash */}
                                    {stepConfirmed && (
                                        <div className="absolute inset-0 z-50 bg-blue-500/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in zoom-in duration-300">
                                            <div className="bg-black/80 px-10 py-5 border-2 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                                                <h4 className="text-blue-500 font-black italic tracking-widest text-2xl uppercase">SIGNAL_AUTHORIZED</h4>
                                                <p className="text-white/40 text-[8px] font-black tracking-[0.5em] mt-2">ENCODING_BIOMETRIC_DATA...</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Central AI Instruction LCD (Enhanced) */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[280px] text-center z-40">
                                        <div className={`text-[10px] font-black tracking-[0.2em] px-4 py-3 border-2 backdrop-blur-lg transition-all duration-300 shadow-2xl ${!isEngineReady ? 'text-white/20 border-white/5' : !currentPose ? 'text-red-500 border-red-500/30 bg-red-500/5' : !isCentered ? 'text-amber-500 border-amber-500/30 bg-amber-500/5' : signalValid ? 'text-blue-500 border-blue-400 scale-105 bg-blue-500/20' : 'text-white border-white/10 bg-black/60'}`}>
                                            {!isEngineReady ? 'WAKING_NEURAL_CORE...' : isCalibrating ? 'RE_ALIGNING_OPTICS...' : !currentPose ? 'SEARCHING_BIOMETRIC_SIGNAL...' : !isCentered ? 'MOVE_FACE_INTO_CIRCLE' : signalValid ? 'STAY_STILL_AUTHORIZED' : 'LOOK_STRAIGHT_AHEAD'}
                                        </div>
                                    </div>

                                    {/* Center Target */}
                                    <div className="absolute inset-4 border-2 border-[var(--primary)] border-dashed rounded-full animate-spin-slow opacity-20"></div>
                                </div>
                            </div>

                            {/* Scanning Pulse Overlays */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--primary)] animate-scan shadow-[0_0_15px_var(--primary)]"></div>
                                <div className="absolute inset-0 border-[20px] border-black/20"></div>
                            </div>

                            <div className="absolute bottom-4 left-4 flex flex-col gap-2 w-full pr-8">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 ${isLocked ? 'bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]' : signalValid ? 'bg-amber-500 animate-ping' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                                    <span className={`text-[8px] font-black tracking-widest uppercase ${isLocked ? 'text-[var(--primary)]' : signalValid ? 'text-amber-500' : 'text-red-500'}`}>
                                        BIOMETRIC_RECOGNITION :: {isLocked ? 'SIGNAL_LOCKED' : signalValid ? `ANALYZING_${scanStep}` : 'WAITING_FOR_SUBJECT'}
                                    </span>
                                </div>
                                <div className="w-full max-w-[200px] h-[2px] bg-white/10 relative overflow-hidden">
                                    <div
                                        className={`absolute top-0 left-0 h-full transition-all duration-300 ${isLocked ? 'bg-[var(--primary)]' : 'bg-amber-500'}`}
                                        style={{ width: `${lockProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* IDENTITY CARD PREVIEW */
                        <div
                            ref={cardRef}
                            className="w-full max-w-[500px] h-[315px] bg-[#050505] border border-[var(--border-strong)] relative overflow-hidden group shadow-2xl scale-100 md:scale-110"
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
                                    <div className={`w-32 h-40 bg-[var(--surface)] border flex items-center justify-center relative transition-all duration-700 overflow-hidden group/img ${!profile.image ? 'border-[var(--primary)] shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]' : 'border-[var(--border-strong)]'}`}>
                                        {!profile.image && (
                                            <div className="absolute inset-0 border-2 border-[var(--primary)]/20 animate-pulse pointer-events-none"></div>
                                        )}
                                        {profile.image ? (
                                            <img src={getImageUrl(profile.image)} alt="Identity" className="w-full h-full object-cover" style={{ objectFit: 'cover', width: '8rem', height: '10rem' }} />
                                        ) : (
                                            <div className="text-4xl font-black text-[var(--primary)] italic">
                                                {profile.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                        )}

                                        {/* Profile Update Overlay */}
                                        <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-opacity">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;
                                                    const reader = new FileReader();
                                                    reader.onloadend = async () => {
                                                        try {
                                                            const token = localStorage.getItem('token');
                                                            const config = { headers: { Authorization: `Bearer ${token}` } };
                                                            await axios.put('http://localhost:5000/api/stagiaire/profile', { image: reader.result }, config);
                                                            addNotification('Neural avatar updated.', 'success');
                                                            onUpdate();
                                                        } catch (err) {
                                                            addNotification('Sync failure.', 'error');
                                                        }
                                                    };
                                                    reader.readAsDataURL(file);
                                                }}
                                            />
                                            <Camera className="w-5 h-5 text-white" />
                                        </label>

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
                                <div className="px-14 py-5 font-black tracking-[0.4em] text-[11px] bg-white/5 text-white/20 border border-white/10 uppercase cursor-wait flex items-center gap-3">
                                    {scanLoading || isLocked || isCalibrating ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : <div className={`w-2 h-2 rounded-full animate-pulse ${currentPose ? 'bg-blue-500' : 'bg-red-500'}`} />}
                                    {scanLoading ? 'ENCODING...' : isLocked ? 'SYNCING_NEURAL_LINK...' : isCalibrating ? 'RE_CALIBRATING_SENSORS...' : !currentPose ? 'SEARCHING_FOR_FACE...' : !isCentered ? 'ALIGN_FACE_IN_CENTER' : signalValid ? `SYNCING_${scanStep}_POSE` : `ROTATE_HEAD_${scanStep}`}
                                </div>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => profile?.face_id ? setIsConfirmingUpdate(true) : handleStartScan()}
                                    title={profile?.face_id ? "UPDATE_BIometric_DATA" : "SCAN_FACIAL_BIOMETRICS"}
                                    className={`p-5 bg-transparent border transition-all flex items-center justify-center group relative ${profile?.face_id ? 'border-green-500/30 hover:border-green-500 text-green-500' : 'border-[var(--primary)] hover:scale-105 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] text-[var(--primary)]'}`}
                                >
                                    {!profile?.face_id && (
                                        <div className="absolute inset-0 border border-[var(--primary)] animate-ping opacity-20 pointer-events-none"></div>
                                    )}
                                    <Scan className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {profile?.face_id && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-black">
                                            <Check className="w-2.5 h-2.5 text-black stroke-[4]" />
                                        </div>
                                    )}
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

            <ConfirmationModal
                isOpen={isConfirmingUpdate}
                onClose={() => setIsConfirmingUpdate(false)}
                onConfirm={() => {
                    setIsConfirmingUpdate(false);
                    handleStartScan();
                }}
                title="NEURAL_RE_CONFIGURATION"
                message="ARE YOU SURE YOU WANT TO OVERWRITE YOUR CURRENT BIOMETRIC TELEMETRY? THIS ACTION WILL SYNC NEW FACE-ID DATA TO THE SQUADRON GRID."
            />
        </div>
        ,
        document.body
    );
};

export default StagiaireIdentityModal;
